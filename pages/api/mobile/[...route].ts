import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { createSession, hashToken, passwordHash, publicReader, rateLimit, readerFor, verifyPassword } from '@/lib/mobileAuth';

const safeUrl = (v: unknown) => { try { return typeof v==='string' && new URL(v).protocol==='https:'; } catch { return false; } };
const text = (v: unknown, max: number) => typeof v==='string' ? v.trim().slice(0,max) : '';
const username = (v: unknown) => text(v,40).toLowerCase();
const validUsername = (v: string) => /^[a-z0-9_]{3,24}$/.test(v);
async function validTarget(target: string) {
  const [type,...parts] = target.split(':'); const id=parts.join(':');
  if (type==='article') return !!await prisma.article.findUnique({where:{slug:id},select:{id:true}});
  if (type==='post') return !!await prisma.mobileContent.findFirst({where:{id,published:true},select:{id:true}});
  return false;
}
function csvCell(v: unknown) {
  let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s="'"+s;
  return '"'+s.replace(/"/g,'""')+'"';
}
export const config = {api:{bodyParser:{sizeLimit:'64kb'}}};
export default async function handler(req: NextApiRequest,res: NextApiResponse) {
  res.setHeader('Cache-Control','no-store');
  const route=(req.query.route as string[] || []).join('/');
  const method=req.method;
  const b=req.body || {};
  try {
    if(route==='content' && method==='GET') {
      const kind=String(req.query.kind || 'feed');
      if(!['feed','short','post','series'].includes(kind)) return res.status(400).json({error:'Unknown content type'});
      return res.json(await prisma.mobileContent.findMany({where:{published:true,kind:kind==='feed'?{in:['short','post']}:kind},orderBy:{createdAt:'desc'},take:200}));
    }
    if(route==='auth/register' && method==='POST') {
      if(!await rateLimit(req,'register',10)) return res.status(429).json({error:'Too many attempts. Try again later.'});
      const user=username(b.username), displayName=text(b.displayName,40), email=text(b.email,254).toLowerCase() || null;
      if(!validUsername(user)||displayName.length<2||typeof b.password!=='string'||b.password.length<10||b.password.length>128|| (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({error:'Use a 3–24 character username (letters, numbers, underscores), a display name and a password of 10–128 characters.'});
      const reader=await prisma.readerAccount.create({data:{username:user,displayName,email,passwordHash:await passwordHash(b.password)}});
      return res.status(201).json({reader:publicReader(reader),token:await createSession(reader.id)});
    }
    if(route==='auth/login' && method==='POST') {
      const user=username(b.username);
      if(!await rateLimit(req,'login-ip',50)||!await rateLimit(req,'login-user',20,user)) return res.status(429).json({error:'Too many attempts. Try again later.'});
      if(typeof b.password!=='string'||b.password.length>128) return res.status(401).json({error:'Incorrect username or password.'});
      const reader=await prisma.readerAccount.findUnique({where:{username:user}});
      if(!reader||!await verifyPassword(b.password,reader.passwordHash)) return res.status(401).json({error:'Incorrect username or password.'});
      return res.json({reader:publicReader(reader),token:await createSession(reader.id)});
    }
    if(route.startsWith('admin/')) {
      const session=await getServerSession(req,res,authOptions);
      if(!session?.user || !(['admin','editor'].includes(session.user.role || '') || ['sushantgaurav@dalimss.com','admin@dalimss.com','dalimsssushant@gmail.com'].includes(session.user.email || ''))) return res.status(403).json({error:'Editors only'});
      // Cookie-authenticated mutations must originate on this host.
      if(method!=='GET' && (!req.headers.origin || new URL(req.headers.origin).host!==req.headers.host)) return res.status(403).json({error:'Invalid origin'});
      if(route==='admin/readers' && method==='GET') {
        const rows=await prisma.readerAccount.findMany({select:{id:true,username:true,displayName:true,email:true,createdAt:true},orderBy:{createdAt:'desc'},take:10000});
        res.setHeader('Content-Type','text/csv; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="dalimss-readers.csv"');
        return res.send('\uFEFF'+['id,username,displayName,email,createdAt',...rows.map(r=>[r.id,r.username,r.displayName,r.email,r.createdAt.toISOString()].map(csvCell).join(','))].join('\r\n'));
      }
      if(route==='admin/content' && method==='GET') return res.json(await prisma.mobileContent.findMany({orderBy:{createdAt:'desc'},take:200}));
      if(route==='admin/content' && method==='POST') {
        if(!['short','post','series'].includes(b.kind)||!text(b.title,200)||!text(b.description,5000)||!text(b.category,200)) return res.status(400).json({error:'Type, title, description and category are required.'});
        if((b.kind==='short'||b.kind==='series')&&!safeUrl(b.videoUrl)) return res.status(400).json({error:'An HTTPS video URL is required.'});
        if(b.kind==='post'&&!safeUrl(b.imageUrl)) return res.status(400).json({error:'An HTTPS image URL is required.'});
        if((b.imageUrl&&!safeUrl(b.imageUrl))||(b.captionUrl&&!safeUrl(b.captionUrl))) return res.status(400).json({error:'Media URLs must use HTTPS.'});
        if(b.kind==='series'&&!text(b.seriesName,100)) return res.status(400).json({error:'A news series name is required.'});
        const data={kind:b.kind,title:text(b.title,200),description:text(b.description,5000),category:text(b.category,200),imageUrl:b.imageUrl||null,videoUrl:b.videoUrl||null,captionUrl:b.captionUrl||null,seriesName:b.kind==='series'?text(b.seriesName,100):null,published:b.published===true};
        return res.json(b.id?await prisma.mobileContent.update({where:{id:String(b.id)},data}):await prisma.mobileContent.create({data}));
      }
      if(route==='admin/comments'&&method==='GET') return res.json(await prisma.readerComment.findMany({where:{approved:false},include:{reader:{select:{username:true}}},orderBy:{createdAt:'asc'},take:200}));
      if(route==='admin/comments'&&method==='POST') {
        if(b.approve===true) await prisma.readerComment.update({where:{id:String(b.id)},data:{approved:true}});
        else await prisma.readerComment.delete({where:{id:String(b.id)}});
        return res.json({ok:true});
      }
      if(route==='admin/reports'&&method==='GET') return res.json(await prisma.readerReport.findMany({include:{reader:{select:{username:true}}},orderBy:{createdAt:'desc'},take:200}));
      return res.status(405).json({error:'Method not allowed'});
    }
    const reader=await readerFor(req);
    if(route==='social'&&method==='GET') {
      const target=text(req.query.target,300);
      if(!await validTarget(target)) return res.status(404).json({error:'Story not found.'});
      const [likes,liked,comments,commentCount]=await Promise.all([
        prisma.readerLike.count({where:{target}}),
        reader?prisma.readerLike.findUnique({where:{readerId_target:{readerId:reader.id,target}}}):null,
        prisma.readerComment.findMany({where:{target,OR:[{approved:true},...(reader?[{readerId:reader.id}]:[])]},select:{id:true,text:true,createdAt:true,approved:true,reader:{select:{username:true,displayName:true}}},orderBy:{createdAt:'desc'},take:100}),
        prisma.readerComment.count({where:{target,approved:true}}),
      ]);
      return res.json({likes,liked:!!liked,comments,commentCount});
    }
    if(!reader) return res.status(401).json({error:'Sign in to continue.'});
    if(route==='auth/me'&&method==='GET') return res.json({reader:publicReader(reader)});
    if(route==='auth/logout'&&method==='POST') { await prisma.readerSession.deleteMany({where:{tokenHash:hashToken(req.headers.authorization!.slice(7))}});return res.json({ok:true}); }
    if(route==='auth/profile'&&method==='POST') {
      const user=username(b.username), displayName=text(b.displayName,40);
      if(!validUsername(user)||displayName.length<2) return res.status(400).json({error:'Enter a valid display name and username.'});
      return res.json({reader:publicReader(await prisma.readerAccount.update({where:{id:reader.id},data:{username:user,displayName}}))});
    }
    if(route==='auth/account'&&method==='DELETE') { await prisma.readerAccount.delete({where:{id:reader.id}});return res.json({ok:true}); }
    const target=text(b.target,300);
    if(!await validTarget(target)) return res.status(404).json({error:'Story not found.'});
    if(route==='social/like'&&method==='POST') {
      if(!await rateLimit(req,'like',300,reader.id)) return res.status(429).json({error:'Please try again later.'});
      const where={readerId_target:{readerId:reader.id,target}};
      if(b.liked===true) await prisma.readerLike.upsert({where,create:{readerId:reader.id,target},update:{}});
      else await prisma.readerLike.deleteMany({where:{readerId:reader.id,target}});
      return res.json({liked:b.liked===true,likes:await prisma.readerLike.count({where:{target}})});
    }
    if(route==='social/comment'&&method==='POST') {
      const value=text(b.text,1000);
      if(!value) return res.status(400).json({error:'Write a comment first.'});
      if(!await rateLimit(req,'comment',20,reader.id)) return res.status(429).json({error:'Comment limit reached. Try again later.'});
      await prisma.readerComment.create({data:{target,text:value,readerId:reader.id}});
      return res.status(201).json({message:'Comment submitted for review.'});
    }
    if(route==='social/report'&&method==='POST') {
      const reason=text(b.reason,500);if(!reason) return res.status(400).json({error:'Choose a reason.'});
      if(!await rateLimit(req,'report',30,reader.id)) return res.status(429).json({error:'Please try again later.'});
      await prisma.readerReport.upsert({where:{readerId_target:{readerId:reader.id,target}},create:{readerId:reader.id,target,reason},update:{reason}});
      return res.json({message:'Report sent to the editorial team.'});
    }
    return res.status(405).json({error:'Method not allowed'});
  } catch(error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==='P2002') return res.status(409).json({error:'That username or email is already registered. Choose another username or sign in.'});
    console.error('Mobile API request failed',error instanceof Error?error.message:'Unknown error');
    return res.status(500).json({error:'Unable to complete this request. Please try again.'});
  }
}
