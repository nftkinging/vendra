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
    if (!isConnected||!address) { router.push('/join'); return; }
    if (items.length===0) return;
    setStep('paying');
    const hashes: string[] = [];
    const sellers = Object.entries(grouped);
    setTotalItems(sellers.length);
    try {
      for (let i=0;i<sellers.length;i++) {
        const [,storeItems] = sellers[i];
        setCurrentSeller(storeItems[0].storeName);
        setCurrentItem(i+1);
        const sellerWallet = storeItems[0].sellerWallet as `0x${string}`;
        const storeTotal = storeItems.reduce((s,item)=>s+item.price*item.quantity,0);
        const hash = await sendTransactionAsync({ to:sellerWallet, value:parseUnits(storeTotal.toString(),18) });
        hashes.push(hash);
        for (const item of storeItems) {
          const order = await saveOrder({ buyer_wallet:address, seller_wallet:sellerWallet, product_name:item.productName+(item.quantity>1?' x'+item.quantity:''), amount:item.price*item.quantity, tx_hash:hash });
          await createEscrowJob({ order_id:order?.id, buyer_wallet:address, seller_wallet:sellerWallet, amount:item.price*item.quantity, tx_hash:hash });
        }
        await upsertSellerReputation(sellerWallet,{total_sales:storeItems.length});
      }
      setTxHashes(hashes); clearCart(); setStep('success');
    } catch(e:any) {
      setError(e?.message?.includes('rejected')?'Transaction rejected in wallet':'Transaction failed — please try again');
      setStep('error');
    }
  };

  if (items.length===0&&step==='review') return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}><Nav />
    <div style={{maxWidth:520,margin:'0 auto',padding:'120px 56px 80px',textAlign:'center'}}>
      <div style={{fontFamily:"'Cormorant',serif",fontSize:'3rem',fontWeight:300,color:'var(--w)',marginBottom:16}}>{'🛒'}</div>
      <div style={{fontFamily:"'Cormorant',serif",fontSize:28,fontWeight:300,color:'var(--w)',marginBottom:24}}>Cart is Empty</div>
      <Link href='/marketplace'><button className='btn-primary'>Browse Marketplace</button></Link>
    </div></main>
  );

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      <div style={{maxWidth:580,margin:'0 auto',padding:'120px 56px 80px'}}>
        {step==='review'&&(
          <>
            <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Checkout</span></div>
            <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:40}}>Order Summary</h1>
            {Object.entries(grouped).map(([slug,storeItems])=>{
              const storeTotal = storeItems.reduce((s,item)=>s+item.price*item.quantity,0);
              return (
                <div key={slug} style={{border:'1px solid var(--b1)',marginBottom:16,overflow:'hidden'}}>
                  <div className='v-block-head' style={{color:'var(--a)'}}>{'🏪 '}{storeItems[0].storeName}</div>
                  {storeItems.map(item=>(
                    <div key={item.id} style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',borderBottom:'1px solid var(--b1)'}}>
                      {item.image?<img src={item.image} alt={item.productName} style={{width:48,height:48,objectFit:'cover',flexShrink:0,border:'1px solid var(--b1)'}}/>:<div style={{width:48,height:48,background:'var(--s1)',border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{'📦'}</div>}
                      <div style={{flex:1}}><div style={{fontFamily:"'Cormorant',serif",fontSize:16,fontWeight:300,color:'var(--w85)',marginBottom:4}}>{item.productName}</div><div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em'}}>{'Qty: '}{item.quantity}{' · $'}{item.price}{' each'}</div></div>
                      <div style={{fontFamily:"'Cormorant',serif",fontSize:18,fontWeight:300,color:'var(--a2)'}}>{'$'}{(item.price*item.quantity).toFixed(2)}</div>
                    </div>))}
                  <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',background:'var(--bg2)'}}>
                    <span style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--w18)'}}>Store total</span>
                    <span style={{fontFamily:"'Cormorant',serif",fontSize:16,fontWeight:300,color:'var(--a2)'}}>{'$'}{storeTotal.toFixed(2)}{' USDC'}</span>
                  </div>
                </div>);
            })}
            <div style={{border:'1px solid var(--b2)',padding:'24px',marginBottom:20,background:'var(--bg2)',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:'20%',right:'20%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
                <div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--w18)',marginBottom:4}}>Grand Total</div><div style={{fontFamily:"'Cormorant',serif",fontSize:40,fontWeight:300,color:'var(--a2)',lineHeight:1}}>{'$'}{total().toFixed(2)}</div></div>
                <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em'}}>USDC · Arc Testnet</div>
              </div>
              {Object.keys(grouped).length>1&&<div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',marginTop:12,borderTop:'1px solid var(--b1)',paddingTop:12,letterSpacing:'0.08em'}}>{'⚡ '}{Object.keys(grouped).length}{' separate wallet approvals — one per store'}</div>}
            </div>
            <div style={{border:'1px solid var(--b1)',padding:'14px 18px',marginBottom:24,display:'flex',alignItems:'center',gap:10}}>
              <div className='v-arc-badge-dot'/>
              <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.7}}>Funds locked in ERC-8183 escrow until delivery confirmed. 48-hour dispute window.</div>
            </div>
            <button onClick={handleCheckout} className='btn-primary' style={{width:'100%',padding:'18px',fontSize:12}}>{'Pay $'}{total().toFixed(2)}{' USDC on Arc →'}</button>
            <div style={{textAlign:'center',marginTop:16}}><Link href='/marketplace' style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',textDecoration:'none'}}>← Continue Shopping</Link></div>
          </>
        )}
        {step==='paying'&&(
          <div style={{textAlign:'center',padding:'4rem 0'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'var(--w)',marginBottom:16}}>Processing Payment</div>
            <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--a)',letterSpacing:'0.16em',textTransform:'uppercase',marginBottom:8}}>{'Store '}{currentItem}{' of '}{totalItems}</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:32}}>{'Approve payment to '}{currentSeller}{' in your wallet'}</div>
            <div className='v-spinner' style={{margin:'0 auto'}}/>
          </div>)}
        {step==='success'&&(
          <div style={{textAlign:'center',padding:'3rem 0'}}>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'5rem',fontWeight:300,color:'var(--a2)',lineHeight:1,marginBottom:16}}>✓</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,color:'var(--w)',marginBottom:12}}>All Payments Confirmed</div>
            <div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',lineHeight:1.8,marginBottom:8}}>{txHashes.length}{' transaction'}{txHashes.length>1?'s':''}{' confirmed on Arc Testnet'}</div>
            <div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em',marginBottom:36}}>ERC-8183 escrow active · Funds release in 48 hours</div>
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