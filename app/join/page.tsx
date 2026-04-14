'use client';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';

export default function Join() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.15), transparent 70%), radial-gradient(ellipse at 80% 20%, rgba(201,77,122,0.1), transparent 50%), var(--bg)'
    }}>
      {[
        { top: '10%', left: '15%', size: 2, opacity: 0.5 },
        { top: '20%', left: '70%', size: 1, opacity: 0.4 },
        { top: '70%', left: '20%', size: 2, opacity: 0.3 },
        { top: '80%', left: '75%', size: 1, opacity: 0.5 },
        { top: '40%', left: '90%', size: 2, opacity: 0.4 },
        { top: '60%', left: '5%', size: 1, opacity: 0.6 },
      ].map((s, i) => (
        <div key={i} style={{ position: 'fixed', top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', opacity: s.opacity, pointerEvents: 'none' }} />
      ))}

      <div style={{ textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.08em', marginBottom: '2.5rem', color: 'var(--ink)' }}>
          VEND<span style={{ color: 'var(--accent)' }}>R</span>A
        </div>

        <div style={{ width: 100, height: 100, margin: '0 auto 2.5rem' }}>
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id="jg1" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <stop offset="40%" stopColor="rgba(201,77,122,0.25)" />
                <stop offset="100%" stopColor="rgba(124,58,237,0.1)" />
              </radialGradient>
              <filter id="jblur"><feGaussianBlur stdDeviation="10" /></filter>
            </defs>
            <ellipse cx="200" cy="210" rx="140" ry="130" fill="rgba(124,58,237,0.15)" filter="url(#jblur)" />
            <polygon points="200,60 340,140 340,280 200,360 60,280 60,140" fill="url(#jg1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="140" y1="120" x2="280" y2="290" stroke="rgba(201,77,122,0.6)" strokeWidth="1.5" />
            <line x1="240" y1="80" x2="100" y2="300" stroke="rgba(124,58,237,0.4)" strokeWidth="1" />
          </svg>
        </div>

        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '0.02em', marginBottom: '0.75rem', color: 'var(--ink)' }}>
          JOIN VENDRA
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Connect your wallet to start buying and selling on Arc Testnet. No sign-up form, no email — just your wallet.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <ConnectButton
            label="Connect Wallet to Join"
            accountStatus="address"
            chainStatus="none"
            showBalance={false}
          />
        </div>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          Powered by Arc Testnet · 0% fees
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['Zero platform fees', 'Instant USDC settlement', 'Sell anything globally'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>{f}</span>
            </div>
          ))}
        </div>

        <a href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
          ← Back to home
        </a>
      </div>
    </main>
  );
}