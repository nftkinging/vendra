'use client';
import Nav from './Nav';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { getAllProfiles } from './lib/supabase';
import { useRouter } from 'next/navigation';

function GetStartedButton({ address }: { address: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const profiles = await getAllProfiles(address);
      const hasSeller = profiles.some((p: any) => p.role === 'seller');
      const hasBuyer = profiles.some((p: any) => p.role === 'buyer');

      if (hasSeller && hasBuyer) {
        router.push('/welcome');
      } else if (hasSeller && !hasBuyer) {
        router.push('/onboarding?role=buyer');
      } else if (hasBuyer && !hasSeller) {
        router.push('/onboarding?role=seller');
      } else {
        router.push('/onboarding');
      }
    } catch {
      router.push('/onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
      {loading ? 'Loading...' : 'Get Started →'}
    </button>
  );
}

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <main>
      <Nav />

      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: '5rem',
        background: 'radial-gradient(ellipse at 70% 40%, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(201,77,122,0.15) 0%, transparent 50%)'
      }}>

        <div style={{ position: 'absolute', top: '5.5rem', left: '2.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.6 }}>
          Arc Testnet<br />Commerce Protocol
        </div>
        <div style={{ position: 'absolute', top: '5.5rem', right: '2.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.6, textAlign: 'right' }}>
          2025<br />Web3 Commerce
        </div>

        {[
          { top: '15%', left: '20%', size: 2, opacity: 0.6 },
          { top: '25%', left: '45%', size: 1, opacity: 0.4 },
          { top: '10%', left: '65%', size: 2, opacity: 0.7 },
          { top: '35%', left: '80%', size: 1, opacity: 0.5 },
          { top: '60%', left: '10%', size: 3, opacity: 0.3 },
          { top: '70%', left: '55%', size: 1, opacity: 0.5 },
          { top: '20%', left: '90%', size: 2, opacity: 0.6 },
          { top: '45%', left: '30%', size: 1, opacity: 0.4 },
          { top: '5%', left: '50%', size: 2, opacity: 0.5 },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', opacity: s.opacity, pointerEvents: 'none' }} />
        ))}

        <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: 'clamp(200px, 30vw, 380px)', height: 'clamp(200px, 30vw, 380px)', zIndex: 1, pointerEvents: 'none' }}>
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id="g1" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <stop offset="40%" stopColor="rgba(201,77,122,0.25)" />
                <stop offset="100%" stopColor="rgba(124,58,237,0.1)" />
              </radialGradient>
              <radialGradient id="g2" cx="70%" cy="65%" r="50%">
                <stop offset="0%" stopColor="rgba(201,77,122,0.5)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="blur1"><feGaussianBlur stdDeviation="10" /></filter>
              <filter id="blur2"><feGaussianBlur stdDeviation="4" /></filter>
            </defs>
            <ellipse cx="200" cy="210" rx="140" ry="130" fill="rgba(124,58,237,0.15)" filter="url(#blur1)" />
            <ellipse cx="240" cy="240" rx="100" ry="90" fill="rgba(201,77,122,0.1)" filter="url(#blur1)" />
            <polygon points="200,60 340,140 340,280 200,360 60,280 60,140" fill="url(#g1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <polygon points="200,100 300,160 300,260 200,320 100,260 100,160" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <line x1="140" y1="120" x2="280" y2="290" stroke="rgba(201,77,122,0.6)" strokeWidth="1.5" filter="url(#blur2)" />
            <line x1="160" y1="100" x2="300" y2="260" stroke="rgba(232,93,138,0.4)" strokeWidth="0.8" />
            <line x1="240" y1="80" x2="100" y2="300" stroke="rgba(124,58,237,0.4)" strokeWidth="1" filter="url(#blur2)" />
            <ellipse cx="160" cy="155" rx="35" ry="20" fill="rgba(255,255,255,0.35)" transform="rotate(-20,160,155)" filter="url(#blur2)" />
            <ellipse cx="290" cy="270" rx="50" ry="40" fill="url(#g2)" filter="url(#blur1)" />
          </svg>
        </div>

        <div style={{ padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem,13vw,11rem)', lineHeight: 0.92, letterSpacing: '-0.01em' }}>
            <div style={{ color: 'var(--ink)' }}>COMMERCE</div>
            <div style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>UNCHAINED</div>
            <div style={{ color: 'var(--accent)' }}>ON ARC</div>
            <div style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--accent)', opacity: 0.4 }}>TESTNET</div>
          </div>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid var(--border)', margin: '2rem 2.5rem 0', position: 'relative', zIndex: 2 }}>
          {[['0%', 'Platform Fees'], ['<2s', 'Settlement'], ['USDC', 'Native Currency'], ['∞', 'Global Reach']].map(([num, label]) => (
            <div key={label} style={{ flex: 1, padding: '1.25rem 0', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: 'var(--accent2)' }}>{num}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '2rem 2.5rem', position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '360px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>
              Launch your store in minutes. Sell anything. Get paid instantly in USDC — no middlemen, no fees, no borders.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {isConnected && address ? (
  <GetStartedButton address={address} />
) : (
  <a href="/join">
    <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
      Join Now →
    </button>
  </a>
)}
<a href="/marketplace">
  <button style={{ background: 'transparent', color: 'var(--ink)', border: '1px solid var(--border2)', padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
    Explore
  </button>
</a>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent2)', animation: 'pulse 2s infinite' }} />
            Live on Arc Testnet
          </div>
        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}`}</style>
      </section>
    </main>
  );
}