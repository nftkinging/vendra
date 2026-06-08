/* ============================================================
   batch30_storecreate_pay.js  —  Vendra, Batch 30 (Wave 3)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch30_storecreate_pay.js
   ------------------------------------------------------------
   Makes store creation work for Circle sellers + gates on a seller profile.
     - app/store/create/page.tsx (patched):
         * identity via useVendraWallet (no "connect wallet" for Circle)
         * deploy-fee payment BRANCHES by wallet type:
             web3   -> wagmi sendTransactionAsync (unchanged)
             Circle -> POST /api/circle/send  (deploy_fee_tx 'circle:<txId>')
         * seller-profile GATE -> /onboarding?role=seller&next=/store/create
         * Circle-aware "paying" copy
         * keeps existing-store guard, banner upload, saveStore, success step
   Targeted patches (no full rewrite). Requires app/lib/useVendraWallet.ts
   (batch26). Backs up the file once (*.paybak). Safe to re-run.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const scPath = path.join(root, 'app', 'store', 'create', 'page.tsx');
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');
if (!fs.existsSync(hookPath)) { console.error('\n  x  app/lib/useVendraWallet.ts missing. Run batch26_circle_identity.js first.\n'); process.exit(1); }
if (!fs.existsSync(scPath)) { console.error('\n  x  app/store/create/page.tsx not found. Run from project root.\n'); process.exit(1); }

const repls = [
  // 1) react import: add useEffect
  ["import { useState, useRef } from 'react';",
   "import { useState, useRef, useEffect } from 'react';"],

  // 2) wagmi useAccount -> unified hook (keep useSendTransaction import on its own line)
  ["import { useAccount } from 'wagmi';",
   "import { useVendraWallet } from '../../lib/useVendraWallet';"],

  // 3) supabase: add getProfile
  ["import { saveStore, getStoreByWallet, uploadImage } from '../../lib/supabase';",
   "import { saveStore, getStoreByWallet, uploadImage, getProfile } from '../../lib/supabase';"],

  // 4) identity
  ["  const { address, isConnected } = useAccount();",
   "  const { address, isCircle, circle, ready } = useVendraWallet();"],

  // 5) seller-gate state + effect (after loading state, before return)
  ["  const [loading, setLoading] = useState(false);",
   "  const [loading, setLoading] = useState(false);\n" +
   "  const [gate, setGate] = useState<'checking'|'ok'|'need'>('checking');\n\n" +
   "  useEffect(() => {\n" +
   "    if (!ready) return;\n" +
   "    if (!address) { setGate('ok'); return; }\n" +
   "    getProfile(address, 'seller').then(p => setGate(p ? 'ok' : 'need')).catch(() => setGate('ok'));\n" +
   "  }, [ready, address]);"],

  // 6) handler connect-gate
  ["    if (!address || !isConnected) { setError('Please connect your wallet'); return; }",
   "    if (!address) { setError('Please connect your wallet'); return; }"],

  // 7) deploy-fee payment branch
  ["      const hash = await sendTransactionAsync({ to: FEE_WALLET, value: parseUnits(FEE.toString(), 18) });",
   "      let hash: string;\n" +
   "      if (isCircle && circle) {\n" +
   "        const res = await fetch('/api/circle/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ walletId: circle.walletId, walletAddress: address, toAddress: FEE_WALLET, amount: FEE.toString() }) });\n" +
   "        const data = await res.json();\n" +
   "        if (data.error) throw new Error(data.error);\n" +
   "        hash = 'circle:' + (data.txId || '');\n" +
   "      } else {\n" +
   "        hash = await sendTransactionAsync({ to: FEE_WALLET, value: parseUnits(FEE.toString(), 18) });\n" +
   "      }"],

  // 8) paying copy — Circle-aware
  ["            <p className='sc-state-p'>{'Approve the $'}{FEE}{' USDC deployment fee in your wallet\u2026'}</p>",
   "            <p className='sc-state-p'>{isCircle ? <>{'Sending the $'}{FEE}{' USDC deployment fee\u2026'}</> : <>{'Approve the $'}{FEE}{' USDC deployment fee in your wallet\u2026'}</>}</p>"],

  // 9) deploy button -> seller gate
  ["            <button onClick={handleCreate} disabled={loading} className='v4btn v4btn-amber ob-cta'>{'Deploy store on Arc \u00b7 $'}{FEE}{' USDC \u2192'}</button>",
   "            {gate === 'need' ? (<>\n" +
   "              <div className='co-escrow' style={{ background: 'var(--v4-aSoft2)' }}><span className='co-dot' /><span>You need a seller profile to set up a store \u2014 it takes a few seconds.</span></div>\n" +
   "              <Link href={'/onboarding?role=seller&next=' + encodeURIComponent('/store/create')} className='v4btn v4btn-amber ob-cta' style={{ textAlign: 'center', display: 'block' }}>{'Create a seller profile \u2192'}</Link>\n" +
   "            </>) : (\n" +
   "              <button onClick={handleCreate} disabled={loading || gate === 'checking'} className='v4btn v4btn-amber ob-cta'>{'Deploy store on Arc \u00b7 $'}{FEE}{' USDC \u2192'}</button>\n" +
   "            )}"],
];

let src = fs.readFileSync(scPath, 'utf8');
let changed = 0, already = 0;
for (const [from, to] of repls) {
  if (src.includes(to)) { already++; }
  else if (src.includes(from)) { src = src.split(from).join(to); changed++; }
  else { console.error('  x  app/store/create/page.tsx: expected snippet not found, ABORTED:\n     ' + JSON.stringify(from.slice(0, 80))); process.exit(1); }
}
if (changed > 0) {
  if (!fs.existsSync(scPath + '.paybak')) fs.copyFileSync(scPath, scPath + '.paybak');
  fs.writeFileSync(scPath, src, 'utf8');
  console.log('  +  app/store/create/page.tsx patched (' + changed + ' change' + (changed !== 1 ? 's' : '') + (already ? ', ' + already + ' already done' : '') + ')');
} else {
  console.log('  .  app/store/create/page.tsx already up to date');
}

console.log('\n  Done. npm run build -> npm run dev. As a CIRCLE user with no seller profile: "Sell" / store setup');
console.log('  prompts to create a seller profile, then returns you to deploy the store via your Circle wallet. Then git push.\n');
