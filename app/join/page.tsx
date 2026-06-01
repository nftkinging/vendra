'use client';
import Nav from '../Nav';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CircleStep = 'email'|'otp'|'checking'|'found'|'notfound'|'creating'|'done';
const STORAGE_KEY = 'vendra_circle_wallet';

export default function Join() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [step, setStep] = useState<CircleStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [circleWallet, setCircleWallet] = useState<{address:string;walletId:string;email:string}|null>(null);
  const [balance, setBalance] = useState('0');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendForm, setSendForm] = useState({ to:'', amount:'' });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');
  const [mode, setMode] = useState<'options'|'circle'>('options');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => { if (isConnected) router.push('/onboarding'); }, [isConnected, router]);
  useEffect(() => { try { const saved = sessionStorage.getItem(STORAGE_KEY); if (saved) { const w = JSON.parse(saved); setCircleWallet(w); fetchBalance(w.walletId); setMode('circle'); setStep('found'); } } catch {} }, []);
  useEffect(() => { if (resendTimer>0) { const t=setTimeout(()=>setResendTimer(resendTimer-1),1000); return ()=>clearTimeout(t); } }, [resendTimer]);

  const saveWallet = (w: any) => { setCircleWallet(w); try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch {} };
  const logout = () => { setCircleWallet(null); try { sessionStorage.removeItem(STORAGE_KEY); } catch {} setMode('options'); setStep('email'); setEmail(''); };
  const fetchBalance = async (walletId: string) => { try { const res = await fetch('/api/circle/balance', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletId }) }); const data = await res.json(); setBalance(data.balance||'0'); } catch {} };
  const handleCopy = () => { if (!circleWallet) return; navigator.clipboard.writeText(circleWallet.address); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const handleSendOtp = async () => {
    if (!email) { setError('Enter your email'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/circle/send-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStep('otp'); setResendTimer(60);
    } catch(e:any) { setError(e.message||'Failed to send code'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp||otp.length!==6) { setError('Enter the 6-digit code'); return; }
    setLoading(true); setError(''); setStep('checking');
    try {
      const verifyRes = await fetch('/api/circle/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp }) });
      const verifyData = await verifyRes.json();
      if (verifyData.error) throw new Error(verifyData.error);
      const res = await fetch('/api/circle/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.found) { const w={address:data.address,walletId:data.walletId,email}; saveWallet(w); await fetchBalance(data.walletId); setStep('found'); }
      else { setStep('notfound'); }
    } catch(e:any) { setError(e.message||'Verification failed'); setStep('otp'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    setStep('creating'); setError('');
    try {
      const res = await fetch('/api/circle/create-wallet', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const w={address:data.address,walletId:data.walletId,email}; saveWallet(w); await fetchBalance(data.walletId); setStep('done');
    } catch(e:any) { setError(e.message||'Failed'); setStep('notfound'); }
  };

  const handleSend = async () => {
    if (!sendForm.to||!sendForm.amount||!circleWallet) return;
    setSending(true); setSendResult(''); setError('');
    try {
      const res = await fetch('/api/circle/send', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ walletId:circleWallet.walletId, walletAddress:circleWallet.address, toAddress:sendForm.to, amount:sendForm.amount }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendResult('Sent! TX: '+(data.txId||'').slice(0,20)+'...');
    } catch(e:any) { setError(e.message||'Send failed'); }
    finally { setSending(false); }
  };

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <Nav/>
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-60%)',width:800,height:600,background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)',backgroundSize:'96px 96px'}}/>
      </div>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:480,padding:'80px 40px'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div className='v-arc-badge' style={{marginBottom:24,display:'inline-flex'}}><div className='v-arc-badge-dot'/><span className='v-arc-badge-text'>Arc Testnet · Powered by USDC</span></div>
          <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(48px,8vw,80px)',fontWeight:300,lineHeight:0.90,letterSpacing:'-0.01em',color:'var(--w)',marginBottom:16}}>Join<br/><em style={{fontStyle:'italic',background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Vendra</em></h1>
          <p style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8}}>Connect a Web3 wallet or log in with Circle — no crypto experience needed.</p>
        </div>
        {mode==='options'&&(
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{border:'1px solid var(--b1)',padding:'24px',background:'var(--bg2)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.3),transparent)'}}/>
              <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--a)',marginBottom:8}}>🦊 Web3 Wallet</div>
              <div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:16,lineHeight:1.6}}>MetaMask, Coinbase, WalletConnect or any EVM wallet.</div>
              <div style={{display:'flex',justifyContent:'center'}}><ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false}/></div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{flex:1,height:1,background:'var(--b1)'}}/><span style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.14em',textTransform:'uppercase'}}>or</span><div style={{flex:1,height:1,background:'var(--b1)'}}/></div>
            <div style={{border:'1px solid rgba(155,181,200,0.2)',padding:'24px',background:'rgba(155,181,200,0.03)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,rgba(155,181,200,0.3),transparent)'}}/>
              <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--sl)',marginBottom:8}}>⭕ Circle Wallet</div>
              <div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:16,lineHeight:1.6}}>No crypto experience needed. Verify your email and access your USDC wallet instantly.</div>
              <button onClick={()=>setMode('circle')} className='btn-slate' style={{width:'100%',fontSize:10,padding:'12px'}}>Log In with Circle Wallet →</button>
            </div>
            <div style={{textAlign:'center',marginTop:8}}><Link href='/marketplace' style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.12em',textDecoration:'none'}}>Browse without connecting →</Link></div>
          </div>
        )}
        {mode==='circle'&&(
          <div style={{border:'1px solid rgba(155,181,200,0.2)',background:'rgba(155,181,200,0.03)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,rgba(155,181,200,0.4),transparent)'}}/>
            <div style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--sl)',marginBottom:4}}>Circle · USDC Wallet</div>
                  <div style={{fontFamily:"'Cormorant',serif",fontSize:22,fontWeight:300,color:'var(--w)'}}>
                    {step==='email'&&'Log In with Circle'}
                    {step==='otp'&&'Enter Your Code'}
                    {step==='checking'&&'Verifying...'}
                    {step==='notfound'&&'Create Wallet'}
                    {step==='creating'&&'Creating Wallet...'}
                    {(step==='found'||step==='done')&&'Welcome Back ✓'}
                  </div>
                </div>
                {(step==='found'||step==='done')&&<button onClick={logout} className='btn-danger' style={{fontSize:9,padding:'6px 12px'}}>Log Out</button>}
              </div>
              {step==='email'&&(
                <><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:20}}>Enter your email. We'll send a 6-digit verification code to confirm it's you.</div>
                <div className='v-field'><label className='v-label'>Email Address</label><input className='v-input' type='email' placeholder='you@example.com' value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSendOtp()} autoFocus/></div>
                {error&&<div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:12,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}
                <button onClick={handleSendOtp} disabled={loading} className='btn-primary' style={{width:'100%',padding:'14px',fontSize:11,marginBottom:10}}>{loading?'Sending code...':'Send Verification Code →'}</button>
                <button onClick={()=>setMode('options')} style={{width:'100%',background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',cursor:'pointer',padding:'8px'}}>← Back to options</button></>
              )}
              {step==='otp'&&(
                <><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:8}}>We sent a code to <strong style={{color:'var(--w)'}}>{email}</strong>. Check your inbox.</div>
                <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',marginBottom:20,letterSpacing:'0.06em'}}>Code expires in 10 minutes. Check spam if not received.</div>
                <div className='v-field'><label className='v-label'>6-Digit Code</label><input className='v-input' type='text' inputMode='numeric' maxLength={6} placeholder='000000' value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} onKeyDown={e=>e.key==='Enter'&&handleVerifyOtp()} autoFocus style={{letterSpacing:'0.3em',fontSize:22,textAlign:'center'}}/></div>
                {error&&<div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:12,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}
                <button onClick={handleVerifyOtp} disabled={loading||otp.length!==6} className='btn-primary' style={{width:'100%',padding:'14px',fontSize:11,marginBottom:10}}>{loading?'Verifying...':'Verify & Continue →'}</button>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <button onClick={()=>{setStep('email');setOtp('');setError('');}} style={{background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',cursor:'pointer',padding:'8px 0'}}>← Change email</button>
                  <button onClick={resendTimer===0?handleSendOtp:undefined} disabled={resendTimer>0} style={{background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:resendTimer>0?'var(--w18)':'var(--a)',cursor:resendTimer>0?'not-allowed':'pointer',padding:'8px 0'}}>{resendTimer>0?`Resend in ${resendTimer}s`:'Resend code'}</button>
                </div></>
              )}
              {step==='checking'&&<div style={{textAlign:'center',padding:'24px 0'}}><div className='v-spinner' style={{margin:'0 auto 16px'}}/><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)'}}>Verifying your identity...</div></div>}
              {step==='notfound'&&(
                <><div style={{border:'1px solid var(--b1)',padding:'14px',marginBottom:20,background:'var(--bg3)'}}><div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7}}>No wallet found for <strong style={{color:'var(--w)'}}>{email}</strong>. Create one?</div></div>
                {error&&<div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:12,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}
                <button onClick={handleCreate} className='btn-primary' style={{width:'100%',padding:'14px',fontSize:11,marginBottom:10}}>Create New Circle Wallet →</button>
                <button onClick={()=>setStep('email')} style={{width:'100%',background:'transparent',border:'none',fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',cursor:'pointer',padding:'8px'}}>← Try a different email</button></>
              )}
              {step==='creating'&&<div style={{textAlign:'center',padding:'24px 0'}}><div className='v-spinner' style={{margin:'0 auto 16px'}}/><div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)'}}>Creating your wallet on Arc Testnet...</div></div>}
              {(step==='found'||step==='done')&&circleWallet&&(
                <><div style={{border:'1px solid rgba(212,176,90,0.2)',background:'rgba(212,176,90,0.04)',padding:'20px',marginBottom:16,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)'}}/>
                  <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--w18)',marginBottom:4}}>Circle Wallet · Arc Testnet</div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                    <div style={{fontFamily:"'Cormorant',serif",fontSize:12,fontWeight:300,color:'var(--a)',flex:1,wordBreak:'break-all'}}>{circleWallet.address}</div>
                    <button onClick={handleCopy} style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.12em',textTransform:'uppercase',border:'1px solid var(--b2)',color:copied?'var(--gr)':'var(--w35)',padding:'5px 10px',background:'transparent',cursor:'pointer',flexShrink:0,transition:'all 0.3s',whiteSpace:'nowrap'}}>{copied?'✓ Copied':'Copy'}</button>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--w18)',marginBottom:2}}>USDC Balance</div><div style={{fontFamily:"'Cormorant',serif",fontSize:32,fontWeight:300,color:'var(--a2)'}}>${balance}</div></div>
                    <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{fontSize:9,padding:'8px 12px'}}>Get USDC ↗</button></a>
                  </div>
                </div>
                <div className='v-field'><label className='v-label'>Send to Address</label><input className='v-input' placeholder='0x...' value={sendForm.to} onChange={e=>setSendForm({...sendForm,to:e.target.value})}/></div>
                <div className='v-field'><label className='v-label'>Amount (USDC)</label><input className='v-input' type='number' placeholder='e.g. 5.00' value={sendForm.amount} onChange={e=>setSendForm({...sendForm,amount:e.target.value})}/></div>
                {error&&<div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:10,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}
                {sendResult&&<div style={{fontSize:10,fontStyle:'italic',color:'var(--gr)',marginBottom:10,border:'1px solid var(--gr3)',padding:'8px 12px',wordBreak:'break-all'}}>{sendResult}</div>}
                <button onClick={handleSend} disabled={sending} className='btn-primary' style={{width:'100%',padding:'12px',fontSize:10,marginBottom:10}}>{sending?'Sending...':'Send USDC on Arc →'}</button>
                <div style={{display:'flex',gap:8,marginBottom:12}}>
                  <a href={`https://testnet.arcscan.app/address/${circleWallet.address}`} target='_blank' rel='noopener noreferrer' style={{flex:1}}><button className='btn-ghost' style={{width:'100%',fontSize:9,padding:'8px'}}>Arc Explorer ↗</button></a>
                  <Link href='/marketplace' style={{flex:1}}><button className='btn-primary' style={{width:'100%',fontSize:9,padding:'8px'}}>Explore Marketplace →</button></Link>
                </div></>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}