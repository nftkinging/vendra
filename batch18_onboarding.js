/* ============================================================
   batch18_onboarding.js  —  Vendra v4, Batch 18 (onboarding)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch18_onboarding.js
   ------------------------------------------------------------
   - rewrites app/onboarding/page.tsx in the v4 light look
   - keeps ALL logic: role/step state machine, handleAvatar,
     handleSave (uploadAvatar + saveProfile), Suspense wrapper,
     role-conditional finish actions, error handling
   - appends v4 onboarding styles (ob-*) to globals.css (idempotent)
   Backs up the page once.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const pagePath = path.join(root, 'app', 'onboarding', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(pagePath)) { console.error('\n  x  app/onboarding/page.tsx not found. Run from project root.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }

const PAGE = [
"'use client';",
"import Nav from '../Nav';",
"import { useState, useRef, Suspense } from 'react';",
"import { useAccount } from 'wagmi';",
"import { useRouter, useSearchParams } from 'next/navigation';",
"import { saveProfile, uploadAvatar } from '../lib/supabase';",
"import Link from 'next/link';",
"",
"function OnboardingContent() {",
"  const { address, isConnected } = useAccount();",
"  const router = useRouter();",
"  const params = useSearchParams();",
"  const avatarRef = useRef<HTMLInputElement>(null);",
"  const [role, setRole] = useState<'buyer'|'seller'>(params.get('role') === 'seller' ? 'seller' : 'buyer');",
"  const [step, setStep] = useState<'role'|'profile'|'done'>('role');",
"  const [form, setForm] = useState({ display_name: '', bio: '', x_handle: '' });",
"  const [avatarFile, setAvatarFile] = useState<File|null>(null);",
"  const [avatarPreview, setAvatarPreview] = useState('');",
"  const [loading, setLoading] = useState(false);",
"  const [error, setError] = useState('');",
"",
"  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {",
"    const f = e.target.files?.[0]; if (!f) return;",
"    setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f));",
"  };",
"",
"  const handleSave = async () => {",
"    if (!address || !isConnected) { setError('Please connect your wallet'); return; }",
"    if (!form.display_name) { setError('Display name is required'); return; }",
"    setLoading(true); setError('');",
"    try {",
"      let avatar_url = '';",
"      if (avatarFile) avatar_url = await uploadAvatar(address, avatarFile);",
"      await saveProfile({ wallet_address: address, role, display_name: form.display_name, bio: form.bio, avatar_url, x_handle: form.x_handle });",
"      setStep('done');",
"    } catch (e:any) { setError(e?.message || 'Something went wrong'); }",
"    finally { setLoading(false); }",
"  };",
"",
"  return (",
"    <main className='v4home' style={{ minHeight: '100vh' }}>",
"      <Nav theme='v4' />",
"      <div className='ob-wrap'>",
"        {step === 'role' && (",
"          <>",
"            <p className='eyebrow'>Welcome to Vendra</p>",
"            <h1 className='ob-title'>How will you <span className='v4amber'>use Vendra?</span></h1>",
"            <p className='lede'>You can always add both roles later from your profile.</p>",
"            <div className='ob-roles'>",
"              <div onClick={() => setRole('buyer')} className={'ob-role' + (role === 'buyer' ? ' sel' : '')}>",
"                <div className='ob-role-ic'>\uD83D\uDECD\uFE0F</div>",
"                <div className='ob-role-h'>I want to buy</div>",
"                <div className='ob-role-p'>Browse stores, discover products, pay instantly in USDC on Arc.</div>",
"              </div>",
"              <div onClick={() => setRole('seller')} className={'ob-role' + (role === 'seller' ? ' sel' : '')}>",
"                <div className='ob-role-ic'>\uD83C\uDFEA</div>",
"                <div className='ob-role-h'>I want to sell</div>",
"                <div className='ob-role-p'>Launch a store, list products, get paid directly in USDC. Zero fees.</div>",
"              </div>",
"            </div>",
"            <button onClick={() => setStep('profile')} className='v4btn v4btn-amber ob-cta'>Continue as {role === 'buyer' ? 'Buyer' : 'Seller'} \u2192</button>",
"          </>",
"        )}",
"        {step === 'profile' && (",
"          <>",
"            <p className='eyebrow'>{role === 'seller' ? 'Seller' : 'Buyer'} profile</p>",
"            <h1 className='ob-title' style={{ marginBottom: 28 }}>Set up your <span className='v4amber'>profile</span></h1>",
"            <div className='ob-avatar-row'>",
"              <div onClick={() => avatarRef.current?.click()} className='ob-avatar'>",
"                {avatarPreview ? <img src={avatarPreview} alt='avatar' /> : <div><div className='ob-avatar-ic'>\uD83D\uDCF7</div><div className='ob-avatar-cap'>Photo</div></div>}",
"              </div>",
"              <input ref={avatarRef} type='file' accept='image/*' onChange={handleAvatar} style={{ display: 'none' }} />",
"              <div style={{ flex: 1 }}>",
"                <div className='ob-avatar-l'>Profile photo</div>",
"                <div className='ob-avatar-d'>Click the circle to upload. Optional but recommended.</div>",
"              </div>",
"            </div>",
"            <div className='ob-card'>",
"              <div className='ob-card-head'>Profile info</div>",
"              <div className='ob-card-body'>",
"                <div className='ob-field'><label className='ob-label'>Display name *</label><input className='ob-input' placeholder='Your name or handle' value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} /></div>",
"                <div className='ob-field'><label className='ob-label'>Bio</label><textarea className='ob-textarea' placeholder='Tell the Vendra community about yourself...' value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>",
"                <div className='ob-field last'><label className='ob-label'>X (Twitter) handle</label><input className='ob-input' placeholder='@yourhandle' value={form.x_handle} onChange={e => setForm({ ...form, x_handle: e.target.value })} /></div>",
"              </div>",
"            </div>",
"            <div className='ob-note'><span className='ob-note-dot' /><span>Your profile is linked to your wallet via ERC-8004 onchain identity.</span></div>",
"            {error && <div className='ob-error'>{error}</div>}",
"            <button onClick={handleSave} disabled={loading} className='v4btn v4btn-amber ob-cta'>{loading ? 'Saving\u2026' : 'Create profile \u2192'}</button>",
"            <button onClick={() => setStep('role')} className='ob-back'>\u2190 Back</button>",
"          </>",
"        )}",
"        {step === 'done' && (",
"          <div className='ob-done'>",
"            <div className='ob-tick'>\u2713</div>",
"            <div className='ob-done-h'>Profile created</div>",
"            <div className='ob-done-p'>Welcome to Vendra, {form.display_name}.</div>",
"            <div className='ob-done-actions'>",
"              {role === 'seller' ? (<><Link href='/store/create' className='v4btn v4btn-amber'>Create my store \u2192</Link><Link href='/marketplace' className='v4btn v4btn-ghost'>Explore first</Link></>) : (<><Link href='/marketplace' className='v4btn v4btn-amber'>Browse marketplace \u2192</Link><Link href='/profile' className='v4btn v4btn-ghost'>View profile</Link></>)}",
"            </div>",
"          </div>",
"        )}",
"      </div>",
"    </main>",
"  );",
"}",
"",
"export default function Onboarding() {",
"  return <Suspense><OnboardingContent /></Suspense>;",
"}",
""
].join("\n");

if (!fs.existsSync(pagePath + '.v3bak')) { fs.copyFileSync(pagePath, pagePath + '.v3bak'); console.log('  .  backup -> app/onboarding/page.tsx.v3bak'); }
fs.writeFileSync(pagePath, PAGE, 'utf8');
console.log('  +  app/onboarding/page.tsx rewritten in v4 (logic unchanged)');

const MARK = '/* === V4 ONBOARDING STYLES === */';
const CSS = [
MARK,
".v4home .ob-wrap{max-width:560px;margin:0 auto;padding:120px 40px 80px;}",
".v4home .ob-title{font-size:clamp(34px,5vw,58px);font-weight:600;letter-spacing:-.02em;line-height:1;margin-bottom:12px;}",
".v4home .ob-roles{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:30px 0;}",
".v4home .ob-role{background:var(--v4-card);border:1px solid var(--v4-line);border-radius:16px;padding:26px 22px;cursor:pointer;transition:.2s;}",
".v4home .ob-role:hover{border-color:var(--v4-line2);}",
".v4home .ob-role.sel{border-color:var(--v4-a);background:var(--v4-aSoft);box-shadow:inset 0 0 0 1px var(--v4-a);}",
".v4home .ob-role-ic{font-size:30px;margin-bottom:12px;}",
".v4home .ob-role-h{font-size:19px;font-weight:600;letter-spacing:-.01em;margin-bottom:8px;}",
".v4home .ob-role.sel .ob-role-h{color:var(--v4-aDeep);}",
".v4home .ob-role-p{font-size:12.5px;color:var(--v4-tx60);line-height:1.6;}",
".v4home .ob-avatar-row{display:flex;align-items:center;gap:18px;margin-bottom:26px;}",
".v4home .ob-avatar{width:72px;height:72px;border-radius:50%;border:1px dashed var(--v4-line2);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;background:var(--v4-paper2);flex-shrink:0;transition:border-color .25s;}",
".v4home .ob-avatar:hover{border-color:var(--v4-a);}",
".v4home .ob-avatar img{width:100%;height:100%;object-fit:cover;}",
".v4home .ob-avatar-ic{font-size:22px;text-align:center;}",
".v4home .ob-avatar-cap{font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--v4-tx40);margin-top:4px;font-weight:600;text-align:center;}",
".v4home .ob-avatar-l{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--v4-tx40);margin-bottom:4px;}",
".v4home .ob-avatar-d{font-size:12.5px;color:var(--v4-tx60);line-height:1.55;}",
".v4home .ob-card{background:var(--v4-card);border:1px solid var(--v4-line);border-radius:16px;overflow:hidden;margin-bottom:20px;}",
".v4home .ob-card-head{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--v4-tx40);padding:14px 20px;border-bottom:1px solid var(--v4-line);}",
".v4home .ob-card-body{padding:20px;}",
".v4home .ob-field{margin-bottom:16px;}",
".v4home .ob-field.last{margin-bottom:0;}",
".v4home .ob-label{display:block;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--v4-tx60);margin-bottom:7px;}",
".v4home .ob-input,.v4home .ob-textarea{width:100%;background:var(--v4-paper);border:1px solid var(--v4-line2);border-radius:10px;padding:12px 14px;font-size:14px;color:var(--v4-tx);font-family:inherit;transition:border-color .2s;box-sizing:border-box;}",
".v4home .ob-input:focus,.v4home .ob-textarea:focus{outline:none;border-color:var(--v4-a);}",
".v4home .ob-input::placeholder,.v4home .ob-textarea::placeholder{color:var(--v4-tx40);}",
".v4home .ob-textarea{min-height:84px;resize:vertical;line-height:1.5;}",
".v4home .ob-note{display:flex;align-items:flex-start;gap:10px;border:1px solid var(--v4-line);border-radius:12px;padding:13px 16px;margin-bottom:20px;font-size:12px;color:var(--v4-tx60);line-height:1.6;background:var(--v4-card);}",
".v4home .ob-note-dot{width:7px;height:7px;border-radius:50%;background:var(--v4-a);box-shadow:0 0 6px var(--v4-a);flex-shrink:0;margin-top:5px;}",
".v4home .ob-error{border:1px solid rgba(192,57,43,.3);background:rgba(192,57,43,.08);border-radius:10px;padding:11px 16px;font-size:13px;color:#C0392B;margin-bottom:16px;}",
".v4home .ob-cta{width:100%;justify-content:center;padding:16px;font-size:15px;}",
".v4home .ob-back{display:block;margin:14px auto 0;background:transparent;border:none;cursor:pointer;font-size:12px;color:var(--v4-tx40);}",
".v4home .ob-back:hover{color:var(--v4-ink);}",
".v4home .ob-done{text-align:center;padding-top:20px;}",
".v4home .ob-tick{font-size:64px;color:#3F7A47;line-height:1;margin-bottom:16px;}",
".v4home .ob-done-h{font-size:clamp(30px,5vw,48px);font-weight:600;letter-spacing:-.02em;margin-bottom:12px;}",
".v4home .ob-done-p{font-size:14px;color:var(--v4-tx60);margin-bottom:32px;}",
".v4home .ob-done-actions{display:flex;flex-direction:column;gap:12px;max-width:280px;margin:0 auto;}",
"@media(max-width:560px){.v4home .ob-roles{grid-template-columns:1fr;}.v4home .ob-wrap{padding-left:24px;padding-right:24px;}}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 onboarding styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev -> open /onboarding. Then git push.\n');
