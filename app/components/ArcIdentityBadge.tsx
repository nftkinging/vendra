'use client';

interface Props { score?: string | number; totalSales?: number; verified?: boolean; }

export default function ArcIdentityBadge({ score='—', totalSales=0, verified=false }: Props) {
  return (
    <div style={{ border: '1px solid var(--b1)', background: 'var(--bg2)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: verified ? 'var(--gr)' : 'var(--w18)', boxShadow: verified ? '0 0 6px var(--gr)' : 'none' }} />
        <span style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.16em', textTransform: 'uppercase', color: verified ? 'var(--gr)' : 'var(--w18)' }}>ERC-8004</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--w18)', marginBottom: 2 }}>Onchain Identity · Trust Score</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: "'Cormorant',serif", fontSize: 22, fontWeight: 300, color: 'var(--a2)', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 10, fontWeight: 300, fontStyle: 'italic', color: 'var(--w18)' }}>from {totalSales} sale{totalSales !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <a href='https://docs.arc.io/arc/tutorials/create-your-first-erc-8183-job.md' target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none', flexShrink: 0 }}>
        <button className='btn-ghost' style={{ fontSize: 9, padding: '6px 12px' }}>Docs ↗</button>
      </a>
    </div>
  );
}