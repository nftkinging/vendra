/* ============================================================
   batch12_cartdrawer.js  —  Vendra v4, Batch 12 (cart drawer)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch12_cartdrawer.js
   ------------------------------------------------------------
   - rewrites app/components/CartDrawer.tsx to the v4 light panel
     (matches checkout: light bg, rounded rows, amber pill, clean
      qty steppers) — ALL logic kept: store grouping, qty +/-,
      remove, totals, multi-store warning, /cart/checkout route
   - appends v4 cart-drawer styles to globals.css (idempotent)
   Backs up the component once.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const cdPath = path.join(root, 'app', 'components', 'CartDrawer.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(cdPath)) { console.error('\n  x  app/components/CartDrawer.tsx not found. Run from project root.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }

const CD = [
"'use client';",
"import { useCart } from '../lib/cart';",
"import { useRouter } from 'next/navigation';",
"",
"export default function CartDrawer() {",
"  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCart();",
"  const router = useRouter();",
"  const grouped = items.reduce((acc: any, item) => { if (!acc[item.storeSlug]) acc[item.storeSlug] = []; acc[item.storeSlug].push(item); return acc; }, {} as Record<string, typeof items>);",
"  const sellerCount = Object.keys(grouped).length;",
"  return (",
"    <>",
"      {isOpen && <div onClick={closeCart} className='v4-cart-backdrop' />}",
"      <div className={'v4-cart' + (isOpen ? ' open' : '')}>",
"        <div className='v4-cart-head'>",
"          <div>",
"            <div className='v4-cart-title'>Your cart</div>",
"            <div className='v4-cart-meta'>{count()} item{count() !== 1 ? 's' : ''} \u00b7 {sellerCount} store{sellerCount !== 1 ? 's' : ''}</div>",
"          </div>",
"          <button onClick={closeCart} className='v4-cart-x' aria-label='Close cart'>\u2715</button>",
"        </div>",
"        <div className='v4-cart-body'>",
"          {items.length === 0 ? (",
"            <div className='v4-cart-empty'>",
"              <div className='v4-cart-empty-ic'>\uD83D\uDED2</div>",
"              <div className='v4-cart-empty-h'>Cart is empty</div>",
"              <div className='v4-cart-empty-p'>Add products from any store.</div>",
"              <button onClick={() => { closeCart(); router.push('/marketplace'); }} className='v4btn v4btn-amber'>Browse marketplace</button>",
"            </div>",
"          ) : (",
"            Object.entries(grouped).map(([slug, storeItems]: any) => (",
"              <div key={slug} className='v4-cart-group'>",
"                <div className='v4-cart-store'>{storeItems[0].storeName}</div>",
"                {storeItems.map((item: any) => (",
"                  <div key={item.id} className='v4-cart-item'>",
"                    {item.image",
"                      ? <img src={item.image} alt={item.productName} className='v4-cart-item-img' />",
"                      : <div className='v4-cart-item-img'>\uD83D\uDCE6</div>}",
"                    <div style={{ flex: 1, minWidth: 0 }}>",
"                      <div className='v4-cart-item-name'>{item.productName}</div>",
"                      <div className='v4-cart-item-price'>{(item.price * item.quantity).toFixed(2)} USDC</div>",
"                      <div className='v4-cart-qty'>",
"                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='v4-cart-qbtn' aria-label='Decrease'>\u2212</button>",
"                        <span className='v4-cart-qn'>{item.quantity}</span>",
"                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='v4-cart-qbtn' aria-label='Increase'>+</button>",
"                      </div>",
"                    </div>",
"                    <button onClick={() => removeItem(item.id)} className='v4-cart-rm' aria-label='Remove item'>\u2715</button>",
"                  </div>",
"                ))}",
"              </div>",
"            ))",
"          )}",
"        </div>",
"        {items.length > 0 && (",
"          <div className='v4-cart-foot'>",
"            {sellerCount > 1 && <div className='v4-cart-warn'>\u26A1 {sellerCount} separate transactions \u2014 one per store</div>}",
"            <div className='v4-cart-total'>",
"              <div>",
"                <div className='v4-cart-total-l'>Total</div>",
"                <div className='v4-cart-total-v'>{total().toFixed(2)}<span className='v4-cart-total-u'>USDC</span></div>",
"              </div>",
"              <div className='v4-cart-meta2'>Arc Testnet</div>",
"            </div>",
"            <button onClick={() => { closeCart(); router.push('/cart/checkout'); }} className='v4btn v4btn-amber v4-cart-checkout'>Checkout \u00b7 {total().toFixed(2)} USDC <span className='arr'>\u2192</span></button>",
"          </div>",
"        )}",
"      </div>",
"    </>",
"  );",
"}",
""
].join("\n");

if (!fs.existsSync(cdPath + '.v3bak')) { fs.copyFileSync(cdPath, cdPath + '.v3bak'); console.log('  .  backup -> app/components/CartDrawer.tsx.v3bak'); }
fs.writeFileSync(cdPath, CD, 'utf8');
console.log('  +  CartDrawer.tsx rewritten in v4 (logic unchanged)');

const MARK = '/* === V4 CART DRAWER STYLES === */';
const CSS = [
MARK,
".v4-cart-backdrop{position:fixed;inset:0;background:rgba(21,19,13,.45);z-index:150;backdrop-filter:blur(6px);}",
".v4-cart{position:fixed;top:0;right:0;bottom:0;width:min(420px,92vw);background:var(--v4-paper);border-left:1px solid var(--v4-line);z-index:151;transform:translateX(100%);transition:transform .42s var(--v4-ease);display:flex;flex-direction:column;box-shadow:-12px 0 48px rgba(21,19,13,.18);}",
".v4-cart.open{transform:translateX(0);}",
".v4-cart-head{display:flex;justify-content:space-between;align-items:flex-start;padding:24px 26px;border-bottom:1px solid var(--v4-line);}",
".v4-cart-title{font-size:22px;font-weight:600;letter-spacing:-.01em;}",
".v4-cart-meta{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--v4-tx40);margin-top:5px;}",
".v4-cart-x{width:34px;height:34px;border-radius:999px;border:1px solid var(--v4-line2);background:transparent;color:var(--v4-tx60);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.2s;}",
".v4-cart-x:hover{border-color:var(--v4-ink);color:var(--v4-ink);}",
".v4-cart-body{flex:1;overflow-y:auto;padding:18px 26px;}",
".v4-cart-empty{text-align:center;padding:56px 16px;}",
".v4-cart-empty-ic{font-size:42px;margin-bottom:14px;}",
".v4-cart-empty-h{font-size:20px;font-weight:600;margin-bottom:6px;}",
".v4-cart-empty-p{font-size:13px;color:var(--v4-tx40);margin-bottom:24px;}",
".v4-cart-group{margin-bottom:22px;}",
".v4-cart-store{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--v4-tx40);margin-bottom:10px;}",
".v4-cart-item{display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--v4-line);}",
"img.v4-cart-item-img{width:54px;height:54px;border-radius:10px;object-fit:cover;flex-shrink:0;border:1px solid var(--v4-line);}",
"div.v4-cart-item-img{width:54px;height:54px;border-radius:10px;flex-shrink:0;border:1px solid var(--v4-line);background:var(--v4-paper2);display:flex;align-items:center;justify-content:center;font-size:22px;}",
".v4-cart-item-name{font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1.3;}",
".v4-cart-item-price{font-size:13px;color:var(--v4-aDeep);font-weight:600;margin-top:3px;}",
".v4-cart-qty{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--v4-line2);border-radius:999px;padding:2px;margin-top:10px;}",
".v4-cart-qbtn{width:24px;height:24px;border:none;background:transparent;color:var(--v4-tx);cursor:pointer;border-radius:999px;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;}",
".v4-cart-qbtn:hover{background:var(--v4-paper2);}",
".v4-cart-qn{min-width:20px;text-align:center;font-weight:600;font-size:13px;}",
".v4-cart-rm{background:transparent;border:none;color:var(--v4-tx40);cursor:pointer;font-size:13px;flex-shrink:0;padding:2px 0;}",
".v4-cart-rm:hover{color:var(--v4-ink);}",
".v4-cart-foot{padding:20px 26px;border-top:1px solid var(--v4-line);}",
".v4-cart-warn{font-size:11.5px;color:var(--v4-aDeep);background:var(--v4-aSoft);border:1px solid var(--v4-aSoft2);border-radius:10px;padding:9px 12px;margin-bottom:14px;}",
".v4-cart-total{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:16px;}",
".v4-cart-total-l{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--v4-tx40);}",
".v4-cart-total-v{font-size:30px;font-weight:700;letter-spacing:-.02em;}",
".v4-cart-total-u{font-size:13px;color:var(--v4-tx40);font-weight:500;margin-left:5px;}",
".v4-cart-meta2{font-size:11px;color:var(--v4-tx40);}",
".v4-cart-checkout{width:100%;justify-content:center;padding:15px;font-size:15px;}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 cart-drawer styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev -> open the cart. Then git push.\n');
