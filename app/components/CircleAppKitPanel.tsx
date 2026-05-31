'use client';
import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { createViemAdapter } from '@circle-fin/adapter-viem-v2';
import { AppKit } from '@circle-fin/app-kit';

type Tab = 'balance'|'bridge'|'send';

export default function CircleAppKitPanel() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [tab, setTab] = useState<Tab>('balance');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [bridgeForm, setBridgeForm] = useState({ amount:'', fromChain:'Ethereum_Sepolia', toChain:'Arc_Testnet' });
  const [sendForm, setSendForm] = useState({ amount:'', to:'' });

  useEffect(() => setMounted(true), []);
  if (!mounted || !isConnected) return null;

  const getKit = () => {
    if (!walletClient) throw new Error('Wallet not connected');
    const adapter = createViemAdapter({ walletClient });
    return { kit: new AppKit(), adapter };
  };

  const handleBridge = async () => {
    if (!bridgeForm.amount) { setError('Enter an amount'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const { kit, adapter } = getKit();
      const res = await kit.bridge({
        from: { adapter, chain: bridgeForm.fromChain as any },
        to: { adapter, chain: bridgeForm.toChain as any },
        amount: bridgeForm.amount,
        token: 'USDC',
      });
      setResult('Bridge initiated! Tx: ' + JSON.stringify(res).slice(0,80));
    } catch(e:any) {
      setError(e?.message||'Bridge failed');
    } finally { setLoading(false); }
  };

  const handleSend = async () => {
    if (!sendForm.amount || !sendForm.to) { setError('Fill in all fields'); return; }
    setLoading(true); setError(''); setResult('');
    try {
      const { kit, adapter } = getKit();
      const res = await kit.send({
        from: { adapter, chain: 'Arc_Testnet' as any },
        to: { address: sendForm.to as `0x${string}`, chain: 'Arc_Testnet' as any },
        amount: sendForm.amount,
        token: 'USDC',
      });
      setResult('Sent! Tx: ' + JSON.stringify(res).slice(0,80));
    } catch(e:any) {
      setError(e?.message||'Send failed');
    } finally { setLoading(false); }
  };

  const CHAINS = ['Arc_Testnet','Ethereum_Sepolia','Solana_Devnet'];
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id:'balance', label:'Unified Balance', icon:'💳' },
    { id:'bridge', label:'Bridge USDC', icon:'🌉' },
    { id:'send', label:'Send USDC', icon:'✈️' },
  ];

  return (
    <div style={{ border:'1px solid rgba(212,176,90,0.2)', background:'linear-gradient(145deg,rgba(212,176,90,0.05),var(--bg2))', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.5),transparent)' }} />
      {/* Header */}
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--b1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--a)', marginBottom:2 }}>Circle · App Kit</div>
          <div style={{ fontFamily:"'Cormorant',serif", fontSize:18, fontWeight:300, color:'var(--w85)' }}>USDC Wallet</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, border:'1px solid var(--gr3)', background:'var(--gr2)', padding:'4px 10px' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--gr)', boxShadow:'0 0 6px var(--gr)' }} />
          <span style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gr)' }}>Arc Testnet</span>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--b1)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setError(''); setResult(''); }} style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.12em', textTransform:'uppercase', padding:'10px 8px', background:'transparent', border:'none', borderBottom: tab===t.id ? '1px solid var(--a)' : '1px solid transparent', color: tab===t.id ? 'var(--a)' : 'var(--w18)', cursor:'pointer', transition:'all 0.2s' }}>
            {t.icon}{' '}{t.label}
          </button>))}
      </div>
      <div style={{ padding:'20px' }}>
        {/* BALANCE TAB */}
        {tab==='balance' && (
          <div>
            <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--w18)', marginBottom:4 }}>Connected Wallet</div>
            <div style={{ fontFamily:"'Cormorant',serif", fontSize:14, fontWeight:300, color:'var(--a2)', marginBottom:16, wordBreak:'break-all' }}>{address}</div>
            <div style={{ borderTop:'1px solid var(--b1)', paddingTop:14, marginBottom:14 }}>
              {[{chain:'Arc Testnet',note:'Active · Native USDC'},{chain:'Ethereum Sepolia',note:'Bridge via CCTP'},{chain:'Solana Devnet',note:'Bridge via CCTP'}].map(c => (
                <div key={c.chain} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:300, color:'var(--w60)', fontStyle:'italic' }}>{c.chain}</div>
                    <div style={{ fontSize:9, fontWeight:300, fontStyle:'italic', color:'var(--w18)', letterSpacing:'0.08em' }}>{c.note}</div>
                  </div>
                  <div style={{ fontFamily:"'Cormorant',serif", fontSize:16, fontWeight:300, color:'var(--w18)' }}>— USDC</div>
                </div>))}
            </div>
            <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:12 }}>Unified Balance lets you hold USDC across chains and spend on Vendra without manually bridging. Powered by Circle Gateway + CCTP.</div>
            <a href='https://docs.arc.io/app-kit/unified-balance' target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{ width:'100%', fontSize:9, padding:'8px' }}>Read Unified Balance Docs ↗</button></a>
          </div>)}
        {/* BRIDGE TAB */}
        {tab==='bridge' && (
          <div>
            <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:16 }}>Bridge USDC from any supported chain to Arc Testnet via Circle CCTP.</div>
            <div className='v-field'>
              <label className='v-label'>Amount (USDC)</label>
              <input className='v-input' type='number' placeholder='e.g. 10.00' value={bridgeForm.amount} onChange={e => setBridgeForm({...bridgeForm, amount:e.target.value})} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div>
                <label className='v-label'>From Chain</label>
                <select className='v-input' value={bridgeForm.fromChain} onChange={e => setBridgeForm({...bridgeForm, fromChain:e.target.value})} style={{ cursor:'pointer' }}>
                  {CHAINS.filter(c => c !== 'Arc_Testnet').map(c => <option key={c} value={c} style={{ background:'var(--bg2)' }}>{c.replace('_',' ')}</option>)}
                </select>
              </div>
              <div>
                <label className='v-label'>To Chain</label>
                <select className='v-input' value={bridgeForm.toChain} onChange={e => setBridgeForm({...bridgeForm, toChain:e.target.value})} style={{ cursor:'pointer' }}>
                  {CHAINS.map(c => <option key={c} value={c} style={{ background:'var(--bg2)' }}>{c.replace('_',' ')}</option>)}
                </select>
              </div>
            </div>
            {error && <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--err)', marginBottom:10, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
            {result && <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--gr)', marginBottom:10, border:'1px solid var(--gr3)', padding:'8px 12px', wordBreak:'break-all' }}>{result}</div>}
            <button onClick={handleBridge} disabled={loading} className='btn-primary' style={{ width:'100%', padding:'12px', fontSize:10 }}>{loading ? 'Bridging...' : 'Bridge USDC via CCTP →'}</button>
          </div>)}
        {/* SEND TAB */}
        {tab==='send' && (
          <div>
            <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--w35)', lineHeight:1.7, marginBottom:16 }}>Send USDC to any address on Arc Testnet.</div>
            <div className='v-field'>
              <label className='v-label'>Recipient Address</label>
              <input className='v-input' type='text' placeholder='0x...' value={sendForm.to} onChange={e => setSendForm({...sendForm, to:e.target.value})} />
            </div>
            <div className='v-field'>
              <label className='v-label'>Amount (USDC)</label>
              <input className='v-input' type='number' placeholder='e.g. 5.00' value={sendForm.amount} onChange={e => setSendForm({...sendForm, amount:e.target.value})} />
            </div>
            {error && <div style={{ fontSize:11, fontWeight:300, fontStyle:'italic', color:'var(--err)', marginBottom:10, border:'1px solid rgba(232,112,112,0.2)', padding:'8px 12px' }}>{error}</div>}
            {result && <div style={{ fontSize:10, fontWeight:300, fontStyle:'italic', color:'var(--gr)', marginBottom:10, border:'1px solid var(--gr3)', padding:'8px 12px', wordBreak:'break-all' }}>{result}</div>}
            <button onClick={handleSend} disabled={loading} className='btn-primary' style={{ width:'100%', padding:'12px', fontSize:10 }}>{loading ? 'Sending...' : 'Send USDC on Arc →'}</button>
          </div>)}
      </div>
    </div>
  );
}