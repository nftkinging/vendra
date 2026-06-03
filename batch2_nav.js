/* ============================================================
   batch2_nav.js  —  Vendra v4, Batch 2 of 3
   Drop in your project root (C:\Users\kvngs\VENDRA), then run:
       node batch2_nav.js
   ------------------------------------------------------------
   Two tiny surgical edits to app/Nav.tsx — nothing else touched:
     1) add an optional  theme  prop  (defaults to 'v3')
     2) give <nav> the  v4nav  class when theme === 'v4'
   All Circle/Web3 auth, modals, cart logic stay exactly as-is.
   Backs up once to app/Nav.tsx.v3bak. Safe to re-run.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const navPath = path.join(root, 'app', 'Nav.tsx');

if (!fs.existsSync(navPath)) {
  console.error('\n  x  app/Nav.tsx not found. Run this from your project root (folder with app/, package.json).\n');
  process.exit(1);
}
if (!fs.existsSync(navPath + '.v3bak')) {
  fs.copyFileSync(navPath, navPath + '.v3bak');
  console.log('  .  backup written  -> app/Nav.tsx.v3bak');
}

let nav = fs.readFileSync(navPath, 'utf8');
let changed = false;

// 1) function signature -> add theme prop
const SIG     = 'export default function Nav() {';
const SIG_NEW = "export default function Nav({ theme = 'v3' }: { theme?: 'v3' | 'v4' }) {";
if (nav.includes(SIG)) {
  nav = nav.replace(SIG, SIG_NEW);
  changed = true;
  console.log("  +  theme prop added  ->  Nav({ theme = 'v3' })");
} else if (nav.includes("theme = 'v3'")) {
  console.log('  .  theme prop already present, skipped');
} else {
  console.log('  !  could not find the Nav() signature to patch — check Nav.tsx manually');
}

// 2) <nav> className -> add v4nav when theme is v4
const TAG     = "<nav className='v-nav'>";
const TAG_NEW = "<nav className={theme === 'v4' ? 'v-nav v4nav' : 'v-nav'}>";
if (nav.includes(TAG)) {
  nav = nav.replace(TAG, TAG_NEW);
  changed = true;
  console.log('  +  v4nav skin wired  ->  <nav> picks it up when theme="v4"');
} else if (nav.includes('v4nav')) {
  console.log('  .  v4nav class already present, skipped');
} else {
  console.log("  !  could not find <nav className='v-nav'> to patch — check Nav.tsx manually");
}

if (changed) {
  fs.writeFileSync(navPath, nav, 'utf8');
  console.log('  +  app/Nav.tsx saved');
} else {
  console.log('  .  no changes needed — Nav.tsx already patched');
}

console.log('\n  Batch 2 done. Nav still defaults to v3 everywhere; it only goes light when a page');
console.log('  renders <Nav theme="v4" /> — which Batch 3 does on the homepage.');
console.log('  Next: npm run build  (should pass with no NEW errors), then git push.\n');
