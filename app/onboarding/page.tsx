'use client';
import Nav from '../Nav';
import { useState, useRef, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveProfile, uploadAvatar } from '../lib/supabase';

function OnboardingContent() {
  const { address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetRole = searchParams.get('role');

  const [step, setStep] = useState<'choose' | 'seller' | 'buyer'>(
    presetRole === 'seller' ? 'seller' : presetRole === 'buyer' ? 'buyer' : 'choose'
  );
  const [form, setForm] = useState({ name: '', bio: '', category: '', xHandle: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const initials = form.name ? form.name.slice(0, 2).toUpperCase() : address ? address.slice(2, 4).toUpperCase() : 'VN';
  const isSeller = step === 'seller';
  const accentColor = isSeller ? 'var(--accent)' : '#7c3aed';
  const accentLight = isSeller ? 'var(--accent)' : '#a78bfa';

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!address) { setError('Please connect your wallet first'); return; }
    if (!form.name) { setError('Please enter a display name'); return; }
    setLoading(true);
    setError('');
    try {
      let avatarUrl = '';
      if (avatarFile) avatarUrl = await uploadAvatar(address, avatarFile);
      await saveProfile({
        wallet_address: address,
        role: isSeller ? 'seller' : 'buyer',
        display_name: form.name,
        bio: form.bio,
        avatar_url: avatarUrl,
        category: form.category,
        x_handle: form.xHandle,
      });
      router.push('/profile');
    } catch (e) {
      setError('Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' };
  const blockHeadStyle = { padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'var(--bg3)' };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />

      {step === 'choose' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 3rem', background: 'radial-gradient(ellipse at 25% 60%, rgba(201,77,122,0.1), transparent 55%), radial-gradient(ellipse at 75% 40%, rgba(124,58,237,0.1), transparent 55%)' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Welcome to Vendra</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem,6vw,4rem)', textAlign: 'center', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>How do you want<br />to use Vendra?</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', textAlign: 'center', fontWeight: 300, marginBottom: '3rem' }}>Choose your path — you can always add the other role later</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', width: '100%', maxWidth: 860, background: 'var(--border)' }}>
            {[
              { id: 'seller', icon: '🏪', label: 'For creators & businesses', title: 'I want to Sell', color: 'var(--accent)', desc: 'Launch your store, list products, and get paid instantly in USDC with zero platform fees.', features: ['Store creation & management', 'Product listings & inventory', 'Real-time earnings dashboard', 'Instant USDC settlement'], cta: 'Launch My Store →' },
              { id: 'buyer', icon: '🛍️', label: 'For shoppers & collectors', title: 'I want to Shop', color: '#7c3aed', desc: 'Discover unique stores, buy physical goods, digital files and services — all in USDC.', features: ['Browse the full marketplace', 'Order history & tracking', 'Wishlist & saved stores', 'Spending summary'], cta: 'Start Shopping →' },
            ].map(p => (
              <div key={p.id} onClick={() => { setStep(p.id as 'seller' | 'buyer'); }} style={{ padding: '2.5rem', background: 'var(--bg2)', cursor: 'pointer', borderTop: '2px solid transparent', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderTopColor = p.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderTopColor = 'transparent'; }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{p.icon}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.label}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.03em', marginBottom: '0.75rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '1.5rem' }}>{p.desc}</div>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>{f}</span>
                  </div>
                ))}
                <div style={{ marginTop: '2rem', background: p.color, color: '#fff', padding: '0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>{p.cta}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textAlign: 'center' }}>
            Want both?{' '}<span style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setStep('seller')}>Set up both roles →</span>
          </div>
        </div>
      )}

      {(step === 'seller' || step === 'buyer') && (
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: `1px solid ${accentColor}`, padding: '0.25rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: accentLight, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {isSeller ? '🏪 Seller Account' : '🛍️ Buyer Account'}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
              {isSeller ? 'SELLER PROFILE' : 'BUYER PROFILE'}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300 }}>
              {isSeller ? 'Tell buyers who you are — takes 60 seconds' : 'Personalize your shopping experience'}
            </div>
          </div>

          <div style={{ border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={blockHeadStyle}>Your identity</div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div onClick={() => fileRef.current?.click()} style={{ width: 72, height: 72, borderRadius: '50%', background: isSeller ? 'linear-gradient(135deg, var(--accent), #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', flexShrink: 0, cursor: 'pointer', overflow: 'hidden', border: '2px solid var(--border2)' }}>
                  {avatarPreview ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{initials}</span>}
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    {avatarPreview ? 'Looking good! Click to change' : 'Auto-generated from wallet'}
                  </div>
                  <button onClick={() => fileRef.current?.click()} style={{ background: 'transparent', border: `1px solid ${accentColor}`, color: accentLight, padding: '0.35rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Upload Photo
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Display name *</label>
                <input type="text" placeholder={isSeller ? 'e.g. Kwame Ventures' : 'e.g. Kwame'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Bio</label>
                <input type="text" placeholder={isSeller ? 'What do you sell? Where are you based?' : 'A little about yourself...'} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>X (Twitter) handle</label>
                <input type="text" placeholder="@yourhandle" value={form.xHandle} onChange={e => setForm({ ...form, xHandle: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Connected wallet</label>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: accentLight, padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  {short} · Arc Testnet
                </div>
              </div>
            </div>
          </div>

          {!isSeller && (
            <div style={{ border: '1px solid var(--border)', marginBottom: '1rem' }}>
              <div style={blockHeadStyle}>Shopping preferences</div>
              <div style={{ padding: '1.25rem' }}>
                <label style={labelStyle}>Interested in</label>
                <input type="text" placeholder="e.g. Fashion, Digital, Art..." value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ border: '1px solid rgba(232,80,80,0.3)', background: 'rgba(232,80,80,0.08)', padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#e85050', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: loading ? 'var(--muted)' : accentColor, color: '#fff', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.15em', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
            {loading ? 'Saving...' : `Create ${isSeller ? 'Seller' : 'Buyer'} Profile →`}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setStep('choose')}>← Back</span>
            {' · or '}
            <span style={{ color: accentLight, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setStep(isSeller ? 'buyer' : 'seller')}>
              set up as {isSeller ? 'buyer' : 'seller'} instead
            </span>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Onboarding() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}