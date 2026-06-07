/* ============================================================
   batch21_storeurl_fix.js  —  Vendra v4, Batch 21 (domain fix)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch21_storeurl_fix.js
   ------------------------------------------------------------
   Replaces the stale share/link domain
       https://vendra-app-omega.vercel.app
   with the live domain
       https://vendramarket.xyz
   across all .ts/.tsx files under app/. Pure string swap,
   idempotent, reports every file changed. No other logic touched.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const appDir = path.join(root, 'app');
if (!fs.existsSync(appDir)) { console.error('\n  x  app/ not found. Run from project root.\n'); process.exit(1); }

const OLD = 'vendra-app-omega.vercel.app';
const NEW = 'vendramarket.xyz';

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const files = walk(appDir, []);
let changed = 0;
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  if (!before.includes(OLD)) continue;
  const after = before.split(OLD).join(NEW);
  fs.writeFileSync(f, after, 'utf8');
  const n = before.split(OLD).length - 1;
  console.log('  +  ' + path.relative(root, f) + '  (' + n + ' occurrence' + (n !== 1 ? 's' : '') + ')');
  changed++;
}

if (changed === 0) console.log('  .  No occurrences of ' + OLD + ' found (already up to date).');
else console.log('\n  Updated ' + changed + ' file' + (changed !== 1 ? 's' : '') + ' -> ' + NEW);
console.log('\n  Done. npm run build -> git push.\n');
