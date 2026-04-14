'use client';
import Nav from '../../Nav';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { saveStore, getStoreByWallet } from '../../lib/supabase';

const categories = [
  { icon: '👗', name: 'Fashion' }, { icon: '💾', name: 'Digital' },
  { icon: '🎨', name: 'Art' }, { icon: '🛠', name: 'Services' },
  { icon: '🍱', name: 'Food' }, { icon: '📱', name: 'Tech' },
  { icon: '🎵', name: 'Music' }, { icon: '✨', name: 'Other' },
];

export default function CreateStore() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('Fashion');
  const [form, setForm] = useState({ name: '', tagline: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' };
  const blockHeadStyle = { padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'var(--bg2)' };

  const handleCreate = async () => {
    if (!address || !isConnected) { setError('Please connect your wallet'); return; }
    if (!form.name) { setError('Please enter a store name'); return; }
    setLoading(true);
    setError('');
    try {
      const existing = await getStoreByWallet(address);
      if (existing) {
        setError('You already have a store. Delete your existing store first to create a new one.');
        setLoading(false);
        return;
      }
      const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await saveStore({
        owner_wallet: address,
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        category: selectedCat,
        slug: `${slug}-${address.slice(2, 6)}`,
      });
      router.push('/profile');
    } catch (e) {
      setError('Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '7rem 2.5rem 4rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} /> Arc Testnet
          </div>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '0.5rem' }}>
          LAUNCH<br />YOUR STORE
        </div>
        <p style={{ color: 'var(--muted)', marginBottom: '3rem', fontSize: '0.9rem', fontWeight: 300 }}>
          Set up in 2 minutes. Start selling globally, instantly.
        </p>

        <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={blockHeadStyle}>Store Identity</div>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Store name *</label>
              <input type="text" placeholder="e.g. Nour Atelier" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Tagline</label>
              <input type="text" placeholder="One line about what you sell" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea placeholder="Tell buyers what makes your store special..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={blockHeadStyle}>Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {categories.map(cat => (
              <div key={cat.name} onClick={() => setSelectedCat(cat.name)} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', cursor: 'pointer', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: selectedCat === cat.name ? 'var(--accent)' : 'transparent', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: selectedCat === cat.name ? '#fff' : 'var(--muted)' }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <div style={blockHeadStyle}>Payment</div>
          <div style={{ padding: '1.25rem' }}>
            <label style={labelStyle}>Wallet (receives USDC payments)</label>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)} · Arc Testnet` : 'Connect your wallet'}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ border: '1px solid rgba(232,80,80,0.3)', background: 'rgba(232,80,80,0.08)', padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#e85050', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button onClick={handleCreate} disabled={loading} style={{ width: '100%', background: loading ? 'var(--muted)' : 'var(--accent)', color: '#fff', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Deploying...' : 'Deploy Store on Arc →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', cursor: 'pointer' }} onClick={() => router.push('/profile')}>
          ← Back to Profile
        </div>
      </div>
    </main>
  );
}