'use client';
import Nav from '../../Nav';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoreByWallet, updateStore, saveProduct, deleteProduct, uploadImage } from '../../lib/supabase';
import Link from 'next/link';

const CATS = [{icon:'👗',name:'Fashion'},{icon:'💾',name:'Digital'},{icon:'🎨',name:'Art'},{icon:'🛠',name:'Services'},{icon:'🍱',name:'Food'},{icon:'📱',name:'Tech'},{icon:'🎵',name:'Music'},{icon:'✨',name:'Other'}];
const TYPES = ['Physical','Digital','Service'];

function EditStoreContent() {
  const { address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState<'details'|'products'>('details');
  const [form, setForm] = useState({ name:'', tagline:'', description:'', xHandle:'', category:'Fashion' });
  const [bannerFile, setBannerFile] = useState<File|null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [newProd, setNewProd] = useState({ name:'', description:'', price:'', type:'Physical' });
  const [prodFile, setProdFile] = useState<File|null>(null);
  const [prodPreview, setProdPreview] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { if (searchParams.get('tab')==='products') setTab('products'); }, [searchParams]);
  useEffect(() => {
    if (!address) return;
    getStoreByWallet(address).then(s => {
      if (!s) { router.push('/store/create'); return; }
      setStore(s);
      setForm({ name:s.name||'', tagline:s.tagline||'', description:s.description||'', xHandle:s.x_handle||'', category:s.category||'Fashion' });
      setBannerPreview(s.banner_url||'');
      setLoading(false);
    });
  }, [address, router]);

  const handleSave = async () => {
    if (!form.name) { setError('Store name required'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      let bannerUrl = store.banner_url||'';
      if (bannerFile && address) bannerUrl = await uploadImage('banners/'+address, bannerFile);
      await updateStore(store.id, { name:form.name, tagline:form.tagline, description:form.description, category:form.category, x_handle:form.xHandle, banner_url:bannerUrl });
      setSuccess('Store updated!'); setTimeout(()=>setSuccess(''),2500);
    } catch { setError('Something went wrong.'); } finally { setSaving(false); }
  };

  const handleAddProduct = async () => {
    if (!newProd.name||!newProd.price) { setError('Name and price required'); return; }
    setAdding(true); setError('');
    try {
      let imageUrl = '';
      if (prodFile && address) imageUrl = await uploadImage('products/'+store.id+'/'+Date.now(), prodFile);
      const p = await saveProduct({ store_id:store.id, name:newProd.name, description:newProd.description, price:Number(newProd.price), type:newProd.type, image_url:imageUrl });
      setStore({...store, products:[...(store.products||[]),p]});
      setNewProd({name:'',description:'',price:'',type:'Physical'}); setProdFile(null); setProdPreview(''); setShowAdd(false);
    } catch { setError('Failed to add product.'); } finally { setAdding(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    setDeletingId(id);
    try { await deleteProduct(id); setStore({...store,products:store.products.filter((p:any)=>p.id!==id)}); }
    catch { setError('Failed to delete.'); } finally { setDeletingId(''); }
  };

  if (loading) return <main style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><Nav /><div className='v-spinner'/></main>;

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Nav />
      <div style={{maxWidth:700,margin:'0 auto',padding:'120px 56px 80px'}}>
        <div className='v-eyebrow' style={{marginBottom:16}}><div className='v-eyebrow-rule'/><span className='v-eyebrow-label'>Manage Store</span></div>
        <h1 style={{fontFamily:"'Cormorant',serif",fontSize:'clamp(32px,5vw,52px)',fontWeight:300,letterSpacing:'-0.01em',lineHeight:0.94,color:'var(--w)',marginBottom:8}}>{store?.name}</h1>
        <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',marginBottom:28}}>{store?.products?.length||0}{' products · '}{store?.category}{' · Arc Testnet'}</div>
        <div style={{display:'flex',gap:10,marginBottom:32}}>
          <a href={'/store/'+store?.slug} target='_blank' rel='noopener noreferrer'><button className='btn-amber-ghost' style={{fontSize:10,padding:'8px 16px'}}>View Storefront ↗</button></a>
          <Link href='/profile'><button className='btn-ghost' style={{fontSize:10,padding:'8px 16px'}}>← Profile</button></Link>
        </div>
        {/* Tabs */}
        <div style={{display:'flex',borderBottom:'1px solid var(--b1)',marginBottom:32}}>
          <button onClick={()=>setTab('details')} style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',padding:'12px 24px',background:'transparent',border:'none',borderBottom:tab==='details'?'1px solid var(--a)':'1px solid transparent',color:tab==='details'?'var(--a)':'var(--w18)',cursor:'pointer',transition:'all 0.2s'}}>Store Details</button>
          <button onClick={()=>setTab('products')} style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:300,fontStyle:'italic',letterSpacing:'0.14em',textTransform:'uppercase',padding:'12px 24px',background:'transparent',border:'none',borderBottom:tab==='products'?'1px solid var(--a)':'1px solid transparent',color:tab==='products'?'var(--a)':'var(--w18)',cursor:'pointer',transition:'all 0.2s'}}>{'Products ('}{store?.products?.length||0}{')'}</button>
        </div>
        {/* DETAILS */}
        {tab==='details'&&(
          <>
            <div style={{border:'1px solid var(--b1)',marginBottom:24}}>
              <div className='v-block-head'>Store Banner</div>
              <div style={{padding:20}}>
                <input ref={bannerRef} type='file' accept='image/*' onChange={e=>{const f=e.target.files?.[0];if(!f)return;setBannerFile(f);setBannerPreview(URL.createObjectURL(f));}} style={{display:'none'}}/>
                {bannerPreview
                  ?<div style={{position:'relative'}}><img src={bannerPreview} alt='banner' style={{width:'100%',height:140,objectFit:'cover',display:'block',filter:'brightness(0.65)'}}/><button onClick={()=>bannerRef.current?.click()} style={{position:'absolute',bottom:10,right:10,fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:300,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--w35)',border:'1px solid var(--b2)',padding:'5px 10px',background:'rgba(12,14,26,0.85)',cursor:'pointer'}}>Change</button></div>
                  :<div onClick={()=>bannerRef.current?.click()} className='v-upload-zone' style={{height:120}}><div style={{fontSize:'1.8rem'}}>{'🖼️'}</div><div className='v-upload-label'>Click to upload banner</div></div>}
              </div>
            </div>
            <div style={{border:'1px solid var(--b1)',marginBottom:24}}>
              <div className='v-block-head'>Store Info</div>
              <div style={{padding:20}}>
                <div className='v-field'><label className='v-label'>Store name *</label><input className='v-input' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                <div className='v-field'><label className='v-label'>Tagline</label><input className='v-input' placeholder='One line about what you sell' value={form.tagline} onChange={e=>setForm({...form,tagline:e.target.value})}/></div>
                <div className='v-field'><label className='v-label'>Description</label><textarea className='v-textarea' value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
                <div className='v-field' style={{marginBottom:0}}><label className='v-label'>X (Twitter) handle</label><input className='v-input' placeholder='@yourhandle' value={form.xHandle} onChange={e=>setForm({...form,xHandle:e.target.value})}/></div>
              </div>
            </div>
            <div style={{border:'1px solid var(--b1)',marginBottom:24}}>
              <div className='v-block-head'>Category</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'var(--b1)'}}>
                {CATS.map(c=><div key={c.name} onClick={()=>setForm({...form,category:c.name})} style={{padding:'14px 8px',textAlign:'center',cursor:'pointer',background:form.category===c.name?'rgba(212,176,90,0.10)':'var(--bg2)',borderBottom:form.category===c.name?'1px solid var(--a)':'1px solid transparent',transition:'all 0.2s'}}><div style={{fontSize:'1.1rem',marginBottom:4}}>{c.icon}</div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',letterSpacing:'0.10em',textTransform:'uppercase',color:form.category===c.name?'var(--a)':'var(--w18)'}}>{c.name}</div></div>)}
              </div>
            </div>
            {error&&<div style={{border:'1px solid rgba(232,112,112,0.3)',background:'rgba(232,112,112,0.08)',padding:'10px 16px',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--err)',marginBottom:16}}>{error}</div>}
            {success&&<div style={{border:'1px solid rgba(143,196,152,0.3)',background:'rgba(143,196,152,0.08)',padding:'10px 16px',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--gr)',marginBottom:16}}>{success}</div>}
            <button onClick={handleSave} disabled={saving} className='btn-primary' style={{width:'100%',padding:'16px',fontSize:11}}>{saving?'Saving...':'Save Changes →'}</button>
          </>
        )}
        {/* PRODUCTS */}
        {tab==='products'&&(
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',textTransform:'uppercase'}}>{store?.products?.length||0}{' products listed'}</div>
              <button onClick={()=>{setShowAdd(!showAdd);setError('');}} className={showAdd?'btn-ghost':'btn-amber-ghost'} style={{fontSize:10,padding:'8px 16px'}}>{showAdd?'Cancel':'+ Add Product'}</button>
            </div>
            {showAdd&&(
              <div style={{border:'1px solid rgba(212,176,90,0.25)',marginBottom:20,background:'rgba(212,176,90,0.03)'}}>
                <div className='v-block-head' style={{color:'var(--a)'}}>New Product</div>
                <div style={{padding:20}}>
                  <div className='v-field'><label className='v-label'>Product Image</label>
                    <input ref={imgRef} type='file' accept='image/*' onChange={e=>{const f=e.target.files?.[0];if(!f)return;setProdFile(f);setProdPreview(URL.createObjectURL(f));}} style={{display:'none'}}/>
                    {prodPreview
                      ?<div style={{position:'relative',display:'inline-block'}}><img src={prodPreview} alt='product' style={{width:100,height:100,objectFit:'cover',border:'1px solid var(--b1)',display:'block'}}/><button onClick={()=>imgRef.current?.click()} style={{position:'absolute',bottom:4,right:4,fontFamily:"'DM Sans',sans-serif",fontSize:8,color:'var(--w35)',border:'1px solid var(--b2)',padding:'3px 8px',background:'rgba(12,14,26,0.85)',cursor:'pointer'}}>Change</button></div>
                      :<div onClick={()=>imgRef.current?.click()} style={{width:100,height:100,border:'1px dashed var(--b2)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',gap:4}} onMouseEnter={e=>(e.currentTarget.style.borderColor='var(--a)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='var(--b2)')}><div style={{fontSize:'1.5rem'}}>{'📷'}</div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.08em'}}>Add photo</div></div>}
                  </div>
                  <div className='v-field'><label className='v-label'>Product name *</label><input className='v-input' placeholder='e.g. Gold Ring' value={newProd.name} onChange={e=>setNewProd({...newProd,name:e.target.value})}/></div>
                  <div className='v-field'><label className='v-label'>Description</label><input className='v-input' placeholder='What is this product?' value={newProd.description} onChange={e=>setNewProd({...newProd,description:e.target.value})}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
                    <div><label className='v-label'>Price (USDC) *</label><input className='v-input' type='number' placeholder='e.g. 25' value={newProd.price} onChange={e=>setNewProd({...newProd,price:e.target.value})}/></div>
                    <div><label className='v-label'>Type</label><select className='v-input' value={newProd.type} onChange={e=>setNewProd({...newProd,type:e.target.value})} style={{cursor:'pointer'}}>{TYPES.map(t=><option key={t} value={t} style={{background:'var(--bg2)'}}>{t}</option>)}</select></div>
                  </div>
                  {error&&<div style={{fontSize:11,fontWeight:300,fontStyle:'italic',color:'var(--err)',marginBottom:12}}>{error}</div>}
                  <button onClick={handleAddProduct} disabled={adding} className='btn-primary' style={{width:'100%',padding:'14px',fontSize:11}}>{adding?'Adding...':'Add Product →'}</button>
                </div>
              </div>)}
            <div style={{border:'1px solid var(--b1)'}}>
              {!store?.products?.length
                ?<div style={{padding:'32px',textAlign:'center',fontSize:12,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em'}}>No products yet — add your first one above</div>
                :store.products.map((p:any)=>(
                  <div key={p.id} style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',borderBottom:'1px solid var(--b1)'}}>
                    {p.image_url?<img src={p.image_url} alt={p.name} style={{width:48,height:48,objectFit:'cover',flexShrink:0,border:'1px solid var(--b1)'}}/>:<div style={{width:48,height:48,background:'var(--s1)',border:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'1.4rem'}}>{'📦'}</div>}
                    <div style={{flex:1}}><div style={{fontFamily:"'Cormorant',serif",fontSize:16,fontWeight:300,color:'var(--w85)',marginBottom:2}}>{p.name}</div><div style={{fontSize:9,fontWeight:300,fontStyle:'italic',color:'var(--w18)',letterSpacing:'0.10em',textTransform:'uppercase'}}>{p.type}{' · $'}{p.price}{' USDC'}</div></div>
                    <button onClick={()=>handleDeleteProduct(p.id)} disabled={deletingId===p.id} className='btn-danger' style={{fontSize:9,padding:'6px 12px',flexShrink:0}}>{deletingId===p.id?'...':'Remove'}</button>
                  </div>))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function EditStore() {
  return <Suspense><EditStoreContent /></Suspense>;
}