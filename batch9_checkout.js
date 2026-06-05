/* ============================================================
   batch9_checkout.js  —  Vendra v4, Batch 9 (checkout/payment page)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch9_checkout.js
   ------------------------------------------------------------
   - rewrites app/checkout/page.tsx in the v4 look (light, pill CTA)
   - adds quantity support: reads &qty, shows it, charges price x qty
   - keeps all logic: wagmi sendTransaction, saveOrder, createEscrowJob,
     review/paying/success/error steps, Suspense wrapper
   - appends v4 checkout styles to globals.css (idempotent)
   Backs up the page once.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const pagePath = path.join(root, 'app', 'checkout', 'page.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
if (!fs.existsSync(pagePath)) { console.error('\n  x  app/checkout/page.tsx not found. Run from project root.\n'); process.exit(1); }
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found.\n'); process.exit(1); }

const PAGE = [
"'use client';",
"import Nav from '../Nav';",
"import Link from 'next/link';",
"import { Suspense, useState } from 'react';",
"import { useSearchParams, useRouter } from 'next/navigation';",
"import { useAccount, useSendTransaction } from 'wagmi';",
"import { parseUnits } from 'viem';",
"import { saveOrder, createEscrowJob } from '../lib/supabase';",
"",
"function CheckoutContent() {",
"  const params = useSearchParams();",
"  const router = useRouter();",
"  const { address, isConnected } = useAccount();",
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
"",
"  const handleBuy = async () => {",
"    if (!isConnected || !address) { router.push('/join'); return; }",
"    setStep('paying');",
"    try {",
"      const hash = await sendTransactionAsync({ to: seller, value: parseUnits(total.toString(), 18) });",
"      const order = await saveOrder({ buyer_wallet: address, seller_wallet: seller, product_name: qty > 1 ? product + ' x' + qty : product, amount: total, tx_hash: hash });",
"      await createEscrowJob({ order_id: order?.id, buyer_wallet: address, seller_wallet: seller, amount: total, tx_hash: hash });",
"      setTxHash(hash); setStep('success');",
"    } catch (e: any) {",
"      setError(e?.message?.includes('rejected') ? 'Transaction rejected in wallet' : 'Transaction failed \u2014 please try again');",
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
"          <button onClick={handleBuy} className='v4btn v4btn-amber co-pay'>Pay {total} USDC on Arc <span className='arr'>\u2192</span></button>",
"          <div className='co-back'><Link href={'/store/' + store}>\u2190 Back to store</Link></div>",
"        </>)}",
"        {step === 'paying' && (",
"          <div className='co-state'>",
"            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />",
"            <h2 className='co-state-h'>Processing</h2>",
"            <p className='co-state-p'>Approve the payment in your wallet\u2026</p>",
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

if (!fs.existsSync(pagePath + '.v3bak')) { fs.copyFileSync(pagePath, pagePath + '.v3bak'); console.log('  .  backup -> app/checkout/page.tsx.v3bak'); }
fs.writeFileSync(pagePath, PAGE, 'utf8');
console.log('  +  app/checkout/page.tsx rewritten in v4 (quantity-aware)');

const MARK = '/* === V4 CHECKOUT STYLES === */';
const CSS = [
MARK,
".v4home .co-wrap{max-width:540px;margin:0 auto;padding:calc(68px + clamp(40px,6vw,72px)) clamp(20px,5vw,40px) clamp(64px,8vw,96px);}",
".v4home .co-title{font-size:clamp(30px,5vw,48px);font-weight:600;letter-spacing:-.02em;line-height:1.02;margin:14px 0 28px;}",
".v4home .co-card{background:var(--v4-card);border:1px solid var(--v4-line);border-radius:18px;overflow:hidden;}",
".v4home .co-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:24px;border-bottom:1px solid var(--v4-line);}",
".v4home .co-lbl{font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--v4-tx40);margin-bottom:7px;}",
".v4home .co-prod{font-size:18px;font-weight:600;letter-spacing:-.01em;}",
".v4home .co-store{font-size:13px;color:var(--v4-tx40);margin-top:3px;}",
".v4home .co-qtytag{flex-shrink:0;font-size:12px;font-weight:600;color:var(--v4-tx60);border:1px solid var(--v4-line2);padding:5px 11px;border-radius:999px;}",
".v4home .co-total{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;}",
".v4home .co-amt{font-size:30px;font-weight:700;letter-spacing:-.02em;}",
".v4home .co-amt .u{font-size:13px;color:var(--v4-tx40);font-weight:500;margin-left:5px;}",
".v4home .co-escrow{display:flex;gap:11px;align-items:flex-start;margin:18px 0 24px;background:var(--v4-aSoft);border:1px solid var(--v4-aSoft2);border-radius:14px;padding:15px 17px;font-size:13px;color:var(--v4-tx60);line-height:1.55;}",
".v4home .co-dot{width:8px;height:8px;border-radius:50%;background:var(--v4-a);flex-shrink:0;margin-top:5px;}",
".v4home .co-pay{width:100%;justify-content:center;padding:16px;font-size:15px;}",
".v4home .co-back{text-align:center;margin-top:16px;}",
".v4home .co-back a{font-size:13px;color:var(--v4-tx40);text-decoration:none;}",
".v4home .co-back a:hover{color:var(--v4-ink);}",
".v4home .co-state{text-align:center;padding:48px 0;}",
".v4home .co-state-h{font-size:30px;font-weight:600;letter-spacing:-.01em;}",
".v4home .co-state-p{font-size:14px;color:var(--v4-tx60);line-height:1.7;margin-top:10px;}",
".v4home .co-tick{width:64px;height:64px;border-radius:50%;background:var(--v4-a);color:#15130d;font-size:32px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;}",
".v4home .co-cross{width:64px;height:64px;border-radius:50%;background:#e87070;color:#fff;font-size:30px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;}",
".v4home .co-tx{font-size:11px;color:var(--v4-aDeep);word-break:break-all;margin:18px auto 0;max-width:380px;padding:11px 14px;border:1px solid var(--v4-line);border-radius:10px;background:var(--v4-paper2);}",
".v4home .co-state-actions{display:flex;flex-direction:column;gap:10px;max-width:240px;margin:28px auto 0;}",
".v4home .co-state-actions .v4btn{justify-content:center;}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 checkout styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev -> buy something to see the v4 checkout. Then git push.\n');
