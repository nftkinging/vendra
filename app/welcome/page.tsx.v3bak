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
    <main style={{ minHeight:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <Nav />
      {/* Ambient */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-60%)', width:800, height:600, background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)', backgroundSize:'96px 96px' }}/>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:'2px', background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.3),transparent)' }}/>
      </div>

      <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:560, padding:'0 40px' }}>
        {/* Badge */}
        <div className='v-arc-badge' style={{ marginBottom:32, display:'inline-flex' }}>
          <div className='v-arc-badge-dot'/>
          <span className='v-arc-badge-text'>Welcome back · Arc Testnet</span>
        </div>
        {/* Heading */}
        <h1 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(44px,8vw,88px)', fontWeight:300, lineHeight:0.90, letterSpacing:'-0.01em', color:'var(--w)', marginBottom:20 }}>
          What would you<br/>
          <em style={{ fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>like to do?</em>
        </h1>
        <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:48, maxWidth:400, margin:'0 auto 48px' }}>
          You have both a buyer and seller profile. Your storefront and order history are ready whenever you are.
        </p>
        {/* Options */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'var(--b1)', maxWidth:480, margin:'0 auto 32px' }}>
          {/* Seller */}
          <Link href='/profile' style={{ textDecoration:'none' }}>
            <div style={{ background:'var(--bg2)', padding:'36px 24px', cursor:'pointer', transition:'all 0.3s', textAlign:'left' }} onMouseEnter={e=>{ e.currentTarget.style.background='rgba(212,176,90,0.06)'; e.currentTarget.style.borderBottom='1px solid var(--a)'; }} onMouseLeave={e=>{ e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.borderBottom='1px solid transparent'; }}>
              <div style={{ fontSize:'2rem', marginBottom:14 }}>🏪</div>
              <div style={{ fontFamily:"'Cormorant',serif", fontSize:22, fontWeight:300, color:'var(--w)', marginBottom:8, lineHeight:1.2 }}>Manage my store</div>
              <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7 }}>Add products, view sales, edit your storefront or launch a new store on Arc Testnet.</div>
            </div>
          </Link>
          {/* Buyer */}
          <Link href='/marketplace' style={{ textDecoration:'none' }}>
            <div style={{ background:'var(--bg2)', padding:'36px 24px', cursor:'pointer', transition:'all 0.3s', textAlign:'left' }} onMouseEnter={e=>{ e.currentTarget.style.background='rgba(212,176,90,0.06)'; e.currentTarget.style.borderBottom='1px solid var(--a)'; }} onMouseLeave={e=>{ e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.borderBottom='1px solid transparent'; }}>
              <div style={{ fontSize:'2rem', marginBottom:14 }}>🛍️</div>
              <div style={{ fontFamily:"'Cormorant',serif", fontSize:22, fontWeight:300, color:'var(--w)', marginBottom:8, lineHeight:1.2 }}>Keep shopping</div>
              <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7 }}>Browse stores, discover new products and pay instantly in USDC on Arc.</div>
            </div>
          </Link>
        </div>
        {/* Eyebrow divider */}
        <div className='v-cta-rule' style={{ marginBottom:20 }}>
          <div className='v-cta-rule-line'/>
          <div className='v-cta-rule-text'>or</div>
          <div className='v-cta-rule-line'/>
        </div>
        <Link href='/marketplace' style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.12em', textDecoration:'none', transition:'color 0.3s' }} onMouseEnter={e=>(e.currentTarget.style.color='var(--a)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--w18)')}>Explore Marketplace →</Link>
      </div>
    </main>
  );
}