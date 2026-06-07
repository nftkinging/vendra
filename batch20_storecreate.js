/* ============================================================
   batch20_storecreate.js  —  Vendra v4, Batch 20 (create store)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch20_storecreate.js
   ------------------------------------------------------------
   - rewrites app/store/create/page.tsx in the v4 light look
   - reuses ob-* form styles from Batch 18 (run that first)
   - keeps ALL logic: CATS/FEE/FEE_WALLET, slug + tweet derivation,
     handleBanner, handleCreate (existing-store guard -> deploy-fee
     sendTransactionAsync -> uploadImage banner -> saveStore),
     form/paying/success steps, error handling
   - appends v4 store-create styles (sc-*) to globals.css (idempotent)
   Backs up the page once.
   NOTE: requires the ob-* styles from batch18_onboarding.js.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const pagePath = path.join(root, 'app', 'store', 'create', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(pagePath)) { console.error('\n  x  app/store/create/page.tsx not found. Run from project root.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }
if (!fs.readFileSync(cssPath, 'utf8').includes('V4 ONBOARDING STYLES')) {
  console.warn('  !  Warning: onboarding (ob-*) styles not found. Run node batch18_onboarding.js first, or the form will be unstyled.');
}

const PAGE = [
"'use client';",
"import Nav from '../../Nav';",
"import { useState, useRef } from 'react';",
"import { useAccount } from 'wagmi';",
"import { useRouter } from 'next/navigation';",
"import { saveStore, getStoreByWallet, uploadImage } from '../../lib/supabase';",
"import { useSendTransaction } from 'wagmi';",
"import { parseUnits } from 'viem';",
"import Link from 'next/link';",
"",
"const CATS = [{ icon: '\uD83D\uDC57', name: 'Fashion' }, { icon: '\uD83D\uDCBE', name: 'Digital' }, { icon: '\uD83C\uDFA8', name: 'Art' }, { icon: '\uD83D\uDEE0', name: 'Services' }, { icon: '\uD83C\uDF71', name: 'Food' }, { icon: '\uD83D\uDCF1', name: 'Tech' }, { icon: '\uD83C\uDFB5', name: 'Music' }, { icon: '\u2728', name: 'Other' }];",
"const FEE = 0.5;",
"const FEE_WALLET = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as `0x${string}`;",
"",
"export default function CreateStore() {",
"  const { address, isConnected } = useAccount();",
"  const router = useRouter();",
"  const { sendTransactionAsync } = useSendTransaction();",
"  const bannerRef = useRef<HTMLInputElement>(null);",
"  const [cat, setCat] = useState('Fashion');",
"  const [form, setForm] = useState({ name: '', tagline: '', description: '', xHandle: '' });",
"  const [bannerFile, setBannerFile] = useState<File|null>(null);",
"  const [bannerPreview, setBannerPreview] = useState('');",
"  const [step, setStep] = useState<'form'|'paying'|'success'>('form');",
"  const [error, setError] = useState('');",
"  const [deployedStore, setDeployedStore] = useState<any>(null);",
"  const [loading, setLoading] = useState(false);",
"",
"  const slug = (form.name.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')) + (address ? '-' + address.slice(2,6) : '');",
"  const storeUrl = 'https://vendra-app-omega.vercel.app/store/' + slug;",
"  const tweet = 'I just deployed my store \"' + form.name + '\" on Arc Testnet!\\n\\n' + storeUrl + '\\n\\n#ArcTestnet #Web3 #Vendra';",
"",
"  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {",
"    const f = e.target.files?.[0]; if (!f) return;",
"    setBannerFile(f); setBannerPreview(URL.createObjectURL(f));",
"  };",
"",
"  const handleCreate = async () => {",
"    if (!address || !isConnected) { setError('Please connect your wallet'); return; }",
"    if (!form.name) { setError('Store name is required'); return; }",
"    setLoading(true); setError('');",
"    try {",
"      const existing = await getStoreByWallet(address);",
"      if (existing) { setError('You already have a store. Delete it first.'); setLoading(false); return; }",
"      setStep('paying');",
"      const hash = await sendTransactionAsync({ to: FEE_WALLET, value: parseUnits(FEE.toString(), 18) });",
"      let bannerUrl = '';",
"      if (bannerFile && address) bannerUrl = await uploadImage('banners/' + address, bannerFile);",
"      const store = await saveStore({ owner_wallet: address, name: form.name, tagline: form.tagline, description: form.description, category: cat, slug, x_handle: form.xHandle, deploy_fee_tx: hash, banner_url: bannerUrl });",
"      setDeployedStore(store); setStep('success');",
"    } catch (e:any) {",
"      setStep('form');",
"      setError(e?.message?.includes('rejected') ? 'Transaction rejected.' : 'Something went wrong. Please try again.');",
"    } finally { setLoading(false); }",
"  };",
"",
"  return (",
"    <main className='v4home' style={{ minHeight: '100vh' }}>",
"      <Nav theme='v4' />",
"      <div className='ob-wrap' style={{ maxWidth: 660 }}>",
"",
"        {step === 'paying' && (",
"          <div className='sc-state'>",
"            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />",
"            <h2 className='sc-state-h'>Deploying store</h2>",
"            <p className='sc-state-p'>{'Approve the $'}{FEE}{' USDC deployment fee in your wallet\u2026'}</p>",
"          </div>)}",
"",
"        {step === 'success' && (",
"          <div className='sc-state'>",
"            <div className='sc-tick'>\u2713</div>",
"            <h2 className='sc-state-h'>Store deployed</h2>",
"            <p className='sc-state-p'><strong>{form.name}</strong> is now live on Arc Testnet.</p>",
"            <div className='sc-state-actions'>",
"              <Link href={'/store/' + (deployedStore?.slug || slug)} className='v4btn v4btn-amber'>View my store \u2192</Link>",
"              <Link href='/store/edit' className='v4btn v4btn-ink'>Add products \u2192</Link>",
"              <a href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet)} target='_blank' rel='noopener noreferrer' className='v4btn v4btn-ghost'>Share on \uD835\uDD4F</a>",
"            </div>",
"          </div>)}",
"",
"        {step === 'form' && (",
"          <>",
"            <p className='eyebrow'>Arc Testnet</p>",
"            <h1 className='ob-title'>Launch your <span className='v4amber'>store</span></h1>",
"            <p className='lede'>Set up in 2 minutes. Sell globally, get paid instantly.</p>",
"            <div className='sc-fee'><span className='sc-fee-dot' /><span className='sc-fee-txt'>{'Deployment fee: $'}{FEE}{' USDC \u00b7 Arc Testnet'}</span></div>",
"",
"            <div className='ob-card'>",
"              <div className='ob-card-head'>Store banner</div>",
"              <div className='ob-card-body'>",
"                <input ref={bannerRef} type='file' accept='image/*' onChange={handleBanner} style={{ display: 'none' }} />",
"                {bannerPreview",
"                  ? <div className='sc-banner-prev'><img src={bannerPreview} alt='banner' /><button onClick={() => bannerRef.current?.click()} className='sc-banner-change'>Change</button></div>",
"                  : <div onClick={() => bannerRef.current?.click()} className='sc-banner-zone'><div className='sc-banner-ic'>\uD83D\uDDBC\uFE0F</div><div className='sc-banner-label'>Click to upload banner</div><div className='sc-banner-hint'>Recommended: 1200\u00d7400px</div></div>}",
"              </div>",
"            </div>",
"",
"            <div className='ob-card'>",
"              <div className='ob-card-head'>Store identity</div>",
"              <div className='ob-card-body'>",
"                <div className='ob-field'><label className='ob-label'>Store name *</label><input className='ob-input' type='text' placeholder='e.g. Nour Atelier' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>",
"                <div className='ob-field'><label className='ob-label'>Tagline</label><input className='ob-input' type='text' placeholder='One line about what you sell' value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} /></div>",
"                <div className='ob-field'><label className='ob-label'>Description</label><textarea className='ob-textarea' placeholder='Tell buyers what makes your store special...' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>",
"                <div className='ob-field last'><label className='ob-label'>X (Twitter) handle</label><input className='ob-input' type='text' placeholder='@yourhandle' value={form.xHandle} onChange={e => setForm({ ...form, xHandle: e.target.value })} /></div>",
"              </div>",
"            </div>",
"",
"            <div className='ob-card'>",
"              <div className='ob-card-head'>Category</div>",
"              <div className='sc-cats'>",
"                {CATS.map(c => <div key={c.name} onClick={() => setCat(c.name)} className={'sc-cat' + (cat === c.name ? ' sel' : '')}><div className='sc-cat-ic'>{c.icon}</div><div className='sc-cat-name'>{c.name}</div></div>)}",
"              </div>",
"            </div>",
"",
"            <div className='ob-card'>",
"              <div className='ob-card-head'>Payment wallet \u00b7 ERC-8004 Identity</div>",
"              <div className='ob-card-body'>",
"                <div className='sc-wallet-l'>Receives USDC payments from buyers</div>",
"                <div className='sc-wallet-v'>{address ? address.slice(0,6) + '...' + address.slice(-4) + ' \u00b7 Arc Testnet' : 'Connect your wallet'}</div>",
"              </div>",
"            </div>",
"",
"            {error && <div className='ob-error'>{error}</div>}",
"            <button onClick={handleCreate} disabled={loading} className='v4btn v4btn-amber ob-cta'>{'Deploy store on Arc \u00b7 $'}{FEE}{' USDC \u2192'}</button>",
"            <div style={{ textAlign: 'center' }}><Link href='/profile' className='ob-backlink'>\u2190 Back to profile</Link></div>",
"          </>",
"        )}",
"      </div>",
"    </main>",
"  );",
"}",
""
].join("\n");

if (!fs.existsSync(pagePath + '.v3bak')) { fs.copyFileSync(pagePath, pagePath + '.v3bak'); console.log('  .  backup -> app/store/create/page.tsx.v3bak'); }
fs.writeFileSync(pagePath, PAGE, 'utf8');
console.log('  +  app/store/create/page.tsx rewritten in v4 (logic unchanged)');

const MARK = '/* === V4 STORE-CREATE STYLES === */';
const CSS = [
MARK,
".v4home .sc-fee{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--v4-aSoft2);background:var(--v4-aSoft);border-radius:999px;padding:8px 16px;margin:14px 0 36px;}",
".v4home .sc-fee-dot{width:7px;height:7px;border-radius:50%;background:var(--v4-a);box-shadow:0 0 6px var(--v4-a);}",
".v4home .sc-fee-txt{font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--v4-aDeep);}",
".v4home .sc-banner-zone{height:150px;border:1px dashed var(--v4-line2);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;background:var(--v4-paper2);transition:border-color .25s;}",
".v4home .sc-banner-zone:hover{border-color:var(--v4-a);}",
".v4home .sc-banner-ic{font-size:28px;}",
".v4home .sc-banner-label{font-size:12px;font-weight:600;color:var(--v4-tx);}",
".v4home .sc-banner-hint{font-size:10px;color:var(--v4-tx40);letter-spacing:.04em;}",
".v4home .sc-banner-prev{position:relative;border-radius:12px;overflow:hidden;}",
".v4home .sc-banner-prev img{width:100%;height:160px;object-fit:cover;display:block;}",
".v4home .sc-banner-change{position:absolute;bottom:12px;right:12px;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#fff;border:1px solid rgba(255,255,255,.4);padding:6px 12px;border-radius:999px;background:rgba(21,19,13,.6);cursor:pointer;backdrop-filter:blur(4px);}",
".v4home .sc-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:18px;}",
".v4home .sc-cat{padding:16px 8px;text-align:center;cursor:pointer;border:1px solid var(--v4-line);border-radius:12px;background:var(--v4-paper);transition:.2s;}",
".v4home .sc-cat:hover{border-color:var(--v4-line2);}",
".v4home .sc-cat.sel{border-color:var(--v4-a);background:var(--v4-aSoft);}",
".v4home .sc-cat-ic{font-size:20px;margin-bottom:6px;}",
".v4home .sc-cat-name{font-size:9.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--v4-tx40);}",
".v4home .sc-cat.sel .sc-cat-name{color:var(--v4-aDeep);}",
".v4home .sc-wallet-l{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--v4-tx40);margin-bottom:6px;}",
".v4home .sc-wallet-v{font-size:15px;font-weight:600;color:var(--v4-aDeep);}",
".v4home .sc-state{text-align:center;padding:64px 0;}",
".v4home .sc-state-h{font-size:clamp(30px,5vw,48px);font-weight:600;letter-spacing:-.02em;margin-bottom:12px;}",
".v4home .sc-state-p{font-size:14px;color:var(--v4-tx60);margin-bottom:28px;line-height:1.7;}",
".v4home .sc-state-p strong{color:var(--v4-ink);font-weight:600;}",
".v4home .sc-tick{font-size:64px;color:#3F7A47;line-height:1;margin-bottom:16px;}",
".v4home .sc-state-actions{display:flex;flex-direction:column;gap:12px;max-width:300px;margin:0 auto;}",
"@media(max-width:560px){.v4home .sc-cats{grid-template-columns:repeat(2,1fr);}}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 store-create styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev -> open /store/create. Then git push.\n');
