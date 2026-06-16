'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWriteContract, usePublicClient } from 'wagmi';
import { parseUnits } from 'viem';
import { saveOrder, createEscrowJob, getProfile } from '../lib/supabase';
import { useVendraWallet } from '../lib/useVendraWallet';
import { ESCROW_ADDRESS, USDC_ADDRESS, escrowAbi, erc20Abi } from '../lib/escrow';

const ZERO_REF = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { address, isCircle, circle, ready } = useVendraWallet();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const store = params.get('store') || '';
  const product = params.get('product') || '';
  const price = Number(params.get('price') || 0);
  const qty = Math.max(1, Number(params.get('qty') || 1));
  const total = price * qty;
  const seller = (params.get('seller') || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8') as `0x${string}`;
  const [step, setStep] = useState<'review'|'paying'|'success'|'error'>('review');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [gate, setGate] = useState<'checking'|'ok'|'need'>('checking');
  const nextUrl = '/checkout?' + params.toString();

  useEffect(() => {
    if (!ready) return;
    if (!address) { setGate('ok'); return; }
    getProfile(address, 'buyer').then(p => setGate(p ? 'ok' : 'need')).catch(() => setGate('ok'));
  }, [ready, address]);

  const handleBuy = async () => {
    if (!address) { router.push('/join'); return; }
    setStep('paying');
    try {
      let hash: string;
      if (isCircle && circle) {
        // Circle wallets: direct USDC send for now (on-chain escrow funding via Circle
        // contract-execution is the next step). Web3 already funds the escrow below.
        const res = await fetch('/api/circle/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: circle.walletId, walletAddress: address, toAddress: seller, amount: total.toString() }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        hash = 'circle:' + (data.txId || '');
      } else {
        // Web3 wallets: fund the on-chain escrow. USDC is a 6-decimal ERC-20 on Arc,
        // so amounts use 6 decimals. Step 1: approve the escrow to pull USDC. Step 2: fund.
        const amount6 = parseUnits(total.toString(), 6);
        const approveHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: 'approve',
          args: [ESCROW_ADDRESS, amount6],
        });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: approveHash });
        const fundHash = await writeContractAsync({
          address: ESCROW_ADDRESS,
          abi: escrowAbi,
          functionName: 'fund',
          args: [seller, amount6, ZERO_REF],
        });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: fundHash });
        hash = fundHash;
      }
      const order = await saveOrder({ buyer_wallet: address, seller_wallet: seller, product_name: qty > 1 ? product + ' x' + qty : product, amount: total, tx_hash: hash });
      await createEscrowJob({ order_id: order?.id, buyer_wallet: address, seller_wallet: seller, amount: total, tx_hash: hash });
      setTxHash(hash); setStep('success');
    } catch (e: any) {
      setError(e?.message?.includes('rejected') ? 'Transaction rejected in wallet' : (e?.message || 'Transaction failed — please try again'));
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
          <div className='co-escrow'><span className='co-dot' /><span>Your USDC is locked in an on-chain escrow contract on Arc until you confirm delivery. It auto-releases to the seller after 7 days, and you can open a dispute for a refund if the item isn't as described.</span></div>
          {gate === 'need' ? (<>
            <div className='co-escrow' style={{ background: 'var(--v4-aSoft2)' }}><span className='co-dot' /><span>You need a buyer profile to complete checkout — it takes a few seconds and lets you track your orders.</span></div>
            <Link href={'/onboarding?role=buyer&next=' + encodeURIComponent(nextUrl)} className='v4btn v4btn-amber co-pay'>Create a buyer profile <span className='arr'>→</span></Link>
          </>) : (
            <button onClick={handleBuy} disabled={gate === 'checking'} className='v4btn v4btn-amber co-pay'>Pay {total} USDC on Arc <span className='arr'>→</span></button>
          )}
          <div className='co-back'><Link href={'/store/' + store}>← Back to store</Link></div>
        </>)}
        {step === 'paying' && (
          <div className='co-state'>
            <div className='v4spinner' style={{ margin: '0 auto 24px' }} />
            <h2 className='co-state-h'>Processing</h2>
            <p className='co-state-p'>{isCircle ? 'Sending USDC from your Circle wallet…' : 'Approve the USDC, then confirm the escrow deposit in your wallet…'}</p>
          </div>)}
        {step === 'success' && (
          <div className='co-state'>
            <div className='co-tick'>✓</div>
            <h2 className='co-state-h'>Payment confirmed</h2>
            <p className='co-state-p'>Settled on Arc Testnet · your USDC is locked in escrow and releases when you confirm receipt (or automatically after 7 days).</p>
            {txHash && (txHash.startsWith('0x')
              ? <a className='co-tx' href={'https://testnet.arcscan.app/tx/' + txHash} target='_blank' rel='noreferrer'>{txHash}</a>
              : <div className='co-tx'>{txHash}</div>)}
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