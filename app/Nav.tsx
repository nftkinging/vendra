'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Nav() {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2.5rem', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(240,237,232,0.85)' }}>
      <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.08em', color: 'var(--ink)' }}>
        VEND<span style={{ color: 'var(--accent)' }}>R</span>A
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Explore</Link>
        <Link href="/create" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Launch Store</Link>
        <Link href="/dashboard" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Dashboard</Link>
        <ConnectButton
          label="Connect Wallet"
          accountStatus="address"
          chainStatus="none"
          showBalance={false}
        />
      </div>
    </nav>
  );
}