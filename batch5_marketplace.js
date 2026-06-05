/* ============================================================
   batch5_marketplace.js  —  Vendra v4, Batch 5 (marketplace page)
   Drop in your project root (C:\Users\kvngs\VENDRA), then run:
       node batch5_marketplace.js
   ------------------------------------------------------------
   - rewrites app/marketplace/page.tsx in the v4 look
       (Nav theme="v4", v4 page header + search, v4 store cards,
        chip category filter) — ALL data logic kept identical:
        getStores fetch, SAMPLE merge, search + category filtering
   - appends v4 marketplace styles to app/globals.css (scoped .v4home)
   Backs up the page once. Idempotent CSS block.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pagePath = path.join(root, 'app', 'marketplace', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(pagePath)) {
  console.error('\n  x  app/marketplace/page.tsx not found. Run from your project root.\n');
  process.exit(1);
}
if (!fs.existsSync(cssPath)) {
  console.error('\n  x  app/globals.css not found.\n');
  process.exit(1);
}

const PAGE = [
"'use client';",
"import Nav from '../Nav';",
"import Link from 'next/link';",
"import { useState, useEffect } from 'react';",
"import { getStores } from '../lib/supabase';",
"",
"const CATS = ['All','Fashion','Digital','Art','Services','Food','Tech','Music','Other'];",
"",
"const SAMPLE = [",
"  { id:'s1', slug:'nour-atelier', name:'Nour Atelier', tagline:'Handcrafted jewellery from the Middle East', category:'Fashion', productCount:4, bg:'linear-gradient(145deg,#1e1608,#3d2e14)', banner_url:'' },",
"  { id:'s2', slug:'bytedrop', name:'ByteDrop', tagline:'Premium UI kits and Figma assets', category:'Digital', productCount:3, bg:'linear-gradient(145deg,#060d18,#142035)', banner_url:'' },",
"  { id:'s3', slug:'solar-prints', name:'Solar Prints', tagline:'Limited edition art prints worldwide', category:'Art', productCount:2, bg:'linear-gradient(145deg,#100810,#261630)', banner_url:'' },",
"  { id:'s4', slug:'kode-studio', name:'Kode Studio', tagline:'Custom dev work and automation', category:'Services', productCount:2, bg:'linear-gradient(145deg,#0a1208,#162418)', banner_url:'' },",
"  { id:'s5', slug:'umami-box', name:'Umami Box', tagline:'Artisan Japanese food kits', category:'Food', productCount:2, bg:'linear-gradient(145deg,#180d06,#2e1a0c)', banner_url:'' },",
"  { id:'s6', slug:'soundvault', name:'SoundVault', tagline:'Exclusive beats and sample packs', category:'Music', productCount:3, bg:'linear-gradient(145deg,#050d18,#0d1a2e)', banner_url:'' },",
"];",
"",
"export default function Marketplace() {",
"  const [dbStores, setDbStores] = useState<any[]>([]);",
"  const [cat, setCat] = useState('All');",
"  const [search, setSearch] = useState('');",
"  const [loading, setLoading] = useState(true);",
"",
"  useEffect(() => {",
"    getStores().then(db => {",
"      setDbStores(db || []);",
"      setLoading(false);",
"    }).catch(() => setLoading(false));",
"  }, []);",
"",
"  const allStores = [",
"    ...SAMPLE.filter(s => !dbStores.find(d => d.slug === s.slug)),",
"    ...dbStores.map(s => ({",
"      ...s,",
"      productCount: s.products?.length || 0,",
"      bg: 'linear-gradient(145deg,var(--bg2),var(--bg3))',",
"    })),",
"  ];",
"",
"  const filtered = allStores.filter(s =>",
"    (cat === 'All' || s.category === cat) &&",
"    (s.name.toLowerCase().includes(search.toLowerCase()) ||",
"     (s.tagline||'').toLowerCase().includes(search.toLowerCase()))",
"  );",
"",
"  return (",
"    <main className='v4home'>",
"      <Nav theme='v4' />",
"",
"      <section className='v4mkt-head'>",
"        <div className='v4mkt-head-inner'>",
"          <p className='eyebrow'>Arc Testnet \u00b7 Live stores</p>",
"          <h1>The <span className='v4amber'>Marketplace</span></h1>",
"          <p className='lede'>Browse every store on Vendra \u2014 handmade goods, digital drops, art, music and more. Zero platform fees, instant USDC settlement.</p>",
"          <input className='v4search' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search stores and products\u2026' />",
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
"          <div style={{ padding: '72px 0' }}><div className='v4spinner' /></div>",
"        ) : filtered.length === 0 ? (",
"          <div className='v4empty'><h3>No stores found</h3><p>Try a different search or category.</p></div>",
"        ) : (",
"          <div className='v4store-grid'>",
"            {filtered.map(s => (",
"              <Link key={s.id || s.slug} href={'/store/' + s.slug} className='v4store-card'>",
"                <div className='v4store-banner' style={{ background: s.banner_url ? 'none' : s.bg }}>",
"                  {s.banner_url",
"                    ? <img src={s.banner_url} alt={s.name} />",
"                    : <div className='v4store-ghost'>{s.name?.slice(0,1)}</div>}",
"                </div>",
"                <div className='v4store-body'>",
"                  <div className='v4store-name'>{s.name}</div>",
"                  <div className='v4store-desc'>{s.tagline}</div>",
"                  <div className='v4store-meta'>",
"                    <span className='v4store-cat'>{s.category}</span>",
"                    <span className='v4store-count'>{(s.productCount || s.products?.length || 0)} products</span>",
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
console.log('  +  app/marketplace/page.tsx rewritten in v4 (data logic unchanged)');

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
".v4home .v4store-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:32px;}",
".v4home .v4store-card{background:var(--v4-card);border:1px solid var(--v4-line);border-radius:16px;overflow:hidden;transition:transform .45s var(--v4-ease),box-shadow .45s var(--v4-ease),border-color .45s;cursor:pointer;display:block;}",
".v4home .v4store-card:hover{transform:translateY(-6px);box-shadow:0 26px 50px -28px rgba(21,19,13,.35);border-color:var(--v4-line2);}",
".v4home .v4store-banner{height:150px;position:relative;overflow:hidden;}",
".v4home .v4store-banner img{width:100%;height:100%;object-fit:cover;}",
".v4home .v4store-ghost{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant',serif;font-style:italic;font-weight:500;font-size:64px;color:rgba(248,215,124,.22);}",
".v4home .v4store-body{padding:20px;}",
".v4home .v4store-name{font-size:18px;font-weight:600;letter-spacing:-.01em;}",
".v4home .v4store-desc{font-size:13.5px;color:var(--v4-tx60);margin-top:6px;line-height:1.5;}",
".v4home .v4store-meta{display:flex;align-items:center;justify-content:space-between;margin-top:16px;}",
".v4home .v4store-cat{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--v4-tx40);}",
".v4home .v4store-count{font-size:12.5px;font-weight:600;color:var(--v4-aDeep);}",
".v4home .v4spinner{width:34px;height:34px;border:2px solid var(--v4-line2);border-top-color:var(--v4-a);border-radius:50%;animation:v4spin 1s linear infinite;margin:0 auto;}",
"@keyframes v4spin{to{transform:rotate(360deg);}}",
".v4home .v4empty{text-align:center;padding:72px 24px;border:1px solid var(--v4-line);border-radius:16px;}",
".v4home .v4empty h3{font-size:24px;font-weight:600;}",
".v4home .v4empty p{font-size:14px;color:var(--v4-tx40);margin-top:8px;}",
"@media(max-width:980px){.v4home .v4store-grid{grid-template-columns:repeat(2,1fr);}}",
"@media(max-width:560px){.v4home .v4store-grid{grid-template-columns:1fr;}}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 marketplace styles appended to globals.css');
console.log('\n  Done. Next: npm run build  ->  npm run dev  -> open /marketplace');
console.log('  Then git push. (Store/product pages still v3 until the next batch.)\n');
