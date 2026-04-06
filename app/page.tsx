'use client';
import Nav from './Nav';

export default function Home() {
  return (
    <main>
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '5rem' }}>
        <div style={{ position: 'absolute', top: '5.5rem', left: '2.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.6 }}>
          Arc Testnet<br />Commerce Protocol
        </div>
        <div style={{ position: 'absolute', top: '5.5rem', right: '2.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.6, textAlign: 'right' }}>
          2025<br />Web3 Commerce
        </div>

        {/* Glass orb */}
        <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: 'clamp(200px, 30vw, 380px)', height: 'clamp(200px, 30vw, 380px)', zIndex: 1, pointerEvents: 'none' }}>
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id="g1" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="40%" stopColor="rgba(232,114,12,0.15)" />
                <stop offset="100%" stopColor="rgba(232,114,12,0.05)" />
              </radialGradient>
              <radialGradient id="g2" cx="70%" cy="65%" r="50%">
                <stop offset="0%" stopColor="rgba(232,114,12,0.4)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="blur1"><feGaussianBlur stdDeviation="8" /></filter>
              <filter id="blur2"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>
            <ellipse cx="200" cy="210" rx="140" ry="130" fill="rgba(232,114,12,0.12)" filter="url(#blur1)" />
            <polygon points="200,60 340,140 340,280 200,360 60,280 60,140" fill="url(#g1)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <polygon points="200,100 300,160 300,260 200,320 100,260 100,160" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <line x1="140" y1="120" x2="280" y2="290" stroke="rgba(232,114,12,0.6)" strokeWidth="1.5" filter="url(#blur2)" />
            <line x1="160" y1="100" x2="300" y2="260" stroke="rgba(245,160,84,0.4)" strokeWidth="0.8" />
            <line x1="240" y1="80" x2="100" y2="300" stroke="rgba(80,200,180,0.35)" strokeWidth="1" filter="url(#blur2)" />
            <ellipse cx="160" cy="155" rx="35" ry="20" fill="rgba(255,255,255,0.5)" transform="rotate(-20,160,155)" filter="url(#blur2)" />
            <ellipse cx="290" cy="270" rx="50" ry="40" fill="url(#g2)" filter="url(#blur1)" />
          </svg>
        </div>

        {/* Big type */}
        <div style={{ padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem,13vw,11rem)', lineHeight: 0.92, letterSpacing: '-0.01em' }}>
            <div style={{ color: 'var(--ink)' }}>COMMERCE</div>
            <div style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--ink)', opacity: 0.35 }}>UNCHAINED</div>
            <div style={{ color: 'var(--accent)' }}>ON ARC</div>
            <div style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--accent)', opacity: 0.5 }}>TESTNET</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', borderTop: '1px solid var(--border)', margin: '2rem 2.5rem 0', position: 'relative', zIndex: 2 }}>
          {[['0%', 'Platform Fees'], ['<2s', 'Settlement'], ['USDC', 'Native Currency'], ['∞', 'Global Reach']].map(([num, label]) => (
            <div key={label} style={{ flex: 1, padding: '1.25rem 0', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: 'var(--accent)' }}>{num}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Hero bottom */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '2rem 2.5rem', position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '360px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>
              Launch your store in minutes. Sell anything. Get paid instantly in USDC — no middlemen, no fees, no borders.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="/create">
                <button style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Launch Store →
                </button>
              </a>
              <a href="/marketplace">
                <button style={{ background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Explore
                </button>
              </a>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
            Live on Arc Testnet
          </div>
        </div>
      </section>
    </main>
  );
}