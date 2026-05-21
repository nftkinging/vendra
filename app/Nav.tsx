'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import CartButton from './components/CartButton';
import CartDrawer from './components/CartDrawer';

export default function Nav() {
  const { isConnected } = useAccount();
  const [hover, setHover] = useState(false);

  return (
    <>
      <CartDrawer />
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(10,6,18,0.85)', gap: '1rem' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.08em', color: 'var(--ink)', textDecoration: 'none', flexShrink: 0 }}>
          VEND<span style={{ color: 'var(--accent)' }}>R</span>A
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/marketplace" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Explore
          </Link>
          {isConnected && (
            <Link href="/profile" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
              My Profile
            </Link>
          )}
          <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', textDecoration: 'none', border: hover ? '1px solid #7c3aed' : '1px solid rgba(124,58,237,0.4)', padding: '0.35rem 0.75rem', background: hover ? 'rgba(124,58,237,0.15)' : 'transparent', transition: 'all 0.2s' }}>
            Faucet
          </a>
          <CartButton />
          <ConnectButton label="Connect Wallet" accountStatus="address" chainStatus="none" showBalance={false} />
        </div>
      </nav>
    </>
  );
}
