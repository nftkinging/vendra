/* ============================================================
   batch4_cartpolish.js  —  Vendra v4, nav polish (cart button)
   Drop in your project root (C:\Users\kvngs\VENDRA), then run:
       node batch4_cartpolish.js
   ------------------------------------------------------------
   - rewrites app/components/CartButton.tsx: inline styles -> CSS class
     (identical look on v3 pages, behavior 100% unchanged)
   - appends .v-cart-btn / .v-cart-badge styles to app/globals.css:
       base = exactly today's v3 look  +  .v4nav override = light skin
   Backs up CartButton.tsx once. Idempotent.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cbPath = path.join(root, 'app', 'components', 'CartButton.tsx');
const cssPath = path.join(root, 'app', 'globals.css');

if (!fs.existsSync(cbPath)) {
  console.error('\n  x  app/components/CartButton.tsx not found. Run from your project root.\n');
  process.exit(1);
}
if (!fs.existsSync(cssPath)) {
  console.error('\n  x  app/globals.css not found. Run from your project root.\n');
  process.exit(1);
}

const CART = [
"'use client';",
"import { useCart } from '../lib/cart';",
"export default function CartButton() {",
"  const { toggleCart, count } = useCart();",
"  const n = count();",
"  return (",
"    <button onClick={toggleCart} className='v-cart-btn' aria-label='Cart'>",
"      \ud83d\uded2",
"      {n > 0 && <span className='v-cart-badge'>{n > 9 ? '9+' : n}</span>}",
"    </button>",
"  );",
"}",
""
].join("\n");

if (!fs.existsSync(cbPath + '.v3bak')) {
  fs.copyFileSync(cbPath, cbPath + '.v3bak');
  console.log('  .  backup written  -> app/components/CartButton.tsx.v3bak');
}
fs.writeFileSync(cbPath, CART, 'utf8');
console.log('  +  CartButton.tsx rewritten (class-based, behavior identical)');

const MARK = '/* === V4 CART BUTTON POLISH === */';
const CSS = [
MARK,
".v-cart-btn{position:relative;background:transparent;border:1px solid var(--b1);color:var(--w35);width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:border-color .35s;flex-shrink:0;}",
".v-cart-btn:hover{border-color:var(--a);}",
".v-cart-badge{position:absolute;top:-6px;right:-6px;background:var(--a2);color:var(--bg);width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;font-size:.55rem;font-weight:500;border:2px solid var(--bg);}",
".v4nav .v-cart-btn{border:1px solid var(--v4-line2)!important;color:var(--v4-tx)!important;border-radius:999px!important;width:40px;height:40px;}",
".v4nav .v-cart-btn:hover{border-color:var(--v4-ink)!important;}",
".v4nav .v-cart-badge{background:var(--v4-a)!important;color:#15130d!important;border:2px solid var(--v4-paper)!important;}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  cart styles appended to globals.css (v3 look kept + v4 skin)');
console.log('\n  Done. Next: npm run build  ->  view the homepage cart icon (top-right of nav)');
console.log('  It should now be a clean rounded outline on the light bar. Then git push.\n');
