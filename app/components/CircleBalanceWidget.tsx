'use client';
import { useState, useEffect } from 'react';

type Tab = 'balance'|'deposit'|'bridge';
const CHAINS = [
  { id:'Ethereum_Sepolia', label:'Ethereum', logo:'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id:'Base_Sepolia', label:'Base', logo:'https://cryptologos.cc/logos/base-logo.png' },
  { id:'Arbitrum_Sepolia', label:'Arbitrum', logo:'https://cryptologos.cc/logos/arbitrum-arb-logo.png' },
  { id:'Polygon_Amoy', label:'Polygon', logo:'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { id:'Solana_Devnet', label:'Solana', logo:'https://cryptologos.cc/logos/solana-sol-logo.png' },
];
const AMOUNTS = ['1','5','10','50'];

interface Props {
  wallet: { address: string; walletId: string; email: string };
}

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
      const res = await fetch('/api/circle/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: wallet.walletId }),
      });
      const data = await res.json();
      setBalance(parseFloat(data.balance || '0').toFixed(2));
    } catch {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleBridge = async () => {
    if (!bridgeAmount) { setBridgeError('Enter an amount'); return; }
    setBridgeLoading(true); setBridgeError(''); setBridgeResult('');
    try {
      const res = await fetch('/api/circle/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromChain, toChain: 'Arc_Testnet', amount: bridgeAmount, walletAddress: wallet.address, walletId: wallet.walletId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBridgeResult('Bridge initiated! USDC is on its way to Arc Testnet.');
    } catch(e:any) {
      setBridgeError(e?.message || 'Bridge failed.');
    } finally { setBridgeLoading(false); }
  };

  const selectedChain = CHAINS.find(c => c.id === fromChain) || CHAINS[0];
  const tabs: {id:Tab;label:string}[] = [{id:'balance',label:'Balance'},{id:'deposit',label:'Deposit'},{id:'bridge',label:'Bridge'}];

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => { setOpen(!open); if (!open) fetchBalance(); }} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:400, background:'var(--bg2)', border:'1px solid var(--b2)', color:'var(--sl2)', padding:'8px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.3s' }} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--sl)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b2)')}>
        <span>⭕</span>
        <span style={{fontFamily:"'Cormorant',serif",fontSize:16,fontWeight:300}}>${balance}</span>
        <span style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.10em',textTransform:'uppercase',color:'var(--w18)'}}>USDC</span>
        <span style={{fontSize:8,color:'var(--w18)',display:'inline-block',transform:open?'rotate(180deg)':'rotate(0)'}}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,zIndex:98}}/>
          <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,width:320,background:'var(--bg2)',border:'1px solid var(--b2)',zIndex:99,boxShadow:'0 20px 60px rgba(0,0,0,0.6)',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,rgba(155,181,200,0.5),transparent)'}}/>
            <div style={{padding:'12px 16px',borderBottom:'1px solid var(--b1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--sl)'}}>Circle Wallet · USDC</div>
              <button onClick={()=>setOpen(false)} style={{background:'transparent',border:'none',color:'var(--w18)',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{display:'flex',borderBottom:'1px solid var(--b1)'}}>
              {tabs.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setBridgeError('');setBridgeResult('');}} style={{flex:1,fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.12em',textTransform:'uppercase',padding:'10px 4px',background:'transparent',border:'none',borderBottom:tab===t.id?'1px solid var(--sl)':'1px solid transparent',color:tab===t.id?'var(--sl)':'var(--w18)',cursor:'pointer',transition:'all 0.2s'}}>{t.label}</button>)}
            </div>
            <div style={{padding:16}}>
              {tab==='balance' && (
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--w18)',marginBottom:4}}>Circle Wallet · USDC Balance</div>
                  <div style={{fontFamily:"'Cormorant',serif",fontSize:40,fontWeight:300,color:'var(--sl2)',lineHeight:1,marginBottom:2}}>${balance}</div>
                  <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)',marginBottom:14}}>USDC · Arc Testnet</div>
                  <div style={{display:'flex',gap:8,marginBottom:8}}>
                    <button onClick={()=>setTab('deposit')} className='btn-slate' style={{flex:1,fontSize:9,padding:'9px'}}>Deposit ↓</button>
                    <button onClick={()=>setTab('bridge')} className='btn-ghost' style={{flex:1,fontSize:9,padding:'9px'}}>Bridge 🌉</button>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{flex:1}}><button className='btn-ghost' style={{width:'100%',fontSize:9,padding:'8px'}}>💧 Faucet</button></a>
                    <a href={`https://testnet.arcscan.app/address/${wallet.address}`} target='_blank' rel='noopener noreferrer' style={{flex:1}}><button className='btn-ghost' style={{width:'100%',fontSize:9,padding:'8px'}}>Explorer ↗</button></a>
                  </div>
                </div>)}
              {tab==='deposit' && (
                <div>
                  <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7,marginBottom:14}}>Copy your Circle wallet address to receive USDC on Arc Testnet.</div>
                  <div style={{border:'1px solid var(--b1)',background:'var(--bg3)',padding:'14px',marginBottom:14}}>
                    <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--sl)',marginBottom:6}}>Circle Wallet · Arc Testnet</div>
                    <div style={{fontFamily:"'Cormorant',serif",fontSize:11,fontWeight:300,color:'var(--w60)',wordBreak:'break-all',marginBottom:10}}>{wallet.address}</div>
                    <button onClick={handleCopy} className={copied?'btn-primary':'btn-slate'} style={{width:'100%',fontSize:10,padding:'10px'}}>{copied?'✓ Address Copied!':'Copy Address'}</button>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><div style={{flex:1,height:1,background:'var(--b1)'}}/><span style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.12em',textTransform:'uppercase'}}>or</span><div style={{flex:1,height:1,background:'var(--b1)'}}/></div>
                  <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'><button className='btn-ghost' style={{width:'100%',fontSize:10,padding:'10px'}}>💧 Get Free Test USDC ↗</button></a>
                </div>)}
              {tab==='bridge' && (
                <div>
                  <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7,marginBottom:12}}>Bridge USDC to your Circle wallet on Arc Testnet.</div>
                  <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--w18)',marginBottom:8}}>From Chain</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:4,marginBottom:12}}>
                    {CHAINS.map(c=><button key={c.id} onClick={()=>setFromChain(c.id)} style={{padding:'8px 2px',textAlign:'center',background:fromChain===c.id?'rgba(155,181,200,0.12)':'var(--bg3)',border:fromChain===c.id?'1px solid var(--sl)':'1px solid var(--b1)',cursor:'pointer',transition:'all 0.2s',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                      <img src={c.logo} alt={c.label} style={{width:22,height:22,borderRadius:'50%',objectFit:'cover',border:'1px solid var(--b1)'}} onError={e=>{(e.target as HTMLImageElement).style.opacity='0.3';}}/>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:7,fontWeight:300,letterSpacing:'0.06em',textTransform:'uppercase',color:fromChain===c.id?'var(--sl)':'var(--w18)'}}>{c.label}</span>
                    </button>)}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                    <div style={{flex:1,display:'flex',alignItems:'center',gap:6,border:'1px solid var(--b1)',padding:'8px 10px',background:'var(--bg3)'}}>
                      <img src={selectedChain.logo} alt={selectedChain.label} style={{width:18,height:18,borderRadius:'50%',objectFit:'cover'}} onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>
                      <span style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w60)'}}>{selectedChain.label}</span>
                    </div>
                    <span style={{color:'var(--sl)',fontSize:'1.1rem'}}>→</span>
                    <div style={{flex:1,display:'flex',alignItems:'center',gap:6,border:'1px solid rgba(155,181,200,0.3)',padding:'8px 10px',background:'rgba(155,181,200,0.06)'}}>
                      <span style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--sl2)'}}>Arc Testnet</span>
                    </div>
                  </div>
                  <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--w18)',marginBottom:8}}>Amount (USDC)</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,marginBottom:8}}>
                    {AMOUNTS.map(a=><button key={a} onClick={()=>setBridgeAmount(a)} style={{fontFamily:"'Cormorant',serif",fontSize:14,fontWeight:300,padding:'8px 4px',textAlign:'center',background:bridgeAmount===a?'rgba(155,181,200,0.12)':'var(--bg3)',border:bridgeAmount===a?'1px solid var(--sl)':'1px solid var(--b1)',color:bridgeAmount===a?'var(--sl2)':'var(--w35)',cursor:'pointer',transition:'all 0.2s'}}>${a}</button>)}
                  </div>
                  <input className='v-input' type='number' placeholder='Custom amount...' value={bridgeAmount} onChange={e=>setBridgeAmount(e.target.value)} style={{marginBottom:12}}/>
                  {bridgeError&&<div style={{fontSize:10,fontStyle:'italic',color:'var(--err)',marginBottom:10,border:'1px solid rgba(232,112,112,0.2)',padding:'7px 10px'}}>{bridgeError}</div>}
                  {bridgeResult&&<div style={{fontSize:10,fontStyle:'italic',color:'var(--gr)',marginBottom:10,border:'1px solid var(--gr3)',padding:'7px 10px'}}>{bridgeResult}</div>}
                  <button onClick={handleBridge} disabled={bridgeLoading} className='btn-slate' style={{width:'100%',padding:'11px',fontSize:10}}>{bridgeLoading?'Bridging...':`Bridge $${bridgeAmount} USDC → Arc`}</button>
                </div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}