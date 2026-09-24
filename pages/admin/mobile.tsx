import {useEffect,useState} from 'react';
import {upload} from '@vercel/blob/client';
import {useSession,signIn} from 'next-auth/react';
export default function MobileAdmin(){
 const {data:session,status}=useSession();const [items,setItems]=useState<any[]>([]),[comments,setComments]=useState<any[]>([]),[reports,setReports]=useState<any[]>([]),[message,setMessage]=useState('');
 const empty={kind:'short',title:'',description:'',category:'Varanasi',imageUrl:'',videoUrl:'',captionUrl:'',seriesName:'',published:false};
 const [form,setForm]=useState<any>(empty);
 const [uploading,setUploading]=useState(false);
 async function uploadFile(file:File,field:string){
  setUploading(true);setMessage('Uploading…');
  try {
   if(field==='videoUrl'&&form.kind==='short'){
    const video=document.createElement('video');const url=URL.createObjectURL(file);video.preload='metadata';video.src=url;
    try{await new Promise<void>((resolve,reject)=>{video.onloadedmetadata=()=>resolve();video.onerror=()=>reject(new Error('Cannot read video. Use an MP4 file.'));});
     if(Math.abs(video.videoWidth/video.videoHeight-9/16)>.04)throw new Error('Shorts must use a portrait 9:16 video.');
    }finally{URL.revokeObjectURL(url);video.removeAttribute('src');video.load();}
   }
   const kind=field==='imageUrl'?'cover':field==='captionUrl'?'captions':'video';
   const blob=await upload('dalimss-mobile/'+Date.now()+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_'),file,{access:'public',handleUploadUrl:'/api/mobile/upload',clientPayload:JSON.stringify({kind}),multipart:true});
   setForm((previous:any)=>({...previous,[field]:blob.url}));setMessage('Upload complete. Save the content to publish it.');
  }catch(e){setMessage(String(e));}finally{setUploading(false);}
 }

 async function call(path:string,body?:any){const r=await fetch('/api/mobile/admin/'+path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});const d=await r.json();if(!r.ok)throw new Error(d.error);return d;}
 async function load(){try{setItems(await call('content'));setComments(await call('comments'));setReports(await call('reports'));}catch(e){setMessage(String(e));}}
 useEffect(()=>{if(session)void load();},[session]); // eslint-disable-line react-hooks/exhaustive-deps
 if(status==='loading')return <p>Loading…</p>;
 if(!session)return <button onClick={()=>signIn()}>Sign in as editor</button>;
 return <main style={{maxWidth:1000,margin:'40px auto',padding:24}}><h1>Mobile newsroom</h1><p>Publish team posts, portrait shorts (9:16), and ongoing news series. OTT stays in the existing OTT editor.</p><a href="/api/mobile/admin/readers">Download registered readers CSV (up to 10,000)</a><p role="status">{message}</p>
 <form onSubmit={async e=>{e.preventDefault();try{await call('content',form);setForm(empty);setMessage('Content saved.');await load();}catch(err){setMessage(String(err));}}}>
 <select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}>{['short','post','series'].map(k=><option key={k}>{k}</option>)}</select>
 {['title','description','category','imageUrl','videoUrl','captionUrl',...(form.kind==='series'?['seriesName']:[])].map(k=><label key={k} style={{display:'block',margin:'12px 0'}}>{k}<input style={{display:'block',width:'100%',border:'1px solid #aaa',padding:8}} value={form[k]} required={['title','description','category'].includes(k)} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}
 <fieldset disabled={uploading}><legend>Upload media</legend>{[['videoUrl','Video','video/mp4,video/webm'],['imageUrl','Cover image','image/jpeg,image/png,image/webp'],['captionUrl','Captions (.vtt)','.vtt']].map(([field,label,accept])=><label key={field} style={{display:'block',margin:12}}>{label}<input type="file" accept={accept} onChange={e=>{const file=e.target.files?.[0];if(file)void uploadFile(file,field);e.target.value='';}}/></label>)}</fieldset>
 <p>Use HTTPS URLs from your media hosting for video, cover and optional WebVTT captions. Shorts should be portrait 9:16. Comma-separated categories use the first category as primary.</p>
 <label><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Published</label><button disabled={uploading} style={{margin:16}} type="submit">Save content</button></form>
 <h2>Content</h2>{items.map(i=><p key={i.id}>{i.kind}: {i.title} — {i.published?'Published':'Draft'} <button onClick={()=>setForm(i)}>Edit / unpublish</button></p>)}
 <h2>Comments awaiting review</h2>{comments.map(c=><div key={c.id}><p>@{c.reader.username}: {c.text} ({c.target})</p>{[true,false].map(approve=><button key={String(approve)} style={{margin:8}} onClick={async()=>{try{await call('comments',{id:c.id,approve});await load();}catch(e){setMessage(String(e));}}}>{approve?'Approve':'Remove'}</button>)}</div>)}
 <h2>Reports</h2>{reports.map(r=><p key={r.id}>@{r.reader.username} · {r.target} · {r.reason}</p>)}
 </main>;
}
