import {useRouter} from 'next/router';
import {signIn} from 'next-auth/react';
import {useState} from 'react';
import Head from 'next/head';
export default function MobileSignIn(){
 const router=useRouter();const [busy,setBusy]=useState(false);
 const {challenge,state}=router.query;
 const valid=typeof challenge==='string'&&/^[A-Za-z0-9_-]{43}$/.test(challenge)&&typeof state==='string'&&/^[A-Za-z0-9_-]{43}$/.test(state);
 return <main style={{minHeight:'100vh',background:'#050505',color:'white',display:'grid',placeItems:'center',padding:24}}><Head><title>Sign in to Dalimss News</title><meta name="robots" content="noindex"/></Head><section style={{maxWidth:420,textAlign:'center'}}><h1>Dalimss News</h1><h2>Your stories. Your account.</h2><p>Sign in with Google to continue in the Dalimss News app. Your Google password stays with Google.</p>{valid?<button disabled={busy} style={{background:'white',color:'black',border:0,borderRadius:32,padding:'16px 28px',fontWeight:600}} onClick={()=>{setBusy(true);void signIn('google',{callbackUrl:`/mobile-sign-in/complete?challenge=${challenge}&state=${state}`});}}>{busy?'Opening Google…':'Continue with Google'}</button>:<p>Open Google sign-in from the Dalimss News app.</p>}</section></main>;
}
