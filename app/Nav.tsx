'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import CartButton from './components/CartButton';
import CartDrawer from './components/CartDrawer';
import AppKitWidget from './components/AppKitWidget';
import CircleWalletDashboard from './components/CircleWalletDashboard';

type CircleStep = 'email'|'otp'|'checking'|'found'|'notfound'|'creating'|'done';
type CircleWallet = { address: string; walletId: string; email: string };
const STORAGE_KEY = 'vendra_circle_wallet';

export default function Nav() {
  const { isConnected } = useAccount();
  const [showLogin, setShowLogin] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [step, setStep] = useState<CircleStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [circleWallet, setCircleWallet] = useState<CircleWallet|null>(null);
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) { const w = JSON.parse(saved); setCircleWallet(w); fetchBalance(w.walletId); }
    } catch {}
  }, []);

  useEffect(() => {
    if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(r => r - 1), 1000); return () => clearTimeout(t); }
  }, [resendTimer]);

  const saveWallet = (w: CircleWallet) => { setCircleWallet(w); try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch {} };
  const logout = () => { setCircleWallet(null); try { sessionStorage.removeItem(STORAGE_KEY); } catch {} setShowDashboard(false); setShowCircle(false); };
  const closeAll = () => { setShowLogin(false); setShowCircle(false); setShowDashboard(false); setStep('email'); setError(''); setOtp(''); };
  const shortAddr = (addr: string) => addr ? addr.slice(0,6)+'...'+addr.slice(-4) : '';

  const fetchBalance = async (walletId: string) => {
    try {
      const res = await fetch('/api/circle/balance', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletId }) });
      const data = await res.json();
      setBalance(data.balance || '0');
    } catch {}
  };

  const handleSendOtp = async () => {
    if (!email) { setError('Enter your email'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/circle/send-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStep('otp'); setResendTimer(60);
    } catch(e:any) { setError(e.message || 'Failed to send code'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true); setError(''); setStep('checking');
    try {
      const vRes = await fetch('/api/circle/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp }) });
      const vData = await vRes.json();
      if (vData.error) throw new Error(vData.error);
      const res = await fetch('/api/circle/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.found) { const w = { address:data.address, walletId:data.walletId, email }; saveWallet(w); await fetchBalance(data.walletId); setStep('found'); }
      else { setStep('notfound'); }
    } catch(e:any) { setError(e.message || 'Verification failed'); setStep('otp'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setStep('creating'); setError('');
    try {
      const res = await fetch('/api/circle/create-wallet', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const w = { address:data.address, walletId:data.walletId, email }; saveWallet(w); await fetchBalance(data.walletId); setStep('done');
    } catch(e:any) { setError(e.message || 'Failed'); setStep('notfound'); }
  };

  return (
    <>
      <CartDrawer/>

      {/* Login Modal */}
      {showLogin && !showCircle && (
        <div className='v-modal-bg' onClick={closeAll}>
          <div className='v-modal' style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <div style={{fontFamily:"'Cormorant',serif",fontSize:28,fontWeight:300,color:'var(--w)'}}>Log In</div>
              <button onClick={closeAll} style={{background:'transparent',border:'1px solid var(--b1)',color:'var(--w35)',width:32,height:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </div>
            <div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7,marginBottom:20}}>Choose how you want to connect to Vendra.</div>
            <div style={{border:'1px solid var(--b1)',padding:'20px',marginBottom:12,background:'var(--bg3)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.3),transparent)'}}/>
              <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--a)',marginBottom:8}}>🦊 Web3 Wallet</div>
              <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:14,lineHeight:1.6}}>MetaMask, Coinbase, WalletConnect or any EVM wallet.</div>
              <div style={{display:'flex',justifyContent:'center'}}><ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false}/></div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}><div style={{flex:1,height:1,background:'var(--b1)'}}/><span style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.14em',textTransform:'uppercase'}}>or</span><div style={{flex:1,height:1,background:'var(--b1)'}}/></div>
            <div style={{border:'1px solid rgba(155,181,200,0.2)',padding:'20px',background:'rgba(155,181,200,0.03)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,rgba(155,181,200,0.3),transparent)'}}/>
              <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--sl)',marginBottom:8}}>⭕ Circle Wallet</div>
              <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:14,lineHeight:1.6}}>No crypto experience needed. Verify your email to access your USDC wallet.</div>
              <button onClick={()=>{setShowLogin(false);setShowCircle(true);}} className='btn-slate' style={{width:'100%',fontSize:10,padding:'12px'}}>Log In with Circle Wallet →</button>
            </div>
          </div>
        </div>)}

      {/* Circle Auth Modal */}
      {showCircle && (
        <div className='v-modal-bg' onClick={closeAll}>
          <div className='v-modal' style={{maxWidth:440}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
              <div>
                <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--sl)',marginBottom:4}}>Circle · USDC Wallet</div>
                <div style={{fontFamily:"'Cormorant',serif",fontSize:24,fontWeight:300,color:'var(--w)'}}>
                  {step==='email'&&'Log In with Circle'}{step==='otp'&&'Enter Your Code'}{step==='checking'&&'Verifying...'}{step==='notfound'&&'Create Wallet'}{step==='creating'&&'Creating Wallet...'}{(step==='found'||step==='done')&&'Welcome Back ✓'}
                </div>
              </div>
              <button onClick={closeAll} style={{background:'transparent',border:'1px solid var(--b1)',color:'var(--w35)',width:32,height:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>✕</button>
            </div>
            {step==='email'&&(<><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:20}}>Enter your email. We'll send a verification code to confirm it's you.</div><div className='v-field'><label className='v-label'>Email Address</label><input className='v-input' type='email' placeholder='you@example.com' value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSendOtp()} autoFocus/></div>{error&&<div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:12,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}<button onClick={handleSendOtp} disabled={loading} className='btn-primary' style={{width:'100%',padding:'14px',fontSize:11,marginBottom:10}}>{loading?'Sending code...':'Send Verification Code →'}</button><button onClick={()=>{setShowCircle(false);setShowLogin(true);}} style={{width:'100%',background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',cursor:'pointer',padding:'8px'}}>← Back to options</button></>)}
            {step==='otp'&&(<><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:8}}>Code sent to <strong style={{color:'var(--w)'}}>{email}</strong>. Check inbox and spam.</div><div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',marginBottom:20,letterSpacing:'0.06em'}}>Expires in 10 minutes.</div><div className='v-field'><label className='v-label'>6-Digit Code</label><input className='v-input' type='text' inputMode='numeric' maxLength={6} placeholder='000000' value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} onKeyDown={e=>e.key==='Enter'&&handleVerifyOtp()} autoFocus style={{letterSpacing:'0.3em',fontSize:22,textAlign:'center'}}/></div>{error&&<div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:12,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}<button onClick={handleVerifyOtp} disabled={loading||otp.length!==6} className='btn-primary' style={{width:'100%',padding:'14px',fontSize:11,marginBottom:10}}>{loading?'Verifying...':'Verify & Continue →'}</button><div style={{display:'flex',justifyContent:'space-between'}}><button onClick={()=>{setStep('email');setOtp('');setError('');}} style={{background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',cursor:'pointer',padding:'8px 0'}}>← Change email</button><button onClick={resendTimer===0?handleSendOtp:undefined} disabled={resendTimer>0} style={{background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:resendTimer>0?'var(--w18)':'var(--a)',cursor:resendTimer>0?'not-allowed':'pointer',padding:'8px 0'}}>{resendTimer>0?`Resend in ${resendTimer}s`:'Resend code'}</button></div></>)}
            {step==='checking'&&<div style={{textAlign:'center',padding:'24px 0'}}><div className='v-spinner' style={{margin:'0 auto 16px'}}/><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)'}}>Verifying...</div></div>}
            {step==='notfound'&&(<><div style={{border:'1px solid var(--b1)',padding:'16px',marginBottom:20,background:'var(--bg3)'}}><div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7}}>No wallet found for <strong style={{color:'var(--w)'}}>{email}</strong>. Create one?</div></div>{error&&<div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:12,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}<button onClick={handleCreate} className='btn-primary' style={{width:'100%',padding:'14px',fontSize:11,marginBottom:10}}>Create New Circle Wallet →</button><button onClick={()=>setStep('email')} style={{width:'100%',background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',cursor:'pointer',padding:'8px'}}>← Try different email</button></>)}
            {step==='creating'&&<div style={{textAlign:'center',padding:'24px 0'}}><div className='v-spinner' style={{margin:'0 auto 16px'}}/><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)'}}>Creating wallet...</div></div>}
            {(step==='found'||step==='done')&&circleWallet&&(
              <CircleWalletDashboard wallet={circleWallet} balance={balance} onLogout={()=>{logout();closeAll();}} onClose={closeAll}/>
            )}
          </div>
        </div>)}

      {/* Circle Dashboard Modal — when already logged in */}
      {showDashboard && circleWallet && (
        <div className='v-modal-bg' onClick={closeAll}>
          <div className='v-modal' style={{maxWidth:440}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
              <div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--sl)',marginBottom:4}}>Circle · USDC Wallet</div><div style={{fontFamily:"'Cormorant',serif",fontSize:20,fontWeight:300,color:'var(--w)'}}>{circleWallet.email}</div></div>
              <button onClick={closeAll} style={{background:'transparent',border:'1px solid var(--b1)',color:'var(--w35)',width:32,height:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>✕</button>
            </div>
            <CircleWalletDashboard wallet={circleWallet} balance={balance} onLogout={()=>{logout();closeAll();}} onClose={closeAll}/>
          </div>
        </div>)}

      <nav className='v-nav'>
        <Link href='/' className='v-logo'><div className='v-logo-emblem'><span className='v-logo-v'>V</span></div><span className='v-logo-name'>Vendra</span></Link>
        <div className='v-nav-links'><Link href='/marketplace'>Marketplace</Link><Link href='/store/create'>Sell</Link>{isConnected&&<Link href='/profile'>Profile</Link>}</div>
        <div className='v-nav-right'>
          <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{textDecoration:'none'}}><button className='btn-faucet'>💧 Faucet</button></a>
          <CartButton/>
          {isConnected && <AppKitWidget />}
          {isConnected
            ? <ConnectButton accountStatus='address' chainStatus='none' showBalance={false}/>
            : mounted && circleWallet
              ? <button onClick={()=>{setShowDashboard(true);fetchBalance(circleWallet.walletId);}} className='btn-nav-amber' style={{display:'flex',alignItems:'center',gap:6}}>
                  <span>⭕</span><span>{shortAddr(circleWallet.address)}</span>
                </button>
              : <button onClick={()=>setShowLogin(true)} className='btn-nav-amber'>Log In</button>}
        </div>
      </nav>
    </>
  );
}