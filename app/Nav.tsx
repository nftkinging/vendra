'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import CartButton from './components/CartButton';
import CartDrawer from './components/CartDrawer';
import AppKitWidget from './components/AppKitWidget';

type CircleStep = 'email'|'checking'|'found'|'notfound'|'creating'|'done';
type CircleWallet = { address: string; walletId: string; email: string };

const STORAGE_KEY = 'vendra_circle_wallet';

export default function Nav() {
  const { isConnected } = useAccount();
  const [showLogin, setShowLogin] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [step, setStep] = useState<CircleStep>('email');
  const [email, setEmail] = useState('');
  const [circleWallet, setCircleWallet] = useState<CircleWallet|null>(null);
  const [balance, setBalance] = useState('0');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [sendForm, setSendForm] = useState({ to:'', amount:'' });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  // Load persisted Circle wallet on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const w = JSON.parse(saved) as CircleWallet;
        setCircleWallet(w);
        fetchBalance(w.walletId);
      }
    } catch {}
  }, []);

  const saveWallet = (w: CircleWallet) => {
    setCircleWallet(w);
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch {}
  };

  const logout = () => {
    setCircleWallet(null);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
    setShowDashboard(false);
  };

  const fetchBalance = async (walletId: string) => {
    try {
      const res = await fetch('/api/circle/balance', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletId }) });
      const data = await res.json();
      setBalance(data.balance || '0');
    } catch {}
  };

  const handleCopy = () => {
    if (!circleWallet) return;
    navigator.clipboard.writeText(circleWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogin = async () => {
    if (!email) { setError('Enter your email'); return; }
    setStep('checking'); setError('');
    try {
      const res = await fetch('/api/circle/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.found) {
        const w = { address: data.address, walletId: data.walletId, email };
        saveWallet(w);
        await fetchBalance(data.walletId);
        setStep('found');
      } else {
        setStep('notfound');
      }
    } catch(e:any) { setError(e.message || 'Something went wrong'); setStep('email'); }
  };

  const handleCreate = async () => {
    setStep('creating'); setError('');
    try {
      const res = await fetch('/api/circle/create-wallet', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const w = { address: data.address, walletId: data.walletId, email };
      saveWallet(w);
      await fetchBalance(data.walletId);
      setStep('done');
    } catch(e:any) { setError(e.message || 'Failed'); setStep('notfound'); }
  };

  const handleSend = async () => {
    if (!sendForm.to || !sendForm.amount || !circleWallet) return;
    setSending(true); setSendResult(''); setError('');
    try {
      const res = await fetch('/api/circle/send', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletId: circleWallet.walletId, walletAddress: circleWallet.address, toAddress: sendForm.to, amount: sendForm.amount }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendResult('Sent! TX: ' + (data.txId || '').slice(0,20) + '...');
      await fetchBalance(circleWallet.walletId);
    } catch(e:any) { setError(e.message || 'Send failed'); }
    finally { setSending(false); }
  };

  const closeAll = () => { setShowLogin(false); setShowCircle(false); setShowDashboard(false); setStep('email'); setError(''); setSendResult(''); };

  // Truncate address for display
  const shortAddr = (addr: string) => addr ? addr.slice(0,6)+'...'+addr.slice(-4) : '';

  const WalletDashboard = () => (
    <>
      <div style={{ border:'1px solid rgba(212,176,90,0.2)', background:'rgba(212,176,90,0.04)', padding:'20px', marginBottom:16, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)' }} />
        <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Circle Wallet · Arc Testnet</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <div style={{ fontFamily:"'Cormorant',serif", fontSize:13, fontWeight:300, color:'var(--a)', flex:1, wordBreak:'break-all' }}>{circleWallet?.address}</div>
          <button onClick={handleCopy} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.12em', textTransform:'uppercase', border:'1px solid var(--b2)', color: copied?'var(--gr)':'var(--w35)', padding:'5px 10px', background:'transparent', cursor:'pointer', flexShrink:0, transition:'all 0.3s', whiteSpace:'nowrap' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div><div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--w18)', marginBottom:2 }}>USDC Balance</div><div style={{ fontFamily:"'Cormorant',serif", fontSize:32, fontWeight:300, color:'var(--a2)' }}>${balance}</div></div>
          <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{ fontSize:9, padding:'8px 12px' }}>Get USDC ↗</button></a>
        </div>
      </div>
      <div className='v-field'><label className='v-label'>Send to Address</label><input className='v-input' placeholder='0x...' value={sendForm.to} onChange={e => setSendForm({...sendForm, to:e.target.value})} /></div>
      <div className='v-field'><label className='v-label'>Amount (USDC)</label><input className='v-input' type='number' placeholder='e.g. 5.00' value={sendForm.amount} onChange={e => setSendForm({...sendForm, amount:e.target.value})} /></div>
      {error && <div style={{ fontSize:11, fontStyle:'italic', color:'var(--err)', marginBottom:10, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
      {sendResult && <div style={{ fontSize:10, fontStyle:'italic', color:'var(--gr)', marginBottom:10, border:'1px solid var(--gr3)', padding:'8px 12px', wordBreak:'break-all' }}>{sendResult}</div>}
      <button onClick={handleSend} disabled={sending} className='btn-primary' style={{ width:'100%', padding:'12px', fontSize:10, marginBottom:10 }}>{sending?'Sending...':'Send USDC on Arc →'}</button>
      <div style={{ display:'flex', gap:8 }}>
        <a href={`https://testnet.arcscan.app/address/${circleWallet?.address}`} target='_blank' rel='noopener noreferrer' style={{ flex:1 }}><button className='btn-ghost' style={{ width:'100%', fontSize:9, padding:'8px' }}>Arc Explorer ↗</button></a>
        <button onClick={logout} className='btn-danger' style={{ flex:1, fontSize:9, padding:'8px' }}>Log Out</button>
      </div>
    </>
  );

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
            <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:20 }}>Choose how you want to connect to Vendra.</div>
            <div style={{ border:'1px solid var(--b1)', padding:'20px', marginBottom:12, background:'var(--bg3)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.3),transparent)' }} />
              <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--a)', marginBottom:8 }}>🦊 Web3 Wallet</div>
              <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', marginBottom:14, lineHeight:1.6 }}>MetaMask, Coinbase, WalletConnect or any EVM wallet.</div>
              <div style={{ display:'flex', justifyContent:'center' }}><ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false} /></div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ flex:1, height:1, background:'var(--b1)' }}/><span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.14em', textTransform:'uppercase' }}>or</span><div style={{ flex:1, height:1, background:'var(--b1)' }}/>
            </div>
            <div style={{ border:'1px solid rgba(155,181,200,0.2)', padding:'20px', background:'rgba(155,181,200,0.03)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:'linear-gradient(90deg,transparent,rgba(155,181,200,0.3),transparent)' }} />
              <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--sl)', marginBottom:8 }}>⭕ Circle Wallet</div>
              <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', marginBottom:14, lineHeight:1.6 }}>No crypto experience needed. Log in with your email.</div>
              <button onClick={() => { setShowLogin(false); setShowCircle(true); }} className='btn-slate' style={{ width:'100%', fontSize:10, padding:'12px' }}>Log In with Circle Wallet →</button>
            </div>
          </div>
        </div>)}

      {/* Circle Modal */}
      {showCircle && (
        <div className='v-modal-bg' onClick={closeAll}>
          <div className='v-modal' style={{ maxWidth:440 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sl)', marginBottom:4 }}>Circle · USDC Wallet</div>
                <div style={{ fontFamily:"'Cormorant',serif", fontSize:24, fontWeight:300, color:'var(--w)' }}>
                  {step==='email'&&'Log In with Circle'}
                  {step==='checking'&&'Checking...'}
                  {step==='notfound'&&'Create Wallet'}
                  {step==='creating'&&'Creating Wallet...'}
                  {(step==='found'||step==='done')&&'Welcome Back ✓'}
                </div>
              </div>
              <button onClick={closeAll} style={{ background:'transparent', border:'1px solid var(--b1)', color:'var(--w35)', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
            </div>
            {step==='email' && (
              <>
                <div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:20 }}>Enter the email linked to your Circle wallet. New here? We'll create one for you.</div>
                <div className='v-field'><label className='v-label'>Email Address</label><input className='v-input' type='email' placeholder='you@example.com' value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLogin()} autoFocus /></div>
                {error && <div style={{ fontSize:11, fontStyle:'italic', color:'var(--err)', marginBottom:12, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
                <button onClick={handleLogin} className='btn-primary' style={{ width:'100%', padding:'14px', fontSize:11, marginBottom:10 }}>Continue →</button>
                <button onClick={() => { setShowCircle(false); setShowLogin(true); }} style={{ width:'100%', background:'transparent', border:'none', fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', cursor:'pointer', padding:'8px' }}>← Back to options</button>
              </>
            )}
            {step==='checking' && <div style={{ textAlign:'center', padding:'24px 0' }}><div className='v-spinner' style={{ margin:'0 auto 16px' }}/><div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)' }}>Looking up your wallet...</div></div>}
            {step==='notfound' && (
              <>
                <div style={{ border:'1px solid var(--b1)', padding:'16px', marginBottom:20, background:'var(--bg3)' }}>
                  <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7 }}>No wallet found for <strong style={{ color:'var(--w)' }}>{email}</strong>. Would you like to create one?</div>
                </div>
                {error && <div style={{ fontSize:11, fontStyle:'italic', color:'var(--err)', marginBottom:12, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
                <button onClick={handleCreate} className='btn-primary' style={{ width:'100%', padding:'14px', fontSize:11, marginBottom:10 }}>Create New Circle Wallet →</button>
                <button onClick={() => setStep('email')} style={{ width:'100%', background:'transparent', border:'none', fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', cursor:'pointer', padding:'8px' }}>← Try a different email</button>
              </>
            )}
            {step==='creating' && <div style={{ textAlign:'center', padding:'24px 0' }}><div className='v-spinner' style={{ margin:'0 auto 16px' }}/><div style={{ fontSize:12, fontWeight:300, fontStyle:'italic', color:'var(--w35)' }}>Creating your wallet on Arc Testnet...</div></div>}
            {(step==='found'||step==='done') && circleWallet && <WalletDashboard />}
          </div>
        </div>)}

      {/* Circle Dashboard Modal — when already logged in */}
      {showDashboard && circleWallet && (
        <div className='v-modal-bg' onClick={closeAll}>
          <div className='v-modal' style={{ maxWidth:440 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sl)', marginBottom:4 }}>Circle · USDC Wallet</div>
                <div style={{ fontFamily:"'Cormorant',serif", fontSize:24, fontWeight:300, color:'var(--w)' }}>{circleWallet.email}</div>
              </div>
              <button onClick={closeAll} style={{ background:'transparent', border:'1px solid var(--b1)', color:'var(--w35)', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
            </div>
            <WalletDashboard />
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
          {isConnected && <AppKitWidget />}
          {isConnected
            ? <ConnectButton accountStatus='address' chainStatus='none' showBalance={false} />
            : circleWallet
              ? <button onClick={() => { setShowDashboard(true); fetchBalance(circleWallet.walletId); }} className='btn-nav-amber' style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span>⭕</span>
                  <span>{shortAddr(circleWallet.address)}</span>
                </button>
              : <button onClick={() => setShowLogin(true)} className='btn-nav-amber'>Log In</button>}
        </div>
      </nav>
    </>
  );
}