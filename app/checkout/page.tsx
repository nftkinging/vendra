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
  const store = params.get('store')||'';
  const product = params.get('product')||'';
  const price = Number(params.get('price')||0);
  const seller = (params.get('seller')||'0x70997970C51812dc3A010C7d01b50e0d17dc79C8') as `0x${string}`;
  const [step, setStep] = useState<'review'|'paying'|'success'|'error'>('review');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleBuy = async () => {
    if (!isConnected||!address) { router.push('/join'); return; }
    setStep('paying');
    try {
      const hash = await sendTransactionAsync({ to: seller, value: parseUnits(price.toString(),18) });
      const order = await saveOrder({ buyer_wallet:address, seller_wallet:seller, product_name:product, amount:price, tx_hash:hash });
      await createEscrowJob({ order_id:order?.id, buyer_wallet:address, seller_wallet:seller, amount:price, tx_hash:hash });
      setTxHash(hash); setStep('success');
    } catch(e:any) {
      setError(e?.message?.includes('rejected')?'Transaction rejected in wallet':'Transaction failed — please try again');
      setStep('error');
    }
  };

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      <div style={{maxWidth:520,margin:'0 auto',padding:'120px 56px 80px'}}>
        {step==='review'&&(
          <>
            <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Buy Now</span></div>
            <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:32}}>Confirm Purchase</h1>
            <div className='v-order-card' style={{marginBottom:24}}>
              <div style={{padding:'28px',borderBottom:'1px solid var(--b1)'}}>
                <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--w18)',marginBottom:6}}>Product</div>
                <div style={{fontFamily:"'Cormorant',serif",fontSize:22,fontWeight:400,color:'var(--w85)',marginBottom:4}}>{product}</div>
                <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em'}}>{store}</div>
              </div>
              <div style={{padding:'20px 28px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--w18)'}}>Total</span>
                <span style={{fontFamily:"'Cormorant',serif",fontSize:32,fontWeight:300,color:'var(--a2)'}}>{'$'}{price}{' USDC'}</span>
              </div>
            </div>
            <div style={{border:'1px solid var(--b1)',padding:'14px 18px',marginBottom:24,display:'flex',alignItems:'center',gap:10}}>
              <div className='v-arc-badge-dot'/>
              <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7}}>Funds held in ERC-8183 escrow until delivery confirmed. 48-hour dispute window.</div>
            </div>
            <button onClick={handleBuy} className='btn-primary' style={{width:'100%',padding:'18px',fontSize:12}}>{'Pay $'}{price}{' USDC on Arc →'}</button>
            <div style={{textAlign:'center',marginTop:16}}><Link href={'/store/'+store} style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',textDecoration:'none'}}>← Back to Store</Link></div>
          </>
        )}
        {step==='paying'&&(
          <div style={{textAlign:'center',padding:'4rem 0'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'var(--w)',marginBottom:16}}>Processing</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:32}}>Approve the payment in your wallet</div>
            <div className='v-spinner' style={{margin:'0 auto'}}/>
          </div>)}
        {step==='success'&&(
          <div style={{textAlign:'center',padding:'3rem 0'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'5rem',fontWeight:300,color:'var(--a2)',lineHeight:1,marginBottom:16}}>✓</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'var(--w)',marginBottom:12}}>Payment Confirmed</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:8}}>Transaction confirmed on Arc Testnet</div>
            <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em',marginBottom:8}}>ERC-8183 escrow active · Release in 48 hours</div>
            {txHash&&<div style={{fontSize:10,fontWeight:300,color:'var(--a)',letterSpacing:'0.06em',wordBreak:'break-all',marginBottom:32,padding:'10px 16px',border:'1px solid var(--b1)',background:'var(--bg2)'}}>{txHash}</div>}
            <div style={{display:'flex',flexDirection:'column',gap:12,maxWidth:260,margin:'0 auto'}}>
              <Link href='/profile'><button className='btn-primary' style={{width:'100%',padding:'14px',fontSize:10}}>View My Orders</button></Link>
              <Link href='/marketplace'><button className='btn-ghost' style={{width:'100%',padding:'14px',fontSize:10}}>Keep Shopping</button></Link>
            </div>
          </div>)}
        {step==='error'&&(
          <div style={{textAlign:'center',padding:'3rem 0'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'4rem',fontWeight:300,color:'var(--err)',lineHeight:1,marginBottom:16}}>✕</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(24px,4vw,36px)',fontWeight:300,color:'var(--w)',marginBottom:8}}>Transaction Failed</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.75,marginBottom:28}}>{error}</div>
            <button onClick={()=>setStep('review')} className='btn-amber-ghost'>Try Again</button>
          </div>)}
      </div>
    </main>
  );
}

export default function Checkout() {
  return <Suspense><CheckoutContent /></Suspense>;
}