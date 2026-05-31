'use client';
import Link from 'next/link';

export default function ArcAgenticBanner() {
  return (
    <div style={{ background: 'linear-gradient(135deg,rgba(212,176,90,0.06),rgba(155,181,200,0.04),var(--bg2))', border: '1px solid rgba(212,176,90,0.15)', padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gr)', boxShadow: '0 0 6px var(--gr)' }} />
            <span style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--w18)' }}>Arc Agentic Economy</span>
          </div>
          <div style={{ fontFamily: "'Cormorant',serif", fontSize: 20, fontWeight: 300, color: 'var(--w85)', marginBottom: 6, lineHeight: 1.2 }}>Vendra is a flagship proof-of-concept for Arc's agentic economy thesis</div>
          <div style={{ fontSize: 12, fontWeight: 300, fontStyle: 'italic', color: 'var(--w35)', lineHeight: 1.7 }}>Arc was built for AI agents that transact thousands of times in rapid succession. USDC gas means predictable costs. Sub-second finality means instant outcomes. Vendra demonstrates this at the application layer.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <a href='https://www.arc.io/blog/how-arc-supports-the-agentic-economy-arc-blueprints' target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{ fontSize: 9, padding: '8px 16px', whiteSpace: 'nowrap' }}>Arc Blog ↗</button></a>
          <a href='https://docs.arc.io/build/agentic-economy.md' target='_blank' rel='noopener noreferrer'><button className='btn-ghost' style={{ fontSize: 9, padding: '8px 16px', whiteSpace: 'nowrap' }}>Arc Docs ↗</button></a>
        </div>
      </div>
    </div>
  );
}