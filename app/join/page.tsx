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
  const [option, setOption] = useState<'web3'|'circle'|null>(null);
  useEffect(() => { if (isConnected) router.push('/onboarding'); }, [isConnected, router]);

  return (
    <main style={{ minHeight:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden' }}>
      <Nav />
      {/* Ambient bg */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-60%)', width:800, height:600, background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)', backgroundSize:'96px 96px' }}/>
      </div>
      <div style={{ position:'relative', zIndex:1, maxWidth:680, margin:'0 auto', padding:'120px 40px 80px', textAlign:'center' }}>
        <div className='v-arc-badge' style={{ marginBottom:32, display:'inline-flex' }}><div className='v-arc-badge-dot'/><span className='v-arc-badge-text'>Arc Testnet · Powered by USDC</span></div>
        <h1 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(40px,7vw,80px)', fontWeight:300, lineHeight:0.90, letterSpacing:'-0.01em', color:'var(--w)', marginBottom:16 }}>
          Join<br/><em style={{ fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Vendra</em>
        </h1>
        <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:48, maxWidth:440, margin:'0 auto 48px' }}>Buy and sell anything, get paid instantly in USDC. Choose how you want to connect.</p>

        {/* Two options */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'var(--b1)', marginBottom:32 }}>
          {/* Web3 Wallet */}
          <div onClick={() => setOption('web3')} style={{ background: option==='web3' ? 'rgba(212,176,90,0.08)' : 'var(--bg2)', padding:'36px 28px', cursor:'pointer', borderBottom: option==='web3' ? '1px solid var(--a)' : '1px solid transparent', transition:'all 0.2s', textAlign:'left' }}>
            <div style={{ fontSize:'2rem', marginBottom:14 }}>🦊</div>
            <div style={{ fontFamily:"'Cormorant',serif", fontSize:22, fontWeight:300, color: option==='web3' ? 'var(--a2)' : 'var(--w)', marginBottom:8 }}>Web3 Wallet</div>
            <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:16 }}>Connect MetaMask, Coinbase, WalletConnect or any EVM wallet. Full Web3 experience on Arc Testnet.</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['MetaMask','Coinbase','WalletConnect','Rabby'].map(w => <span key={w} style={{ fontSize:8, fontWeight:300, fontStyle:'italic', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--w18)', border:'1px solid var(--b1)', padding:'3px 8px' }}>{w}</span>)}
            </div>
          </div>
          {/* Circle Wallet */}
          <div onClick={() => setOption('circle')} style={{ background: option==='circle' ? 'rgba(155,181,200,0.08)' : 'var(--bg2)', padding:'36px 28px', cursor:'pointer', borderBottom: option==='circle' ? '1px solid var(--sl)' : '1px solid transparent', transition:'all 0.2s', textAlign:'left' }}>
            <div style={{ fontSize:'2rem', marginBottom:14 }}>⭕</div>
            <div style={{ fontFamily:"'Cormorant',serif", fontSize:22, fontWeight:300, color: option==='circle' ? 'var(--sl2)' : 'var(--w)', marginBottom:8 }}>Circle Wallet</div>
            <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:16 }}>No crypto experience needed. Use Circle's App Kit to bridge USDC from any chain and pay on Vendra instantly.</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['USDC Native','CCTP Bridge','Multi-Chain','Unified Balance'].map(w => <span key={w} style={{ fontSize:8, fontWeight:300, fontStyle:'italic', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--w18)', border:'1px solid var(--b1)', padding:'3px 8px' }}>{w}</span>)}
            </div>
          </div>
        </div>

        {/* Web3 connect */}
        {option==='web3' && (
          <div style={{ border:'1px solid var(--b1)', background:'var(--bg2)', padding:'28px', position:'relative', overflow:'hidden', marginBottom:16 }}>
            <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)' }} />
            <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--a)', marginBottom:16 }}>Connect your Web3 wallet</div>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
              <ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
            </div>
            <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.08em' }}>Your wallet is your identity. No email or password needed.</div>
          </div>)}

        {/* Circle App Kit option */}
        {option==='circle' && (
          <div style={{ border:'1px solid rgba(155,181,200,0.2)', background:'linear-gradient(145deg,rgba(155,181,200,0.05),var(--bg2))', padding:'28px', position:'relative', overflow:'hidden', marginBottom:16 }}>
            <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(155,181,200,0.4),transparent)' }} />
            <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--sl)', marginBottom:16 }}>Circle App Kit · Bridge & Pay</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1px', background:'var(--b1)', marginBottom:20 }}>
              {[{icon:'🌉',title:'Bridge',desc:'Move USDC from Ethereum, Solana, or any supported chain to Arc Testnet via CCTP'},{icon:'💳',title:'Unified Balance',desc:'Hold USDC anywhere, spend on Vendra without manual bridging'},{icon:'✈️',title:'Send',desc:'Transfer USDC directly to any seller wallet on Arc Testnet instantly'}].map(f => (
                <div key={f.title} style={{ background:'var(--bg2)', padding:'20px 16px', textAlign:'left' }}>
                  <div style={{ fontSize:'1.4rem', marginBottom:8 }}>{f.icon}</div>
                  <div style={{ fontFamily:"'Cormorant',serif", fontSize:16, fontWeight:300, color:'var(--w85)', marginBottom:6 }}>{f.title}</div>
                  <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.65 }}>{f.desc}</div>
                </div>))}
            </div>
            <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:16 }}>To use Circle App Kit, you still need to connect a Web3 wallet — but the App Kit handles all the complex bridging and payment routing so you never have to think about chains.</div>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
              <ConnectButton label='Connect & Use Circle App Kit' accountStatus='address' chainStatus='none' showBalance={false} />
            </div>
            <a href='https://docs.arc.io/app-kit' target='_blank' rel='noopener noreferrer' style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--sl)', letterSpacing:'0.10em', textDecoration:'none', display:'block', marginTop:8 }}>Learn about Circle App Kit ↗</a>
          </div>)}

        {!option && (
          <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.08em' }}>← Select an option above to continue</div>)}

        <div style={{ marginTop:24 }}>
          <Link href='/marketplace' style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.12em', textDecoration:'none' }}>Browse without connecting →</Link>
        </div>
      </div>
    </main>
  );
}