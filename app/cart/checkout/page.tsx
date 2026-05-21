'use client';
import Nav from '../../Nav';
import { useState } from 'react';
import { useCart } from '../../lib/cart';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import { saveOrder } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartCheckout() {
  const { items, clearCart, total } = useCart();
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const router = useRouter();
  const [step, setStep] = useState<'review'|'paying'|'success'|'error'>('review');
  const [currentSeller, setCurrentSeller] = useState('');
  const [currentItem, setCurrentItem] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [txHashes, setTxHashes] = useState<string[]>([]);
  const [error, setError] = useState('');

  const groupedBySeller: Record<string, typeof items> = items.reduce((acc: any, item) => {
    if (!acc[item.storeSlug]) acc[item.storeSlug] = [];
    acc[item.storeSlug].push(item);
    return acc;
  }, {});

  const handleCheckout = async () => {
    if (!isConnected || !address) { router.push('/join'); return; }
    if (items.length === 0) return;
    setStep('paying');
    const hashes: string[] = [];
    const sellers = Object.entries(groupedBySeller);
    setTotalItems(sellers.length);
    try {
      for (let i = 0; i < sellers.length; i++) {
        const [, storeItems] = sellers[i];
        setCurrentSeller(storeItems[0].storeName);
        setCurrentItem(i + 1);
        const sellerWallet = storeItems[0].sellerWallet as `0x${string}`;
        const storeTotal = storeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const hash = await sendTransactionAsync({
          to: sellerWallet,
          value: parseUnits(storeTotal.toString(), 18),
        });
        hashes.push(hash);
        for (const item of storeItems) {
          await saveOrder({
            buyer_wallet: address,
            seller_wallet: sellerWallet,
            product_name: item.productName + (item.quantity > 1 ? ' x' + item.quantity : ''),
            amount: item.price * item.quantity,
            tx_hash: hash,
          });
        }
      }
      setTxHashes(hashes);
      clearCart();
      setStep('success');
    } catch (e: any) {
      const msg = e?.message || '';
      setError(msg.includes('rejected') ? 'Transaction rejected in wallet' : 'Transaction failed — please try again');
      setStep('error');
    }
  };

  if (items.length === 0 && step === 'review') return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{'🛒'}</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', marginBottom: '1rem' }}>Cart is Empty</div>
        <Link href='/marketplace'>
          <button className='btn-3d-purple' style={{ padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Browse Marketplace</button>
        </Link>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
        {step === 'review' && (
          <>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Checkout</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '2rem' }}>ORDER SUMMARY</div>
            {Object.entries(groupedBySeller).map(([slug, storeItems]) => {
              const storeTotal = storeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
              return (
                <div key={slug} style={{ border: '1px solid var(--border)', marginBottom: '1rem', overflow: 'hidden' }}>
                  <div style={{ padding: '0.75rem 1.25rem', background: 'var(--bg3)', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{'🏪 '}{storeItems[0].storeName}</div>
                  {storeItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                      {item.image ? <img src={item.image} alt={item.productName} style={{ width: 48, height: 48, objectFit: 'cover', flexShrink: 0 }} /> : <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,var(--accent),#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{'📦'}</div>}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.productName}</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{'Qty: '}{item.quantity}{' · $'}{item.price}{' each'}</div>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--accent2)' }}>{'$'}{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  <div style={{ padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', background: 'var(--bg2)' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Store total</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--accent2)' }}>{'$'}{storeTotal.toFixed(2)}{' USDC'}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ border: '1px solid var(--border)', padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Grand Total</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: 'var(--accent2)' }}>{'$'}{total().toFixed(2)}{' USDC'}</span>
              </div>
              {Object.keys(groupedBySeller).length > 1 && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{'⚡ '}{Object.keys(groupedBySeller).length}{' separate wallet approvals required'}</div>}
            </div>
            <button onClick={handleCheckout} className='btn-3d-accent' style={{ width: '100%', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em' }}>{'Pay $'}{total().toFixed(2)}{' USDC →'}</button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href='/marketplace' style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>← Continue Shopping</Link>
            </div>
          </>
        )}
        {step === 'paying' && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', marginBottom: '1rem' }}>Processing Payment</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{'Store '}{currentItem}{' of '}{totalItems}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '2rem' }}>{'Approve payment to '}{currentSeller}{' in your wallet'}</div>
            <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
          </div>
        )}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem', color: 'var(--accent)', lineHeight: 1 }}>{'✓'}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '0.75rem' }}>All Payments Confirmed!</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '2rem' }}>{txHashes.length}{' transaction'}{txHashes.length > 1 ? 's' : ''}{' confirmed on Arc Testnet'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300, margin: '0 auto' }}>
              <Link href='/profile'><button className='btn-3d-purple' style={{ width: '100%', padding: '0.85rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>View Orders</button></Link>
              <Link href='/marketplace'><button className='btn-3d-ghost' style={{ width: '100%', padding: '0.85rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Keep Shopping</button></Link>
            </div>
          </div>
        )}
        {step === 'error' && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#e84040' }}>{'✕'}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Transaction Failed</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', fontWeight: 300 }}>{error}</div>
            <button onClick={() => setStep('review')} className='btn-3d-accent' style={{ padding: '0.75rem 2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Try Again</button>
          </div>
        )}
      </div>
    </main>
  );
}