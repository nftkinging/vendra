/* ============================================================
   batch36_mobile_nav.js  —  Vendra, Batch 36 (mobile)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch36_mobile_nav.js
   ------------------------------------------------------------
   Gives the Nav a real mobile layout (was desktop-only; on phones the
   links dropped and the wallet cluster overflowed, hiding logout).
     - app/Nav.tsx:
         * adds `menuOpen` state
         * adds a mobile-only bar (cart + hamburger) and a tap menu with
           Marketplace / Sell / Profile + wallet actions (Log In, or
           Circle address->dashboard->logout, or web3 connect/disconnect)
     - app/globals.css: appends V4 MOBILE NAV styles (<=720px). On mobile
       the desktop .v-nav-right is hidden and the menu takes over; desktop
       is completely unchanged.
   Backs up files once. Idempotent.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const navPath = [path.join(root, 'app', 'Nav.tsx'), path.join(root, 'components', 'Nav.tsx'), path.join(root, 'app', 'components', 'Nav.tsx')].find(p => fs.existsSync(p));
const cssPath = path.join(root, 'app', 'globals.css');
if (!navPath) { console.error('\n  x  Nav.tsx not found.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }

const navRel = path.relative(root, navPath).replace(/\\/g, '/');
let nav = fs.readFileSync(navPath, 'utf8');

// 1) add menuOpen state (anchor on the unique circleWallet state line)
const stateFrom = "  const [circleWallet, setCircleWallet] = useState<CircleWallet|null>(null);";
const stateTo = stateFrom + "\n  const [menuOpen, setMenuOpen] = useState(false);";

// 2) insert mobile bar + menu panel just before </nav>
const closeFrom = "        </div>\n      </nav>";
const closeTo = [
"        </div>",
"        <div className='v-nav-mobile-bar'>",
"          <CartButton/>",
"          <button className='v-nav-burger' onClick={() => setMenuOpen(o => !o)} aria-label='Menu'>{menuOpen ? '\u2715' : '\u2630'}</button>",
"        </div>",
"        {menuOpen && (",
"          <div className='v-nav-mobile'>",
"            <Link href='/marketplace' onClick={() => setMenuOpen(false)}>Marketplace</Link>",
"            <Link href='/store/create' onClick={() => setMenuOpen(false)}>Sell</Link>",
"            {(isConnected || (mounted && circleWallet)) && <Link href='/profile' onClick={() => setMenuOpen(false)}>Profile</Link>}",
"            <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' onClick={() => setMenuOpen(false)}>\uD83D\uDCA7 Faucet</a>",
"            <div className='v-nav-mobile-wallet'>",
"              {isConnected",
"                ? <ConnectButton accountStatus='address' chainStatus='none' showBalance={false}/>",
"                : mounted && circleWallet",
"                  ? <button onClick={() => { setShowDashboard(true); fetchBalance(circleWallet.walletId); setMenuOpen(false); }} className='btn-nav-amber' style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><span>\u2B55</span><span>{shortAddr(circleWallet.address)}</span></button>",
"                  : <button onClick={() => { setShowLogin(true); setMenuOpen(false); }} className='btn-nav-amber'>Log In</button>}",
"            </div>",
"          </div>",
"        )}",
"      </nav>"
].join("\n");

let changed = 0;
for (const [from, to] of [[stateFrom, stateTo], [closeFrom, closeTo]]) {
  if (nav.includes(to)) { /* already */ }
  else if (nav.includes(from)) { nav = nav.split(from).join(to); changed++; }
  else { console.error('  x  ' + navRel + ': anchor not found, ABORTED:\n     ' + JSON.stringify(from.slice(0, 70))); process.exit(1); }
}
if (changed > 0) {
  if (!fs.existsSync(navPath + '.mobbak')) fs.copyFileSync(navPath, navPath + '.mobbak');
  fs.writeFileSync(navPath, nav, 'utf8');
  console.log('  +  ' + navRel + ' patched (mobile bar + menu, ' + changed + ' change' + (changed !== 1 ? 's' : '') + ')');
} else { console.log('  .  ' + navRel + ' already has the mobile menu'); }

// 3) append mobile nav CSS (idempotent)
const MARK = '/* === V4 MOBILE NAV === */';
const CSS = [
MARK,
".v-nav-burger{display:none;}",
".v-nav-mobile-bar{display:none;}",
".v-nav-mobile{display:none;}",
"@media(max-width:720px){",
"  .v-nav .v-nav-right{display:none !important;}",
"  .v-nav .v-nav-links{display:none !important;}",
"  .v-nav-mobile-bar{display:flex;align-items:center;gap:10px;}",
"  .v-nav-burger{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:12px;border:1px solid var(--v4-line2);background:var(--v4-card);color:var(--v4-ink);font-size:17px;line-height:1;padding:0;cursor:pointer;}",
"  .v-nav-mobile{display:block;position:absolute;top:100%;left:0;right:0;background:var(--v4-paper);border-top:1px solid var(--v4-line);border-bottom:1px solid var(--v4-line);box-shadow:0 20px 44px rgba(0,0,0,.14);padding:8px 18px 20px;z-index:200;}",
"  .v-nav-mobile a{display:block;padding:15px 4px;font-size:16px;font-weight:500;color:var(--v4-ink);text-decoration:none;border-bottom:1px solid var(--v4-line);}",
"  .v-nav-mobile a:last-of-type{border-bottom:none;}",
"  .v-nav-mobile-wallet{margin-top:14px;display:flex;flex-direction:column;gap:10px;}",
"  .v-nav-mobile-wallet .btn-nav-amber{width:100%;justify-content:center;padding:14px;font-size:15px;}",
"  .v-nav-mobile-wallet [data-rk]{width:100%;}",
"}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) css = css.slice(0, i).replace(/\s+$/, '') + '\n\n';
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  V4 MOBILE NAV styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev. On a phone: tap the menu button (top-right) for');
console.log('  Marketplace / Sell / Profile and your wallet (login / address / logout). Then git push.\n');
