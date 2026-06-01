'use client';
import Link from 'next/link';
import Nav from './Nav';

export default function NotFound() {
  return (
    <main style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <Nav />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-60%)', width:800, height:600, background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)', backgroundSize:'96px 96px' }}/>
      </div>
      <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:480, padding:'0 40px' }}>
        <div style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(80px,20vw,160px)', fontWeight:300, lineHeight:1, background:'linear-gradient(120deg,var(--a),var(--a2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:8 }}>404</div>
        <div className='v-cta-rule' style={{ marginBottom:20 }}><div className='v-cta-rule-line'/><div className='v-cta-rule-text'>Page Not Found</div><div className='v-cta-rule-line'/></div>
        <h1 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(28px,5vw,48px)', fontWeight:300, letterSpacing:'-0.01em', lineHeight:0.94, color:'var(--w)', marginBottom:16 }}>This page doesn't<br/><em style={{ fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>exist</em></h1>
        <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:40 }}>The page you're looking for has moved, was deleted, or never existed. Let's get you back on track.</p>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <Link href='/'><button className='btn-primary' style={{ fontSize:11, padding:'14px 36px' }}>Back to Homepage</button></Link>
          <Link href='/marketplace'><button className='btn-ghost' style={{ fontSize:11, padding:'14px 36px' }}>Browse Marketplace</button></Link>
        </div>
      </div>
    </main>
  );
}