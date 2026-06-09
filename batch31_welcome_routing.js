/* ============================================================
   batch31_welcome_routing.js  —  Vendra, Batch 31
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch31_welcome_routing.js
   ------------------------------------------------------------
   Fixes the /welcome -> /onboarding refresh glitch and makes the
   returning-user experience identical for web3 and Circle logins.
     - app/welcome/page.tsx (rewritten):
         * unified identity via useVendraWallet (web3 OR Circle)
         * waits for `ready`, then loads buyer+seller profiles:
             no address  -> /join
             no profile   -> /onboarding   (first-time user)
             has profile  -> role-aware chooser (no more bounce)
         * new heading: "How would you like to continue using Vendra?"
         * options shown by role (Manage my store / Keep shopping)
     - app/join/page.tsx (patched):
         * connected users go to /welcome (the decision hub), not
           straight to /onboarding
   Reuses existing welcome styles (wc-, amb, vbadge, vor, v4spinner) - no CSS changes.
   Requires app/lib/useVendraWallet.ts (batch26). Backs up files once.
   Safe to re-run (join patch is idempotent; welcome is a full rewrite).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const welcomePath = path.join(root, 'app', 'welcome', 'page.tsx');
const joinPath = path.join(root, 'app', 'join', 'page.tsx');
const hookPath = path.join(root, 'app', 'lib', 'useVendraWallet.ts');
if (!fs.existsSync(hookPath)) { console.error('\n  x  app/lib/useVendraWallet.ts missing. Run batch26_circle_identity.js first.\n'); process.exit(1); }
for (const [p, l] of [[welcomePath, 'app/welcome/page.tsx'], [joinPath, 'app/join/page.tsx']]) {
  if (!fs.existsSync(p)) { console.error('\n  x  ' + l + ' not found. Run from project root.\n'); process.exit(1); }
}

const WELCOME = [
"'use client';",
"import Nav from '../Nav';",
"import Link from 'next/link';",
"import { useEffect, useState } from 'react';",
"import { useRouter } from 'next/navigation';",
"import { useVendraWallet } from '../lib/useVendraWallet';",
"import { getProfile } from '../lib/supabase';",
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
"    if (!address) { router.replace('/join'); return; }",
"    Promise.all([getProfile(address, 'buyer'), getProfile(address, 'seller')])",
"      .then(([b, s]) => {",
"        if (!b && !s) { router.replace('/onboarding'); return; }",
"        setHasBuyer(!!b); setHasSeller(!!s); setShown(true);",
"      })",
"      .catch(() => router.replace('/onboarding'));",
"  }, [ready, address, router]);",
"",
"  if (!shown) return (",
"    <main className='v4home wc-main'>",
"      <Nav theme='v4' />",
"      <div className='amb'><div className='amb-glow' /><div className='amb-grid' /><div className='amb-line' /></div>",
"      <div className='wc-in'><div className='v4spinner' style={{ margin: '120px auto' }} /></div>",
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

if (!fs.existsSync(welcomePath + '.wcbak')) fs.copyFileSync(welcomePath, welcomePath + '.wcbak');
fs.writeFileSync(welcomePath, WELCOME, 'utf8');
console.log('  +  app/welcome/page.tsx rewritten (role-aware, ready-gated, new heading)');

// join: send connected users to the decision hub, not straight to onboarding
let join = fs.readFileSync(joinPath, 'utf8');
const fromJoin = "useEffect(() => { if (isConnected) router.push('/onboarding'); }, [isConnected, router]);";
const toJoin = "useEffect(() => { if (isConnected) router.push('/welcome'); }, [isConnected, router]);";
if (join.includes(toJoin)) {
  console.log('  .  app/join/page.tsx already routes to /welcome');
} else if (join.includes(fromJoin)) {
  if (!fs.existsSync(joinPath + '.wcbak')) fs.copyFileSync(joinPath, joinPath + '.wcbak');
  fs.writeFileSync(joinPath, join.split(fromJoin).join(toJoin), 'utf8');
  console.log('  +  app/join/page.tsx redirect retargeted to /welcome');
} else {
  console.error('  x  app/join/page.tsx: redirect snippet not found (skipped)');
}

console.log('\n  Done. npm run build -> npm run dev. Refresh /welcome while logged in (web3 or Circle): it stays and');
console.log('  shows the chooser; first-time users still go to /onboarding. Then git push.\n');
