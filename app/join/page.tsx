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
  const [showCircle, setShowCircle] = useState(false);
  const [step, setStep] = useState<'form'|'creating'|'done'>('form');
  const [circleEmail, setCircleEmail] = useState('');
  const [circleWallet, setCircleWallet] = useState<{address:string;walletId:string}|null>(null);
  const [circleBalance, setCircleBalance] = useState('0');
  const [sending, setSending] = useState(false);
  const [sendForm, setSendForm] = useState({ to:'', amount:'' });
  const [sendResult, setSendResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (isConnected) router.push('/onboarding'); }, [isConnected, router]);

  const handleCreateCircleWallet = async () => {
    if (!circleEmail) { setError('Enter your email'); return; }
    setStep('creating'); setError('');
    try {
      const res = await fetch('/api/circle/create-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: circleEmail }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCircleWallet({ address: data.address, walletId: data.walletId });
      // Get balance
      const balRes = await fetch('/api/circle/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: data.walletId }),
      });
      const balData = await balRes.json();
      setCircleBalance(balData.balance || '0');
      setStep('done');
    } catch(e:any) {
      setError(e.message || 'Failed to create wallet');
      setStep('form');
    }
  };

  const handleSend = async () => {
    if (!sendForm.to || !sendForm.amount || !circleWallet) return;
    setSending(true); setSendResult(''); setError('');
    try {
      const res = await fetch('/api/circle/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: circleWallet.walletId, walletAddress: circleWallet.address, toAddress: sendForm.to, amount: sendForm.amount }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendResult('Transaction submitted! ID: ' + data.txId);
    } catch(e:any) { setError(e.message || 'Send failed'); }
    finally { setSending(false); }
  };

  return (
    <main style={{ minHeight:'100vh', background:'var(--bg)', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <Nav />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-60%)', width:800, height:600, background:'radial-gradient(ellipse at center,rgba(212,176,90,0.08) 0%,transparent 70%)' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(212,176,90,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(212,176,90,0.018) 1px,transparent 1px)', backgroundSize:'96px 96px' }}/>
      </div>

      {/* Circle Wallet Modal */}
      {showCircle && (
        <div className='v-modal-bg' onClick={() => { setShowCircle(false); setStep('form'); setCircleWallet(null); setError(''); }}>
          <div className='v-modal' style={{ maxWidth:480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--sl)', marginBottom:6 }}>Circle · Developer Controlled Wallet</div>
                <div style={{ fontFamily:"'Cormorant',serif", fontSize:26, fontWeight:300, color:'var(--w)', lineHeight:1.1 }}>{step==='done' ? 'Wallet Ready' : step==='creating' ? 'Creating Wallet...' : 'Create Circle Wallet'}</div>
              </div>
              <button onClick={() => { setShowCircle(false); setStep('form'); setCircleWallet(null); setError(''); }} style={{ background:'transparent', border:'1px solid var(--b1)', color:'var(--w35)', width:32, height:32, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>

            {step==='form' && (
              <>
                <div style={{ fontSize:13, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:24 }}>No crypto experience needed. Enter your email and we'll create a USDC wallet on Arc Testnet for you instantly.</div>
                <div className='v-field'>
                  <label className='v-label'>Your Email</label>
                  <input className='v-input' type='email' placeholder='you@example.com' value={circleEmail} onChange={e => setCircleEmail(e.target.value)} onKeyDown={e => e.key==='Enter' && handleCreateCircleWallet()} />
                </div>
                {error && <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--err)', marginBottom:12, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
                <button onClick={handleCreateCircleWallet} className='btn-primary' style={{ width:'100%', padding:'14px', fontSize:11 }}>Create My USDC Wallet →</button>
                <div style={{ textAlign:'center', marginTop:12, fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', lineHeight:1.6 }}>Powered by Circle · Arc Testnet · No seed phrase required</div>
              </>
            )}

            {step==='creating' && (
              <div style={{ textAlign:'center', padding:'24px 0' }}>
                <div className='v-spinner' style={{ margin:'0 auto 20px' }} />
                <div style={{ fontSize:13, fontWeight:300, fontStyle:'italic', color:'var(--w35)' }}>Creating your wallet on Arc Testnet...</div>
              </div>
            )}

            {step==='done' && circleWallet && (
              <>
                <div style={{ border:'1px solid rgba(212,176,90,0.2)', background:'rgba(212,176,90,0.04)', padding:'20px', marginBottom:20, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)' }} />
                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Your Circle Wallet · Arc Testnet</div>
                  <div style={{ fontFamily:"'Cormorant',serif", fontSize:13, fontWeight:300, color:'var(--a2)', wordBreak:'break-all', marginBottom:12 }}>{circleWallet.address}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--w18)', marginBottom:2 }}>USDC Balance</div>
                      <div style={{ fontFamily:"'Cormorant',serif", fontSize:28, fontWeight:300, color:'var(--a2)' }}>${circleBalance}</div>
                    </div>
                    <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{ fontSize:9, padding:'8px 14px' }}>Get Test USDC ↗</button></a>
                  </div>
                </div>
                <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--a)', marginBottom:12 }}>Send USDC on Arc</div>
                <div className='v-field'>
                  <label className='v-label'>Recipient Address</label>
                  <input className='v-input' type='text' placeholder='0x...' value={sendForm.to} onChange={e => setSendForm({...sendForm, to:e.target.value})} />
                </div>
                <div className='v-field'>
                  <label className='v-label'>Amount (USDC)</label>
                  <input className='v-input' type='number' placeholder='e.g. 5.00' value={sendForm.amount} onChange={e => setSendForm({...sendForm, amount:e.target.value})} />
                </div>
                {error && <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--err)', marginBottom:10, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
                {sendResult && <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--gr)', marginBottom:10, border:'1px solid var(--gr3)', padding:'8px 12px', wordBreak:'break-all' }}>{sendResult}</div>}
                <button onClick={handleSend} disabled={sending} className='btn-primary' style={{ width:'100%', padding:'12px', fontSize:10, marginBottom:12 }}>{sending ? 'Sending...' : 'Send USDC on Arc →'}</button>
                <a href={`https://testnet.arcscan.app/address/${circleWallet.address}`} target='_blank' rel='noopener noreferrer' style={{ display:'block', textAlign:'center', fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--sl)', letterSpacing:'0.10em', textDecoration:'none' }}>View on Arc Explorer ↗</a>
              </>
            )}
          </div>
        </div>)}

      {/* Main */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:480, padding:'0 40px' }}>
        <div className='v-arc-badge' style={{ marginBottom:36, display:'inline-flex' }}><div className='v-arc-badge-dot'/><span className='v-arc-badge-text'>Arc Testnet · Powered by USDC</span></div>
        <h1 style={{ fontFamily:"'Cormorant',serif", fontSize:'clamp(52px,9vw,104px)', fontWeight:300, lineHeight:0.88, letterSpacing:'-0.01em', color:'var(--w)', marginBottom:20 }}>
          Connect your<br/><em style={{ fontStyle:'italic', background:'linear-gradient(120deg,var(--a),var(--a2),var(--a3))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>wallet</em>
        </h1>
        <p style={{ fontSize:14, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.8, marginBottom:48 }}>Your wallet is your identity on Vendra. Connect a Web3 wallet or create a Circle wallet — no crypto experience needed.</p>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:28 }}>
          <ConnectButton label='Connect Web3 Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
          <div style={{ display:'flex', alignItems:'center', gap:12, width:'100%', maxWidth:280 }}>
            <div style={{ flex:1, height:1, background:'var(--b1)' }}/>
            <span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.14em', textTransform:'uppercase' }}>or</span>
            <div style={{ flex:1, height:1, background:'var(--b1)' }}/>
          </div>
          <button onClick={() => setShowCircle(true)} className='btn-ghost' style={{ fontSize:11, padding:'14px 36px', display:'flex', alignItems:'center', gap:10 }}>
            <span>⭕</span>
            <span>Create Circle Wallet</span>
          </button>
        </div>
        <Link href='/marketplace' style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.12em', textDecoration:'none' }}>Browse without connecting →</Link>
      </div>
    </main>
  );
}