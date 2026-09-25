import {useRouter} from 'next/router';
import {useEffect,useRef,useState} from 'react';
import Head from 'next/head';
export default function Complete(){
 const router=useRouter();const started=useRef(false);const [callback,setCallback]=useState(''),[error,setError]=useState('');
 useEffect(()=>{
  if(!router.isReady||started.current)return;started.current=true;
  void(async()=>{try{
   const r=await fetch('/api/mobile/google',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'authorize',challenge:router.query.challenge,state:router.query.state})});
   const data=await r.json();if(!r.ok)throw new Error(data.error);
   setCallback(data.callback);window.location.assign(data.callback);
  }catch(e){setError(e instanceof Error?e.message:'Unable to complete sign-in.');}})();
 },[router.isReady,router.query]);
 return <main style={{minHeight:'100vh',background:'#050505',color:'white',display:'grid',placeItems:'center',padding:24}}><Head><title>Return to Dalimss News</title><meta name="robots" content="noindex"/><meta name="referrer" content="no-referrer"/></Head><section style={{maxWidth:420,textAlign:'center'}}><h1>Dalimss News</h1><p>{error||'Returning you to the app…'}</p>{callback&&<a href={callback} style={{display:'inline-block',background:'white',color:'black',padding:16,borderRadius:28}}>Return to Dalimss News</a>}{error&&<p>Close this window and try Google sign-in again from the app.</p>}</section></main>;
}
