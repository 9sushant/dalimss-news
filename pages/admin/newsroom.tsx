import type {GetServerSideProps} from 'next';
import Link from 'next/link';
import {getServerSession} from 'next-auth';
import {authOptions} from '../api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
const editorEmails=['admin@dalimss.com','sushantgaurav@dalimss.com','dalimsssushant@gmail.com'];
export default function Newsroom({allowed,stories}:{allowed:boolean,stories:{slug:string,title:string,expiresAt:string}[]}) {
 return <main style={{minHeight:'100vh',background:'#080808',color:'#fff',padding:'32px 20px'}}><div style={{maxWidth:680,margin:'auto'}}><h1 style={{fontSize:30}}>Newsroom admin</h1>{!allowed?<p>This area is for website administrators and editors. Sign in with an authorized newsroom account.</p>:<><p>Publish to the website and app from one place.</p><nav style={{display:'grid',gap:16,margin:'28px 0'}}>{[['/articles/new','Write an article'],['/stories/new','Create a 24-hour story'],['/admin/mobile','Upload shorts and news series']].map(([href,label])=><Link key={href} href={href} style={{display:'block',padding:20,border:'1px solid #444',borderRadius:16}}>{label} →</Link>)}</nav><p>Stories disappear publicly 24 hours after creation. Editing a story does not restart its lifetime. Articles and shorts remain published.</p><h2 style={{marginTop:32}}>Recent stories</h2>{stories.map(s=><div key={s.slug} style={{padding:'18px 0',borderBottom:'1px solid #333'}}><Link href={`/stories/${s.slug}/edit`}>{s.title} → Edit</Link><p style={{color:'#aaa',fontSize:13}}>Public expiry: {s.expiresAt} (UTC)</p></div>)}</>}<p style={{marginTop:28}}><Link href="/api/auth/signout">Sign out</Link></p></div></main>;
}
export const getServerSideProps:GetServerSideProps=async({req,res})=>{
 res.setHeader('Cache-Control','no-store');
 const session=await getServerSession(req,res,authOptions);
 if(!session?.user)return {redirect:{destination:'/auth/signin?callbackUrl=%2Fadmin%2Fnewsroom',permanent:false}};
 const allowed=['admin','editor'].includes(session.user.role||'')||editorEmails.includes(session.user.email||'');
 if(!allowed){res.statusCode=403;return {props:{allowed:false,stories:[]}};}
 const stories=await prisma.webStory.findMany({take:50,orderBy:{createdAt:'desc'},select:{slug:true,title:true,createdAt:true}});
 return {props:{allowed:true,stories:stories.map(s=>({slug:s.slug,title:s.title,expiresAt:new Date(s.createdAt.getTime()+86400000).toISOString()}))}};
};
