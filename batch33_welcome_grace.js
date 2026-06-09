/* ============================================================
   batch33_welcome_grace.js  —  Vendra, Batch 33
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch33_welcome_grace.js
   ------------------------------------------------------------
   Kills the remaining /join flash on refresh. Even with `ready`
   waiting on wagmi, some setups briefly report "no address" while
   the wallet reconnects, so /welcome bailed to /join and bounced
   back. Now /welcome waits a grace window for the address to show
   up before ever redirecting to /join; if it arrives, it cancels
   and shows the chooser. Truly logged-out users still go to /join
   after the short wait.
   Rewrites app/welcome/page.tsx. Backs it up once. Idempotent.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const welcomePath = path.join(root, 'app', 'welcome', 'page.tsx');
if (!fs.existsSync(welcomePath)) { console.error('\n  x  app/welcome/page.tsx not found. Run from project root.\n'); process.exit(1); }

const WELCOME = [
"'use client';",
"import Nav from '../Nav';",
"import Link from 'next/link';",
"import { useEffect, useState } from 'react';",
"import { useRouter } from 'next/navigation';",
"import { useVendraWallet } from '../lib/useVendraWallet';",
"import { getProfile } from '../lib/supabase';",
"",
"// How long to wait for a web3 wallet to finish reconnecting after a refresh",
"// before concluding the visitor is logged out and sending them to /join.",
"const RECONNECT_GRACE_MS = 4000;",
"",
"export default function Welcome() {",
"  const router = useRouter();",
"  const { address, ready } = useVendraWallet();",
"  const [shown, setShown] = useState(false);",
"  const [hasBuyer, setHasBuyer] = useState(false);",
"  const [hasSeller, setHasSeller] = useState(false);",
"",
"  useEffect(() => {",
"    if (!ready) return;",
"    if (!address) {",
"      // wagmi may still be reconnecting after a refresh; wait before bailing",
"      const t = setTimeout(() => router.replace('/join'), RECONNECT_GRACE_MS);",
"      return () => clearTimeout(t);",
"    }",
"    let cancelled = false;",
"    Promise.all([getProfile(address, 'buyer'), getProfile(address, 'seller')])",
"      .then(([b, s]) => {",
"        if (cancelled) return;",
"        if (!b && !s) { router.replace('/onboarding'); return; }",
"        setHasBuyer(!!b); setHasSeller(!!s); setShown(true);",
"      })",
"      .catch(() => { if (!cancelled) router.replace('/onboarding'); });",
"    return () => { cancelled = true; };",
"  }, [ready, address, router]);",
"",
"  if (!shown) return (",
"    <main className='v4home wc-main'>",
"      <Nav theme='v4' />",
"      <div className='amb'><div className='amb-glow' /><div className='amb-grid' /><div className='amb-line' /></div>",
"      <div className='wc-in'>",
"        <div className='v4spinner' style={{ margin: '120px auto 16px' }} />",
"        <p className='wc-sub' style={{ marginTop: 0 }}>One moment\u2026</p>",
"      </div>",
"    </main>",
"  );",
"",
"  const sub = hasBuyer && hasSeller",
"    ? 'You have a buyer and a seller profile. Your storefront and order history are ready whenever you are.'",
"    : hasSeller",
"      ? 'Your storefront is ready. Manage products, view sales, or launch another store on Arc Testnet.'",
"      : 'Your orders and saved stores are ready. Jump back into the marketplace whenever you like.';",
"",
"  return (",
"    <main className='v4home wc-main'>",
"      <Nav theme='v4' />",
"      <div className='amb'><div className='amb-glow' /><div className='amb-grid' /><div className='amb-line' /></div>",
"      <div className='wc-in'>",
"        <div className='vbadge'><span className='vbadge-dot' /><span className='vbadge-txt'>Welcome back \u00b7 Arc Testnet</span></div>",
"        <h1 className='wc-h1'>How would you like to continue using <span className='v4amber'>Vendra?</span></h1>",
"        <p className='wc-sub'>{sub}</p>",
"        <div className='wc-opts'>",
"          {hasSeller && (",
"            <Link href='/profile' style={{ textDecoration: 'none', color: 'inherit' }}>",
"              <div className='wc-opt'><div className='wc-opt-ic'>\uD83C\uDFEA</div><div className='wc-opt-h'>Manage my store</div><div className='wc-opt-p'>Add products, view sales, edit your storefront or launch a new store on Arc Testnet.</div></div>",
"            </Link>",
"          )}",
"          {hasBuyer && (",
"            <Link href='/marketplace' style={{ textDecoration: 'none', color: 'inherit' }}>",
"              <div className='wc-opt'><div className='wc-opt-ic'>\uD83D\uDECD\uFE0F</div><div className='wc-opt-h'>Keep shopping</div><div className='wc-opt-p'>Browse stores, discover new products and pay instantly in USDC on Arc.</div></div>",
"            </Link>",
"          )}",
"        </div>",
"        <div className='vor' style={{ maxWidth: 480, margin: '0 auto 20px' }}><div className='vor-line' /><span className='vor-txt'>or</span><div className='vor-line' /></div>",
"        <Link href='/marketplace' className='wc-explore'>Explore marketplace \u2192</Link>",
"      </div>",
"    </main>",
"  );",
"}",
""
].join("\n");

if (!fs.existsSync(welcomePath + '.flashbak')) fs.copyFileSync(welcomePath, welcomePath + '.flashbak');
const cur = fs.readFileSync(welcomePath, 'utf8');
if (cur === WELCOME) { console.log('  .  app/welcome/page.tsx already up to date'); }
else { fs.writeFileSync(welcomePath, WELCOME, 'utf8'); console.log('  +  app/welcome/page.tsx updated (grace window before /join redirect)'); }
console.log('\n  Done. npm run build -> npm run dev. Refresh /welcome while connected via web3: it holds on');
console.log('  "One moment..." until the wallet reconnects, then shows the chooser \u2014 no /join flash. Then git push.\n');
