// relabel_nav.js — renames the existing nav link text "Orders" -> "Escrow" in app/Nav.tsx.
// Use this if you already ran patch_nav.js with the old "Orders" label.
// Run from the VENDRA app root:  node relabel_nav.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(process.cwd(), 'app', 'Nav.tsx');
if (!fs.existsSync(FILE)) { console.error('app/Nav.tsx not found — run from the VENDRA root.'); process.exit(1); }
let src = fs.readFileSync(FILE, 'utf8');
const before = (src.match(/>Orders<\/Link>/g) || []).length;
if (before === 0) { console.log('No "Orders" link text found — nothing to relabel.'); process.exit(0); }
fs.writeFileSync(FILE + '.relabelbak', src);
src = src.replace(/>Orders<\/Link>/g, '>Escrow</Link>');
fs.writeFileSync(FILE, src);
console.log('Relabeled', before, 'link(s) from "Orders" to "Escrow". Backup: app/Nav.tsx.relabelbak');
console.log('\nNext:  (restart dev if needed)  ->  check the top bar  ->  git push');
