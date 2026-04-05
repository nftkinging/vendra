'use client';
import Link from 'next/link';
import { useState } from 'react';

const typeIcon: Record<string, string> = { Physical: '📦', Digital: '💾', Service: '🛠' };

export default function Dashboard() {
  const [products, setProducts] = useState<{ name: string; price: string; type: string }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', type: 'Physical' });

  const addProduct = () => {
    if (!form.name || !form.price) return;
    setProducts([...products, form]);
    setForm({ name: '', price: '', type: 'Physical' });
    setShowModal(false);
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2.5rem', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(240,237,232,0.85)' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.08em' }}>
          VEND<span style={{ color: 'var(--accent)' }}>R</span>A
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="/" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Explore</Link>
          <Link href="/create" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Launch Store</Link>
          <Link href="/dashboard" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Dashboard</Link>
          <button style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.55rem 1.25rem' }}>Connect Wallet</button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '7rem 2.5rem 4rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Store</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em' }}>MY VENDRA STORE</div>
            <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} /> Live · Arc Testnet
            </div>
          </div>
          <Link href="/">
            <button style={{ background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)', padding: '0.65rem 1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              View Storefront
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          {[['$0.00', 'Revenue', true], [String(products.length), 'Products', false], ['0', 'Orders', false], ['0%', 'Platform Fee', true]].map(([val, label, accent]) => (
            <div key={String(label)} style={{ padding: '1.25rem', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: accent ? 'var(--accent)' : 'var(--ink)' }}>{val}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div style={{ border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Products</div>
            <button onClick={() => setShowModal(true)} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '0.4rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              + Add Product
            </button>
          </div>
          {products.length === 0
            ? <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>No products yet — add your first one above</div>
            : products.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.2rem', width: 32, textAlign: 'center' }}>{typeIcon[p.type] || '📦'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{p.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{p.type}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'var(--accent)', letterSpacing: '0.05em' }}>${parseFloat(p.price).toFixed(2)} USDC</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,8,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '2rem', width: 420, maxWidth: '90vw' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.05em', marginBottom: '1.5rem', textAlign: 'center' }}>Add Product</div>
            {[['Product name', 'name', 'text', 'e.g. Limited Edition Print'], ['Price (USDC)', 'price', 'number', '25.00']].map(([label, key, type, ph]) => (
              <div key={key} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                <input type={type} placeholder={ph} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
              </div>
            ))}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', background: 'var(--bg)', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }}>
                <option>Physical</option><option>Digital</option><option>Service</option>
              </select>
            </div>
            <button onClick={addProduct} style={{ width: '100%', background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: 'pointer' }}>Add Product →</button>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '0.75rem' }}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}