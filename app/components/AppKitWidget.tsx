'use client';
import { useState, useEffect } from 'react';
import { useAccount, useBalance, useWalletClient } from 'wagmi';
import { formatUnits } from 'viem';

type Tab = 'balance'|'deposit'|'bridge';
const ARC_USDC = '0x3600000000000000000000000000000000000000' as `0x${string}`;
const CHAINS = [
  { id:'Ethereum_Sepolia', label:'Ethereum', logo:'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id:'Base_Sepolia', label:'Base', logo:'https://cryptologos.cc/logos/base-logo.png' },
  { id:'Arbitrum_Sepolia', label:'Arbitrum', logo:'https://cryptologos.cc/logos/arbitrum-arb-logo.png' },
  { id:'Polygon_Amoy', label:'Polygon', logo:'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { id:'Solana_Devnet', label:'Solana', logo:'https://cryptologos.cc/logos/solana-sol-logo.png' },
];
const ARC_CHAIN = { id:'Arc_Testnet', label:'Arc Testnet', logo:'https://pbs.twimg.com/profile_images/1834254808826806272/fBTVQFT1_400x400.jpg' };
const AMOUNTS = ['1','5','10','50'];

export default function AppKitWidget() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: usdcBalance } = useBalance({ address, token: ARC_USDC });
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('balance');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [fromChain, setFromChain] = useState('Ethereum_Sepolia');
  const [bridgeAmount, setBridgeAmount] = useState('10');

  useEffect(() => setMounted(true), []);
  if (!mounted || !isConnected) return null;

  const balance = usdcBalance ? Number(formatUnits(usdcBalance.value, usdcBalance.decimals)).toFixed(2) : '0.00';
  const selectedChain = CHAINS.find(c => c.id === fromChain) || CHAINS[0];

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBridge = async () => {
    if (!bridgeAmount) { setError('Enter an amount'); return; }
    if (!walletClient) { setError('Wallet not connected. Please reconnect.'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      // Use Circle App Kit bridge via our API route
      const res = await fetch('/api/circle/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromChain,
          toChain: 'Arc_Testnet',
          amount: bridgeAmount,
          walletAddress: address,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult('Bridge initiated! USDC is on its way to Arc Testnet via CCTP.');
    } catch(e:any) {
      setError(e?.message || 'Bridge failed. Make sure you have USDC on the selected chain and try again.');
    } finally { setLoading(false); }
  };
  const ChainLogo = ({ logo, label, size=28 }: { logo:string; label:string; size?:number }) => (
    <img src={logo} alt={label} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border:'1px solid var(--b1)', background:'var(--bg3)', flexShrink:0 }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
  );

  const tabs: {id:Tab;label:string}[] = [
    { id:'balance', label:'Balance' },
    { id:'deposit', label:'Deposit' },
    { id:'bridge', label:'Bridge' },
  ];

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => { setOpen(!open); setError(''); setResult(''); }} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:400, letterSpacing:'0.10em', background:'var(--bg2)', border:'1px solid var(--b2)', color:'var(--a2)', padding:'8px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.3s' }} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--a)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b2)')}>
        <img src='https://pbs.twimg.com/profile_images/1834254808826806272/1834254808826806272_400x400.jpg' alt='Arc' style={{ width:16, height:16, borderRadius:'50%', objectFit:'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
        <span style={{ fontFamily:"'Cormorant',serif", fontSize:16, fontWeight:300 }}>${balance}</span>
        <span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.10em', textTransform:'uppercase', color:'var(--w18)' }}>USDC</span>
        <span style={{ fontSize:8, color:'var(--w18)', transition:'transform 0.2s', display:'inline-block', transform: open?'rotate(180deg)':'rotate(0)' }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:98 }} />
          <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:320, background:'var(--bg2)', border:'1px solid var(--b2)', zIndex:99, boxShadow:'0 20px 60px rgba(0,0,0,0.6)', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.5),transparent)' }} />
            {/* Header */}
            <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--b1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <img src='https://pbs.twimg.com/profile_images/1834254808826806272/1834254808826806272_400x400.jpg' alt='Arc' style={{ width:20, height:20, borderRadius:'50%' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--a)' }}>Arc App Kit · USDC</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:'transparent', border:'none', color:'var(--w18)', cursor:'pointer', fontSize:'0.9rem' }}>✕</button>
            </div>
            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--b1)' }}>
              {tabs.map(t => <button key={t.id} onClick={() => { setTab(t.id); setError(''); setResult(''); }} style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.12em', textTransform:'uppercase', padding:'10px 4px', background:'transparent', border:'none', borderBottom:tab===t.id?'1px solid var(--a)':'1px solid transparent', color:tab===t.id?'var(--a)':'var(--w18)', cursor:'pointer', transition:'all 0.2s' }}>{t.label}</button>)}
            </div>
            <div style={{ padding:16 }}>

              {/* BALANCE */}
              {tab==='balance' && (
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Arc Testnet · USDC Balance</div>
                  <div style={{ fontFamily:"'Cormorant',serif", fontSize:38, fontWeight:300, color:'var(--a2)', lineHeight:1, marginBottom:2 }}>${parseFloat(balance).toFixed(2)}</div>
                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', marginBottom:14 }}>USDC · Arc Testnet</div>
                  <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                    <button onClick={() => setTab('deposit')} className='btn-primary' style={{ flex:1, fontSize:9, padding:'9px' }}>Deposit ↓</button>
                    <button onClick={() => setTab('bridge')} className='btn-ghost' style={{ flex:1, fontSize:9, padding:'9px' }}>Bridge 🌉</button>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{ flex:1 }}><button className='btn-ghost' style={{ width:'100%', fontSize:9, padding:'8px' }}>💧 Faucet ↗</button></a>
                    <a href={`https://testnet.arcscan.app/address/${address}`} target='_blank' rel='noopener noreferrer' style={{ flex:1 }}><button className='btn-ghost' style={{ width:'100%', fontSize:9, padding:'8px' }}>Explorer ↗</button></a>
                  </div>
                </div>)}

              {/* DEPOSIT */}
              {tab==='deposit' && (
                <div>
                  <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:14 }}>Copy your Arc Testnet address to receive USDC, or get free test USDC from the faucet.</div>
                  <div style={{ border:'1px solid var(--b1)', background:'var(--bg3)', padding:'14px', marginBottom:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <img src='https://pbs.twimg.com/profile_images/1834254808826806272/1834254808826806272_400x400.jpg' alt='Arc' style={{ width:24, height:24, borderRadius:'50%', border:'1px solid var(--b1)' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--a)' }}>Arc Testnet Wallet Address</div>
                    </div>
                    <div style={{ fontFamily:"'Cormorant',serif", fontSize:11, fontWeight:300, color:'var(--w60)', wordBreak:'break-all', marginBottom:10 }}>{address}</div>
                    <button onClick={handleCopy} className={copied?'btn-primary':'btn-amber-ghost'} style={{ width:'100%', fontSize:10, padding:'10px' }}>{copied?'✓ Address Copied!':'Copy Address'}</button>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}><div style={{ flex:1, height:1, background:'var(--b1)' }}/><span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.12em', textTransform:'uppercase' }}>or</span><div style={{ flex:1, height:1, background:'var(--b1)' }}/></div>
                  <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'><button className='btn-ghost' style={{ width:'100%', fontSize:10, padding:'10px' }}>💧 Get Free Test USDC from Faucet ↗</button></a>
                </div>)}

              {/* BRIDGE */}
              {tab==='bridge' && (
                <div>
                  <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:14 }}>Bridge USDC from another chain to Arc Testnet via Circle CCTP.</div>
                  {/* From chain selector */}
                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--w18)', marginBottom:8 }}>From Chain</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:4, marginBottom:16 }}>
                    {CHAINS.map(c => (
                      <button key={c.id} onClick={() => setFromChain(c.id)} style={{ padding:'8px 4px', textAlign:'center', background:fromChain===c.id?'rgba(212,176,90,0.12)':'var(--bg3)', border:fromChain===c.id?'1px solid var(--a)':'1px solid var(--b1)', cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <img src={c.logo} alt={c.label} style={{ width:24, height:24, borderRadius:'50%', objectFit:'cover', border:'1px solid var(--b1)', background:'var(--bg)' }} onError={e => { (e.target as HTMLImageElement).src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><circle cx=%2212%22 cy=%2212%22 r=%2212%22 fill=%22%23333%22/><text x=%2212%22 y=%2216%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%228%22>?</text></svg>'; }} />
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:7, fontWeight:300, letterSpacing:'0.06em', textTransform:'uppercase', color:fromChain===c.id?'var(--a)':'var(--w18)' }}>{c.label}</span>
                      </button>))}
                  </div>
                  {/* Arrow + To chain */}
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                    <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, border:'1px solid var(--b1)', padding:'8px 12px', background:'var(--bg3)' }}>
                      <img src={selectedChain.logo} alt={selectedChain.label} style={{ width:20, height:20, borderRadius:'50%', objectFit:'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      <span style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w60)' }}>{selectedChain.label}</span>
                    </div>
                    <div style={{ fontSize:'1.2rem', color:'var(--a)' }}>→</div>
                    <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, border:'1px solid rgba(212,176,90,0.3)', padding:'8px 12px', background:'rgba(212,176,90,0.06)' }}>
                      <img src='https://pbs.twimg.com/profile_images/1834254808826806272/1834254808826806272_400x400.jpg' alt='Arc' style={{ width:20, height:20, borderRadius:'50%' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                      <span style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--a2)' }}>Arc Testnet</span>
                    </div>
                  </div>
                  {/* Amount presets */}
                  <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--w18)', marginBottom:8 }}>Amount (USDC)</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4, marginBottom:10 }}>
                    {AMOUNTS.map(a => <button key={a} onClick={() => setBridgeAmount(a)} style={{ fontFamily:"'Cormorant',serif", fontSize:14, fontWeight:300, padding:'8px 4px', textAlign:'center', background:bridgeAmount===a?'rgba(212,176,90,0.12)':'var(--bg3)', border:bridgeAmount===a?'1px solid var(--a)':'1px solid var(--b1)', color:bridgeAmount===a?'var(--a2)':'var(--w35)', cursor:'pointer', transition:'all 0.2s' }}>${a}</button>)}
                  </div>
                  <input className='v-input' type='number' placeholder='Custom amount...' value={bridgeAmount} onChange={e => setBridgeAmount(e.target.value)} style={{ marginBottom:14 }} />
                  {error && <div style={{ fontSize:10, fontStyle:'italic', color:'var(--err)', marginBottom:10, border:'1px solid rgba(232,112,112,0.2)', padding:'7px 10px' }}>{error}</div>}
                  {result && <div style={{ fontSize:10, fontStyle:'italic', color:'var(--gr)', marginBottom:10, border:'1px solid var(--gr3)', padding:'7px 10px' }}>{result}</div>}
                  <button onClick={handleBridge} disabled={loading} className='btn-primary' style={{ width:'100%', padding:'11px', fontSize:10 }}>
                    {loading ? 'Bridging...' : `Bridge $${bridgeAmount} USDC → Arc`}
                  </button>
                </div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}