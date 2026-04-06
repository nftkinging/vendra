'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from '../Nav';
import { Suspense } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);

  const store = searchParams.get('store') || 'nour-atelier';
  const product = searchParams.get('product') || 'Signature Piece';
  const price = searchParams.get('price') || '45';

  const storeName: Record<string, string> = {
    'nour-atelier': 'Nour Atelier',
    'bytedrop': 'ByteDrop',
    'solar-prints': 'Solar Prints',
    'kode-studio': 'Kode Studio',
    'umami-box': 'Umami Box',
    'soundvault': 'SoundVault',
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); }, 2000);
  };

  const txHash = '0x4a7f9c2e8b1d3f6a0e5c8b2d4f7a1e3c6b9d2f5a8e1c4b7d0f3a6e9c2b5d8f1a';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 460, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
        <div style={{ border: '1px solid var(--border)' }}>
          {!paid ? (
            <>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg2)' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {storeName[store] || store}
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em' }}>{product}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: 'var(--accent)', letterSpacing: '0.02em' }}>${price} USDC</div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {[
                  ['Product', product, false],
                  ['Network', 'Arc Testnet', true],
                  ['Gas fee', '~$0.001 USDC', false],
                  ['Total', `$${price} USDC`, true],
                ].map(([label, val, accent], i) => (
                  <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ color: 'var(--muted)', fontWeight: 300, fontSize: '0.875rem' }}>{String(label)}</span>
                    <span style={{ fontWeight: 500, fontSize: String(label) === 'Total' ? '1.2rem' : '0.875rem', color: accent ? 'var(--accent)' : 'var(--ink)', fontFamily: String(label) === 'Total' ? "'Bebas Neue', sans-serif" : 'inherit' }}>{String(val)}</span>
                  </div>
                ))}
                <button onClick={handlePay} disabled={paying} style={{ width: '100%', background: paying ? 'var(--muted)' : 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: paying ? 'not-allowed' : 'pointer', marginTop: '1.5rem' }}>
                  {paying ? 'Confirming on Arc...' : `Pay $${price} USDC →`}
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
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', wordBreak: 'break-all', padding: '0.75rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>{txHash}</div>
              <Link href={`/store/${store}`}>
                <button style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Back to Store
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Checkout() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}