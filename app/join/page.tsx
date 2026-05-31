'use client';
import Nav from '../Nav';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Join() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [showCircleModal, setShowCircleModal] = useState(false);
  useEffect(() => { if (isConnected) router.push('/onboarding'); }, [isConnected, router]);

  return (
    <main style={{ minHeight:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <Nav />
      {/* Ambient */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-60%)', width:800, height:600, background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)', backgroundSize:'96px 96px' }}/>
      </div>

      {/* Circle Modal */}
      {showCircleModal && (
        <div className='v-modal-bg' onClick={() => setShowCircleModal(false)}>
          <div className='v-modal' style={{ maxWidth:480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sl)', marginBottom:6 }}>Circle · App Kit</div>
                <div style={{ fontFamily:"'Cormorant',serif", fontSize:28, fontWeight:300, color:'var(--w)', lineHeight:1.1 }}>Pay with USDC<br/>from any chain</div>
              </div>
              <button onClick={() => setShowCircleModal(false)} style={{ background:'transparent', border:'1px solid var(--b1)', color:'var(--w35)', width:32, height:32, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ fontSize:13, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:24 }}>Hold USDC on Ethereum, Solana, or any supported chain and spend directly on Vendra — no manual bridging needed. Powered by Circle CCTP.</div>
            <div style={{ border:'1px solid var(--b1)', marginBottom:24 }}>
              {[
                { num:'01', title:'Get test USDC', desc:'Visit the Circle faucet and get free USDC on Arc Testnet.', link:'https://faucet.circle.com/', cta:'Open Faucet ↗' },
                { num:'02', title:'Connect your wallet', desc:'Connect any EVM wallet below — App Kit handles the USDC flow automatically.', link:null, cta:null },
                { num:'03', title:'Bridge from another chain', desc:'Already have USDC elsewhere? Circle bridges it via CCTP in one click.', link:'https://docs.arc.io/app-kit/bridge', cta:'Bridge Docs ↗' },
              ].map(s => (
                <div key={s.num} style={{ display:'flex', gap:16, padding:'14px 18px', borderBottom:'1px solid var(--b1)' }}>
                  <div style={{ fontFamily:"'Cormorant',serif", fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--a)', flexShrink:0, paddingTop:2 }}>{s.num}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Cormorant',serif", fontSize:15, fontWeight:300, color:'var(--w85)', marginBottom:3 }}>{s.title}</div>
                    <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.65 }}>{s.desc}</div>
                  </div>
                  {s.link && <a href={s.link} target='_blank' rel='noopener noreferrer' style={{ flexShrink:0, alignSelf:'center' }}><button className='btn-ghost' style={{ fontSize:9, padding:'5px 10px', whiteSpace:'nowrap' }}>{s.cta}</button></a>}
                </div>))}
            </div>
            <div style={{ textAlign:'center', marginBottom:16, fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.08em' }}>Connect a wallet to get started</div>
            <div style={{ display:'flex', justifyContent:'center' }}>
              <ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
            </div>
          </div>
        </div>)}

      {/* Main content */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:520, padding:'0 40px' }}>
        <div className='v-arc-badge' style={{ marginBottom:36, display:'inline-flex' }}>
          <div className='v-arc-badge-dot'/>
          <span className='v-arc-badge-text'>Arc Testnet · Powered by USDC</span>
        </div>
        <h1 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(52px,9vw,104px)', fontWeight:300, lineHeight:0.88, letterSpacing:'-0.01em', color:'var(--w)', marginBottom:20 }}>
          Connect your<br/><em style={{ fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>wallet</em>
        </h1>
        <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:48 }}>Your wallet is your identity on Vendra. No email. No password. Just your keys — or use Circle App Kit for a simpler USDC experience.</p>
        {/* Buttons */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:28 }}>
          {/* Web3 connect button */}
          <ConnectButton label='Connect Web3 Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, width:'100%', maxWidth:280 }}>
            <div style={{ flex:1, height:1, background:'var(--b1)' }}/>
            <span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.14em', textTransform:'uppercase' }}>or</span>
            <div style={{ flex:1, height:1, background:'var(--b1)' }}/>
          </div>
          {/* Circle App Kit button */}
          <button onClick={() => setShowCircleModal(true)} className='btn-ghost' style={{ fontSize:11, padding:'14px 36px', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:'1rem' }}>⭕</span>
            <span>Pay with Circle App Kit</span>
          </button>
        </div>
        <Link href='/marketplace' style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.12em', textDecoration:'none' }}>Browse without connecting →</Link>
      </div>
    </main>
  );
}