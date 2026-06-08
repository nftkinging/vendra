/* ============================================================
   batch27_circle_view.js  —  Vendra, Batch 27 (Wave 1.5: viewing)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch27_circle_view.js
   ------------------------------------------------------------
   Makes Circle-login users equal to web3 for VIEWING:
     - app/Nav.tsx        : Profile link shows for web3 OR Circle wallet
     - app/profile/page.tsx   : useVendraWallet + `ready` guard (no bounce)
     - app/store/edit/page.tsx: useVendraWallet identity (+ ready guard)
   Identity only — NO payment changes (buying / store-deploy come next,
   because Circle pays via /api/circle/send, not wagmi signing).
   Requires app/lib/useVendraWallet.ts (created in batch26).
   Backs up each file once (*.idbak). Safe to re-run.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
// Nav lives at app/Nav.tsx in this project; fall back to other common spots.
const navCandidates = [
  path.join(root, 'app', 'Nav.tsx'),
  path.join(root, 'components', 'Nav.tsx'),
  path.join(root, 'app', 'components', 'Nav.tsx'),
];
const NAV = navCandidates.find(p => fs.existsSync(p));
const profPath = path.join(root, 'app', 'profile', 'page.tsx');
const sePath = path.join(root, 'app', 'store', 'edit', 'page.tsx');
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');

if (!fs.existsSync(hookPath)) { console.error('\n  x  app/lib/useVendraWallet.ts missing. Run batch26_circle_identity.js first.\n'); process.exit(1); }
if (!NAV) { console.error('\n  x  Nav.tsx not found (looked in app/, components/, app/components/). Aborting.\n'); process.exit(1); }
for (const [p, l] of [[profPath, 'app/profile/page.tsx'], [sePath, 'app/store/edit/page.tsx']]) {
  if (!fs.existsSync(p)) { console.error('\n  x  ' + l + ' not found. Aborting.\n'); process.exit(1); }
}

function patch(file, label, repls) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of repls) {
    // check already-patched (`to`) FIRST — `from` can be a substring of `to`
    if (src.includes(to)) { /* already patched */ }
    else if (src.includes(from)) { src = src.split(from).join(to); changed++; }
    else { console.error('  x  ' + label + ': expected snippet not found, file aborted:\n     ' + from); return; }
  }
  if (changed > 0) {
    if (!fs.existsSync(file + '.idbak')) fs.copyFileSync(file, file + '.idbak');
    fs.writeFileSync(file, src, 'utf8');
    console.log('  +  ' + label + ' patched (' + changed + ' change' + (changed !== 1 ? 's' : '') + ')');
  } else { console.log('  .  ' + label + ' already up to date'); }
}

// 1) Nav: Profile link shows for web3 OR Circle users (Nav already has `mounted` + `circleWallet`)
patch(NAV, path.relative(root, NAV).replace(/\\/g, '/'), [
  ["{isConnected&&<Link href='/profile'>Profile</Link>}",
   "{(isConnected || (mounted && circleWallet)) && <Link href='/profile'>Profile</Link>}"],
]);

// 2) profile page: unified identity + wait for `ready` before redirecting
patch(profPath, 'app/profile/page.tsx', [
  ["import { useAccount } from 'wagmi';",
   "import { useVendraWallet } from '../lib/useVendraWallet';"],
  ["const { address, isConnected } = useAccount();",
   "const { address, isConnected, ready } = useVendraWallet();"],
  ["    if (!isConnected || !address) { router.push('/'); return; }",
   "    if (!ready) return;\n    if (!isConnected || !address) { router.push('/'); return; }"],
  ["  }, [address, isConnected, router]);",
   "  }, [address, isConnected, ready, router]);"],
]);

// 3) store/edit: unified identity + wait for `ready` (guard sits just before the fetch)
patch(sePath, 'app/store/edit/page.tsx', [
  ["import { useAccount } from 'wagmi';",
   "import { useVendraWallet } from '../../lib/useVendraWallet';"],
  ["const { address } = useAccount();",
   "const { address, ready } = useVendraWallet();"],
  ["    if (!address) return;\n    getStoreByWallet(address).then",
   "    if (!ready) return;\n    if (!address) return;\n    getStoreByWallet(address).then"],
  ["  }, [address, router]);",
   "  }, [address, ready, router]);"],
]);

console.log('\n  Done. npm run build -> npm run dev. While logged in with CIRCLE: the Profile link now shows,');
console.log('  and /profile + /store/edit load your data. (Buying still routes to /join until batch28.) Then git push.\n');
