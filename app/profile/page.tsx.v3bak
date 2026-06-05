'use client';
import Nav from '../Nav';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { getAllProfiles, getOrdersByBuyer, getOrdersBySeller, getStoreByWallet, deleteStore } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [view, setView] = useState<'seller'|'buyer'>('seller');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!isConnected||!address) { router.push('/'); return; }
    Promise.all([getAllProfiles(address),getStoreByWallet(address),getOrdersByBuyer(address),getOrdersBySeller(address)]).then(([all,s,bo,so])=>{
      const sp=all.find((p:any)=>p.role==='seller')||null;
      const bp=all.find((p:any)=>p.role==='buyer')||null;
      setSellerProfile(sp); setBuyerProfile(bp); setStore(s); setBuyerOrders(bo); setSellerOrders(so);
      if(sp) setView('seller'); else if(bp) setView('buyer');
      setLoading(false);
    });
  },[address,isConnected,router]);

  const handleDeleteStore = async () => {
    if(!store) return; setDeleting(true);
    try { await deleteStore(store.id); setStore(null); setShowDelete(false); }
    catch(e){console.error(e);} finally{setDeleting(false);}
  };

  const isSeller=!!sellerProfile, isBuyer=!!buyerProfile;
  const active=view==='seller'?sellerProfile:buyerProfile;
  const initials=active?.display_name?.slice(0,2).toUpperCase()||address?.slice(2,4).toUpperCase()||'VN';
  const totalRevenue=sellerOrders.reduce((s,o)=>s+Number(o.amount),0);
  const totalSpent=buyerOrders.reduce((s,o)=>s+Number(o.amount),0);
  const trustScore=sellerOrders.length>0?Math.min(9.0+sellerOrders.length*0.05,9.9).toFixed(1):'—';

  if(loading) return <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><Nav /><div className='v-spinner'/></main>;
  if(!isSeller&&!isBuyer) return <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><Nav /><div style={{textAlign:'center'}}><div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(36px,5vw,56px)',fontWeight:300,color:'var(--w)',marginBottom:16}}>No Profile Found</div><div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:36}}>Complete onboarding to join Vendra</div><Link href='/onboarding'><button className='btn-primary'>Get Started</button></Link></div></main>;

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      {showDelete&&<div className='v-modal-bg'><div className='v-modal'><div className='v-modal-title'>Delete Store?</div><div className='v-modal-body'>This will permanently delete <strong style={{color:'var(--w)'}}>{store?.name}</strong> and all its products.</div><div style={{display:'flex',gap:12}}><button onClick={handleDeleteStore} disabled={deleting} className='btn-danger'>{deleting?'Deleting...':'Yes, Delete'}</button><button onClick={()=>setShowDelete(false)} className='btn-ghost'>Cancel</button></div></div></div>}
      <div style={{paddingTop:72}}>
        {/* Hero */}
        <div style={{background:'var(--bg2)',borderBottom:'1px solid var(--b1)',padding:'64px 56px 48px'}}>
          <div style={{maxWidth:1200,margin:'0 auto'}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:32,flexWrap:'wrap'}}>
              <div style={{width:80,height:80,borderRadius:'50%',background:view==='seller'?'linear-gradient(135deg,var(--a),var(--sl))':'linear-gradient(135deg,var(--sl),var(--a))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant',serif",fontSize:'1.6rem',fontWeight:300,fontStyle:'italic',flexShrink:0,overflow:'hidden',border:'1px solid var(--b2)',color:'var(--bg)'}}>
                {active?.avatar_url?<img src={active.avatar_url} alt='avatar' style={{width:'100%',height:'100%',objectFit:'cover'}}/>:initials}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(28px,4vw,48px)',fontWeight:300,color:'var(--w)',lineHeight:0.94,marginBottom:12}}>{active?.display_name||'Vendra User'}{view==='seller'&&store&&<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w18)',marginLeft:16,letterSpacing:'0.08em'}}>{'owner · '}{store.name}</span>}</div>
                {active?.bio&&<div style={{fontSize:13,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:8,lineHeight:1.7}}>{active.bio}</div>}
                {active?.x_handle&&<a href={'https://x.com/'+active.x_handle.replace('@','')} target='_blank' rel='noopener noreferrer' style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--a)',textDecoration:'none',letterSpacing:'0.08em',display:'block',marginBottom:8}}>{'𝕏 '}{active.x_handle.startsWith('@')?active.x_handle:'@'+active.x_handle}{' ↗'}</a>}
                <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',marginBottom:16}}>{address?address.slice(0,6)+'...'+address.slice(-4):''}{' · Arc Testnet'}</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {isSeller&&<div style={{fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',padding:'4px 12px',border:'1px solid rgba(212,176,90,0.4)',color:'var(--a)',fontWeight:300,fontStyle:'italic'}}>Seller</div>}
                  {isBuyer&&<div style={{fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',padding:'4px 12px',border:'1px solid rgba(155,181,200,0.4)',color:'var(--sl)',fontWeight:300,fontStyle:'italic'}}>Buyer</div>}
                  <div style={{fontSize:9,letterSpacing:'0.12em',textTransform:'uppercase',padding:'4px 12px',border:'1px solid var(--gr3)',color:'var(--gr)',fontWeight:300,fontStyle:'italic'}}>ERC-8004 Identity</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10,alignItems:'flex-end',flexShrink:0}}>
                {isSeller&&isBuyer&&<div style={{display:'flex',border:'1px solid var(--b1)',overflow:'hidden'}}><button onClick={()=>setView('seller')} style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:300,fontStyle:'italic',letterSpacing:'0.12em',textTransform:'uppercase',padding:'8px 16px',border:'none',cursor:'pointer',background:view==='seller'?'var(--a2)':'transparent',color:view==='seller'?'var(--bg)':'var(--w18)',transition:'all 0.2s'}}>Seller</button><button onClick={()=>setView('buyer')} style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:300,fontStyle:'italic',letterSpacing:'0.12em',textTransform:'uppercase',padding:'8px 16px',border:'none',cursor:'pointer',background:view==='buyer'?'var(--sl)':'transparent',color:view==='buyer'?'var(--bg)':'var(--w18)',transition:'all 0.2s'}}>Buyer</button></div>}
                {!isSeller&&<Link href='/onboarding?role=seller'><button className='btn-amber-ghost' style={{fontSize:10,padding:'8px 16px'}}>+ Seller Profile</button></Link>}
                {!isBuyer&&<Link href='/onboarding?role=buyer'><button className='btn-slate' style={{fontSize:10,padding:'8px 16px'}}>+ Buyer Profile</button></Link>}
                <Link href={'/edit-profile?role='+view}><button className='btn-ghost' style={{fontSize:10,padding:'8px 16px'}}>Edit Profile</button></Link>
              </div>
            </div>
          </div>
        </div>
        {/* SELLER VIEW */}
        {view==='seller'&&isSeller&&(
          <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 56px 80px'}}>
            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'var(--b1)',marginBottom:24}}>
              {[{val:'$'+totalRevenue.toFixed(2),label:'Total Revenue',c:'var(--a2)'},{val:String(sellerOrders.length),label:'Orders',c:'var(--w)'},{val:String(store?.products?.length||0),label:'Products',c:'var(--w)'},{val:'0%',label:'Platform Fee',c:'var(--a2)'}].map(s=>(<div key={s.label} className='v-profile-stat'><div className='v-profile-stat-val' style={{color:s.c}}>{s.val}</div><div className='v-profile-stat-label'>{s.label}</div></div>))}
            </div>
            {/* Main grid: store + balance */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:24,marginBottom:32,alignItems:'start'}}>
              <div>
                <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Your Store</span></div>
                <div style={{border:'1px solid var(--b1)',background:'var(--bg2)',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.3),transparent)'}}/>
                  {store?(
                    <div style={{padding:28}}>
                      {store.banner_url&&<div style={{marginBottom:20,overflow:'hidden',height:100}}><img src={store.banner_url} alt='banner' style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.6)'}}/></div>}
                      <div style={{fontFamily:"'Cormorant',serif",fontSize:28,fontWeight:300,color:'var(--w)',marginBottom:6}}>{store.name}</div>
                      <div style={{fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w35)',marginBottom:20,lineHeight:1.6}}>{store.tagline}</div>
                      <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',marginBottom:24}}>{store.category}{' · '}{store.products?.length||0}{' products · Arc Testnet'}</div>
                      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                        <Link href={'/store/'+store.slug}><button className='btn-primary' style={{fontSize:10,padding:'10px 20px'}}>View Storefront</button></Link>
                        <Link href='/store/edit?tab=products'><button className='btn-amber-ghost' style={{fontSize:10,padding:'10px 20px'}}>+ Add Products</button></Link>
                        <Link href='/store/edit'><button className='btn-ghost' style={{fontSize:10,padding:'10px 20px'}}>Edit Store</button></Link>
                        <button onClick={()=>setShowDelete(true)} className='btn-danger' style={{fontSize:10,padding:'10px 20px'}}>Delete</button>
                      </div>
                    </div>
                  ):<div style={{padding:40,textAlign:'center'}}><div style={{fontFamily:"'Cormorant',serif",fontSize:22,fontWeight:300,color:'var(--w)',marginBottom:12}}>No store yet</div><Link href='/store/create'><button className='btn-primary'>Create Store</button></Link></div>}
                </div>
              </div>
              {/* Balance + Recent Sales */}
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                <div style={{background:'linear-gradient(145deg,rgba(212,176,90,0.08),rgba(155,181,200,0.04),var(--bg2))',border:'1px solid rgba(212,176,90,0.15)',padding:24,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,176,90,0.4),transparent)'}}/>
                  <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--w18)',marginBottom:4}}>Store Balance</div>
                  <div style={{fontFamily:"'Cormorant',serif",fontSize:36,fontWeight:300,color:'var(--a2)',lineHeight:1,marginBottom:4}}>{'$'}{totalRevenue.toFixed(2)}</div>
                  <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em',marginBottom:16}}>USDC · Arc Testnet</div>
                  <div style={{borderTop:'1px solid var(--b1)',paddingTop:14}}>
                    <div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--w18)',marginBottom:10}}>Recent Sales</div>
                    {sellerOrders.slice(0,3).length===0?<div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--w18)',textAlign:'center',padding:'10px 0'}}>No sales yet</div>
                    :sellerOrders.slice(0,3).map((o:any)=>(<div key={o.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><div style={{width:32,height:32,background:'var(--a5)',border:'1px solid rgba(212,176,90,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{'📦'}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:300,color:'var(--w60)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.product_name}</div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)'}}>{new Date(o.created_at).toLocaleDateString()}</div></div><div style={{fontFamily:"'Cormorant',serif",fontSize:13,fontWeight:300,color:'var(--gr)',flexShrink:0}}>{'+'}{Number(o.amount).toFixed(0)}</div></div>))}
                  </div>
                </div>
                {/* Circle App Kit Panel */}
                
              </div>
            </div>
            {/* All Sales */}
            <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>All Sales</span></div>
            <div style={{border:'1px solid var(--b1)'}}>
              {sellerOrders.length===0?<div style={{padding:32,textAlign:'center',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em'}}>No sales yet</div>
              :sellerOrders.map((o:any)=>(<div key={o.id} style={{display:'flex',alignItems:'center',gap:16,padding:'16px 24px',borderBottom:'1px solid var(--b1)'}}><div style={{fontSize:'1.1rem'}}>{'📦'}</div><div style={{flex:1}}><div style={{fontFamily:"'Cormorant',serif",fontSize:16,fontWeight:300,color:'var(--w85)'}}>{o.product_name}</div><div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',marginTop:2}}>{new Date(o.created_at).toLocaleDateString()}{o.tx_hash?' · '+o.tx_hash.slice(0,14)+'...':''}</div></div><div style={{fontFamily:"'Cormorant',serif",fontSize:18,fontWeight:300,color:'var(--a2)'}}>{'$'}{Number(o.amount).toFixed(2)}</div></div>))}
            </div>
          </div>)}
        {/* BUYER VIEW */}
        {view==='buyer'&&isBuyer&&(
          <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 56px 80px'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--b1)',marginBottom:32}}>
              {[{val:'$'+totalSpent.toFixed(2),label:'Total Spent',c:'var(--sl)'},{val:String(buyerOrders.length),label:'Orders',c:'var(--w)'},{val:'Arc Testnet',label:'Network',c:'var(--w)'}].map(s=>(<div key={s.label} className='v-profile-stat'><div className='v-profile-stat-val' style={{color:s.c}}>{s.val}</div><div className='v-profile-stat-label'>{s.label}</div></div>))}
            </div>
            <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Order History</span></div>
            <div style={{border:'1px solid var(--b1)',marginBottom:32}}>
              {buyerOrders.length===0?<div style={{padding:32,textAlign:'center',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em'}}>No orders yet — <Link href='/marketplace' style={{color:'var(--a)'}}>explore the marketplace</Link></div>
              :buyerOrders.map((o:any)=>(<Link key={o.id} href={'/orders/'+o.id} style={{textDecoration:'none',color:'inherit'}}><div style={{display:'flex',alignItems:'center',gap:16,padding:'16px 24px',borderBottom:'1px solid var(--b1)',cursor:'pointer',transition:'background 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.background='var(--bg2)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}><div style={{fontSize:'1.1rem'}}>{'📦'}</div><div style={{flex:1}}><div style={{fontFamily:"'Cormorant',serif",fontSize:16,fontWeight:300,color:'var(--w85)'}}>{o.product_name}</div><div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',marginTop:2}}>{new Date(o.created_at).toLocaleDateString()}{' · click to view →'}</div></div><div style={{fontFamily:"'Cormorant',serif",fontSize:18,fontWeight:300,color:'var(--sl)'}}>{'$'}{Number(o.amount).toFixed(2)}</div></div></Link>))}
            </div>
            <Link href='/marketplace'><button className='btn-primary'>Browse Marketplace →</button></Link>
          </div>)}
      </div>
      <footer className='v-footer'><div style={{opacity:0.5,fontFamily:"'Cormorant',serif",fontSize:15,fontWeight:300,letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--w85)'}}>Vendra</div><div className='v-footer-copy'>ERC-8183 Escrow · ERC-8004 Identity · Arc Testnet</div><div className='v-footer-links'><Link href='/marketplace'>Marketplace</Link><Link href='/store/create'>Sell</Link></div></footer>
    </main>
  );
}