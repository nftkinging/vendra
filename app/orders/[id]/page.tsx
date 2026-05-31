'use client';
import Nav from '../../Nav';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ArcEscrowStatus from '../../components/ArcEscrowStatus';

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: o } = await supabase.from('orders').select('*').eq('id',id).single();
      setOrder(o);
      if (o) {
        const { data: e } = await supabase.from('escrow_jobs').select('*').eq('order_id',id).single();
        setEscrow(e);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><Nav /><div className='v-spinner'/></main>;
  if (!order) return <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><Nav /><div style={{textAlign:'center'}}><div style={{fontFamily:"'Cormorant',serif",fontSize:'3rem',fontWeight:300,color:'var(--w)',marginBottom:16}}>Order Not Found</div><Link href='/profile'><button className='btn-primary'>Back to Profile</button></Link></div></main>;

  const explorerUrl = 'https://testnet.arcscan.app/tx/'+order.tx_hash;

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      <div style={{maxWidth:560,margin:'0 auto',padding:'120px 56px 80px'}}>
        <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Order Receipt</span></div>
        <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:32}}>Order Details</h1>
        <div className='v-status-settled' style={{marginBottom:24}}><div className='v-status-dot'/>{order.status||'Confirmed'}</div>
        {/* Product Card */}
        <div className='v-order-card' style={{marginBottom:16}}>
          <div style={{padding:'28px',background:'linear-gradient(145deg,rgba(212,176,90,0.06),rgba(12,14,26,0.8))',textAlign:'center',borderBottom:'1px solid var(--b1)'}}>
            <div style={{fontSize:'3rem',marginBottom:12}}>{'📦'}</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:22,fontWeight:400,color:'var(--w85)',marginBottom:8}}>{order.product_name}</div>
            <div style={{fontFamily:"'Cormorant',serif",fontSize:36,fontWeight:300,color:'var(--a2)',lineHeight:1}}>{'$'}{Number(order.amount).toFixed(2)}{' USDC'}</div>
          </div>
          <div style={{padding:'20px 24px'}}>
            {[['Date',new Date(order.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})],['Time',new Date(order.created_at).toLocaleTimeString()],['Buyer',order.buyer_wallet?order.buyer_wallet.slice(0,8)+'...'+order.buyer_wallet.slice(-6):''],['Seller',order.seller_wallet?order.seller_wallet.slice(0,8)+'...'+order.seller_wallet.slice(-6):''],['Network','Arc Testnet'],['Status',order.status||'Confirmed']].map(([label,val])=>(
              <div key={String(label)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--b1)'}}>
                <span style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--w18)'}}>{label}</span>
                <span style={{fontSize:12,fontWeight:300,color:'var(--w60)',fontFamily:"'DM Sans',sans-serif"}}>{val}</span>
              </div>))}
          </div>
        </div>
        {/* Escrow Status */}
        <div style={{marginBottom:16}}>
          <ArcEscrowStatus orderId={id} status={escrow?.status||'locked'} amount={Number(order.amount)} createdAt={order.created_at} />
        </div>
        {/* TX Hash */}
        {order.tx_hash&&(
          <a href={explorerUrl} target='_blank' rel='noopener noreferrer' style={{display:'block',border:'1px solid var(--b1)',padding:'16px 20px',marginBottom:24,textDecoration:'none',background:'var(--bg2)',transition:'border-color 0.35s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--a)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b1)')}>
            <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--w18)',marginBottom:6}}>Transaction Hash · Arc Testnet</div>
            <div style={{fontSize:11,fontWeight:300,color:'var(--a)',wordBreak:'break-all',marginBottom:6}}>{order.tx_hash}</div>
            <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em'}}>View on Arc Explorer ↗</div>
          </a>)}
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <Link href='/profile'><button className='btn-primary' style={{padding:'12px 24px',fontSize:10}}>View All Orders</button></Link>
          <Link href='/marketplace'><button className='btn-ghost' style={{padding:'12px 24px',fontSize:10}}>Keep Shopping</button></Link>
        </div>
      </div>
      <footer className='v-footer'><div style={{opacity:0.5,fontFamily:"'Cormorant',serif",fontSize:15,fontWeight:300,letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--w85)'}}>Vendra</div><div className='v-footer-copy'>ERC-8183 Escrow · Arc Testnet</div><div className='v-footer-links'><Link href='/marketplace'>Marketplace</Link></div></footer>
    </main>
  );
}