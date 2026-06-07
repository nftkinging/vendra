'use client';
import Nav from '../Nav';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { getProfile, saveProfile, uploadAvatar } from '../lib/supabase';
import Link from 'next/link';

function EditProfileContent() {
  const { address } = useAccount();
  const params = useSearchParams();
  const role = (params.get('role') || 'buyer') as 'buyer'|'seller';
  const avatarRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ display_name: '', bio: '', x_handle: '' });
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!address) return;
    getProfile(address, role).then(p => {
      if (p) { setForm({ display_name: p.display_name || '', bio: p.bio || '', x_handle: p.x_handle || '' }); setAvatarPreview(p.avatar_url || ''); }
      setLoading(false);
    });
  }, [address, role]);

  const handleSave = async () => {
    if (!address) return;
    if (!form.display_name) { setError('Display name required'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      let avatar_url = avatarPreview;
      if (avatarFile) avatar_url = await uploadAvatar(address, avatarFile);
      await saveProfile({ wallet_address: address, role, display_name: form.display_name, bio: form.bio, avatar_url, x_handle: form.x_handle });
      setSuccess('Profile updated!'); setTimeout(() => setSuccess(''), 2500);
    } catch (e:any) { setError(e?.message || 'Something went wrong'); }
    finally { setSaving(false); }
  };

  if (loading) return <main className='v4home' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Nav theme='v4' /><div className='v4spinner' /></main>;

  return (
    <main className='v4home' style={{ minHeight: '100vh' }}>
      <Nav theme='v4' />
      <div className='ob-wrap'>
        <p className='eyebrow'>Edit {role === 'seller' ? 'Seller' : 'Buyer'} profile</p>
        <h1 className='ob-title' style={{ marginBottom: 28 }}>Update your <span className='v4amber'>profile</span></h1>
        <div className='ob-avatar-row'>
          <div onClick={() => avatarRef.current?.click()} className='ob-avatar'>
            {avatarPreview ? <img src={avatarPreview} alt='avatar' /> : <div><div className='ob-avatar-ic'>📷</div><div className='ob-avatar-cap'>Change</div></div>}
          </div>
          <input ref={avatarRef} type='file' accept='image/*' onChange={e => { const f = e.target.files?.[0]; if (!f) return; setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }} style={{ display: 'none' }} />
          <div style={{ flex: 1 }}><div className='ob-avatar-d'>Click to change your profile photo.</div></div>
        </div>
        <div className='ob-card'>
          <div className='ob-card-head'>Profile info</div>
          <div className='ob-card-body'>
            <div className='ob-field'><label className='ob-label'>Display name *</label><input className='ob-input' value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} /></div>
            <div className='ob-field'><label className='ob-label'>Bio</label><textarea className='ob-textarea' value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
            <div className='ob-field last'><label className='ob-label'>X (Twitter) handle</label><input className='ob-input' placeholder='@yourhandle' value={form.x_handle} onChange={e => setForm({ ...form, x_handle: e.target.value })} /></div>
          </div>
        </div>
        {error && <div className='ob-error'>{error}</div>}
        {success && <div className='ob-success'>{success}</div>}
        <button onClick={handleSave} disabled={saving} className='v4btn v4btn-amber ob-cta'>{saving ? 'Saving…' : 'Save changes →'}</button>
        <div style={{ textAlign: 'center' }}><Link href='/profile' className='ob-backlink'>← Back to profile</Link></div>
      </div>
    </main>
  );
}

export default function EditProfile() {
  return <Suspense><EditProfileContent /></Suspense>;
}
