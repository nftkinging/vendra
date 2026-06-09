/* ============================================================
   batch37_join_balance.js  —  Vendra, Batch 37 (mobile polish)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch37_join_balance.js
   ------------------------------------------------------------
   Fixes the /join Circle dashboard balance overflowing its card on
   mobile: it rendered the raw full-precision string. Now rounds to
   2 decimals (matching the nav pill + wallet dashboard), plus a small
   defensive wrap rule.
     - app/join/page.tsx : ${balance} -> ${parseFloat(balance||'0').toFixed(2)}
     - app/globals.css   : appends a tiny jn-bal mobile rule
   Backs up files once. Idempotent.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const joinPath = path.join(root, 'app', 'join', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(joinPath)) { console.error('\n  x  app/join/page.tsx not found.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }

// 1) round the balance
let join = fs.readFileSync(joinPath, 'utf8');
const from = "<div className='jn-bal'>${balance}</div>";
const to = "<div className='jn-bal'>${parseFloat(balance || '0').toFixed(2)}</div>";
if (join.includes(to)) {
  console.log('  .  app/join/page.tsx balance already rounded');
} else if (join.includes(from)) {
  if (!fs.existsSync(joinPath + '.balbak')) fs.copyFileSync(joinPath, joinPath + '.balbak');
  fs.writeFileSync(joinPath, join.split(from).join(to), 'utf8');
  console.log('  +  app/join/page.tsx balance rounded to 2 decimals');
} else {
  console.error('  x  app/join/page.tsx: balance snippet not found (skipped)');
}

// 2) defensive CSS (idempotent)
const MARK = '/* === V4 JOIN BALANCE FIX === */';
const CSS = [
MARK,
".v4home .jn-bal{overflow-wrap:anywhere;max-width:100%;}",
"@media(max-width:560px){ .v4home .jn-bal{font-size:24px;} }",
""
].join("\n");
let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) css = css.slice(0, i).replace(/\s+$/, '') + '\n\n';
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  jn-bal mobile rule appended to globals.css');

console.log('\n  Done. npm run build -> npm run dev. The /join wallet balance now reads like $4.99. Then git push.\n');
