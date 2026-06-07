/* ============================================================
   batch19_editprofile.js  —  Vendra v4, Batch 19 (edit profile)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch19_editprofile.js
   ------------------------------------------------------------
   - rewrites app/edit-profile/page.tsx in the v4 light look
   - reuses the ob-* form styles from Batch 18 (run that first)
   - keeps ALL logic: getProfile prefill, avatar change, handleSave
     (keeps existing avatar unless a new file is chosen), timed
     success message, Suspense wrapper, loading state
   - appends ob-success + ob-backlink styles (idempotent)
   Backs up the page once.
   NOTE: requires the ob-* styles from batch18_onboarding.js.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const pagePath = path.join(root, 'app', 'edit-profile', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(pagePath)) { console.error('\n  x  app/edit-profile/page.tsx not found. Run from project root.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }
if (!fs.readFileSync(cssPath, 'utf8').includes('V4 ONBOARDING STYLES')) {
  console.warn('  !  Warning: onboarding (ob-*) styles not found in globals.css. Run node batch18_onboarding.js first, or the form will be unstyled.');
}

const PAGE = [
"'use client';",
"import Nav from '../Nav';",
"import { useState, useEffect, useRef, Suspense } from 'react';",
"import { useAccount } from 'wagmi';",
"import { useSearchParams } from 'next/navigation';",
"import { getProfile, saveProfile, uploadAvatar } from '../lib/supabase';",
"import Link from 'next/link';",
"",
"function EditProfileContent() {",
"  const { address } = useAccount();",
"  const params = useSearchParams();",
"  const role = (params.get('role') || 'buyer') as 'buyer'|'seller';",
"  const avatarRef = useRef<HTMLInputElement>(null);",
"  const [form, setForm] = useState({ display_name: '', bio: '', x_handle: '' });",
"  const [avatarFile, setAvatarFile] = useState<File|null>(null);",
"  const [avatarPreview, setAvatarPreview] = useState('');",
"  const [loading, setLoading] = useState(true);",
"  const [saving, setSaving] = useState(false);",
"  const [error, setError] = useState('');",
"  const [success, setSuccess] = useState('');",
"",
"  useEffect(() => {",
"    if (!address) return;",
"    getProfile(address, role).then(p => {",
"      if (p) { setForm({ display_name: p.display_name || '', bio: p.bio || '', x_handle: p.x_handle || '' }); setAvatarPreview(p.avatar_url || ''); }",
"      setLoading(false);",
"    });",
"  }, [address, role]);",
"",
"  const handleSave = async () => {",
"    if (!address) return;",
"    if (!form.display_name) { setError('Display name required'); return; }",
"    setSaving(true); setError(''); setSuccess('');",
"    try {",
"      let avatar_url = avatarPreview;",
"      if (avatarFile) avatar_url = await uploadAvatar(address, avatarFile);",
"      await saveProfile({ wallet_address: address, role, display_name: form.display_name, bio: form.bio, avatar_url, x_handle: form.x_handle });",
"      setSuccess('Profile updated!'); setTimeout(() => setSuccess(''), 2500);",
"    } catch (e:any) { setError(e?.message || 'Something went wrong'); }",
"    finally { setSaving(false); }",
"  };",
"",
"  if (loading) return <main className='v4home' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Nav theme='v4' /><div className='v4spinner' /></main>;",
"",
"  return (",
"    <main className='v4home' style={{ minHeight: '100vh' }}>",
"      <Nav theme='v4' />",
"      <div className='ob-wrap'>",
"        <p className='eyebrow'>Edit {role === 'seller' ? 'Seller' : 'Buyer'} profile</p>",
"        <h1 className='ob-title' style={{ marginBottom: 28 }}>Update your <span className='v4amber'>profile</span></h1>",
"        <div className='ob-avatar-row'>",
"          <div onClick={() => avatarRef.current?.click()} className='ob-avatar'>",
"            {avatarPreview ? <img src={avatarPreview} alt='avatar' /> : <div><div className='ob-avatar-ic'>\uD83D\uDCF7</div><div className='ob-avatar-cap'>Change</div></div>}",
"          </div>",
"          <input ref={avatarRef} type='file' accept='image/*' onChange={e => { const f = e.target.files?.[0]; if (!f) return; setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }} style={{ display: 'none' }} />",
"          <div style={{ flex: 1 }}><div className='ob-avatar-d'>Click to change your profile photo.</div></div>",
"        </div>",
"        <div className='ob-card'>",
"          <div className='ob-card-head'>Profile info</div>",
"          <div className='ob-card-body'>",
"            <div className='ob-field'><label className='ob-label'>Display name *</label><input className='ob-input' value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} /></div>",
"            <div className='ob-field'><label className='ob-label'>Bio</label><textarea className='ob-textarea' value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>",
"            <div className='ob-field last'><label className='ob-label'>X (Twitter) handle</label><input className='ob-input' placeholder='@yourhandle' value={form.x_handle} onChange={e => setForm({ ...form, x_handle: e.target.value })} /></div>",
"          </div>",
"        </div>",
"        {error && <div className='ob-error'>{error}</div>}",
"        {success && <div className='ob-success'>{success}</div>}",
"        <button onClick={handleSave} disabled={saving} className='v4btn v4btn-amber ob-cta'>{saving ? 'Saving\u2026' : 'Save changes \u2192'}</button>",
"        <div style={{ textAlign: 'center' }}><Link href='/profile' className='ob-backlink'>\u2190 Back to profile</Link></div>",
"      </div>",
"    </main>",
"  );",
"}",
"",
"export default function EditProfile() {",
"  return <Suspense><EditProfileContent /></Suspense>;",
"}",
""
].join("\n");

if (!fs.existsSync(pagePath + '.v3bak')) { fs.copyFileSync(pagePath, pagePath + '.v3bak'); console.log('  .  backup -> app/edit-profile/page.tsx.v3bak'); }
fs.writeFileSync(pagePath, PAGE, 'utf8');
console.log('  +  app/edit-profile/page.tsx rewritten in v4 (logic unchanged)');

const MARK = '/* === V4 EDIT-PROFILE STYLES === */';
const CSS = [
MARK,
".v4home .ob-success{border:1px solid rgba(123,176,130,.4);background:rgba(123,176,130,.10);border-radius:10px;padding:11px 16px;font-size:13px;color:#3F7A47;margin-bottom:16px;}",
".v4home .ob-backlink{display:inline-block;margin-top:14px;font-size:12px;color:var(--v4-tx40);text-decoration:none;}",
".v4home .ob-backlink:hover{color:var(--v4-ink);}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 edit-profile styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev -> open /edit-profile?role=buyer. Then git push.\n');
