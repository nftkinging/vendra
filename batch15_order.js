/* ============================================================
   batch15_order.js  —  Vendra v4, Batch 15 (order receipt)
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch15_order.js
   ------------------------------------------------------------
   Migrates TWO files to the v4 look:
     - app/orders/[id]/page.tsx   (order receipt)
     - app/components/ArcEscrowStatus.tsx  (escrow tracker)
   Keeps ALL logic: orders + escrow_jobs fetch, 48h release-date
   math, isReleased branch, Arc explorer URL, loading/not-found.
   ArcEscrowStatus styles are UNSCOPED with hex fallbacks so the
   shared component renders correctly on any page.
   Appends "V4 ORDER + ESCROW STYLES" to globals.css (idempotent).
   Backs up both files once.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const orderPath = path.join(root, 'app', 'orders', '[id]', 'page.tsx');
const aesPath = path.join(root, 'app', 'components', 'ArcEscrowStatus.tsx');
const cssPath = path.join(root, 'app', 'globals.css');
for (const [p, label] of [[orderPath, 'app/orders/[id]/page.tsx'], [aesPath, 'app/components/ArcEscrowStatus.tsx'], [cssPath, 'app/globals.css']]) {
  if (!fs.existsSync(p)) { console.error('\n  x  ' + label + ' not found. Run from project root.\n'); process.exit(1); }
}

const AES = [
"'use client';",
"",
"interface Props { orderId?: string; status?: string; amount?: number; createdAt?: string; }",
"",
"export default function ArcEscrowStatus({ orderId, status = 'locked', amount = 0, createdAt }: Props) {",
"  const releaseDate = createdAt ? new Date(new Date(createdAt).getTime() + 48 * 60 * 60 * 1000) : null;",
"  const isReleased = status === 'released';",
"  return (",
"    <div className={'aes' + (isReleased ? ' rel' : '')}>",
"      <div className='aes-top'>",
"        <span className='aes-label'>ERC-8183 Escrow</span>",
"        <span className='aes-status'><span className='aes-dot' />{isReleased ? 'Released' : 'Locked'}</span>",
"      </div>",
"      <div className='aes-amt'>${amount.toFixed(2)} USDC</div>",
"      <div className='aes-note'>{isReleased ? 'Funds released to seller.' : releaseDate ? `Releases ${releaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} if no dispute is raised.` : 'Protected by smart-contract escrow.'}</div>",
"    </div>",
"  );",
"}",
""
].join("\n");

const PAGE = [
"'use client';",
"import Nav from '../../Nav';",
"import Link from 'next/link';",
"import { useParams } from 'next/navigation';",
"import { useState, useEffect } from 'react';",
"import { supabase } from '../../lib/supabase';",
"import ArcEscrowStatus from '../../components/ArcEscrowStatus';",
"",
"export default function OrderPage() {",
"  const params = useParams();",
"  const id = params.id as string;",
"  const [order, setOrder] = useState<any>(null);",
"  const [escrow, setEscrow] = useState<any>(null);",
"  const [loading, setLoading] = useState(true);",
"",
"  useEffect(() => {",
"    const load = async () => {",
"      const { data: o } = await supabase.from('orders').select('*').eq('id', id).single();",
"      setOrder(o);",
"      if (o) {",
"        const { data: e } = await supabase.from('escrow_jobs').select('*').eq('order_id', id).single();",
"        setEscrow(e);",
"      }",
"      setLoading(false);",
"    };",
"    load();",
"  }, [id]);",
"",
"  if (loading) return <main className='v4home' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Nav theme='v4' /><div className='v4spinner' /></main>;",
"",
"  if (!order) return (",
"    <main className='v4home' style={{ minHeight: '100vh' }}><Nav theme='v4' />",
"      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>",
"        <h1 className='ord-title'>Order not <span className='v4amber'>found</span></h1>",
"        <Link href='/profile' className='v4btn v4btn-amber'>Back to profile</Link>",
"      </div>",
"    </main>",
"  );",
"",
"  const explorerUrl = 'https://testnet.arcscan.app/tx/' + order.tx_hash;",
"",
"  return (",
"    <main className='v4home' style={{ minHeight: '100vh' }}>",
"      <Nav theme='v4' />",
"      <div className='ord-wrap'>",
"        <p className='eyebrow'>Order receipt</p>",
"        <h1 className='ord-title'>Order <span className='v4amber'>details</span></h1>",
"        <div className='ord-status'><span className='ord-status-dot' />{order.status || 'Confirmed'}</div>",
"        <div className='ord-card'>",
"          <div className='ord-card-top'>",
"            <div className='ord-emoji'>\uD83D\uDCE6</div>",
"            <div className='ord-pname'>{order.product_name}</div>",
"            <div className='ord-amt'>${Number(order.amount).toFixed(2)} USDC</div>",
"          </div>",
"          <div className='ord-rows'>",
"            {[['Date', new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })], ['Time', new Date(order.created_at).toLocaleTimeString()], ['Buyer', order.buyer_wallet ? order.buyer_wallet.slice(0,8) + '...' + order.buyer_wallet.slice(-6) : ''], ['Seller', order.seller_wallet ? order.seller_wallet.slice(0,8) + '...' + order.seller_wallet.slice(-6) : ''], ['Network', 'Arc Testnet'], ['Status', order.status || 'Confirmed']].map(([label, val]) => (",
"              <div key={String(label)} className='ord-row'><span className='ord-row-l'>{label}</span><span className='ord-row-v'>{val}</span></div>",
"            ))}",
"          </div>",
"        </div>",
"        <div style={{ margin: '16px 0' }}>",
"          <ArcEscrowStatus orderId={id} status={escrow?.status || 'locked'} amount={Number(order.amount)} createdAt={order.created_at} />",
"        </div>",
"        {order.tx_hash && (",
"          <a href={explorerUrl} target='_blank' rel='noopener noreferrer' className='ord-tx'>",
"            <div className='ord-tx-l'>Transaction hash \u00b7 Arc Testnet</div>",
"            <div className='ord-tx-h'>{order.tx_hash}</div>",
"            <div className='ord-tx-v'>View on Arc Explorer \u2197</div>",
"          </a>)}",
"        <div className='ord-btns'>",
"          <Link href='/profile' className='v4btn v4btn-amber'>View all orders</Link>",
"          <Link href='/marketplace' className='v4btn v4btn-ghost'>Keep shopping</Link>",
"        </div>",
"      </div>",
"      <footer className='ord-foot'><div className='ord-foot-brand'>Vendra</div><div className='ord-foot-copy'>ERC-8183 Escrow \u00b7 Arc Testnet</div><div className='ord-foot-links'><Link href='/marketplace'>Marketplace</Link></div></footer>",
"    </main>",
"  );",
"}",
""
].join("\n");

if (!fs.existsSync(aesPath + '.v3bak')) { fs.copyFileSync(aesPath, aesPath + '.v3bak'); console.log('  .  backup -> app/components/ArcEscrowStatus.tsx.v3bak'); }
fs.writeFileSync(aesPath, AES, 'utf8');
console.log('  +  ArcEscrowStatus.tsx rewritten in v4 (logic unchanged)');

if (!fs.existsSync(orderPath + '.v3bak')) { fs.copyFileSync(orderPath, orderPath + '.v3bak'); console.log('  .  backup -> app/orders/[id]/page.tsx.v3bak'); }
fs.writeFileSync(orderPath, PAGE, 'utf8');
console.log('  +  app/orders/[id]/page.tsx rewritten in v4 (logic unchanged)');

const MARK = '/* === V4 ORDER + ESCROW STYLES === */';
const CSS = [
MARK,
"/* ArcEscrowStatus: unscoped + hex fallbacks so it is styled on any page */",
".aes{border:1px solid var(--v4-aSoft2,rgba(226,164,28,.28));background:var(--v4-aSoft,rgba(226,164,28,.10));border-radius:16px;padding:18px 20px;}",
".aes.rel{border-color:rgba(123,176,130,.4);background:rgba(123,176,130,.10);}",
".aes-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}",
".aes-label{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--v4-tx40,rgba(38,34,24,.45));}",
".aes-status{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--v4-aDeep,#B47E0E);}",
".aes.rel .aes-status{color:#3F7A47;}",
".aes-dot{width:6px;height:6px;border-radius:50%;background:var(--v4-a,#E2A41C);box-shadow:0 0 6px var(--v4-a,#E2A41C);}",
".aes.rel .aes-dot{background:#5AA463;box-shadow:0 0 6px #5AA463;}",
".aes-amt{font-size:24px;font-weight:700;letter-spacing:-.02em;color:var(--v4-aDeep,#B47E0E);margin-bottom:4px;}",
".aes.rel .aes-amt{color:#3F7A47;}",
".aes-note{font-size:12px;color:var(--v4-tx60,rgba(38,34,24,.62));line-height:1.6;}",
".v4home .ord-wrap{max-width:580px;margin:0 auto;padding:120px 40px 80px;}",
".v4home .ord-title{font-size:clamp(32px,5vw,52px);font-weight:600;letter-spacing:-.02em;line-height:1;margin-bottom:24px;}",
".v4home .ord-status{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#3F7A47;background:rgba(123,176,130,.12);border:1px solid rgba(123,176,130,.4);border-radius:999px;padding:7px 14px;margin-bottom:24px;}",
".v4home .ord-status-dot{width:6px;height:6px;border-radius:50%;background:#5AA463;box-shadow:0 0 6px #5AA463;}",
".v4home .ord-card{background:var(--v4-card);border:1px solid var(--v4-line);border-radius:18px;overflow:hidden;margin-bottom:16px;}",
".v4home .ord-card-top{padding:30px 28px;text-align:center;border-bottom:1px solid var(--v4-line);background:var(--v4-paper2);}",
".v4home .ord-emoji{font-size:42px;margin-bottom:12px;}",
".v4home .ord-pname{font-size:22px;font-weight:600;letter-spacing:-.01em;margin-bottom:10px;}",
".v4home .ord-amt{font-size:36px;font-weight:700;letter-spacing:-.02em;color:var(--v4-aDeep);line-height:1;}",
".v4home .ord-rows{padding:8px 24px 18px;}",
".v4home .ord-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--v4-line);}",
".v4home .ord-row:last-child{border-bottom:none;}",
".v4home .ord-row-l{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--v4-tx40);}",
".v4home .ord-row-v{font-size:13px;font-weight:500;color:var(--v4-tx);text-align:right;}",
".v4home .ord-tx{display:block;border:1px solid var(--v4-line);border-radius:14px;padding:16px 20px;margin-bottom:24px;text-decoration:none;background:var(--v4-card);transition:border-color .3s;}",
".v4home .ord-tx:hover{border-color:var(--v4-a);}",
".v4home .ord-tx-l{font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--v4-tx40);margin-bottom:6px;}",
".v4home .ord-tx-h{font-size:11px;color:var(--v4-aDeep);word-break:break-all;margin-bottom:6px;font-weight:500;}",
".v4home .ord-tx-v{font-size:11px;color:var(--v4-tx40);}",
".v4home .ord-btns{display:flex;gap:12px;flex-wrap:wrap;}",
".v4home .ord-foot{border-top:1px solid var(--v4-line);padding:40px;text-align:center;}",
".v4home .ord-foot-brand{font-size:15px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--v4-tx60);}",
".v4home .ord-foot-copy{font-size:11px;color:var(--v4-tx40);margin:10px 0;}",
".v4home .ord-foot-links{display:flex;gap:18px;justify-content:center;}",
".v4home .ord-foot-links a{font-size:12px;color:var(--v4-tx60);text-decoration:none;}",
".v4home .ord-foot-links a:hover{color:var(--v4-ink);}",
"@media(max-width:600px){.v4home .ord-wrap{padding-left:24px;padding-right:24px;}}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 order + escrow styles appended to globals.css');
console.log('\n  Done. npm run build -> npm run dev -> open an order from /profile. Then git push.\n');
