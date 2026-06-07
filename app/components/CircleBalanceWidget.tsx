'use client';
import { useState, useEffect } from 'react';

type Tab = 'balance'|'deposit'|'bridge';
const CHAINS = [
  { id: 'Ethereum_Sepolia', label: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'Base_Sepolia', label: 'Base', logo: 'https://cryptologos.cc/logos/base-logo.png' },
  { id: 'Arbitrum_Sepolia', label: 'Arbitrum', logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png' },
  { id: 'Polygon_Amoy', label: 'Polygon', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { id: 'Solana_Devnet', label: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
];
const AMOUNTS = ['1','5','10','50'];

interface Props { wallet: { address: string; walletId: string; email: string }; }

export default function CircleBalanceWidget({ wallet }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('balance');
  const [balance, setBalance] = useState('0.00');
  const [copied, setCopied] = useState(false);
  const [fromChain, setFromChain] = useState('Ethereum_Sepolia');
  const [bridgeAmount, setBridgeAmount] = useState('10');
  const [bridgeLoading, setBridgeLoading] = useState(false);
  const [bridgeResult, setBridgeResult] = useState('');
  const [bridgeError, setBridgeError] = useState('');

  useEffect(() => { fetchBalance(); }, [wallet.walletId]);

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/circle/balance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ walletId: wallet.walletId }) });
      const data = await res.json();
      setBalance(parseFloat(data.balance || '0').toFixed(2));
    } catch {}
  };

  const handleCopy = () => { navigator.clipboard.writeText(wallet.address); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleBridge = async () => {
    if (!bridgeAmount) { setBridgeError('Enter an amount'); return; }
    setBridgeLoading(true); setBridgeError(''); setBridgeResult('');
    try {
      const res = await fetch('/api/circle/bridge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fromChain, toChain: 'Arc_Testnet', amount: bridgeAmount, walletAddress: wallet.address, walletId: wallet.walletId }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBridgeResult('Bridge initiated! USDC is on its way to Arc Testnet.');
    } catch (e:any) { setBridgeError(e?.message || 'Bridge failed.'); }
    finally { setBridgeLoading(false); }
  };

  const selectedChain = CHAINS.find(c => c.id === fromChain) || CHAINS[0];
  const tabs: {id:Tab;label:string}[] = [{ id: 'balance', label: 'Balance' }, { id: 'deposit', label: 'Deposit' }, { id: 'bridge', label: 'Bridge' }];

  return (
    <div className='cw'>
      <button onClick={() => { setOpen(!open); if (!open) fetchBalance(); }} className='cw-pill'>
        <span>⭕</span><span className='cw-pill-amt'>${balance}</span><span className='cw-pill-u'>USDC</span><span className='cw-pill-ar' style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
      </button>
      {open && (<>
        <div onClick={() => setOpen(false)} className='cw-scrim' />
        <div className='cw-pop'>
          <div className='cw-pop-head'><div className='cw-pop-l'>Circle Wallet · USDC</div><button onClick={() => setOpen(false)} className='cw-pop-x'>✕</button></div>
          <div className='cw-tabs'>{tabs.map(t => <button key={t.id} onClick={() => { setTab(t.id); setBridgeError(''); setBridgeResult(''); }} className={'cw-tab' + (tab === t.id ? ' on' : '')}>{t.label}</button>)}</div>
          <div className='cw-body'>
            {tab === 'balance' && (
              <div style={{ textAlign: 'center' }}>
                <div className='cw-bal-l'>Circle Wallet · USDC Balance</div>
                <div className='cw-bal'>${balance}</div>
                <div className='cw-bal-sub'>USDC · Arc Testnet</div>
                <div className='cw-row'><button onClick={() => setTab('deposit')} className='v4btn v4btn-amber' style={{ flex: 1, fontSize: 10, padding: 9, justifyContent: 'center' }}>Deposit ↓</button><button onClick={() => setTab('bridge')} className='v4btn v4btn-ghost' style={{ flex: 1, fontSize: 10, padding: 9, justifyContent: 'center' }}>Bridge 🌉</button></div>
                <div className='cw-row' style={{ marginBottom: 0 }}><a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' className='v4btn v4btn-ghost' style={{ flex: 1, fontSize: 10, padding: 8, justifyContent: 'center' }}>💧 Faucet</a><a href={`https://testnet.arcscan.app/address/${wallet.address}`} target='_blank' rel='noopener noreferrer' className='v4btn v4btn-ghost' style={{ flex: 1, fontSize: 10, padding: 8, justifyContent: 'center' }}>Explorer ↗</a></div>
              </div>)}
            {tab === 'deposit' && (
              <div>
                <div className='cw-p'>Copy your Circle wallet address to receive USDC on Arc Testnet.</div>
                <div className='cw-addr-box'>
                  <div className='cw-addr-l'>Circle Wallet · Arc Testnet</div>
                  <div className='cw-addr'>{wallet.address}</div>
                  <button onClick={handleCopy} className={'v4btn ' + (copied ? 'v4btn-amber' : 'v4btn-ink')} style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: 10 }}>{copied ? '✓ Address copied!' : 'Copy address'}</button>
                </div>
                <div className='cw-div'><div className='cw-div-line' /><span className='cw-div-txt'>or</span><div className='cw-div-line' /></div>
                <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' className='v4btn v4btn-ghost' style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: 10 }}>💧 Get free test USDC ↗</a>
              </div>)}
            {tab === 'bridge' && (
              <div>
                <div className='cw-p'>Bridge USDC to your Circle wallet on Arc Testnet.</div>
                <div className='cw-lbl'>From chain</div>
                <div className='cw-chains'>{CHAINS.map(c => <button key={c.id} onClick={() => setFromChain(c.id)} className={'cw-chain' + (fromChain === c.id ? ' on' : '')}><img src={c.logo} alt={c.label} onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} /><span className='cw-chain-n'>{c.label}</span></button>)}</div>
                <div className='cw-swap'>
                  <div className='cw-swap-box'><img src={selectedChain.logo} alt={selectedChain.label} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /><span>{selectedChain.label}</span></div>
                  <span className='cw-swap-ar'>→</span>
                  <div className='cw-swap-box dst'><span>Arc Testnet</span></div>
                </div>
                <div className='cw-lbl'>Amount (USDC)</div>
                <div className='cw-amts'>{AMOUNTS.map(a => <button key={a} onClick={() => setBridgeAmount(a)} className={'cw-amt' + (bridgeAmount === a ? ' on' : '')}>${a}</button>)}</div>
                <input className='ob-input' type='number' placeholder='Custom amount...' value={bridgeAmount} onChange={e => setBridgeAmount(e.target.value)} style={{ marginBottom: 12 }} />
                {bridgeError && <div className='jn-err'>{bridgeError}</div>}
                {bridgeResult && <div className='jn-ok'>{bridgeResult}</div>}
                <button onClick={handleBridge} disabled={bridgeLoading} className='v4btn v4btn-amber' style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: 11 }}>{bridgeLoading ? 'Bridging…' : `Bridge $${bridgeAmount} USDC → Arc`}</button>
              </div>)}
          </div>
        </div>
      </>)}
    </div>
  );
}
