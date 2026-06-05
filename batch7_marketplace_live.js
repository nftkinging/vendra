/* ============================================================
   batch7_marketplace_live.js  —  Vendra v4, Batch 7 (live marketplace)
   Drop in your project root (C:\Users\kvngs\VENDRA), then run:
       node batch7_marketplace_live.js
   ------------------------------------------------------------
   - rewrites app/marketplace/page.tsx to read LIVE DB stores
     (getStores), flatten their products into the v4 pcard grid,
     each card CLICKABLE into its /store/[slug] page.
     Search (product or store name) + category chips (store category).
   - re-ensures v4 marketplace header/search/empty/spinner styles.
   Replaces the showcase-array version. Backup kept once.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pagePath = path.join(root, 'app', 'marketplace', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(pagePath)) { console.error('\n  x  app/marketplace/page.tsx not found. Run from project root.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }

const PAGE = [
"'use client';",
"import Nav from '../Nav';",
"import Link from 'next/link';",
"import { useState, useEffect } from 'react';",
"import { getStores } from '../lib/supabase';",
"",
"export default function Marketplace() {",
"  const [stores, setStores] = useState<any[]>([]);",
"  const [loading, setLoading] = useState(true);",
"  const [cat, setCat] = useState('All');",
"  const [search, setSearch] = useState('');",
"",
"  useEffect(() => {",
"    getStores()",
"      .then(s => { setStores(s || []); setLoading(false); })",
"      .catch(() => setLoading(false));",
"  }, []);",
"",
"  // flatten every store's products into one product feed",
"  const items = stores.flatMap((s: any) => (s.products || []).map((p: any) => ({",
"    id: p.id,",
"    name: p.name,",
"    price: p.price,",
"    image: p.image_url || '',",
"    cat: s.category || 'Other',",
"    storeSlug: s.slug,",
"    storeName: s.name,",
"  })));",
"",
"  const CATS = ['All', ...Array.from(new Set(items.map(i => i.cat)))];",
"",
"  const filtered = items.filter(i =>",
"    (cat === 'All' || i.cat === cat) &&",
"    ((i.name || '').toLowerCase().includes(search.toLowerCase()) ||",
"     (i.storeName || '').toLowerCase().includes(search.toLowerCase()))",
"  );",
"",
"  return (",
"    <main className='v4home'>",
"      <Nav theme='v4' />",
"",
"      <section className='v4mkt-head'>",
"        <div className='v4mkt-head-inner'>",
"          <p className='eyebrow'>Arc Testnet \u00b7 Live listings</p>",
"          <h1>The <span className='v4amber'>Marketplace</span></h1>",
"          <p className='lede'>Every listing on Vendra \u2014 zero platform fees, instant USDC settlement, and escrow on every order.</p>",
"          <input className='v4search' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search listings\u2026' />",
"        </div>",
"      </section>",
"",
"      <section className='v4mkt-body'>",
"        <div className='chips'>",
"          {CATS.map(c => (",
"            <span key={c} className={'chip' + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>{c}</span>",
"          ))}",
"        </div>",
"",
"        {loading ? (",
"          <div style={{ padding: '72px 0', display: 'flex', justifyContent: 'center' }}><div className='v4spinner' /></div>",
"        ) : filtered.length === 0 ? (",
"          <div className='v4empty'><h3>No listings yet</h3><p>Open a store and your products show up here instantly.</p></div>",
"        ) : (",
"          <div className='v4grid' style={{ marginTop: 32 }}>",
"            {filtered.map(i => (",
"              <Link key={i.storeSlug + '-' + i.id} href={'/store/' + i.storeSlug} className='pcard'>",
"                <div className='pc-img'>",
"                  <span className='pc-badge'>{i.cat}</span>",
"                  <img src={i.image} alt={i.name} loading='lazy' onError={(e) => { const d = e.currentTarget.parentElement; if (d) { d.classList.add('grad'); (d as HTMLElement).style.background = 'linear-gradient(150deg,#2c2c34,#16161a)'; } }} />",
"                  <span className='ph-name'>{i.name}</span>",
"                </div>",
"                <div className='pc-body'>",
"                  <div className='pc-name'>{i.name}</div>",
"                  <div className='pc-seller'>{i.storeName}</div>",
"                  <div className='pc-foot'>",
"                    <div className='pc-price'>{i.price}<span className='u'>USDC</span></div>",
"                    <span className='pc-buy'>View</span>",
"                  </div>",
"                </div>",
"              </Link>",
"            ))}",
"          </div>",
"        )}",
"      </section>",
"",
"      <footer className='v4foot'>",
"        <div className='foot-wrap'>",
"          <div className='foot-brand'>",
"            <div className='v4brandrow'><span className='v4emblem'><span>V</span></span><span className='fb-name'>Vendra</span></div>",
"            <p>The Web3-native marketplace. Sell anything, keep everything, get paid instantly in USDC. Powered by Arc.</p>",
"          </div>",
"          <div className='foot-col'><h4>Marketplace</h4><Link href='/marketplace'>Browse</Link><Link href='/marketplace'>Categories</Link><Link href='/marketplace'>Top sellers</Link></div>",
"          <div className='foot-col'><h4>Sell</h4><Link href='/store/create'>Open a store</Link><Link href='/store/create'>Escrow and payouts</Link><Link href='/profile'>Reputation</Link></div>",
"          <div className='foot-col'><h4>Company</h4><Link href='/marketplace'>About</Link><a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'>Faucet</a><a href='https://docs.arc.io/' target='_blank' rel='noopener noreferrer'>Docs</a></div>",
"        </div>",
"        <div className='foot-bot'>",
"          <span>\u00a9 2026 Vendra \u00b7 Commerce Unchained</span>",
"          <span>Live on Arc Testnet \u00b7 USDC native</span>",
"        </div>",
"      </footer>",
"    </main>",
"  );",
"}",
""
].join("\n");

if (!fs.existsSync(pagePath + '.v3bak')) {
  fs.copyFileSync(pagePath, pagePath + '.v3bak');
  console.log('  .  backup written  -> app/marketplace/page.tsx.v3bak');
}
fs.writeFileSync(pagePath, PAGE, 'utf8');
console.log('  +  marketplace/page.tsx rewritten — live DB, clickable product cards');

const MARK = '/* === V4 MARKETPLACE STYLES === */';
const CSS = [
MARK,
".v4home .v4mkt-head{padding:calc(68px + clamp(44px,5vw,68px)) clamp(20px,4vw,48px) clamp(32px,4vw,48px);border-bottom:1px solid var(--v4-line);}",
".v4home .v4mkt-head-inner{max-width:1200px;margin:0 auto;}",
".v4home .v4mkt-head h1{font-size:clamp(40px,6vw,76px);margin:16px 0 0;}",
".v4home .v4mkt-head .lede{margin-top:18px;max-width:54ch;}",
".v4home .v4search{margin-top:28px;display:block;width:100%;max-width:520px;background:var(--v4-card);border:1px solid var(--v4-line2);border-radius:999px;padding:13px 22px;color:var(--v4-tx);font-family:'General Sans',sans-serif;font-size:15px;outline:none;transition:border-color .3s;}",
".v4home .v4search::placeholder{color:var(--v4-tx40);}",
".v4home .v4search:focus{border-color:var(--v4-ink);}",
".v4home .v4mkt-body{max-width:1200px;margin:0 auto;padding:clamp(34px,4vw,52px) clamp(20px,4vw,48px) clamp(64px,8vw,96px);}",
".v4home .v4mkt-body .chips{margin-top:0;}",
".v4home .v4empty{text-align:center;padding:72px 24px;border:1px solid var(--v4-line);border-radius:16px;}",
".v4home .v4empty h3{font-size:24px;font-weight:600;}",
".v4home .v4empty p{font-size:14px;color:var(--v4-tx40);margin-top:8px;}",
".v4home .v4spinner{width:34px;height:34px;border:2px solid var(--v4-line2);border-top-color:var(--v4-a);border-radius:50%;animation:v4spin 1s linear infinite;}",
"@keyframes v4spin{to{transform:rotate(360deg);}}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 marketplace styles ensured in globals.css');
console.log('\n  Done. npm run build -> npm run dev -> /marketplace (live, clickable). Then git push.\n');
