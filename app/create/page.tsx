'use client';
import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { icon: '👗', name: 'Fashion' }, { icon: '💾', name: 'Digital' },
  { icon: '🎨', name: 'Art' }, { icon: '🛠', name: 'Services' },
  { icon: '🍱', name: 'Food' }, { icon: '📱', name: 'Tech' },
  { icon: '🎵', name: 'Music' }, { icon: '✨', name: 'Other' },
];

export default function CreateStore() {
  const [selectedCat, setSelectedCat] = useState('Fashion');
  const [form, setForm] = useState({ name: '', tagline: '', desc: '', wallet: '' });

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2.5rem', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(240,237,232,0.85)' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.08em' }}>
          VEND<span style={{ color: 'var(--accent)' }}>R</span>A
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Explore</Link>
          <Link href="/create" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Launch Store</Link>
          <Link href="/dashboard" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Dashboard</Link>
          <button style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.55rem 1.25rem' }}>Connect Wallet</button>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '7rem 2.5rem 4rem' }}>
        <div style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} /> Arc Testnet
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '0.5rem' }}>LAUNCH<br />YOUR STORE</div>
        <p style={{ color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem', fontWeight: 300 }}>Set up in 2 minutes. Start selling globally, instantly.</p>

        {/* Store Identity */}
        <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg2)' }}>Store Identity</div>
          <div style={{ padding: '1.25rem' }}>
            {[['Store name', 'name', 'e.g. Nour Atelier'], ['Tagline', 'tagline', 'One line about what you sell'], ['Description', 'desc', 'Tell buyers what makes your store special...']].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                {key === 'desc'
                  ? <textarea placeholder={ph} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none', resize: 'vertical', minHeight: 80 }} />
                  : <input type="text" placeholder={ph} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
                }
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg2)' }}>Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {categories.map(cat => (
              <div key={cat.name} onClick={() => setSelectedCat(cat.name)} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', cursor: 'pointer', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: selectedCat === cat.name ? 'var(--ink)' : 'transparent', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: selectedCat === cat.name ? 'var(--accent)' : 'var(--muted)' }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg2)' }}>Payment</div>
          <div style={{ padding: '1.25rem' }}>
            <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Wallet address (receives USDC)</label>
            <input type="text" placeholder="0x..." value={form.wallet} onChange={e => setForm({ ...form, wallet: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
          </div>
        </div>

        <Link href="/dashboard">
          <button style={{ width: '100%', background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: 'pointer', marginTop: '0.5rem' }}>
            Deploy Store on Arc →
          </button>
        </Link>
      </div>
    </main>
  );
}