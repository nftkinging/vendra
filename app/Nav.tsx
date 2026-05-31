'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import CartButton from './components/CartButton';
import CartDrawer from './components/CartDrawer';

export default function Nav() {
  const { isConnected, address } = useAccount();
  const [showLogin, setShowLogin] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [step, setStep] = useState<'form'|'creating'|'done'>('form');
  const [email, setEmail] = useState('');
  const [circleWallet, setCircleWallet] = useState<{address:string;walletId:string}|null>(null);
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');

  const closeAll = () => { setShowLogin(false); setShowCircle(false); setStep('form'); setError(''); };

  const handleCreateCircleWallet = async () => {
    if (!email) { setError('Enter your email'); return; }
    setStep('creating'); setError('');
    try {
      const res = await fetch('/api/circle/create-wallet', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userAddress: email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCircleWallet({ address: data.address, walletId: data.walletId });
      const balRes = await fetch('/api/circle/balance', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletId: data.walletId }) });
      const balData = await balRes.json();
      setBalance(balData.balance || '0');
      setStep('done');
    } catch(e:any) { setError(e.message || 'Failed'); setStep('form'); }
  };

  return (
    <>
      <CartDrawer />

      {/* Login Modal */}
      {showLogin && !showCircle && (
        <div className='v-modal-bg' onClick={closeAll}>
          <div className='v-modal' style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div style={{ fontFamily:"'Cormorant',serif", fontSize:28, fontWeight:300, color:'var(--w)' }}>Log In</div>
              <button onClick={closeAll} style={{ background:'transparent', border:'1px solid var(--b1)', color:'var(--w35)', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:24 }}>Choose how you want to connect to Vendra.</div>
            {/* Web3 Option */}
            <div style={{ border:'1px solid var(--b1)', padding:'20px', marginBottom:12, background:'var(--bg3)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.3),transparent)' }} />
              <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--a)', marginBottom:8 }}>🦊 Web3 Wallet</div>
              <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', marginBottom:16, lineHeight:1.6 }}>MetaMask, Coinbase, WalletConnect or any EVM wallet.</div>
              <div style={{ display:'flex', justifyContent:'center' }}>
                <ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
              </div>
            </div>
            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ flex:1, height:1, background:'var(--b1)' }}/>
              <span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.14em', textTransform:'uppercase' }}>or</span>
              <div style={{ flex:1, height:1, background:'var(--b1)' }}/>
            </div>
            {/* Circle Option */}
            <div style={{ border:'1px solid rgba(155,181,200,0.2)', padding:'20px', background:'rgba(155,181,200,0.03)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(155,181,200,0.3),transparent)' }} />
              <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--sl)', marginBottom:8 }}>⭕ Circle Wallet</div>
              <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', marginBottom:16, lineHeight:1.6 }}>No crypto experience needed. Create a USDC wallet with just your email.</div>
              <button onClick={() => setShowCircle(true)} className='btn-slate' style={{ width:'100%', fontSize:10, padding:'12px' }}>Create Circle Wallet →</button>
            </div>
          </div>
        </div>)}

      {/* Circle Wallet Modal */}
      {showCircle && (
        <div className='v-modal-bg' onClick={closeAll}>
          <div className='v-modal' style={{ maxWidth:440 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sl)', marginBottom:6 }}>Circle · Developer Controlled Wallet</div>
                <div style={{ fontFamily:"'Cormorant',serif", fontSize:24, fontWeight:300, color:'var(--w)' }}>{step==='done'?'Wallet Ready':step==='creating'?'Creating...':'Create Circle Wallet'}</div>
              </div>
              <button onClick={closeAll} style={{ background:'transparent', border:'1px solid var(--b1)', color:'var(--w35)', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
            </div>
            {step==='form' && (
              <>
                <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:20 }}>Enter your email and we'll create a USDC wallet on Arc Testnet instantly.</div>
                <div className='v-field'><label className='v-label'>Email</label><input className='v-input' type='email' placeholder='you@example.com' value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter' && handleCreateCircleWallet()} /></div>
                {error && <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--err)', marginBottom:12, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
                <button onClick={handleCreateCircleWallet} className='btn-primary' style={{ width:'100%', padding:'14px', fontSize:11, marginBottom:12 }}>Create My USDC Wallet →</button>
                <button onClick={() => setShowCircle(false)} style={{ width:'100%', background:'transparent', border:'none', fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', cursor:'pointer', padding:'8px' }}>← Back</button>
              </>
            )}
            {step==='creating' && <div style={{ textAlign:'center', padding:'24px 0' }}><div className='v-spinner' style={{ margin:'0 auto 16px' }}/><div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)' }}>Creating your wallet on Arc Testnet...</div></div>}
            {step==='done' && circleWallet && (
              <>
                <div style={{ border:'1px solid rgba(212,176,90,0.2)', background:'rgba(212,176,90,0.04)', padding:'20px', marginBottom:16, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)' }} />
                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Your Circle Wallet · Arc Testnet</div>
                  <div style={{ fontFamily:"'Cormorant',serif", fontSize:12, fontWeight:300, color:'var(--a2)', wordBreak:'break-all', marginBottom:12 }}>{circleWallet.address}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div><div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--w18)', marginBottom:2 }}>USDC Balance</div><div style={{ fontFamily:"'Cormorant',serif", fontSize:28, fontWeight:300, color:'var(--a2)' }}>${balance}</div></div>
                    <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{ fontSize:9, padding:'8px 14px' }}>Get Test USDC ↗</button></a>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <a href={`https://testnet.arcscan.app/address/${circleWallet.address}`} target='_blank' rel='noopener noreferrer' style={{ flex:1 }}><button className='btn-ghost' style={{ width:'100%', fontSize:9, padding:'10px' }}>Arc Explorer ↗</button></a>
                  <Link href='/marketplace' onClick={closeAll} style={{ flex:1 }}><button className='btn-primary' style={{ width:'100%', fontSize:9, padding:'10px' }}>Browse Marketplace →</button></Link>
                </div>
              </>
            )}
          </div>
        </div>)}

      <nav className='v-nav'>
        <Link href='/' className='v-logo'>
          <div className='v-logo-emblem'><span className='v-logo-v'>V</span></div>
          <span className='v-logo-name'>Vendra</span>
        </Link>
        <div className='v-nav-links'>
          <Link href='/marketplace'>Marketplace</Link>
          <Link href='/store/create'>Sell</Link>
          {isConnected && <Link href='/profile'>Profile</Link>}
        </div>
        <div className='v-nav-right'>
          <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{ textDecoration:'none' }}>
            <button className='btn-faucet'>💧 Faucet</button>
          </a>
          <CartButton />
          {isConnected
            ? <ConnectButton accountStatus='address' chainStatus='none' showBalance={false} />
            : <button onClick={() => setShowLogin(true)} className='btn-nav-amber'>Log In</button>}
        </div>
      </nav>
    </>
  );
}