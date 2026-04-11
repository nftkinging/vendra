'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const { address } = useAccount();
  const router = useRouter();
  const [step, setStep] = useState<'choose' | 'seller' | 'buyer'>('choose');
  const [role, setRole] = useState<'seller' | 'buyer' | 'both' | null>(null);
  const [form, setForm] = useState({ name: '', bio: '', storeName: '', category: '' });

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleSubmit = () => {
    if (role === 'seller' || role === 'both') {
      router.push('/dashboard');
    } else {
      router.push('/marketplace');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />

      {/* STEP 1: Choose role */}
      {step === 'choose' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 3rem', background: 'radial-gradient(ellipse at 25% 60%, rgba(201,77,122,0.1), transparent 55%), radial-gradient(ellipse at 75% 40%, rgba(124,58,237,0.1), transparent 55%)' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Welcome to Vendra</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,6vw,4rem)', textAlign: 'center', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>How do you want<br />to use Vendra?</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', textAlign: 'center', fontWeight: 300, marginBottom: '3rem' }}>Choose your path — you can always add the other role later</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', width: '100%', maxWidth: 860, background: 'var(--border)' }}>
            {/* SELLER */}
            <div onClick={() => { setRole('seller'); setStep('seller'); }} style={{ padding: '2.5rem', background: 'var(--bg2)', cursor: 'pointer', transition: 'background 0.2s', borderTop: '2px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderTopColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderTopColor = 'transparent'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>🏪</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>For creators & businesses</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.03em', marginBottom: '0.75rem' }}>I want to Sell</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>Launch your store, list products, and get paid instantly in USDC with zero platform fees.</div>
              {['Store creation & management', 'Product listings & inventory', 'Real-time earnings dashboard', 'Instant USDC settlement'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>{f}</span>
                </div>
              ))}
              <div style={{ marginTop: '2rem', background: 'var(--accent)', color: '#fff', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                Launch My Store →
              </div>
            </div>

            {/* BUYER */}
            <div onClick={() => { setRole('buyer'); setStep('buyer'); }} style={{ padding: '2.5rem', background: 'var(--bg2)', cursor: 'pointer', transition: 'background 0.2s', borderTop: '2px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderTopColor = '#7c3aed'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderTopColor = 'transparent'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>🛍️</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>For shoppers & collectors</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.03em', marginBottom: '0.75rem' }}>I want to Shop</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>Discover unique stores, buy physical goods, digital files and services — all in USDC.</div>
              {['Browse the full marketplace', 'Order history & tracking', 'Wishlist & saved stores', 'Spending summary'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>{f}</span>
                </div>
              ))}
              <div style={{ marginTop: '2rem', background: '#7c3aed', color: '#fff', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                Start Shopping →
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textAlign: 'center' }}>
            Want both? <span style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setRole('both'); setStep('seller'); }}>Set up both roles →</span>
          </div>
        </div>
      )}

      {/* STEP 2A: SELLER FORM */}
      {step === 'seller' && (
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--accent)', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>🏪 Seller Account</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>SET UP YOUR<br />SELLER PROFILE</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300 }}>Tell buyers who you are — takes 60 seconds</div>
          </div>

          <div style={{ border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg3)' }}>Your identity</div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', flexShrink: 0 }}>
                  {form.name ? form.name.slice(0, 2).toUpperCase() : 'VN'}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                  Auto-generated from wallet<br /><span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Upload custom image →</span>
                </div>
              </div>
              {[['Display name', 'name', 'e.g. Kwame Ventures', 'text'], ['Bio', 'bio', 'What do you sell? Where are you based?', 'text']].map(([label, key, ph, type]) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Connected wallet</label>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--accent)', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>{short} · Arc Testnet</div>
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg3)' }}>Store preference</div>
            <div style={{ padding: '1.25rem' }}>
              {[['What will you sell?', 'category', 'e.g. Digital art, fashion, services...'], ['Store name', 'storeName', 'e.g. Nour Atelier']].map(([label, key, ph]) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                  <input type="text" placeholder={ph} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.15em', cursor: 'pointer', marginTop: '0.5rem' }}>
            Create Seller Profile →
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', cursor: 'pointer' }} onClick={() => setStep('choose')}>
            ← Back · or <span style={{ color: 'var(--accent)', textDecoration: 'underline' }} onClick={() => setStep('buyer')}>set up as buyer instead</span>
          </div>
        </div>
      )}

      {/* STEP 2B: BUYER FORM */}
      {step === 'buyer' && (
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #7c3aed', padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>🛍️ Buyer Account</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>SET UP YOUR<br />BUYER PROFILE</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300 }}>Personalize your shopping experience</div>
          </div>

          <div style={{ border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg3)' }}>Your identity</div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', flexShrink: 0 }}>
                  {form.name ? form.name.slice(0, 2).toUpperCase() : 'VN'}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                  Auto-generated from wallet<br /><span style={{ color: '#a78bfa', cursor: 'pointer' }}>Upload custom image →</span>
                </div>
              </div>
              {[['Display name', 'name', 'e.g. Kwame'], ['Bio (optional)', 'bio', 'A little about yourself...']].map(([label, key, ph]) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
                  <input type="text" placeholder={ph} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Connected wallet</label>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: '#a78bfa', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>{short} · Arc Testnet</div>
              </div>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg3)' }}>Shopping preferences</div>
            <div style={{ padding: '1.25rem' }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Interested in</label>
              <input type="text" placeholder="e.g. Fashion, Digital, Art..." value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
            </div>
          </div>

          <button onClick={handleSubmit} style={{ width: '100%', background: '#7c3aed', color: '#fff', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.15em', cursor: 'pointer', marginTop: '0.5rem' }}>
            Create Buyer Profile →
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', cursor: 'pointer' }} onClick={() => setStep('choose')}>
            ← Back · or <span style={{ color: '#a78bfa', textDecoration: 'underline' }} onClick={e => { e.stopPropagation(); setStep('seller'); }}>set up as seller instead</span>
          </div>
        </div>
      )}
    </main>
  );
}