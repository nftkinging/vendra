'use client';
import { useState, useCallback } from 'react';

interface Props {
  wallet: { address: string; walletId: string; email: string };
  balance: string;
  onLogout: () => void;
  onClose: () => void;
}

export default function CircleWalletDashboard({ wallet, balance, onLogout, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');
  const [error, setError] = useState('');

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [wallet.address]);

  const handleSend = async () => {
    if (!to || !amount) { setError('Fill in all fields'); return; }
    if (!to.startsWith('0x') || to.length !== 42) { setError('Invalid address'); return; }
    setSending(true); setSendResult(''); setError('');
    try {
      const res = await fetch('/api/circle/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: wallet.walletId, walletAddress: wallet.address, toAddress: to, amount }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendResult('Sent! TX: ' + (data.txId || '').slice(0, 20) + '...');
      setTo(''); setAmount('');
    } catch(e:any) { setError(e.message || 'Send failed'); }
    finally { setSending(false); }
  };

  return (
    <div>
      {/* Wallet info */}
      <div style={{border:'1px solid rgba(212,176,90,0.2)',background:'rgba(212,176,90,0.04)',padding:'20px',marginBottom:16,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)'}}/>
        <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--w18)',marginBottom:4}}>Circle Wallet · Arc Testnet</div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <div style={{fontFamily:"'Cormorant',serif",fontSize:11,fontWeight:300,color:'var(--a)',flex:1,wordBreak:'break-all'}}>{wallet.address}</div>
          <button onClick={handleCopy} style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',border:'1px solid var(--b2)',color:copied?'var(--gr)':'var(--w35)',padding:'5px 10px',background:'transparent',cursor:'pointer',flexShrink:0,transition:'all 0.3s',whiteSpace:'nowrap'}}>{copied?'✓ Copied':'Copy'}</button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--w18)',marginBottom:2}}>USDC Balance</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:32,fontWeight:300,color:'var(--a2)'}}>${parseFloat(balance||'0').toFixed(2)}</div>
          </div>
          <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{fontSize:9,padding:'8px 12px'}}>Get USDC ↗</button></a>
        </div>
      </div>
      {/* Send form */}
      <div style={{marginBottom:8}}>
        <label className='v-label'>Send to Address</label>
        <input className='v-input' placeholder='0x...' value={to} onChange={e => setTo(e.target.value)} autoComplete='off' />
      </div>
      <div style={{marginBottom:16}}>
        <label className='v-label'>Amount (USDC)</label>
        <input className='v-input' type='number' placeholder='e.g. 5.00' value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      {error && <div style={{fontSize:11,fontStyle:'italic',color:'var(--err)',marginBottom:10,border:'1px solid rgba(232,112,112,0.2)',padding:'8px 12px'}}>{error}</div>}
      {sendResult && <div style={{fontSize:10,fontStyle:'italic',color:'var(--gr)',marginBottom:10,border:'1px solid var(--gr3)',padding:'8px 12px',wordBreak:'break-all'}}>{sendResult}</div>}
      <button onClick={handleSend} disabled={sending} className='btn-primary' style={{width:'100%',padding:'12px',fontSize:10,marginBottom:10}}>{sending?'Sending...':'Send USDC on Arc →'}</button>
      <div style={{display:'flex',gap:8}}>
        <a href={`https://testnet.arcscan.app/address/${wallet.address}`} target='_blank' rel='noopener noreferrer' style={{flex:1}}><button className='btn-ghost' style={{width:'100%',fontSize:9,padding:'8px'}}>Arc Explorer ↗</button></a>
        <button onClick={onLogout} className='btn-danger' style={{flex:1,fontSize:9,padding:'8px'}}>Log Out</button>
      </div>
    </div>
  );
}