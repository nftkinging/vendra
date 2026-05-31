'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Welcome() {
  const { isConnected } = useAccount();
  const router = useRouter();
  useEffect(() => { if (!isConnected) router.push('/join'); }, [isConnected, router]);
  return (
    <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <Nav />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-60%)',width:800,height:600,background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)',backgroundSize:'96px 96px'}}/>
      </div>
      <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:560,padding:'0 40px'}}>
        <div className='v-arc-badge' style={{marginBottom:32,display:'inline-flex'}}><div className='v-arc-badge-dot'/><span className='v-arc-badge-text'>Welcome back</span></div>
        <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(40px,7vw,88px)',fontWeight:300,lineHeight:0.90,letterSpacing:'-0.01em',color:'var(--w)',marginBottom:24}}>
          What would you<br/><em style={{fontStyle:'italic',background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>like to do?</em>
        </h1>
        <p style={{fontSize:14,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:48}}>You have both a buyer and seller profile. Choose your path.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'var(--b1)',maxWidth:400,margin:'0 auto 32px'}}>
          <Link href='/marketplace' style={{textDecoration:'none'}}>
            <div style={{background:'var(--bg2)',padding:'32px 20px',cursor:'pointer',transition:'background 0.2s',textAlign:'center'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(212,176,90,0.08)')} onMouseLeave={e=>(e.currentTarget.style.background='var(--bg2)')}>
              <div style={{fontSize:'2rem',marginBottom:12}}>{'🛍️'}</div>
              <div style={{fontFamily:"'Cormorant',serif",fontSize:20,fontWeight:300,color:'var(--w)',marginBottom:6}}>Shop</div>
              <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.6}}>Browse stores & buy products</div>
            </div>
          </Link>
          <Link href='/profile' style={{textDecoration:'none'}}>
            <div style={{background:'var(--bg2)',padding:'32px 20px',cursor:'pointer',transition:'background 0.2s',textAlign:'center'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(212,176,90,0.08)')} onMouseLeave={e=>(e.currentTarget.style.background='var(--bg2)')}>
              <div style={{fontSize:'2rem',marginBottom:12}}>{'🏪'}</div>
              <div style={{fontFamily:"'Cormorant',serif",fontSize:20,fontWeight:300,color:'var(--w)',marginBottom:6}}>Sell</div>
              <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.6}}>Manage your store & products</div>
            </div>
          </Link>
        </div>
        <Link href='/profile' style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.12em',textDecoration:'none'}}>View full profile →</Link>
      </div>
    </main>
  );
}