'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function ArcUnifiedBalance() {
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !isConnected) return null;
  const chains = [
    { name: 'Arc Testnet', bal: '—', native: true },
    { name: 'Ethereum Sepolia', bal: '—', native: false },
    { name: 'Solana Devnet', bal: '—', native: false },
  ];
  return (
    <div style={{ border: '1px solid rgba(212,176,90,0.2)', background: 'linear-gradient(145deg,rgba(212,176,90,0.06),rgba(12,14,26,0.9))', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)' }} />
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--w18)', marginBottom: 4 }}>Arc App Kit · Unified Balance</div>
            <div style={{ fontFamily: "'Cormorant',serif", fontSize: 28, fontWeight: 300, color: 'var(--a2)', lineHeight: 1 }}>Multi-Chain USDC</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--gr3)', background: 'var(--gr2)', padding: '4px 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gr)', boxShadow: '0 0 6px var(--gr)' }} />
            <span style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gr)' }}>Live</span>
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 300, fontStyle: 'italic', color: 'var(--w35)', lineHeight: 1.7, marginBottom: 16 }}>Hold USDC on any chain. Spend directly on Vendra — no manual bridging required. Powered by CCTP.</div>
        <div style={{ borderTop: '1px solid var(--b1)', paddingTop: 14, marginBottom: 14 }}>
          {chains.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {c.native && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gr)', boxShadow: '0 0 4px var(--gr)' }} />}
                <span style={{ fontSize: 11, fontWeight: 300, color: c.native ? 'var(--w60)' : 'var(--w35)', fontStyle: 'italic', letterSpacing: '0.04em' }}>{c.name}{c.native ? ' (Active)' : ''}</span>
              </div>
              <span style={{ fontFamily: "'Cormorant',serif", fontSize: 14, fontWeight: 300, color: 'var(--w18)' }}>{c.bal} USDC</span>
            </div>))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href='https://docs.arc.io/app-kit/unified-balance.md' target='_blank' rel='noopener noreferrer' style={{ flex: 1 }}><button className='btn-amber-ghost' style={{ width: '100%', fontSize: 9, padding: '8px' }}>Unified Balance ↗</button></a>
          <a href='https://docs.arc.io/app-kit/bridge.md' target='_blank' rel='noopener noreferrer' style={{ flex: 1 }}><button className='btn-ghost' style={{ width: '100%', fontSize: 9, padding: '8px' }}>Bridge USDC ↗</button></a>
        </div>
      </div>
    </div>
  );
}