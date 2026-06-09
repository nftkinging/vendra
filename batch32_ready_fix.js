/* ============================================================
   batch32_ready_fix.js  —  Vendra, Batch 32
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch32_ready_fix.js
   ------------------------------------------------------------
   Fixes the brief /join flash on refresh. The unified wallet hook
   marked `ready` as soon as it read sessionStorage, but for web3
   users wagmi is still RECONNECTING then (address momentarily
   undefined), so redirect-gated pages bounced to /join and back.
   Now `ready` also waits for wagmi to finish (re)connecting.
   Rewrites app/lib/useVendraWallet.ts. Backs it up once. Idempotent.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');
if (!fs.existsSync(hookPath)) { console.error('\n  x  app/lib/useVendraWallet.ts not found. Run batch26 first.\n'); process.exit(1); }

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
" * Circle wallet address saved in sessionStorage \u2014 so Circle-login users",
" * behave exactly like web3 users.",
" *",
" * `ready` is true only once BOTH are settled: sessionStorage has been read,",
" * and wagmi has finished (re)connecting. Redirect-gated pages should wait",
" * for `ready` so they don't flash /join on a hard refresh.",
" */",
"export function useVendraWallet() {",
"  const { address: wagmiAddress, isConnected: wagmiConnected, status } = useAccount();",
"  const [circle, setCircle] = useState<CircleWallet | null>(null);",
"  const [sessionRead, setSessionRead] = useState(false);",
"",
"  useEffect(() => {",
"    try {",
"      const s = sessionStorage.getItem(STORAGE_KEY);",
"      setCircle(s ? JSON.parse(s) : null);",
"    } catch { setCircle(null); }",
"    setSessionRead(true);",
"  }, []);",
"",
"  const usingWagmi = wagmiConnected && !!wagmiAddress;",
"  const address = (usingWagmi ? wagmiAddress : circle?.address) as `0x${string}` | undefined;",
"  const isConnected = !!address;",
"  const wagmiSettling = status === 'connecting' || status === 'reconnecting';",
"  const ready = sessionRead && !wagmiSettling;",
"",
"  return { address, isConnected, isCircle: !usingWagmi && !!circle, circle, ready };",
"}",
""
].join("\n");

if (!fs.existsSync(hookPath + '.readybak')) fs.copyFileSync(hookPath, hookPath + '.readybak');
const cur = fs.readFileSync(hookPath, 'utf8');
if (cur === HOOK) { console.log('  .  app/lib/useVendraWallet.ts already up to date'); }
else { fs.writeFileSync(hookPath, HOOK, 'utf8'); console.log('  +  app/lib/useVendraWallet.ts updated (ready waits for wagmi to settle)'); }
console.log('\n  Done. npm run build -> npm run dev. Refresh /welcome while connected via web3: no more /join flash. Then git push.\n');
