'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Welcome() {
  const { isConnected } = useAccount();
  const router = useRouter();
  useEffect(() => { if (!isConnected) router.push('/join'); }, [isConnected, router]);

  return (
    <main className='v4home wc-main'>
      <Nav theme='v4' />
      <div className='amb'><div className='amb-glow' /><div className='amb-grid' /><div className='amb-line' /></div>
      <div className='wc-in'>
        <div className='vbadge'><span className='vbadge-dot' /><span className='vbadge-txt'>Welcome back · Arc Testnet</span></div>
        <h1 className='wc-h1'>What would you <span className='v4amber'>like to do?</span></h1>
        <p className='wc-sub'>You have both a buyer and seller profile. Your storefront and order history are ready whenever you are.</p>
        <div className='wc-opts'>
          <Link href='/profile' style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='wc-opt'><div className='wc-opt-ic'>🏪</div><div className='wc-opt-h'>Manage my store</div><div className='wc-opt-p'>Add products, view sales, edit your storefront or launch a new store on Arc Testnet.</div></div>
          </Link>
          <Link href='/marketplace' style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='wc-opt'><div className='wc-opt-ic'>🛍️</div><div className='wc-opt-h'>Keep shopping</div><div className='wc-opt-p'>Browse stores, discover new products and pay instantly in USDC on Arc.</div></div>
          </Link>
        </div>
        <div className='vor' style={{ maxWidth: 480, margin: '0 auto 20px' }}><div className='vor-line' /><span className='vor-txt'>or</span><div className='vor-line' /></div>
        <Link href='/marketplace' className='wc-explore'>Explore marketplace →</Link>
      </div>
    </main>
  );
}
