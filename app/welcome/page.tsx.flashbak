'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendraWallet } from '../lib/useVendraWallet';
import { getProfile } from '../lib/supabase';

export default function Welcome() {
  const router = useRouter();
  const { address, ready } = useVendraWallet();
  const [shown, setShown] = useState(false);
  const [hasBuyer, setHasBuyer] = useState(false);
  const [hasSeller, setHasSeller] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!address) { router.replace('/join'); return; }
    Promise.all([getProfile(address, 'buyer'), getProfile(address, 'seller')])
      .then(([b, s]) => {
        if (!b && !s) { router.replace('/onboarding'); return; }
        setHasBuyer(!!b); setHasSeller(!!s); setShown(true);
      })
      .catch(() => router.replace('/onboarding'));
  }, [ready, address, router]);

  if (!shown) return (
    <main className='v4home wc-main'>
      <Nav theme='v4' />
      <div className='amb'><div className='amb-glow' /><div className='amb-grid' /><div className='amb-line' /></div>
      <div className='wc-in'><div className='v4spinner' style={{ margin: '120px auto' }} /></div>
    </main>
  );

  const sub = hasBuyer && hasSeller
    ? 'You have a buyer and a seller profile. Your storefront and order history are ready whenever you are.'
    : hasSeller
      ? 'Your storefront is ready. Manage products, view sales, or launch another store on Arc Testnet.'
      : 'Your orders and saved stores are ready. Jump back into the marketplace whenever you like.';

  return (
    <main className='v4home wc-main'>
      <Nav theme='v4' />
      <div className='amb'><div className='amb-glow' /><div className='amb-grid' /><div className='amb-line' /></div>
      <div className='wc-in'>
        <div className='vbadge'><span className='vbadge-dot' /><span className='vbadge-txt'>Welcome back · Arc Testnet</span></div>
        <h1 className='wc-h1'>How would you like to continue using <span className='v4amber'>Vendra?</span></h1>
        <p className='wc-sub'>{sub}</p>
        <div className='wc-opts'>
          {hasSeller && (
            <Link href='/profile' style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className='wc-opt'><div className='wc-opt-ic'>🏪</div><div className='wc-opt-h'>Manage my store</div><div className='wc-opt-p'>Add products, view sales, edit your storefront or launch a new store on Arc Testnet.</div></div>
            </Link>
          )}
          {hasBuyer && (
            <Link href='/marketplace' style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className='wc-opt'><div className='wc-opt-ic'>🛍️</div><div className='wc-opt-h'>Keep shopping</div><div className='wc-opt-p'>Browse stores, discover new products and pay instantly in USDC on Arc.</div></div>
            </Link>
          )}
        </div>
        <div className='vor' style={{ maxWidth: 480, margin: '0 auto 20px' }}><div className='vor-line' /><span className='vor-txt'>or</span><div className='vor-line' /></div>
        <Link href='/marketplace' className='wc-explore'>Explore marketplace →</Link>
      </div>
    </main>
  );
}
