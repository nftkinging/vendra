'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import CartButton from './components/CartButton';
import CartDrawer from './components/CartDrawer';

export default function Nav() {
  const { isConnected } = useAccount();
  const [fHover, setFHover] = useState(false);
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
          <Link href='/store/create'>Sell</Link>
          {isConnected && <Link href='/profile'>Profile</Link>}
        </div>
        <div className='v-nav-right'>
          <a href='https://faucet.circle.com/' target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none' }} onMouseEnter={() => setFHover(true)} onMouseLeave={() => setFHover(false)}>
            <button className='btn-faucet' style={{ border: fHover ? '1px solid rgba(155,181,200,0.45)' : '1px solid rgba(155,181,200,0.25)' }}>💧 Faucet</button>
          </a>
          <CartButton />
          <ConnectButton label='Connect Wallet' accountStatus='address' chainStatus='none' showBalance={false} />
        </div>
      </nav>
    </>
  );
}