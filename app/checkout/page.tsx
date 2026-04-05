'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Checkout() {
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); }, 2000);
  };

  const txHash = '0x4a7f9c2e8b1d3f6a0e5c8b2d4f7a1e3c6b9d2f5a8e1c4b7d0f3a6e9c2b5d8f1a';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2.5rem', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(240,237,232,0.85)' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.08em' }}>
          VEND<span style={{ color: 'var(--accent)' }}>R</span>A
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Explore</Link>
          <Link href="/create" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Launch Store</Link>
          <Link href="/dashboard" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Dashboard</Link>
          <button style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.55rem 1.25rem' }}>Connect Wallet</button>
        </div>
      </nav>

      <div style={{ maxWidth: 460, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
        <div style={{ border: '1px solid var(--border)' }}>
          {!paid ? (
            <>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg2)' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Nour Atelier</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em' }}>Signature Piece</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: 'var(--accent)', letterSpacing: '0.02em' }}>$45 USDC</div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {(
                  [
                    ['Product', 'Signature Piece', false],
                    ['Type', 'Physical', false],
                    ['Network', 'Arc Testnet', true],
                    ['Gas fee', '~$0.001 USDC', false],
                    ['Total', '$45 USDC', true],
                  ] as [string, string, boolean][]
                ).map(([label, val, accent], i) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ color: 'var(--muted)', fontWeight: 300, fontSize: '0.875rem' }}>{label}</span>
                    <span style={{
                      fontWeight: 500,
                      fontSize: label === 'Total' ? '1.2rem' : '0.875rem',
                      color: accent ? 'var(--accent)' : 'var(--ink)',
                      fontFamily: label === 'Total' ? "'Bebas Neue', sans-serif" : 'inherit'
                    }}>{val}</span>
                  </div>
                ))}

                <button
                  onClick={handlePay}
                  disabled={paying}
                  style={{ width: '100%', background: paying ? 'var(--muted)' : 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: paying ? 'not-allowed' : 'pointer', marginTop: '1.5rem', transition: 'background 0.2s' }}>
                  {paying ? 'Confirming on Arc...' : 'Pay $45 USDC →'}
                </button>

                <div style={{ textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1rem' }}>
                  Arc · Onchain · 0% Fee
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: 'var(--accent)' }}>✓</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Payment Confirmed</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', fontWeight: 300 }}>Transaction settled on Arc Testnet</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', wordBreak: 'break-all', padding: '0.75rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                {txHash}
              </div>
              <Link href="/">
                <button style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Back to Explore
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}