/* ============================================================
   batch29_cartcheckout_pay.js  —  Vendra, Batch 29 (Wave 2b)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch29_cartcheckout_pay.js
   ------------------------------------------------------------
   Same treatment as batch28, for the multi-store cart checkout:
     - app/cart/checkout/page.tsx (patched):
         * identity via useVendraWallet (no /join bounce for Circle)
         * per-store payment BRANCHES by wallet type inside the loop:
             web3   -> wagmi sendTransactionAsync (unchanged)
             Circle -> POST /api/circle/send  (tx_hash 'circle:<txId>')
         * buyer-profile GATE -> /onboarding?role=buyer&next=/cart/checkout
         * Circle-aware copy ("Sending USDC" / "separate transfers")
         * keeps per-store grouping, escrow jobs, seller reputation, clearCart
   Targeted patches (no full rewrite). Requires app/lib/useVendraWallet.ts
   (batch26). Backs up the file once (*.paybak). Safe to re-run.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const ccPath = path.join(root, 'app', 'cart', 'checkout', 'page.tsx');
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');
if (!fs.existsSync(hookPath)) { console.error('\n  x  app/lib/useVendraWallet.ts missing. Run batch26_circle_identity.js first.\n'); process.exit(1); }
if (!fs.existsSync(ccPath)) { console.error('\n  x  app/cart/checkout/page.tsx not found. Run from project root.\n'); process.exit(1); }

const repls = [
  // 1) react import: add useEffect
  ["import { useState } from 'react';",
   "import { useState, useEffect } from 'react';"],

  // 2) wagmi: keep useSendTransaction, add unified hook
  ["import { useAccount, useSendTransaction } from 'wagmi';",
   "import { useSendTransaction } from 'wagmi';\nimport { useVendraWallet } from '../../lib/useVendraWallet';"],

  // 3) supabase: add getProfile
  ["import { saveOrder, createEscrowJob, upsertSellerReputation } from '../../lib/supabase';",
   "import { saveOrder, createEscrowJob, upsertSellerReputation, getProfile } from '../../lib/supabase';"],

  // 4) identity
  ["  const { address, isConnected } = useAccount();",
   "  const { address, isCircle, circle, ready } = useVendraWallet();"],

  // 5) gate state + effect (inserted right after error state, before any early return)
  ["  const [error, setError] = useState('');",
   "  const [error, setError] = useState('');\n" +
   "  const [gate, setGate] = useState<'checking'|'ok'|'need'>('checking');\n\n" +
   "  useEffect(() => {\n" +
   "    if (!ready) return;\n" +
   "    if (!address) { setGate('ok'); return; }\n" +
   "    getProfile(address, 'buyer').then(p => setGate(p ? 'ok' : 'need')).catch(() => setGate('ok'));\n" +
   "  }, [ready, address]);"],

  // 6) handler connect-gate
  ["    if (!isConnected || !address) { router.push('/join'); return; }",
   "    if (!address) { router.push('/join'); return; }"],

  // 7) per-store payment branch
  ["        const hash = await sendTransactionAsync({ to: sellerWallet, value: parseUnits(storeTotal.toString(), 18) });",
   "        let hash: string;\n" +
   "        if (isCircle && circle) {\n" +
   "          const res = await fetch('/api/circle/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ walletId: circle.walletId, walletAddress: address, toAddress: sellerWallet, amount: storeTotal.toString() }) });\n" +
   "          const data = await res.json();\n" +
   "          if (data.error) throw new Error(data.error);\n" +
   "          hash = 'circle:' + (data.txId || '');\n" +
   "        } else {\n" +
   "          hash = await sendTransactionAsync({ to: sellerWallet, value: parseUnits(storeTotal.toString(), 18) });\n" +
   "        }"],

  // 8) pay button -> buyer gate
  ["          <button onClick={handleCheckout} className='v4btn v4btn-amber co-pay'>Pay {total().toFixed(2)} USDC on Arc <span className='arr'>\u2192</span></button>",
   "          {gate === 'need' ? (<>\n" +
   "            <div className='co-escrow' style={{ background: 'var(--v4-aSoft2)' }}><span className='co-dot' /><span>You need a buyer profile to complete checkout \u2014 it takes a few seconds and lets you track your orders.</span></div>\n" +
   "            <Link href={'/onboarding?role=buyer&next=' + encodeURIComponent('/cart/checkout')} className='v4btn v4btn-amber co-pay'>Create a buyer profile <span className='arr'>\u2192</span></Link>\n" +
   "          </>) : (\n" +
   "            <button onClick={handleCheckout} disabled={gate === 'checking'} className='v4btn v4btn-amber co-pay'>Pay {total().toFixed(2)} USDC on Arc <span className='arr'>\u2192</span></button>\n" +
   "          )}"],

  // 9) paying copy — Circle-aware
  ["            <p className='co-state-p'>Approve payment to {currentSeller} in your wallet\u2026</p>",
   "            <p className='co-state-p'>{isCircle ? <>Sending USDC to {currentSeller}\u2026</> : <>Approve payment to {currentSeller} in your wallet\u2026</>}</p>"],

  // 10) multi-store note — Circle-aware wording
  ["            {Object.keys(grouped).length > 1 && <div className='cco-note'>\u26A1 {Object.keys(grouped).length} separate wallet approvals \u2014 one per store</div>}",
   "            {Object.keys(grouped).length > 1 && <div className='cco-note'>\u26A1 {Object.keys(grouped).length} {isCircle ? 'separate transfers' : 'separate wallet approvals'} \u2014 one per store</div>}"],
];

let src = fs.readFileSync(ccPath, 'utf8');
let changed = 0, already = 0;
for (const [from, to] of repls) {
  if (src.includes(to)) { already++; }              // check already-patched FIRST (from may be substring of to)
  else if (src.includes(from)) { src = src.split(from).join(to); changed++; }
  else { console.error('  x  app/cart/checkout/page.tsx: expected snippet not found, ABORTED:\n     ' + JSON.stringify(from.slice(0, 80))); process.exit(1); }
}
if (changed > 0) {
  if (!fs.existsSync(ccPath + '.paybak')) fs.copyFileSync(ccPath, ccPath + '.paybak');
  fs.writeFileSync(ccPath, src, 'utf8');
  console.log('  +  app/cart/checkout/page.tsx patched (' + changed + ' change' + (changed !== 1 ? 's' : '') + (already ? ', ' + already + ' already done' : '') + ')');
} else {
  console.log('  .  app/cart/checkout/page.tsx already up to date');
}

console.log('\n  Done. npm run build -> npm run dev. As a CIRCLE user with no buyer profile: the cart');
console.log('  checkout prompts to create one, then returns you to pay each store via your Circle wallet. Then git push.\n');
