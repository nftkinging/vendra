// patch_nav.js — adds an "Orders" link (-> /escrow) to app/Nav.tsx,
// in both the desktop bar and the mobile menu, gated like the Profile link.
// Safe: backs up first, refuses to run if anchors are missing or already patched.
// Run from the VENDRA app root:  node patch_nav.js
const fs = require('fs');
const path = require('path');

const FILE = path.join(process.cwd(), 'app', 'Nav.tsx');
if (!fs.existsSync(FILE)) { console.error('app/Nav.tsx not found — run this from the VENDRA root.'); process.exit(1); }

let src = fs.readFileSync(FILE, 'utf8');

const DESK_ANCHOR = "{(isConnected || (mounted && circleWallet)) && <Link href='/profile'>Profile</Link>}";
const DESK_ADD    = DESK_ANCHOR + "{(isConnected || (mounted && circleWallet)) && <Link href='/escrow'>Escrow</Link>}";
const MOB_ANCHOR  = "{(isConnected || (mounted && circleWallet)) && <Link href='/profile' onClick={() => setMenuOpen(false)}>Profile</Link>}";
const MOB_ADD     = MOB_ANCHOR + "\n            {(isConnected || (mounted && circleWallet)) && <Link href='/escrow' onClick={() => setMenuOpen(false)}>Escrow</Link>}";

if (src.includes("href='/escrow'")) { console.log('Already patched — Nav.tsx already has an /escrow link. Nothing to do.'); process.exit(0); }
if (!src.includes(DESK_ANCHOR)) { console.error('Could not find the desktop Profile link to anchor to. No changes made.'); process.exit(1); }
if (!src.includes(MOB_ANCHOR))  { console.error('Could not find the mobile Profile link to anchor to. No changes made.'); process.exit(1); }

// backup (gitignored by the existing *bak rule)
fs.writeFileSync(FILE + '.navbak', src);

src = src.replace(DESK_ANCHOR, DESK_ADD).replace(MOB_ANCHOR, MOB_ADD);
fs.writeFileSync(FILE, src);

const count = (src.match(/href='\/escrow'/g) || []).length;
console.log('Patched app/Nav.tsx (backup: app/Nav.tsx.navbak)');
console.log('Added /escrow "Escrow" links:', count, '(expected 2)');
console.log('\nNext:  npm run build  ->  npm run dev  ->  check the top bar  ->  git push');
