/* ============================================================
   batch35_circle_navsync.js  —  Vendra, Batch 35
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch35_circle_navsync.js
   ------------------------------------------------------------
   Fixes: after logging in with Circle from the /join page, the nav
   still shows "Log In" until a manual refresh. The Nav reads the
   Circle wallet from sessionStorage only once on mount; same-tab
   writes don't notify it.
     - app/join/page.tsx : saveWallet/logout now broadcast a
         'vendra-circle-change' window event
     - app/Nav.tsx       : same broadcast on its own saveWallet/logout,
         PLUS a listener that re-reads sessionStorage on that event
         (and cross-tab 'storage'), so the nav updates instantly
   Identity/UI otherwise unchanged. Backs up each file once (*.syncbak).
   Safe to re-run.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const navPath = [path.join(root, 'app', 'Nav.tsx'), path.join(root, 'components', 'Nav.tsx'), path.join(root, 'app', 'components', 'Nav.tsx')].find(p => fs.existsSync(p));
const joinPath = path.join(root, 'app', 'join', 'page.tsx');
if (!navPath) { console.error('\n  x  Nav.tsx not found. Aborting.\n'); process.exit(1); }
if (!fs.existsSync(joinPath)) { console.error('\n  x  app/join/page.tsx not found. Aborting.\n'); process.exit(1); }

function patch(file, label, repls) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of repls) {
    if (src.includes(to)) { /* already patched */ }
    else if (src.includes(from)) { src = src.split(from).join(to); changed++; }
    else { console.error('  x  ' + label + ': expected snippet not found, file aborted:\n     ' + JSON.stringify(from.slice(0, 90))); return false; }
  }
  if (changed > 0) {
    if (!fs.existsSync(file + '.syncbak')) fs.copyFileSync(file, file + '.syncbak');
    fs.writeFileSync(file, src, 'utf8');
    console.log('  +  ' + label + ' patched (' + changed + ' change' + (changed !== 1 ? 's' : '') + ')');
  } else { console.log('  .  ' + label + ' already up to date'); }
  return true;
}

const NAV_MOUNT_FROM = [
"  useEffect(() => {",
"    setMounted(true);",
"    try {",
"      const saved = sessionStorage.getItem(STORAGE_KEY);",
"      if (saved) { const w = JSON.parse(saved); setCircleWallet(w); fetchBalance(w.walletId); }",
"    } catch {}",
"  }, []);"
].join("\n");

const NAV_MOUNT_TO = NAV_MOUNT_FROM + "\n\n" + [
"  useEffect(() => {",
"    const sync = () => {",
"      try {",
"        const saved = sessionStorage.getItem(STORAGE_KEY);",
"        if (saved) { const w = JSON.parse(saved); setCircleWallet(w); fetchBalance(w.walletId); }",
"        else setCircleWallet(null);",
"      } catch { setCircleWallet(null); }",
"    };",
"    window.addEventListener('vendra-circle-change', sync);",
"    window.addEventListener('storage', sync);",
"    return () => { window.removeEventListener('vendra-circle-change', sync); window.removeEventListener('storage', sync); };",
"  }, []);"
].join("\n");

patch(navPath, path.relative(root, navPath).replace(/\\/g, '/'), [
  [NAV_MOUNT_FROM, NAV_MOUNT_TO],
  ["const saveWallet = (w: CircleWallet) => { setCircleWallet(w); try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch {} };",
   "const saveWallet = (w: CircleWallet) => { setCircleWallet(w); try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(w)); window.dispatchEvent(new Event('vendra-circle-change')); } catch {} };"],
  ["const logout = () => { setCircleWallet(null); try { sessionStorage.removeItem(STORAGE_KEY); } catch {} setShowDashboard(false); setShowCircle(false); };",
   "const logout = () => { setCircleWallet(null); try { sessionStorage.removeItem(STORAGE_KEY); window.dispatchEvent(new Event('vendra-circle-change')); } catch {} setShowDashboard(false); setShowCircle(false); };"],
]);

patch(joinPath, 'app/join/page.tsx', [
  ["const saveWallet = (w: any) => { setCircleWallet(w); try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch {} };",
   "const saveWallet = (w: any) => { setCircleWallet(w); try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(w)); window.dispatchEvent(new Event('vendra-circle-change')); } catch {} };"],
  ["const logout = () => { setCircleWallet(null); try { sessionStorage.removeItem(STORAGE_KEY); } catch {} setMode('options'); setStep('email'); setEmail(''); };",
   "const logout = () => { setCircleWallet(null); try { sessionStorage.removeItem(STORAGE_KEY); window.dispatchEvent(new Event('vendra-circle-change')); } catch {} setMode('options'); setStep('email'); setEmail(''); };"],
]);

console.log('\n  Done. npm run build -> npm run dev. Log in with Circle from /join: the nav switches from "Log In"');
console.log('  to your wallet immediately (no refresh). Logout updates it too. Then git push.\n');
