'use client';
import Nav from '../Nav';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Join() {
  const { isConnected } = useAccount();
  const router = useRouter();
  useEffect(() => { if (isConnected) router.push('/onboarding'); }, [isConnected, router]);
  return (
    <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <Nav />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-60%)',width:800,height:600,background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)',backgroundSize:'96px 96px'}}/>
      </div>
      <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:520,padding:'0 40px'}}>
        <div className='v-arc-badge' style={{marginBottom:32,display:'inline-flex'}}><div className='v-arc-badge-dot'/><span className='v-arc-badge-text'>Arc Testnet · Powered by USDC</span></div>
        <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(48px,8vw,96px)',fontWeight:300,lineHeight:0.90,letterSpacing:'-0.01em',color:'var(--w)',marginBottom:24}}>
          Connect your<br/><em style={{fontStyle:'italic',background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>wallet</em>
        </h1>
        <p style={{fontSize:14,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:40}}>Your wallet is your identity on Vendra. No email. No password. Just your keys.</p>
        <div style={{display:'flex',justifyContent:'center',marginBottom:20}}>
          <ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
        </div>
        <Link href='/marketplace' style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.12em',textDecoration:'none'}}>← Browse without connecting</Link>
      </div>
    </main>
  );
}