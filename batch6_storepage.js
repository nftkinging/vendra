/* ============================================================
   batch6_storepage.js  —  Vendra v4, Batch 6 (store page)
   Drop in your project root (C:\Users\kvngs\VENDRA), then run:
       node batch6_storepage.js
   ------------------------------------------------------------
   - rewrites app/store/[slug]/page.tsx to the v4 look:
       * store hero (banner or clean header, emblem, category,
         tagline, X handle, description)
       * products in the v4 pcard SHOWCASE grid (4->2->1)
       * real Add-to-Cart (useCart) + Buy Now (-> /checkout)
       * reads live DB via getStoreBySlug (old hardcoded SAMPLE removed)
   - appends v4 store-page styles to globals.css (idempotent)
   Backs up the page once.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pagePath = path.join(root, 'app', 'store', '[slug]', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(pagePath)) { console.error('\n  x  app/store/[slug]/page.tsx not found. Run from project root.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }

const PAGE = [
"'use client';",
"import Nav from '../../Nav';",
"import Link from 'next/link';",
"import { useParams } from 'next/navigation';",
"import { useState, useEffect } from 'react';",
"import { getStoreBySlug } from '../../lib/supabase';",
"import { useCart } from '../../lib/cart';",
"",
"export default function StorePage() {",
"  const params = useParams();",
"  const storeSlug = Array.isArray(params.slug) ? params.slug[0] : (params.slug as string);",
"  const [store, setStore] = useState<any>(null);",
"  const [loading, setLoading] = useState(true);",
"  const [addedIds, setAddedIds] = useState<Record<string,boolean>>({});",
"  const { addItem } = useCart();",
"",
"  useEffect(() => {",
"    let active = true;",
"    setLoading(true);",
"    getStoreBySlug(storeSlug)",
"      .then(db => { if (active) { setStore(db); setLoading(false); } })",
"      .catch(() => { if (active) setLoading(false); });",
"    return () => { active = false; };",
"  }, [storeSlug]);",
"",
"  const handleAddToCart = (product: any) => {",
"    if (!store) return;",
"    addItem({ id: store.slug + '-' + product.id, storeSlug: store.slug, storeName: store.name, sellerWallet: store.owner_wallet, productName: product.name, price: product.price, image: product.image_url || '' });",
"    setAddedIds(prev => ({ ...prev, [product.id]: true }));",
"    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);",
"  };",
"",
"  if (loading) return (",
"    <main className='v4home'><Nav theme='v4' /><div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68 }}><div className='v4spinner' /></div></main>",
"  );",
"  if (!store) return (",
"    <main className='v4home'><Nav theme='v4' /><div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, paddingTop: 68 }}><div style={{ fontSize: 30, fontWeight: 600 }}>Store not found</div><Link href='/marketplace'><button className='v4btn v4btn-ink'>Back to marketplace</button></Link></div></main>",
"  );",
"",
"  const products: any[] = store.products || [];",
"  const xHandle = store.x_handle ? (store.x_handle.startsWith('@') ? store.x_handle : '@' + store.x_handle) : null;",
"",
"  return (",
"    <main className='v4home'>",
"      <Nav theme='v4' />",
"",
"      {store.banner_url",
"        ? <div className='v4st-banner'><img src={store.banner_url} alt='' /></div>",
"        : <div style={{ height: 68 }} />}",
"",
"      <section className='v4st-head'>",
"        <div className='v4st-head-inner'>",
"          <div className='v4st-emblem'>{store.name?.slice(0,2).toUpperCase()}</div>",
"          <div className='v4st-info'>",
"            <div className='v4st-cat'>{store.category}{' \u00b7 Arc Testnet \u00b7 ERC-8004 Verified'}</div>",
"            <h1 className='v4st-title'>{store.name}</h1>",
"            {store.tagline && <div className='v4st-tag'>{store.tagline}</div>}",
"            {xHandle && <a className='v4st-x' href={'https://x.com/' + xHandle.replace('@','')} target='_blank' rel='noopener noreferrer'>{'\uD835\uDD4F '}{xHandle}{' \u2197'}</a>}",
"            {store.description && <div className='v4st-desc'>{store.description}</div>}",
"          </div>",
"        </div>",
"      </section>",
"",
"      <section className='v4st-body'>",
"        <div className='v4st-count'>{products.length}{' product'}{products.length !== 1 ? 's' : ''}</div>",
"        {products.length === 0",
"          ? <div className='v4empty' style={{ marginTop: 24 }}><h3>No products yet</h3><p>This store has not listed anything.</p></div>",
"          : <div className='v4grid' style={{ marginTop: 24 }}>",
"              {products.map((product: any) => (",
"                <div key={product.id} className='pcard'>",
"                  <div className='pc-img'>",
"                    <span className='pc-badge'>{product.type}</span>",
"                    <img src={product.image_url} alt={product.name} loading='lazy' onError={(e) => { const d = e.currentTarget.parentElement; if (d) { d.classList.add('grad'); (d as HTMLElement).style.background = 'linear-gradient(150deg,#2c2c34,#16161a)'; } }} />",
"                    <span className='ph-name'>{product.name}</span>",
"                  </div>",
"                  <div className='pc-body'>",
"                    <div className='pc-name'>{product.name}</div>",
"                    {product.description && <div className='pc-desc'>{product.description}</div>}",
"                    <div className='pc-foot'>",
"                      <div className='pc-price'>{product.price}<span className='u'>USDC</span></div>",
"                      <div className='pc-acts'>",
"                        <button className={'pc-add' + (addedIds[product.id] ? ' added' : '')} onClick={() => handleAddToCart(product)} title='Add to cart' aria-label='Add to cart'>{addedIds[product.id] ? '\u2713' : '+'}</button>",
"                        <Link href={'/checkout?store=' + store.slug + '&product=' + encodeURIComponent(product.name) + '&price=' + product.price + '&seller=' + store.owner_wallet}><button className='pc-buynow'>Buy</button></Link>",
"                      </div>",
"                    </div>",
"                  </div>",
"                </div>",
"              ))}",
"            </div>}",
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
  console.log('  .  backup written  -> app/store/[slug]/page.tsx.v3bak');
}
fs.writeFileSync(pagePath, PAGE, 'utf8');
console.log('  +  store/[slug]/page.tsx rewritten in v4 (pcard grid, live DB, buy flow kept)');

const MARK = '/* === V4 STORE PAGE STYLES === */';
const CSS = [
MARK,
".v4home .v4st-banner{width:100%;height:clamp(180px,28vw,300px);position:relative;overflow:hidden;}",
".v4home .v4st-banner img{width:100%;height:100%;object-fit:cover;}",
".v4home .v4st-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 35%,var(--v4-paper) 100%);}",
".v4home .v4st-head{max-width:1080px;margin:0 auto;padding:0 clamp(20px,4vw,48px);}",
".v4home .v4st-head-inner{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap;padding:clamp(28px,4vw,44px) 0 clamp(26px,3vw,38px);border-bottom:1px solid var(--v4-line);}",
".v4home .v4st-emblem{width:64px;height:64px;border-radius:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(150deg,var(--v4-a),var(--v4-aDeep));color:#fff;font-weight:600;font-size:22px;letter-spacing:-.01em;box-shadow:0 12px 28px -12px rgba(226,164,28,.55);}",
".v4home .v4st-info{flex:1;min-width:240px;}",
".v4home .v4st-cat{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--v4-aDeep);margin-bottom:8px;}",
".v4home .v4st-title{font-size:clamp(30px,5vw,50px);font-weight:600;letter-spacing:-.02em;line-height:1;}",
".v4home .v4st-tag{font-size:15px;color:var(--v4-tx60);margin-top:10px;}",
".v4home .v4st-x{display:inline-block;margin-top:10px;font-size:13px;font-weight:600;color:var(--v4-aDeep);text-decoration:none;}",
".v4home .v4st-x:hover{text-decoration:underline;}",
".v4home .v4st-desc{font-size:14px;color:var(--v4-tx60);line-height:1.7;margin-top:12px;max-width:60ch;}",
".v4home .v4st-body{max-width:1080px;margin:0 auto;padding:clamp(28px,4vw,40px) clamp(20px,4vw,48px) clamp(64px,8vw,96px);}",
".v4home .v4st-count{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--v4-tx40);}",
".v4home .pc-desc{font-size:12.5px;color:var(--v4-tx40);margin-top:5px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}",
".v4home .pc-acts{display:flex;align-items:center;gap:6px;}",
".v4home .pc-add{width:32px;height:32px;border-radius:999px;border:1px solid var(--v4-line2);background:transparent;color:var(--v4-tx);font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.25s;flex-shrink:0;}",
".v4home .pc-add:hover{border-color:var(--v4-ink);}",
".v4home .pc-add.added{border-color:var(--v4-a);color:var(--v4-aDeep);}",
".v4home .pc-buynow{border:none;border-radius:999px;background:var(--v4-a);color:#15130D;font-family:'General Sans',sans-serif;font-weight:600;font-size:12.5px;padding:8px 16px;cursor:pointer;transition:.25s;white-space:nowrap;}",
".v4home .pc-buynow:hover{background:var(--v4-a2);}",
".v4home .v4spinner{width:34px;height:34px;border:2px solid var(--v4-line2);border-top-color:var(--v4-a);border-radius:50%;animation:v4spin 1s linear infinite;}",
"@keyframes v4spin{to{transform:rotate(360deg);}}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 store-page styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev -> open /store/kicksbyleo (after seeding). Then git push.\n');
