/* ============================================================
   batch28_checkout_pay.js  —  Vendra, Batch 28 (Wave 2: buying)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch28_checkout_pay.js
   ------------------------------------------------------------
   Makes BUYING work for Circle users + gates checkout on a buyer profile.
     - app/checkout/page.tsx (rewritten):
         * identity via useVendraWallet (no more /join bounce for Circle)
         * payment rail BRANCHES by wallet type:
             web3  -> wagmi sendTransactionAsync (unchanged)
             Circle-> POST /api/circle/send (walletId/walletAddress/toAddress/amount)
                      order saved with tx_hash 'circle:<txId>'
         * buyer-profile GATE: no 'buyer' profile -> inline prompt ->
             /onboarding?role=buyer&next=<this checkout url>
         * keeps escrow job, success/error steps, styles (reuses classes)
     - app/onboarding/page.tsx (patched):
         * if ?next= present: skip role picker -> profile form, and after
           saveProfile redirect to next (so the user returns to checkout)
   Does NOT touch globals.css. Requires app/lib/useVendraWallet.ts (batch26).
   Backs up changed files once. Safe to re-run.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const coPath = path.join(root, 'app', 'checkout', 'page.tsx');
const onbPath = path.join(root, 'app', 'onboarding', 'page.tsx');
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');
if (!fs.existsSync(hookPath)) { console.error('\n  x  app/lib/useVendraWallet.ts missing. Run batch26_circle_identity.js first.\n'); process.exit(1); }
for (const [p, l] of [[coPath, 'app/checkout/page.tsx'], [onbPath, 'app/onboarding/page.tsx']]) {
  if (!fs.existsSync(p)) { console.error('\n  x  ' + l + ' not found. Run from project root.\n'); process.exit(1); }
}

/* ---------------- app/checkout/page.tsx ---------------- */
const PAGE = [
"'use client';",
"import Nav from '../Nav';",
"import Link from 'next/link';",
"import { Suspense, useState, useEffect } from 'react';",
"import { useSearchParams, useRouter } from 'next/navigation';",
"import { useSendTransaction } from 'wagmi';",
"import { parseUnits } from 'viem';",
"import { saveOrder, createEscrowJob, getProfile } from '../lib/supabase';",
"import { useVendraWallet } from '../lib/useVendraWallet';",
"",
"function CheckoutContent() {",
"  const params = useSearchParams();",
"  const router = useRouter();",
"  const { address, isCircle, circle, ready } = useVendraWallet();",
"  const { sendTransactionAsync } = useSendTransaction();",
"  const store = params.get('store') || '';",
"  const product = params.get('product') || '';",
"  const price = Number(params.get('price') || 0);",
"  const qty = Math.max(1, Number(params.get('qty') || 1));",
"  const total = price * qty;",
"  const seller = (params.get('seller') || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8') as `0x${string}`;",
"  const [step, setStep] = useState<'review'|'paying'|'success'|'error'>('review');",
"  const [txHash, setTxHash] = useState('');",
"  const [error, setError] = useState('');",
"  const [gate, setGate] = useState<'checking'|'ok'|'need'>('checking');",
"  const nextUrl = '/checkout?' + params.toString();",
"",
"  useEffect(() => {",
"    if (!ready) return;",
"    if (!address) { setGate('ok'); return; }",
"    getProfile(address, 'buyer').then(p => setGate(p ? 'ok' : 'need')).catch(() => setGate('ok'));",
"  }, [ready, address]);",
"",
"  const handleBuy = async () => {",
"    if (!address) { router.push('/join'); return; }",
"    setStep('paying');",
"    try {",
"      let hash: string;",
"      if (isCircle && circle) {",
"        const res = await fetch('/api/circle/send', {",
"          method: 'POST',",
"          headers: { 'Content-Type': 'application/json' },",
"          body: JSON.stringify({ walletId: circle.walletId, walletAddress: address, toAddress: seller, amount: total.toString() }),",
"        });",
"        const data = await res.json();",
"        if (data.error) throw new Error(data.error);",
"        hash = 'circle:' + (data.txId || '');",
"      } else {",
"        hash = await sendTransactionAsync({ to: seller, value: parseUnits(total.toString(), 18) });",
"      }",
"      const order = await saveOrder({ buyer_wallet: address, seller_wallet: seller, product_name: qty > 1 ? product + ' x' + qty : product, amount: total, tx_hash: hash });",
"      await createEscrowJob({ order_id: order?.id, buyer_wallet: address, seller_wallet: seller, amount: total, tx_hash: hash });",
"      setTxHash(hash); setStep('success');",
"    } catch (e: any) {",
"      setError(e?.message?.includes('rejected') ? 'Transaction rejected in wallet' : (e?.message || 'Transaction failed \u2014 please try again'));",
"      setStep('error');",
"    }",
"  };",
"",
"  return (",
"    <main className='v4home'>",
"      <Nav theme='v4' />",
"      <div className='co-wrap'>",
"        {step === 'review' && (<>",
"          <p className='eyebrow'>Checkout</p>",
"          <h1 className='co-title'>Confirm your <span className='v4amber'>purchase</span></h1>",
"          <div className='co-card'>",
"            <div className='co-row'>",
"              <div>",
"                <div className='co-lbl'>Product</div>",
"                <div className='co-prod'>{product}</div>",
"                <div className='co-store'>{store}</div>",
"              </div>",
"              <div className='co-qtytag'>Qty {qty}</div>",
"            </div>",
"            <div className='co-total'>",
"              <span className='co-lbl'>Total</span>",
"              <span className='co-amt'>{total}<span className='u'>USDC</span></span>",
"            </div>",
"          </div>",
"          <div className='co-escrow'><span className='co-dot' /><span>Funds are held in ERC-8183 escrow until you confirm delivery. 48-hour dispute window, full refund if the item is not as described.</span></div>",
"          {gate === 'need' ? (<>",
"            <div className='co-escrow' style={{ background: 'var(--v4-aSoft2)' }}><span className='co-dot' /><span>You need a buyer profile to complete checkout \u2014 it takes a few seconds and lets you track your orders.</span></div>",
"            <Link href={'/onboarding?role=buyer&next=' + encodeURIComponent(nextUrl)} className='v4btn v4btn-amber co-pay'>Create a buyer profile <span className='arr'>\u2192</span></Link>",
"          </>) : (",
"            <button onClick={handleBuy} disabled={gate === 'checking'} className='v4btn v4btn-amber co-pay'>Pay {total} USDC on Arc <span className='arr'>\u2192</span></button>",
"          )}",
"          <div className='co-back'><Link href={'/store/' + store}>\u2190 Back to store</Link></div>",
"        </>)}",
"        {step === 'paying' && (",
"          <div className='co-state'>",
"            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />",
"            <h2 className='co-state-h'>Processing</h2>",
"            <p className='co-state-p'>{isCircle ? 'Sending USDC from your Circle wallet\u2026' : 'Approve the payment in your wallet\u2026'}</p>",
"          </div>)}",
"        {step === 'success' && (",
"          <div className='co-state'>",
"            <div className='co-tick'>\u2713</div>",
"            <h2 className='co-state-h'>Payment confirmed</h2>",
"            <p className='co-state-p'>Settled on Arc Testnet \u00b7 ERC-8183 escrow active, releases in 48 hours.</p>",
"            {txHash && <div className='co-tx'>{txHash}</div>}",
"            <div className='co-state-actions'>",
"              <Link href='/profile' className='v4btn v4btn-amber'>View my orders</Link>",
"              <Link href='/marketplace' className='v4btn v4btn-ghost'>Keep shopping</Link>",
"            </div>",
"          </div>)}",
"        {step === 'error' && (",
"          <div className='co-state'>",
"            <div className='co-cross'>\u2715</div>",
"            <h2 className='co-state-h'>Transaction failed</h2>",
"            <p className='co-state-p'>{error}</p>",
"            <button onClick={() => setStep('review')} className='v4btn v4btn-ghost' style={{ marginTop: 20 }}>Try again</button>",
"          </div>)}",
"      </div>",
"    </main>",
"  );",
"}",
"",
"export default function Checkout() {",
"  return <Suspense><CheckoutContent /></Suspense>;",
"}",
""
].join("\n");

if (!fs.existsSync(coPath + '.paybak')) fs.copyFileSync(coPath, coPath + '.paybak');
fs.writeFileSync(coPath, PAGE, 'utf8');
console.log('  +  app/checkout/page.tsx rewritten (Circle+web3 pay branch, buyer gate)');

/* ---------------- app/onboarding/page.tsx (honor ?next=) ---------------- */
function patch(file, label, repls) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of repls) {
    if (src.includes(to)) { /* already patched */ }
    else if (src.includes(from)) { src = src.split(from).join(to); changed++; }
    else { console.error('  x  ' + label + ': expected snippet not found:\n     ' + from); return; }
  }
  if (changed > 0) {
    if (!fs.existsSync(file + '.nextbak')) fs.copyFileSync(file, file + '.nextbak');
    fs.writeFileSync(file, src, 'utf8');
    console.log('  +  ' + label + ' patched for ?next= (' + changed + ' change' + (changed !== 1 ? 's' : '') + ')');
  } else { console.log('  .  ' + label + ' already honors ?next='); }
}

patch(onbPath, 'app/onboarding/page.tsx', [
  ["const [step, setStep] = useState<'role'|'profile'|'done'>('role');",
   "const [step, setStep] = useState<'role'|'profile'|'done'>(params.get('next') ? 'profile' : 'role');"],
  ["      setStep('done');",
   "      if (params.get('next')) { router.replace(params.get('next')!); return; }\n      setStep('done');"],
]);

console.log('\n  Done. npm run build -> npm run dev.');
console.log('  As a CIRCLE user with no buyer profile: checkout now prompts to create one, then returns you to checkout to pay via your Circle wallet.');
console.log('  Then git push.  (Note: web3 checkout still sends native value; unifying both rails to USDC is on the punch-list.)\n');
