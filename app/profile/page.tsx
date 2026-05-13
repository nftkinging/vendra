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
  const [view, setView] = useState('seller');
  const [loading, setLoading] = useState(true);
  const [deletingStore, setDeletingStore] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  useEffect(() => {
    if (!isConnected || !address) { router.push('/'); return; }
    const load = async () => {
      const [allProfiles, s, bo, so] = await Promise.all([getAllProfiles(address), getStoreByWallet(address), getOrdersByBuyer(address), getOrdersBySeller(address)]);
      const sp = allProfiles.find(p => p.role === 'seller') || null;
      const bp = allProfiles.find(p => p.role === 'buyer') || null;
      setSellerProfile(sp); setBuyerProfile(bp); setStore(s); setBuyerOrders(bo); setSellerOrders(so);
      if (sp) setView('seller'); else if (bp) setView('buyer');
      setLoading(false);
    };
    load();
  }, [address, isConnected, router]);
  const handleDeleteStore = async () => {
    if (!store) return;
    setDeletingStore(true);
    try { await deleteStore(store.id); setStore(null); setShowDeleteConfirm(false); } catch(e) { console.error(e); } finally { setDeletingStore(false); }
  };
  const isSeller = !!sellerProfile;
  const isBuyer = !!buyerProfile;
  const activeProfile = view === 'seller' ? sellerProfile : buyerProfile;
  const initials = activeProfile?.display_name?.slice(0,2).toUpperCase() || address?.slice(2,4).toUpperCase() || 'VN';
  const totalRevenue = sellerOrders.reduce((sum, o) => sum + Number(o.amount), 0);
  const totalSpent = buyerOrders.reduce((sum, o) => sum + Number(o.amount), 0);
  if (loading) return (<main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><Nav /><div style={{fontSize:'0.7rem',color:'var(--muted)'}}>Loading...</div></main>);
  if (!isSeller && !isBuyer) return (<main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><Nav /><div style={{textAlign:'center'}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'2.5rem',marginBottom:'1rem'}}>No Profile Found</div><Link href='/onboarding'><button className='btn-3d-accent' style={{padding:'0.75rem 2rem',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>Get Started</button></Link></div></main>);
  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}><Nav />
      {showDeleteConfirm && (<div style={{position:'fixed',inset:0,background:'rgba(10,6,18,0.9)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}><div className='card-3d' style={{padding:'2rem',maxWidth:400,width:'100%',textAlign:'center'}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.8rem',marginBottom:'0.75rem'}}>Delete Store?</div><div style={{fontSize:'0.875rem',color:'var(--muted)',marginBottom:'1.5rem',fontWeight:300}}>This will permanently delete {store?.name}.</div><div style={{display:'flex',gap:'0.75rem',justifyContent:'center'}}><button onClick={handleDeleteStore} disabled={deletingStore} className='btn-3d-danger' style={{padding:'0.6rem 1.5rem',fontSize:'0.65rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>{deletingStore?'Deleting...':'Yes, Delete'}</button><button onClick={()=>setShowDeleteConfirm(false)} className='btn-3d-ghost' style={{padding:'0.6rem 1.5rem',fontSize:'0.65rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>Cancel</button></div></div></div>)}
      <div style={{maxWidth:900,margin:'0 auto',padding:'7rem 2.5rem 4rem'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:'2rem',paddingBottom:'2rem',borderBottom:'1px solid var(--border)',marginBottom:'2rem',flexWrap:'wrap'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:view==='seller'?'linear-gradient(135deg,var(--accent),#7c3aed)':'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0,overflow:'hidden',border:'2px solid var(--border2)'}}>{activeProfile?.avatar_url?<img src={activeProfile.avatar_url} alt='avatar' style={{width:'100%',height:'100%',objectFit:'cover'}}/>:initials}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'2rem',marginBottom:'0.25rem'}}>{activeProfile?.display_name||'Vendra User'}{view==='seller'&&store&&<span style={{fontSize:'0.6rem',color:'var(--muted)',marginLeft:'0.75rem'}}>owner at {store.name}</span>}</div>
            {activeProfile?.bio&&<div style={{fontSize:'0.875rem',color:'var(--muted)',fontWeight:300,marginBottom:'0.5rem'}}>{activeProfile.bio}</div>}
            {activeProfile?.x_handle&&<a href={'https://x.com/'+activeProfile.x_handle.replace('@','')} target='_blank' rel='noopener noreferrer' style={{fontSize:'0.6rem',color:'var(--accent)',display:'block',textDecoration:'none',marginBottom:'0.5rem'}}>{activeProfile.x_handle.startsWith('@')?activeProfile.x_handle:'@'+activeProfile.x_handle} ↗</a>}
            <div style={{fontSize:'0.6rem',color:'var(--muted)',marginBottom:'0.75rem'}}>{address?address.slice(0,6)+'...'+address.slice(-4):''} · Arc Testnet</div>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>{isSeller&&<div style={{fontSize:'0.55rem',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.2rem 0.6rem',border:'1px solid var(--accent)',color:'var(--accent)'}}>Seller</div>}{isBuyer&&<div style={{fontSize:'0.55rem',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.2rem 0.6rem',border:'1px solid #7c3aed',color:'#a78bfa'}}>Buyer</div>}</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',alignItems:'flex-end',flexShrink:0}}>
            {isSeller&&isBuyer&&(<div style={{display:'flex',border:'1px solid var(--border)',overflow:'hidden'}}><button onClick={()=>setView('seller')} style={{fontSize:'0.58rem',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.5rem 1rem',border:'none',cursor:'pointer',background:view==='seller'?'var(--accent)':'transparent',color:view==='seller'?'#fff':'var(--muted)',transition:'all 0.2s'}}>Seller View</button><button onClick={()=>setView('buyer')} style={{fontSize:'0.58rem',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.5rem 1rem',border:'none',cursor:'pointer',background:view==='buyer'?'#7c3aed':'transparent',color:view==='buyer'?'#fff':'var(--muted)',transition:'all 0.2s'}}>Buyer View</button></div>)}
            {!isSeller&&<Link href='/onboarding?role=seller'><button className='btn-3d-accent' style={{padding:'0.4rem 0.9rem',fontSize:'0.58rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>+ Add Seller Profile</button></Link>}
            {!isBuyer&&<Link href='/onboarding?role=buyer'><button className='btn-3d-purple' style={{padding:'0.4rem 0.9rem',fontSize:'0.58rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>+ Add Buyer Profile</button></Link>}
            <Link href={'/edit-profile?role='+view}><button className='btn-3d-dark' style={{padding:'0.4rem 0.9rem',fontSize:'0.58rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>Edit Profile</button></Link>
          </div>
        </div>
        {view==='seller'&&isSeller&&(<>
          <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'1.5rem',marginBottom:'2rem',alignItems:'start'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1px',background:'var(--border)'}}>
              {[{val:'$'+totalRevenue.toFixed(2),label:'Total Revenue',color:'var(--accent2)'},{val:String(sellerOrders.length),label:'Orders',color:'var(--ink)'},{val:String(store?.products?.length||0),label:'Products',color:'var(--ink)'},{val:'0%',label:'Platform Fee',color:'var(--accent2)'}].map(s=>(<div key={s.label} className='card-3d' style={{padding:'1.25rem'}}><div style={{fontSize:'1.8rem',color:s.color}}>{s.val}</div><div style={{fontSize:'0.55rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',marginTop:'0.2rem'}}>{s.label}</div></div>))}
            </div>
            <div className='card-3d' style={{padding:'1.25rem',background:'linear-gradient(135deg,rgba(201,77,122,0.15),rgba(124,58,237,0.1),var(--bg2))'}}>
              <div style={{fontSize:'0.58rem',color:'var(--muted)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Store Balance</div>
              <div style={{fontSize:'2.5rem',color:'var(--accent2)',marginBottom:'0.25rem'}}>{'$'}{totalRevenue.toFixed(2)}</div>
              <div style={{fontSize:'0.55rem',color:'var(--muted)',marginBottom:'1.25rem'}}>USDC · Arc Testnet</div>
              <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem'}}>
                <div style={{fontSize:'0.55rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Recent Sales</div>
                {sellerOrders.slice(0,3).length===0?<div style={{fontSize:'0.6rem',color:'var(--muted)',textAlign:'center',padding:'1rem 0'}}>No sales yet</div>:sellerOrders.slice(0,3).map(o=>(<div key={o.id} style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.75rem'}}><div style={{width:36,height:36,borderRadius:'4px',background:'linear-gradient(135deg,var(--accent),#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{'📦'}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:'0.75rem',fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.product_name}</div><div style={{fontSize:'0.5rem',color:'var(--muted)'}}>{new Date(o.created_at).toLocaleDateString()}</div></div><div style={{fontSize:'0.9rem',color:'var(--accent2)',flexShrink:0}}>{'$'}{Number(o.amount).toFixed(0)}</div></div>))}
              </div>
            </div>
          </div>
          <div style={{fontSize:'0.6rem',color:'var(--muted)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'1rem'}}>Your Store</div>
          <div style={{border:'1px solid var(--border)',marginBottom:'2rem'}}>{store?(<div style={{padding:'1.25rem'}}>{store.banner_url&&<div style={{marginBottom:'1rem',overflow:'hidden',height:120}}><img src={store.banner_url} alt='banner' style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>}<div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}><div style={{fontSize:'1.5rem'}}>{'🏪'}</div><div style={{flex:1}}><div style={{fontWeight:500,fontSize:'1rem'}}>{store.name}</div><div style={{fontSize:'0.58rem',color:'var(--muted)',letterSpacing:'0.06em',textTransform:'uppercase',marginTop:'0.2rem'}}>{store.category} · {store.products?.length||0} products</div></div></div><div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}><Link href={'/store/'+store.slug}><button className='btn-3d-accent' style={{padding:'0.5rem 1rem',fontSize:'0.58rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>View Storefront</button></Link><Link href='/store/edit?tab=products'><button className='btn-3d-purple' style={{padding:'0.5rem 1rem',fontSize:'0.58rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>+ Add Products</button></Link><Link href='/store/edit'><button className='btn-3d-dark' style={{padding:'0.5rem 1rem',fontSize:'0.58rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>Edit Store</button></Link><button onClick={()=>setShowDeleteConfirm(true)} className='btn-3d-danger' style={{padding:'0.5rem 1rem',fontSize:'0.58rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>Delete</button></div></div>):(<div style={{padding:'2rem',textAlign:'center'}}><div style={{fontSize:'0.65rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'1rem'}}>No store yet</div><Link href='/store/create'><button className='btn-3d-accent' style={{padding:'0.6rem 1.25rem',fontSize:'0.65rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>Create Store</button></Link></div>)}</div>
          <div style={{fontSize:'0.6rem',color:'var(--muted)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'1rem'}}>All Sales</div>
          <div style={{border:'1px solid var(--border)'}}>{sellerOrders.length===0?<div style={{padding:'2rem',textAlign:'center',fontSize:'0.65rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase'}}>No sales yet</div>:sellerOrders.map(o=>(<div key={o.id} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.25rem',borderBottom:'1px solid var(--border)'}}><div style={{fontSize:'1.2rem'}}>{'📦'}</div><div style={{flex:1}}><div style={{fontWeight:500,fontSize:'0.9rem'}}>{o.product_name}</div><div style={{fontSize:'0.55rem',color:'var(--muted)',marginTop:'0.2rem'}}>{new Date(o.created_at).toLocaleDateString()}</div></div><div style={{fontSize:'1rem',color:'var(--accent2)'}}>{'$'}{Number(o.amount).toFixed(2)}</div></div>))}</div>
        </>)}
        {view==='buyer'&&isBuyer&&(<>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',marginBottom:'2rem'}}>{[{val:'$'+totalSpent.toFixed(2),label:'Total Spent',color:'#a78bfa'},{val:String(buyerOrders.length),label:'Orders',color:'var(--ink)'},{val:'Arc Testnet',label:'Network',color:'var(--ink)'}].map(s=>(<div key={s.label} className='card-3d' style={{padding:'1.25rem'}}><div style={{fontSize:'1.8rem',color:s.color}}>{s.val}</div><div style={{fontSize:'0.55rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase',marginTop:'0.2rem'}}>{s.label}</div></div>))}</div>
          <div style={{fontSize:'0.6rem',color:'var(--muted)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'1rem'}}>Order History</div>
          <div style={{border:'1px solid var(--border)',marginBottom:'2rem'}}>{buyerOrders.length===0?<div style={{padding:'2rem',textAlign:'center',fontSize:'0.65rem',color:'var(--muted)',letterSpacing:'0.08em',textTransform:'uppercase'}}>No orders yet</div>:buyerOrders.map(o=>(<Link key={o.id} href={'/orders/'+o.id} style={{textDecoration:'none',color:'inherit'}}><div style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.25rem',borderBottom:'1px solid var(--border)',cursor:'pointer',transition:'background 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.background='var(--bg2)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}><div style={{fontSize:'1.2rem'}}>{'📦'}</div><div style={{flex:1}}><div style={{fontWeight:500,fontSize:'0.9rem'}}>{o.product_name}</div><div style={{fontSize:'0.55rem',color:'var(--muted)',marginTop:'0.2rem'}}>{new Date(o.created_at).toLocaleDateString()} · click to view</div></div><div style={{fontSize:'1rem',color:'#a78bfa'}}>{'$'}{Number(o.amount).toFixed(2)}</div></div></Link>))}</div>
          <Link href='/marketplace'><button className='btn-3d-purple' style={{padding:'0.75rem 2rem',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>Browse Marketplace</button></Link>
        </>)}
      </div>
    </main>
  );
}