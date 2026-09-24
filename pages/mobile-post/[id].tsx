import type {GetServerSideProps} from 'next';
import Head from 'next/head';
import prisma from '@/lib/prisma';
type Post={title:string;description:string;category:string;imageUrl:string|null;videoUrl:string|null;captionUrl:string|null};
export const getServerSideProps:GetServerSideProps=async({params})=>{
 const post=await prisma.mobileContent.findFirst({where:{id:String(params?.id),published:true},select:{title:true,description:true,category:true,imageUrl:true,videoUrl:true,captionUrl:true}});
 return post?{props:{post}}:{notFound:true};
};
export default function MobilePost({post}:{post:Post}){return <main style={{maxWidth:800,margin:'auto',padding:24}}>
 <Head><title>{post.title} | Dalimss News</title><meta name="description" content={post.description.slice(0,160)}/><meta property="og:title" content={post.title}/>{post.imageUrl&&<meta property="og:image" content={post.imageUrl}/>}</Head>
 <a href="/">Dalimss News</a><p>{post.category}</p><h1>{post.title}</h1>
 {post.videoUrl?<video controls playsInline poster={post.imageUrl||undefined} style={{width:'100%',maxHeight:'75vh'}} src={post.videoUrl} crossOrigin={post.captionUrl?'anonymous':undefined}>{post.captionUrl&&<track kind="captions" src={post.captionUrl} label="Captions"/>}</video>:post.imageUrl?<img src={post.imageUrl} alt={post.title} style={{width:'100%'}}/>:null}
 <p style={{whiteSpace:'pre-line'}}>{post.description}</p>
 </main>;}
