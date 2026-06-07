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
    } catch (e:any) { setError(e.message || 'Send failed'); }
    finally { setSending(false); }
  };

  return (
    <div>
      <div className='jn-wallet'>
        <div className='jn-wallet-l'>Circle wallet · Arc Testnet</div>
        <div className='jn-addr-row'><div className='jn-addr'>{wallet.address}</div><button onClick={handleCopy} className={'jn-copy' + (copied ? ' done' : '')}>{copied ? '✓ Copied' : 'Copy'}</button></div>
        <div className='jn-bal-row'>
          <div><div className='jn-wallet-l' style={{ marginBottom: 2 }}>USDC balance</div><div className='jn-bal'>${parseFloat(balance || '0').toFixed(2)}</div></div>
          <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' className='v4btn v4btn-ghost' style={{ fontSize: 10, padding: '8px 12px' }}>Get USDC ↗</a>
        </div>
      </div>
      <div className='ob-field'><label className='ob-label'>Send to address</label><input className='ob-input' placeholder='0x...' value={to} onChange={e => setTo(e.target.value)} autoComplete='off' /></div>
      <div className='ob-field'><label className='ob-label'>Amount (USDC)</label><input className='ob-input' type='number' placeholder='e.g. 5.00' value={amount} onChange={e => setAmount(e.target.value)} /></div>
      {error && <div className='jn-err'>{error}</div>}
      {sendResult && <div className='jn-ok'>{sendResult}</div>}
      <button onClick={handleSend} disabled={sending} className='v4btn v4btn-amber jn-cta'>{sending ? 'Sending…' : 'Send USDC on Arc →'}</button>
      <div className='jn-btn-row'>
        <a href={`https://testnet.arcscan.app/address/${wallet.address}`} target='_blank' rel='noopener noreferrer' className='v4btn v4btn-ghost jn-sm' style={{ flex: 1 }}>Arc Explorer ↗</a>
        <button onClick={onLogout} className='jn-logout' style={{ flex: 1 }}>Log out</button>
      </div>
    </div>
  );
}
