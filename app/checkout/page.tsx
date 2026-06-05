'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import { saveOrder, createEscrowJob } from '../lib/supabase';

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const store = params.get('store') || '';
  const product = params.get('product') || '';
  const price = Number(params.get('price') || 0);
  const qty = Math.max(1, Number(params.get('qty') || 1));
  const total = price * qty;
  const seller = (params.get('seller') || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8') as `0x${string}`;
  const [step, setStep] = useState<'review'|'paying'|'success'|'error'>('review');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleBuy = async () => {
    if (!isConnected || !address) { router.push('/join'); return; }
    setStep('paying');
    try {
      const hash = await sendTransactionAsync({ to: seller, value: parseUnits(total.toString(), 18) });
      const order = await saveOrder({ buyer_wallet: address, seller_wallet: seller, product_name: qty > 1 ? product + ' x' + qty : product, amount: total, tx_hash: hash });
      await createEscrowJob({ order_id: order?.id, buyer_wallet: address, seller_wallet: seller, amount: total, tx_hash: hash });
      setTxHash(hash); setStep('success');
    } catch (e: any) {
      setError(e?.message?.includes('rejected') ? 'Transaction rejected in wallet' : 'Transaction failed — please try again');
      setStep('error');
    }
  };

  return (
    <main className='v4home'>
      <Nav theme='v4' />
      <div className='co-wrap'>
        {step === 'review' && (<>
          <p className='eyebrow'>Checkout</p>
          <h1 className='co-title'>Confirm your <span className='v4amber'>purchase</span></h1>
          <div className='co-card'>
            <div className='co-row'>
              <div>
                <div className='co-lbl'>Product</div>
                <div className='co-prod'>{product}</div>
                <div className='co-store'>{store}</div>
              </div>
              <div className='co-qtytag'>Qty {qty}</div>
            </div>
            <div className='co-total'>
              <span className='co-lbl'>Total</span>
              <span className='co-amt'>{total}<span className='u'>USDC</span></span>
            </div>
          </div>
          <div className='co-escrow'><span className='co-dot' /><span>Funds are held in ERC-8183 escrow until you confirm delivery. 48-hour dispute window, full refund if the item is not as described.</span></div>
          <button onClick={handleBuy} className='v4btn v4btn-amber co-pay'>Pay {total} USDC on Arc <span className='arr'>→</span></button>
          <div className='co-back'><Link href={'/store/' + store}>← Back to store</Link></div>
        </>)}
        {step === 'paying' && (
          <div className='co-state'>
            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />
            <h2 className='co-state-h'>Processing</h2>
            <p className='co-state-p'>Approve the payment in your wallet…</p>
          </div>)}
        {step === 'success' && (
          <div className='co-state'>
            <div className='co-tick'>✓</div>
            <h2 className='co-state-h'>Payment confirmed</h2>
            <p className='co-state-p'>Settled on Arc Testnet · ERC-8183 escrow active, releases in 48 hours.</p>
            {txHash && <div className='co-tx'>{txHash}</div>}
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

export default function Checkout() {
  return <Suspense><CheckoutContent /></Suspense>;
}
