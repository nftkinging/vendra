'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vendra_circle_wallet';

export default function CircleBalanceDisplay() {
  const [wallet, setWallet] = useState<any>(null);
  const [balance, setBalance] = useState('0');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendForm, setSendForm] = useState({ to: '', amount: '' });
  const [sendResult, setSendResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const w = JSON.parse(saved);
        setWallet(w);
        fetchBalance(w.walletId);
      }
    } catch {}
  }, []);

  const fetchBalance = async (walletId: string) => {
    try {
      const res = await fetch('/api/circle/balance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ walletId }) });
      const data = await res.json();
      setBalance(data.balance || '0');
    } catch {}
  };

  const handleCopy = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!sendForm.to || !sendForm.amount || !wallet) return;
    setSending(true); setSendResult(''); setError('');
    try {
      const res = await fetch('/api/circle/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ walletId: wallet.walletId, walletAddress: wallet.address, toAddress: sendForm.to, amount: sendForm.amount }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendResult('Sent! TX: ' + (data.txId || '').slice(0, 16) + '...');
      await fetchBalance(wallet.walletId);
    } catch (e: any) { setError(e.message || 'Send failed'); }
    finally { setSending(false); }
  };

  if (!mounted || !wallet) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => { setOpen(!open); setError(''); setSendResult(''); }} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: '0.10em', background: 'var(--bg2)', border: '1px solid var(--b2)', color: 'var(--sl2)', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s' }} onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--sl)')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b2)')}>
        <span>⭕</span>
        <span style={{ fontFamily: "'Cormorant',serif", fontSize: 16, fontWeight: 300 }}>${balance}</span>
        <span style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--w18)' }}>USDC</span>
        <span style={{ fontSize: 8, color: 'var(--w18)', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 300, background: 'var(--bg2)', border: '1px solid var(--b2)', zIndex: 99, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(155,181,200,0.5),transparent)' }} />
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sl)' }}>Circle Wallet · Arc Testnet</div>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--w18)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--w18)', marginBottom: 4 }}>USDC Balance</div>
                <div style={{ fontFamily: "'Cormorant',serif", fontSize: 44, fontWeight: 300, color: 'var(--sl2)', lineHeight: 1 }}>${balance}</div>
              </div>
              <div style={{ border: '1px solid var(--b1)', padding: '10px 12px', marginBottom: 14, background: 'var(--bg3)' }}>
                <div style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--w18)', marginBottom: 4 }}>Wallet Address</div>
                <div style={{ fontFamily: "'Cormorant',serif", fontSize: 11, fontWeight: 300, color: 'var(--sl)', wordBreak: 'break-all', marginBottom: 8 }}>{wallet.address}</div>
                <button onClick={handleCopy} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--b2)', color: copied ? 'var(--gr)' : 'var(--w35)', padding: '5px 10px', background: 'transparent', cursor: 'pointer', width: '100%', transition: 'all 0.3s' }}>{copied ? '✓ Copied!' : 'Copy Address'}</button>
              </div>
              <div style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--w18)', marginBottom: 8 }}>Send USDC</div>
              <div className='v-field'><label className='v-label'>Recipient</label><input className='v-input' placeholder='0x...' value={sendForm.to} onChange={e => setSendForm({ ...sendForm, to: e.target.value })} /></div>
              <div className='v-field'><label className='v-label'>Amount</label><input className='v-input' type='number' placeholder='e.g. 5.00' value={sendForm.amount} onChange={e => setSendForm({ ...sendForm, amount: e.target.value })} /></div>
              {error && <div style={{ fontSize: 10, fontStyle: 'italic', color: 'var(--err)', marginBottom: 10, border: '1px solid rgba(232,112,112,0.2)', padding: '7px 10px' }}>{error}</div>}
              {sendResult && <div style={{ fontSize: 10, fontStyle: 'italic', color: 'var(--gr)', marginBottom: 10, border: '1px solid var(--gr3)', padding: '7px 10px', wordBreak: 'break-all' }}>{sendResult}</div>}
              <button onClick={handleSend} disabled={sending} className='btn-primary' style={{ width: '100%', padding: '10px', fontSize: 10, marginBottom: 8 }}>{sending ? 'Sending...' : 'Send USDC →'}</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{ flex: 1 }}><button className='btn-ghost' style={{ width: '100%', fontSize: 9, padding: '8px' }}>Get USDC ↗</button></a>
                <a href={`https://testnet.arcscan.app/address/${wallet.address}`} target='_blank' rel='noopener noreferrer' style={{ flex: 1 }}><button className='btn-ghost' style={{ width: '100%', fontSize: 9, padding: '8px' }}>Explorer ↗</button></a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}