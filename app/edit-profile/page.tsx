'use client';
import Nav from '../Nav';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllProfiles, saveProfile, uploadAvatar } from '../lib/supabase';

function EditProfileContent() {
  const { address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'seller';

  const [activeRole, setActiveRole] = useState<'seller' | 'buyer'>(defaultRole as 'seller' | 'buyer');
  const [hasSeller, setHasSeller] = useState(false);
  const [hasBuyer, setHasBuyer] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', category: '', xHandle: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!address) return;
    const load = async () => {
      const profiles = await getAllProfiles(address);
      const sp = profiles.find((p: any) => p.role === 'seller');
      const bp = profiles.find((p: any) => p.role === 'buyer');
      setHasSeller(!!sp);
      setHasBuyer(!!bp);
      const active = activeRole === 'seller' ? sp : bp;
      if (active) {
        setForm({
          name: active.display_name || '',
          bio: active.bio || '',
          category: active.category || '',
          xHandle: active.x_handle || '',
        });
        setCurrentAvatar(active.avatar_url || '');
        setAvatarPreview(active.avatar_url || '');
      }
      setLoading(false);
    };
    load();
  }, [address, activeRole]);

  const switchRole = async (role: 'seller' | 'buyer') => {
    if (!address) return;
    setActiveRole(role);
    setLoading(true);
    const profiles = await getAllProfiles(address);
    const p = profiles.find((pr: any) => pr.role === role);
    if (p) {
      setForm({ name: p.display_name || '', bio: p.bio || '', category: p.category || '', xHandle: p.x_handle || '' });
      setCurrentAvatar(p.avatar_url || '');
      setAvatarPreview(p.avatar_url || '');
    } else {
      setForm({ name: '', bio: '', category: '', xHandle: '' });
      setCurrentAvatar('');
      setAvatarPreview('');
    }
    setLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!address) { setError('Please connect your wallet'); return; }
    if (!form.name) { setError('Display name is required'); return; }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      let avatarUrl = currentAvatar;
      if (avatarFile) avatarUrl = await uploadAvatar(address, avatarFile);
      await saveProfile({
        wallet_address: address,
        role: activeRole,
        display_name: form.name,
        bio: form.bio,
        avatar_url: avatarUrl,
        category: form.category,
        x_handle: form.xHandle,
      });
      setSuccess('Profile saved successfully!');
      setTimeout(() => router.push('/profile'), 1500);
    } catch (e) {
      setError('Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const isSeller = activeRole === 'seller';
  const accentColor = isSeller ? 'var(--accent)' : '#7c3aed';
  const accentLight = isSeller ? 'var(--accent)' : '#a78bfa';
  const initials = form.name ? form.name.slice(0, 2).toUpperCase() : address?.slice(2, 4).toUpperCase() || 'VN';
  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' };
  const blockHeadStyle = { padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'var(--bg3)' };

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading profile...</div>
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>EDIT PROFILE</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300 }}>Update your info anytime</div>
        </div>

        {/* Role switcher */}
        {(hasSeller || hasBuyer) && (
          <div style={{ display: 'flex', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            {hasSeller && (
              <button onClick={() => switchRole('seller')} style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.65rem', border: 'none', cursor: 'pointer', background: activeRole === 'seller' ? 'var(--accent)' : 'transparent', color: activeRole === 'seller' ? '#fff' : 'var(--muted)', transition: 'all 0.2s' }}>
                🏪 Seller Profile
              </button>
            )}
            {hasBuyer && (
              <button onClick={() => switchRole('buyer')} style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.65rem', border: 'none', cursor: 'pointer', background: activeRole === 'buyer' ? '#7c3aed' : 'transparent', color: activeRole === 'buyer' ? '#fff' : 'var(--muted)', transition: 'all 0.2s' }}>
                🛍️ Buyer Profile
              </button>
            )}
          </div>
        )}

        {/* Identity block */}
        <div style={{ border: '1px solid var(--border)', marginBottom: '1rem' }}>
          <div style={blockHeadStyle}>
            {isSeller ? '🏪 Seller Identity' : '🛍️ Buyer Identity'}
          </div>
          <div style={{ padding: '1.25rem' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div onClick={() => fileRef.current?.click()} style={{ width: 72, height: 72, borderRadius: '50%', background: isSeller ? 'linear-gradient(135deg, var(--accent), #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', flexShrink: 0, cursor: 'pointer', overflow: 'hidden', border: '2px solid var(--border2)' }}>
                {avatarPreview ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{initials}</span>}
              </div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.06em', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                  {avatarPreview && avatarPreview !== currentAvatar ? 'New photo selected' : avatarPreview ? 'Current photo' : 'No photo set'}
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ background: 'transparent', border: `1px solid ${accentColor}`, color: accentLight, padding: '0.35rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  {avatarPreview ? 'Change Photo' : 'Upload Photo'}
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
            {!isSeller && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Interested in</label>
                <input type="text" placeholder="e.g. Fashion, Digital, Art..." value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>Connected wallet</label>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: accentLight, padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                {short} · Arc Testnet
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ border: '1px solid rgba(232,80,80,0.3)', background: 'rgba(232,80,80,0.08)', padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#e85050', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ border: '1px solid rgba(80,200,80,0.3)', background: 'rgba(80,200,80,0.08)', padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#50c850', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            {success}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: saving ? 'var(--muted)' : accentColor, color: '#fff', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.15em', cursor: saving ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
          {saving ? 'Saving...' : 'Save Changes →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', cursor: 'pointer' }} onClick={() => router.push('/profile')}>
          ← Back to Profile
        </div>
      </div>
    </main>
  );
}

export default function EditProfile() {
  return (
    <Suspense>
      <EditProfileContent />
    </Suspense>
  );
}