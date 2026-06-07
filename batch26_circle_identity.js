/* ============================================================
   batch26_circle_identity.js  —  Vendra, Batch 26 (Wave 1)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch26_circle_identity.js
   ------------------------------------------------------------
   Unified wallet identity so Circle-login users work like web3 users.
     - creates app/lib/useVendraWallet.ts (wagmi address OR Circle
       address from sessionStorage)
     - patches app/onboarding/page.tsx and app/edit-profile/page.tsx
       to use it instead of useAccount() (identity only; all other
       logic untouched)
   This fixes "Please connect your wallet" for Circle users creating
   buyer/seller profiles. Checkout + store gating come in later waves.
   Backs up patched files once. Safe to re-run (it checks first).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');
const onbPath = path.join(root, 'app', 'onboarding', 'page.tsx');
const edPath = path.join(root, 'app', 'edit-profile', 'page.tsx');
for (const [p, label] of [[onbPath, 'app/onboarding/page.tsx'], [edPath, 'app/edit-profile/page.tsx']]) {
  if (!fs.existsSync(p)) { console.error('\n  x  ' + label + ' not found. Run from project root.\n'); process.exit(1); }
}

const HOOK = [
"'use client';",
"import { useAccount } from 'wagmi';",
"import { useState, useEffect } from 'react';",
"",
"const STORAGE_KEY = 'vendra_circle_wallet';",
"type CircleWallet = { address: string; walletId: string; email: string };",
"",
"/**",
" * Unified wallet identity for Vendra.",
" * Returns the connected web3 (wagmi) address when present, otherwise the",
" * Circle wallet address saved in sessionStorage. This lets Circle-login",
" * users buy, sell and own profiles exactly like web3 users.",
" *",
" * `ready` is true once sessionStorage has been read on the client — pages",
" * that redirect when disconnected should wait for `ready` before deciding.",
" */",
"export function useVendraWallet() {",
"  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();",
"  const [circle, setCircle] = useState<CircleWallet | null>(null);",
"  const [ready, setReady] = useState(false);",
"",
"  useEffect(() => {",
"    try {",
"      const s = sessionStorage.getItem(STORAGE_KEY);",
"      setCircle(s ? JSON.parse(s) : null);",
"    } catch { setCircle(null); }",
"    setReady(true);",
"  }, []);",
"",
"  const usingWagmi = wagmiConnected && !!wagmiAddress;",
"  const address = (usingWagmi ? wagmiAddress : circle?.address) as `0x${string}` | undefined;",
"  const isConnected = !!address;",
"",
"  return { address, isConnected, isCircle: !usingWagmi && !!circle, circle, ready };",
"}",
""
].join("\n");

// write hook
fs.mkdirSync(path.dirname(hookPath), { recursive: true });
if (fs.existsSync(hookPath) && !fs.existsSync(hookPath + '.bak')) fs.copyFileSync(hookPath, hookPath + '.bak');
fs.writeFileSync(hookPath, HOOK, 'utf8');
console.log('  +  app/lib/useVendraWallet.ts created');

function patch(file, label, repls) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = 0, already = 0;
  for (const [from, to] of repls) {
    if (src.includes(from)) { src = src.split(from).join(to); changed++; }
    else if (src.includes(to)) { already++; }
    else { console.error('  x  ' + label + ': expected snippet not found:\n     ' + from + '\n     (file may differ from the expected v4 version — aborting that file)'); return false; }
  }
  if (changed > 0) {
    if (!fs.existsSync(file + '.idbak')) fs.copyFileSync(file, file + '.idbak');
    fs.writeFileSync(file, src, 'utf8');
    console.log('  +  ' + label + ' patched (' + changed + ' change' + (changed !== 1 ? 's' : '') + ')');
  } else {
    console.log('  .  ' + label + ' already using useVendraWallet (no change)');
  }
  return true;
}

patch(onbPath, 'app/onboarding/page.tsx', [
  ["import { useAccount } from 'wagmi';", "import { useVendraWallet } from '../lib/useVendraWallet';"],
  ["const { address, isConnected } = useAccount();", "const { address, isConnected } = useVendraWallet();"],
]);

patch(edPath, 'app/edit-profile/page.tsx', [
  ["import { useAccount } from 'wagmi';", "import { useVendraWallet } from '../lib/useVendraWallet';"],
  ["const { address } = useAccount();", "const { address } = useVendraWallet();"],
]);

console.log('\n  Done. npm run build -> npm run dev. Log in with Circle, then create a buyer/seller profile (no more "connect wallet"). Then git push.\n');
