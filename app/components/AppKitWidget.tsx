'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnectorClient, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

type Tab = 'balance'|'deposit'|'bridge';

const CHAINS = ['Arc_Testnet','Ethereum_Sepolia','Base_Sepolia','Polygon_Amoy','Arbitrum_Sepolia'];
const ARC_USDC = '0x3600000000000000000000000000000000000000' as `0x${string}`;

export default function AppKitWidget() {
  const { address, isConnected } = useAccount();
  const { data: client } = useConnectorClient();
  const { data: usdcBalance } = useBalance({ address, token: ARC_USDC });
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('balance');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [bridgeForm, setBridgeForm] = useState({ from:'Ethereum_Sepolia', to:'Arc_Testnet', amount:'' });
  const [depositForm, setDepositForm] = useState({ from:'Ethereum_Sepolia', amount:'' });

  useEffect(() => setMounted(true), []);
  if (!mounted || !isConnected) return null;

  const balance = usdcBalance ? Number(formatUnits(usdcBalance.value, usdcBalance.decimals)).toFixed(2) : '—';

  const getAdapter = async () => {
    const { createAdapterFromProvider } = await import('@circle-fin/adapter-viem-v2');
    const provider = (client as any)?.transport?.value?.provider;
    if (!provider) throw new Error('No provider found — make sure your wallet is connected');
    return createAdapterFromProvider({ provider });
  };

  const handleBridge = async () => {
    if (!bridgeForm.amount) { setError('Enter an amount'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const { AppKit } = await import('@circle-fin/app-kit');
      const adapter = await getAdapter();
      const kit = new AppKit();
      const res = await kit.bridge({
        from: { adapter, chain: bridgeForm.from as any },
        to: { adapter, chain: bridgeForm.to as any },
        amount: bridgeForm.amount,
        token: 'USDC',
      });
      setResult('Bridge initiated! ' + JSON.stringify(res).slice(0,60) + '...');
    } catch(e:any) {
      setError(e?.message?.includes('provider') ? 'Wallet provider not accessible. Try reconnecting.' : e?.message || 'Bridge failed');
    } finally { setLoading(false); }
  };

  const handleDeposit = async () => {
    if (!depositForm.amount) { setError('Enter an amount'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const { AppKit } = await import('@circle-fin/app-kit');
      const adapter = await getAdapter();
      const kit = new AppKit();
      const res = await kit.unifiedBalance.deposit({
        from: { adapter, chain: depositForm.from as any },
        amount: depositForm.amount,
        token: 'USDC',
      });
      setResult('Deposit initiated! ' + JSON.stringify(res).slice(0,60) + '...');
    } catch(e:any) {
      setError(e?.message?.includes('provider') ? 'Wallet provider not accessible. Try reconnecting.' : e?.message || 'Deposit failed');
    } finally { setLoading(false); }
  };

  const tabs: {id:Tab;label:string;icon:string}[] = [
    { id:'balance', label:'Balance', icon:'💳' },
    { id:'deposit', label:'Deposit', icon:'⬇️' },
    { id:'bridge', label:'Bridge', icon:'🌉' },
  ];

  return (
    <div style={{ position:'relative' }}>
      {/* Trigger button */}
      <button onClick={() => { setOpen(!open); setError(''); setResult(''); }} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:400, letterSpacing:'0.10em', background:'var(--bg2)', border:'1px solid var(--b2)', color:'var(--a2)', padding:'8px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.3s', borderRadius:0 }} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--a)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b2)')}>
        <span style={{ fontSize:'0.8rem' }}>💳</span>
        <span style={{ fontFamily:"'Cormorant',serif", fontSize:16, fontWeight:300 }}>${balance}</span>
        <span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.10em', textTransform:'uppercase', color:'var(--w18)' }}>USDC</span>
        <span style={{ fontSize:8, color:'var(--w18)', transition:'transform 0.2s', display:'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {/* Dropdown panel */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:98 }} />
          <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:340, background:'var(--bg2)', border:'1px solid var(--b2)', zIndex:99, boxShadow:'0 20px 60px rgba(0,0,0,0.6)', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.5),transparent)' }} />
            {/* Header */}
            <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--b1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--a)', marginBottom:2 }}>Arc App Kit · USDC Wallet</div>
                <div style={{ fontFamily:"'Cormorant',serif", fontSize:13, fontWeight:300, color:'var(--w35)', wordBreak:'break-all' }}>{address?.slice(0,8)}...{address?.slice(-6)}</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:'transparent', border:'none', color:'var(--w18)', cursor:'pointer', fontSize:'0.9rem', padding:4 }}>✕</button>
            </div>
            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--b1)' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setError(''); setResult(''); }} style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.12em', textTransform:'uppercase', padding:'10px 4px', background:'transparent', border:'none', borderBottom: tab===t.id ? '1px solid var(--a)' : '1px solid transparent', color: tab===t.id ? 'var(--a)' : 'var(--w18)', cursor:'pointer', transition:'all 0.2s' }}>
                  {t.icon}{' '}{t.label}
                </button>))}
            </div>
            <div style={{ padding:16 }}>
              {/* BALANCE */}
              {tab==='balance' && (
                <div>
                  <div style={{ textAlign:'center', padding:'12px 0 20px' }}>
                    <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Arc Testnet · USDC Balance</div>
                    <div style={{ fontFamily:"'Cormorant',serif", fontSize:48, fontWeight:300, color:'var(--a2)', lineHeight:1 }}>${balance}</div>
                    <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.08em', marginTop:4 }}>USDC · Arc Testnet</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setTab('deposit')} className='btn-primary' style={{ flex:1, fontSize:9, padding:'10px' }}>Deposit ↓</button>
                    <button onClick={() => setTab('bridge')} className='btn-ghost' style={{ flex:1, fontSize:9, padding:'10px' }}>Bridge 🌉</button>
                  </div>
                  <a href={`https://testnet.arcscan.app/address/${address}`} target='_blank' rel='noopener noreferrer' style={{ display:'block', textAlign:'center', marginTop:10, fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.10em', textDecoration:'none' }}>View on Arc Explorer ↗</a>
                </div>)}
              {/* DEPOSIT */}
              {tab==='deposit' && (
                <div>
                  <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:14 }}>Deposit USDC into your Arc Testnet Unified Balance from any supported chain.</div>
                  <div className='v-field'><label className='v-label'>From Chain</label>
                    <select className='v-input' value={depositForm.from} onChange={e => setDepositForm({...depositForm, from:e.target.value})} style={{ cursor:'pointer' }}>
                      {CHAINS.filter(c => c!=='Arc_Testnet').map(c => <option key={c} value={c} style={{ background:'var(--bg2)' }}>{c.replace(/_/g,' ')}</option>)}
                    </select>
                  </div>
                  <div className='v-field'><label className='v-label'>Amount (USDC)</label><input className='v-input' type='number' placeholder='e.g. 10.00' value={depositForm.amount} onChange={e => setDepositForm({...depositForm, amount:e.target.value})} /></div>
                  {error && <div style={{ fontSize:10, fontStyle:'italic', color:'var(--err)', marginBottom:10, border:'1px solid rgba(232,112,112,0.2)', padding:'7px 10px' }}>{error}</div>}
                  {result && <div style={{ fontSize:10, fontStyle:'italic', color:'var(--gr)', marginBottom:10, border:'1px solid var(--gr3)', padding:'7px 10px', wordBreak:'break-all' }}>{result}</div>}
                  <button onClick={handleDeposit} disabled={loading} className='btn-primary' style={{ width:'100%', padding:'11px', fontSize:10 }}>{loading ? 'Processing...' : 'Deposit USDC →'}</button>
                  <div style={{ textAlign:'center', marginTop:10 }}><a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.10em', textDecoration:'none' }}>Need test USDC? Faucet ↗</a></div>
                </div>)}
              {/* BRIDGE */}
              {tab==='bridge' && (
                <div>
                  <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:14 }}>Bridge USDC cross-chain via Circle CCTP. Fast, secure, non-custodial.</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:0 }}>
                    <div><label className='v-label'>From</label><select className='v-input' value={bridgeForm.from} onChange={e => setBridgeForm({...bridgeForm, from:e.target.value})} style={{ cursor:'pointer' }}>{CHAINS.map(c => <option key={c} value={c} style={{ background:'var(--bg2)' }}>{c.replace(/_/g,' ')}</option>)}</select></div>
                    <div><label className='v-label'>To</label><select className='v-input' value={bridgeForm.to} onChange={e => setBridgeForm({...bridgeForm, to:e.target.value})} style={{ cursor:'pointer' }}>{CHAINS.map(c => <option key={c} value={c} style={{ background:'var(--bg2)' }}>{c.replace(/_/g,' ')}</option>)}</select></div>
                  </div>
                  <div className='v-field' style={{ marginTop:10 }}><label className='v-label'>Amount (USDC)</label><input className='v-input' type='number' placeholder='e.g. 10.00' value={bridgeForm.amount} onChange={e => setBridgeForm({...bridgeForm, amount:e.target.value})} /></div>
                  {error && <div style={{ fontSize:10, fontStyle:'italic', color:'var(--err)', marginBottom:10, border:'1px solid rgba(232,112,112,0.2)', padding:'7px 10px' }}>{error}</div>}
                  {result && <div style={{ fontSize:10, fontStyle:'italic', color:'var(--gr)', marginBottom:10, border:'1px solid var(--gr3)', padding:'7px 10px', wordBreak:'break-all' }}>{result}</div>}
                  <button onClick={handleBridge} disabled={loading} className='btn-primary' style={{ width:'100%', padding:'11px', fontSize:10 }}>{loading ? 'Bridging...' : 'Bridge USDC via CCTP →'}</button>
                  <a href='https://docs.arc.io/app-kit/bridge' target='_blank' rel='noopener noreferrer' style={{ display:'block', textAlign:'center', marginTop:10, fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.10em', textDecoration:'none' }}>Bridge Kit Docs ↗</a>
                </div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}