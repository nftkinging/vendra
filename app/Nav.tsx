'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import CartButton from './components/CartButton';
import CartDrawer from './components/CartDrawer';

export default function Nav() {
  const { isConnected } = useAccount();
  const [hover, setHover] = useState(false);
  return (
    <>
      <CartDrawer />
      <nav className='v-nav'>
        <Link href='/' className='v-logo'>
          <div className='v-logo-emblem'><span className='v-logo-v'>V</span></div>
          <span className='v-logo-name'>Vendra</span>
        </Link>
        <div className='v-nav-links'>
          <Link href='/marketplace'>Marketplace</Link>
          {isConnected && <Link href='/profile'>My Profile</Link>}
        </div>
        <div className='v-nav-right'>
          <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer'
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{ textDecoration: 'none' }}>
            <button className='btn-faucet'>Faucet</button>
          </a>
          {isConnected && <Link href='/profile'><button className='btn-nav-ghost'>My Profile</button></Link>}
          <CartButton />
          <ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
        </div>
      </nav>
    </>
  );
}