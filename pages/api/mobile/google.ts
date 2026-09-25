import type {NextApiRequest,NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';
import {createHash,randomBytes,timingSafeEqual} from 'crypto';
import {Prisma} from '@prisma/client';
import prisma from '@/lib/prisma';
import {authOptions} from '../auth/[...nextauth]';
import {createSession,hashToken,publicReader,rateLimit,readerFor} from '@/lib/mobileAuth';
const validProof=(v:unknown):v is string=>typeof v==='string'&&/^[A-Za-z0-9_-]{43,128}$/.test(v);
export default async function handler(req:NextApiRequest,res:NextApiResponse){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 try{
  if(!await rateLimit(req,'google-auth',60))return res.status(429).json({error:'Too many attempts. Please try again later.'});
  const body=req.body||{};
  if(body.action==='authorize'){
   if(!req.headers.origin||new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'Invalid origin'});
   if(!validProof(body.challenge)||!validProof(body.state))return res.status(400).json({error:'Invalid sign-in request. Start again from the app.'});
   const session=await getServerSession(req,res,authOptions);
   if(!session?.user?.id)return res.status(401).json({error:'Sign in with Google to continue.'});
   // This identity comes only from the Google account stored by NextAuth after OAuth verification.
   const google=await prisma.account.findFirst({where:{userId:session.user.id,provider:'google'}});
   if(!google?.id_token)return res.status(403).json({error:'Please choose a Google account to continue.'});
   const identity=JSON.parse(Buffer.from(google.id_token.split('.')[1],'base64url').toString());
   if(identity.sub!==google.providerAccountId||identity.email_verified!==true||typeof identity.email!=='string')return res.status(403).json({error:'A verified Google email is required.'});
   const code=randomBytes(32).toString('base64url');
   await prisma.mobileAuthGrant.deleteMany({where:{expiresAt:{lt:new Date()}}});
   await prisma.mobileAuthGrant.create({data:{codeHash:hashToken(code),challenge:body.challenge,googleSubject:google.providerAccountId,email:identity.email.toLowerCase(),displayName:session.user.name?.slice(0,40)||'Dalimss reader',expiresAt:new Date(Date.now()+120000)}});
   return res.json({callback:`dalimssnews://google-signin?code=${code}&state=${body.state}`});
  }
  if(body.action==='exchange'){
   if(!validProof(body.code)||!validProof(body.verifier))return res.status(400).json({error:'Invalid sign-in response. Please try again.'});
   const codeHash=hashToken(body.code);
   const grant=await prisma.mobileAuthGrant.findUnique({where:{codeHash}});
   const proof=createHash('sha256').update(body.verifier).digest('base64url');
   if(!grant||grant.expiresAt.getTime()<=Date.now()||grant.challenge.length!==proof.length||!timingSafeEqual(Buffer.from(grant.challenge),Buffer.from(proof)))return res.status(401).json({error:'Sign-in expired or invalid. Please try again.'});
   // Atomic consumption prevents parallel requests replaying the same authorization code.
   const consumed=await prisma.mobileAuthGrant.deleteMany({where:{codeHash,expiresAt:{gt:new Date()}}});
   if(consumed.count!==1)return res.status(401).json({error:'This sign-in has already been used. Please try again.'});
   const current=await readerFor(req);
   let reader=await prisma.readerAccount.findUnique({where:{googleSubject:grant.googleSubject}});
   if(current){
    if(reader&&reader.id!==current.id)return res.status(409).json({error:'This Google account is already connected to another reader.'});
    if(current.googleSubject&&current.googleSubject!==grant.googleSubject)return res.status(409).json({error:'This reader already has a different Google account connected.'});
    reader=await prisma.readerAccount.update({where:{id:current.id},data:{googleSubject:grant.googleSubject}});
   }else if(!reader){
    if(await prisma.readerAccount.findUnique({where:{email:grant.email}}))return res.status(409).json({error:'This email already has a reader account. Sign in with your username, then connect Google in Account settings.'});
    const base=grant.displayName.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,14)||'reader';
    reader=await prisma.readerAccount.create({data:{googleSubject:grant.googleSubject,email:grant.email,displayName:grant.displayName,username:`${base}_${randomBytes(4).toString('hex')}`}});
   }
   return res.json({reader:publicReader(reader),token:await createSession(reader.id)});
  }
  return res.status(400).json({error:'Unknown sign-in action'});
 }catch(error){
  if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==='P2002')return res.status(409).json({error:'This account is already registered. Please sign in again.'});
  console.error('Mobile Google sign-in failed',error instanceof Error?error.message:'Unknown error');
  return res.status(500).json({error:'Google sign-in is unavailable. Please try again.'});
 }
}
