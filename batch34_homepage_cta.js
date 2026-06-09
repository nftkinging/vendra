/* ============================================================
   batch34_homepage_cta.js  —  Vendra, Batch 34
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch34_homepage_cta.js
   ------------------------------------------------------------
   Finishes web3 <-> Circle parity for the entry flow. The homepage
   "Start selling" / "Launch my store" buttons used brittle inline
   routing (a saved Circle wallet was forced to /onboarding; only
   both-roles went to /welcome). Now both buttons delegate to the
   /welcome hub, which already decides join / onboarding / chooser
   correctly for web3 AND Circle, with the reconnect grace window.
     - app/page.tsx (patched):
         * identity via useVendraWallet (web3 OR Circle)
         * handleGetStarted -> isConnected ? /welcome : /join
         * removes dead getAllProfiles/getStoreByWallet imports + loading state
   Targeted patches. Requires app/lib/useVendraWallet.ts (batch26).
   Backs up once (*.ctabak). Safe to re-run.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const pagePath = path.join(root, 'app', 'page.tsx');
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');
if (!fs.existsSync(hookPath)) { console.error('\n  x  app/lib/useVendraWallet.ts missing. Run batch26 first.\n'); process.exit(1); }
if (!fs.existsSync(pagePath)) { console.error('\n  x  app/page.tsx not found. Run from project root.\n'); process.exit(1); }

const OLD_HANDLER = [
"  const handleGetStarted = async () => {",
"    try {",
"      const saved = sessionStorage.getItem('vendra_circle_wallet');",
"      if (saved) { router.push('/onboarding'); return; }",
"    } catch {}",
"    if (!isConnected) { router.push('/join'); return; }",
"    setLoading(true);",
"    try {",
"      const [profiles, store] = await Promise.all([getAllProfiles(address!), getStoreByWallet(address!)]);",
"      const hasSeller = profiles.some((p:any) => p.role==='seller');",
"      const hasBuyer = profiles.some((p:any) => p.role==='buyer');",
"      if (hasSeller && hasBuyer) router.push('/welcome');",
"      else if (hasSeller || hasBuyer) router.push('/profile');",
"      else router.push('/onboarding');",
"    } catch { router.push('/onboarding'); }",
"    finally { setLoading(false); }",
"  };"
].join("\n");

const NEW_HANDLER = [
"  const handleGetStarted = () => {",
"    // Delegate to the /welcome hub: it handles web3 + Circle, decides",
"    // join / onboarding / chooser, and rides out the wallet reconnect.",
"    if (isConnected) router.push('/welcome');",
"    else router.push('/join');",
"  };"
].join("\n");

const repls = [
  ["import { useAccount } from 'wagmi';",
   "import { useVendraWallet } from './lib/useVendraWallet';"],
  ["import { getAllProfiles, getStoreByWallet, getStores } from './lib/supabase';",
   "import { getStores } from './lib/supabase';"],
  ["  const { address, isConnected } = useAccount();",
   "  const { isConnected } = useVendraWallet();"],
  [OLD_HANDLER, NEW_HANDLER],
  ["<button className='v4btn v4btn-amber' onClick={handleGetStarted} disabled={loading}>{loading ? 'Loading\u2026' : 'Start selling'} <span className='arr'>\u2192</span></button>",
   "<button className='v4btn v4btn-amber' onClick={handleGetStarted}>Start selling <span className='arr'>\u2192</span></button>"],
];

let src = fs.readFileSync(pagePath, 'utf8');
let changed = 0;
for (const [from, to] of repls) {
  if (src.includes(to)) { /* already patched */ }
  else if (src.includes(from)) { src = src.split(from).join(to); changed++; }
  else { console.error('  x  app/page.tsx: expected snippet not found, ABORTED:\n     ' + JSON.stringify(from.slice(0, 80))); process.exit(1); }
}

// remove the now-dead loading state line (handled separately: empty `to` can't use the loop)
const loadingLine = "  const [loading, setLoading] = useState(false);\n";
if (src.includes(loadingLine)) { src = src.replace(loadingLine, ''); changed++; }

if (changed > 0) {
  if (!fs.existsSync(pagePath + '.ctabak')) fs.copyFileSync(pagePath, pagePath + '.ctabak');
  fs.writeFileSync(pagePath, src, 'utf8');
  console.log('  +  app/page.tsx patched (' + changed + ' change' + (changed !== 1 ? 's' : '') + ')');
} else {
  console.log('  .  app/page.tsx already up to date');
}

console.log('\n  Done. npm run build -> npm run dev. Start selling / Launch my store now route to /welcome');
console.log('  for both web3 and Circle logins (logged-out -> /join). Then git push.\n');
