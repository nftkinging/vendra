'use client';
import Nav from '../../Nav';
import { useState } from 'react';
import { useCart } from '../../lib/cart';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import { saveOrder, createEscrowJob, upsertSellerReputation } from '../../lib/supabase';
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

  const grouped: Record<string,typeof items> = items.reduce((acc:any,item)=>{ if(!acc[item.storeSlug])acc[item.storeSlug]=[]; acc[item.storeSlug].push(item); return acc; },{});

  const handleCheckout = async () => {
    if (!isConnected || !address) { router.push('/join'); return; }
    if (items.length === 0) return;
    setStep('paying');
    const hashes: string[] = [];
    const sellers = Object.entries(grouped);
    setTotalItems(sellers.length);
    try {
      for (let i = 0; i < sellers.length; i++) {
        const [, storeItems] = sellers[i];
        setCurrentSeller(storeItems[0].storeName);
        setCurrentItem(i + 1);
        const sellerWallet = storeItems[0].sellerWallet as `0x${string}`;
        const storeTotal = storeItems.reduce((s, item) => s + item.price * item.quantity, 0);
        const hash = await sendTransactionAsync({ to: sellerWallet, value: parseUnits(storeTotal.toString(), 18) });
        hashes.push(hash);
        for (const item of storeItems) {
          const order = await saveOrder({ buyer_wallet: address, seller_wallet: sellerWallet, product_name: item.productName + (item.quantity > 1 ? ' x' + item.quantity : ''), amount: item.price * item.quantity, tx_hash: hash });
          await createEscrowJob({ order_id: order?.id, buyer_wallet: address, seller_wallet: sellerWallet, amount: item.price * item.quantity, tx_hash: hash });
        }
        await upsertSellerReputation(sellerWallet, { total_sales: storeItems.length });
      }
      setTxHashes(hashes); clearCart(); setStep('success');
    } catch (e: any) {
      setError(e?.message?.includes('rejected') ? 'Transaction rejected in wallet' : 'Transaction failed — please try again');
      setStep('error');
    }
  };

  if (items.length === 0 && step === 'review') return (
    <main className='v4home'><Nav theme='v4' />
      <div className='co-wrap' style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 42, marginBottom: 14 }}>🛒</div>
        <h1 className='co-title' style={{ marginBottom: 24 }}>Your cart is <span className='v4amber'>empty</span></h1>
        <Link href='/marketplace' className='v4btn v4btn-amber'>Browse marketplace</Link>
      </div>
    </main>
  );

  return (
    <main className='v4home'>
      <Nav theme='v4' />
      <div className='co-wrap'>
        {step === 'review' && (<>
          <p className='eyebrow'>Checkout</p>
          <h1 className='co-title'>Order <span className='v4amber'>summary</span></h1>
          {Object.entries(grouped).map(([slug, storeItems]) => {
            const storeTotal = storeItems.reduce((s, item) => s + item.price * item.quantity, 0);
            return (
              <div key={slug} className='cco-store'>
                <div className='cco-store-head'>{storeItems[0].storeName}</div>
                {storeItems.map(item => (
                  <div key={item.id} className='cco-item'>
                    {item.image ? <img src={item.image} alt={item.productName} className='cco-item-img' /> : <div className='cco-item-imgph'>📦</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className='cco-item-name'>{item.productName}</div>
                      <div className='cco-item-meta'>Qty {item.quantity} · {item.price} each</div>
                    </div>
                    <div className='cco-item-total'>{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className='cco-store-foot'><span className='l'>Store total</span><span className='v'>{storeTotal.toFixed(2)} USDC</span></div>
              </div>
            );
          })}
          <div className='cco-grand'>
            <div className='cco-grand-row'>
              <div><div className='co-lbl'>Grand total</div><div className='cco-grand-v'>{total().toFixed(2)}</div></div>
              <div className='cco-grand-u'>USDC · Arc Testnet</div>
            </div>
            {Object.keys(grouped).length > 1 && <div className='cco-note'>⚡ {Object.keys(grouped).length} separate wallet approvals — one per store</div>}
          </div>
          <div className='co-escrow'><span className='co-dot' /><span>Funds are locked in ERC-8183 escrow until delivery is confirmed. 48-hour dispute window, full refund if it is not as described.</span></div>
          <button onClick={handleCheckout} className='v4btn v4btn-amber co-pay'>Pay {total().toFixed(2)} USDC on Arc <span className='arr'>→</span></button>
          <div className='co-back'><Link href='/marketplace'>← Continue shopping</Link></div>
        </>)}
        {step === 'paying' && (
          <div className='co-state'>
            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />
            <h2 className='co-state-h'>Processing payment</h2>
            <p className='cco-progress'>Store {currentItem} of {totalItems}</p>
            <p className='co-state-p'>Approve payment to {currentSeller} in your wallet…</p>
          </div>)}
        {step === 'success' && (
          <div className='co-state'>
            <div className='co-tick'>✓</div>
            <h2 className='co-state-h'>All payments confirmed</h2>
            <p className='co-state-p'>{txHashes.length} transaction{txHashes.length > 1 ? 's' : ''} confirmed on Arc Testnet · escrow releases in 48 hours.</p>
            <div className='co-state-actions'>
              <Link href='/profile' className='v4btn v4btn-amber'>View my orders</Link>
              <Link href='/marketplace' className='v4btn v4btn-ghost'>Keep shopping</Link>
            </div>
          </div>)}
        {step === 'error' && (
          <div className='co-state'>
            <div className='co-cross'>✕</div>
            <h2 className='co-state-h'>Transaction failed</h2>
            <p className='co-state-p'>{error}</p>
            <button onClick={() => setStep('review')} className='v4btn v4btn-ghost' style={{ marginTop: 20 }}>Try again</button>
          </div>)}
      </div>
    </main>
  );
}
