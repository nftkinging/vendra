'use client';
import Nav from '../../Nav';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoreByWallet, updateStore, saveProduct, deleteProduct, uploadImage } from '../../lib/supabase';
import Link from 'next/link';

const CATS = [{ icon: '👗', name: 'Fashion' }, { icon: '💾', name: 'Digital' }, { icon: '🎨', name: 'Art' }, { icon: '🛠', name: 'Services' }, { icon: '🍱', name: 'Food' }, { icon: '📱', name: 'Tech' }, { icon: '🎵', name: 'Music' }, { icon: '✨', name: 'Other' }];
const TYPES = ['Physical', 'Digital', 'Service'];

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
  const [form, setForm] = useState({ name: '', tagline: '', description: '', xHandle: '', category: 'Fashion' });
  const [bannerFile, setBannerFile] = useState<File|null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [newProd, setNewProd] = useState({ name: '', description: '', price: '', type: 'Physical' });
  const [prodFile, setProdFile] = useState<File|null>(null);
  const [prodPreview, setProdPreview] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { if (searchParams.get('tab') === 'products') setTab('products'); }, [searchParams]);
  useEffect(() => {
    if (!address) return;
    getStoreByWallet(address).then(s => {
      if (!s) { router.push('/store/create'); return; }
      setStore(s);
      setForm({ name: s.name || '', tagline: s.tagline || '', description: s.description || '', xHandle: s.x_handle || '', category: s.category || 'Fashion' });
      setBannerPreview(s.banner_url || '');
      setLoading(false);
    });
  }, [address, router]);

  const handleSave = async () => {
    if (!form.name) { setError('Store name required'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      let bannerUrl = store.banner_url || '';
      if (bannerFile && address) bannerUrl = await uploadImage('banners/' + address, bannerFile);
      await updateStore(store.id, { name: form.name, tagline: form.tagline, description: form.description, category: form.category, x_handle: form.xHandle, banner_url: bannerUrl });
      setSuccess('Store updated!'); setTimeout(() => setSuccess(''), 2500);
    } catch { setError('Something went wrong.'); } finally { setSaving(false); }
  };

  const handleAddProduct = async () => {
    if (!newProd.name || !newProd.price) { setError('Name and price required'); return; }
    setAdding(true); setError('');
    try {
      let imageUrl = '';
      if (prodFile && address) imageUrl = await uploadImage('products/' + store.id + '/' + Date.now(), prodFile);
      const p = await saveProduct({ store_id: store.id, name: newProd.name, description: newProd.description, price: Number(newProd.price), type: newProd.type, image_url: imageUrl });
      setStore({ ...store, products: [...(store.products || []), p] });
      setNewProd({ name: '', description: '', price: '', type: 'Physical' }); setProdFile(null); setProdPreview(''); setShowAdd(false);
    } catch { setError('Failed to add product.'); } finally { setAdding(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    setDeletingId(id);
    try { await deleteProduct(id); setStore({ ...store, products: store.products.filter((p:any) => p.id !== id) }); }
    catch { setError('Failed to delete.'); } finally { setDeletingId(''); }
  };

  if (loading) return <main className='v4home' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Nav theme='v4' /><div className='v4spinner' /></main>;

  return (
    <main className='v4home' style={{ minHeight: '100vh' }}>
      <Nav theme='v4' />
      <div className='ob-wrap' style={{ maxWidth: 720 }}>
        <p className='eyebrow'>Manage store</p>
        <h1 className='ob-title' style={{ fontSize: 'clamp(30px,5vw,48px)', marginBottom: 6 }}>{store?.name}</h1>
        <div className='se-meta'>{store?.products?.length || 0} products · {store?.category} · Arc Testnet</div>
        <div className='se-actions'>
          <a href={'/store/' + store?.slug} target='_blank' rel='noopener noreferrer' className='v4btn v4btn-amber se-sm'>View storefront ↗</a>
          <Link href='/profile' className='v4btn v4btn-ghost se-sm'>← Profile</Link>
        </div>
        <div className='se-tabs'>
          <button onClick={() => setTab('details')} className={'se-tab' + (tab === 'details' ? ' on' : '')}>Store details</button>
          <button onClick={() => setTab('products')} className={'se-tab' + (tab === 'products' ? ' on' : '')}>Products ({store?.products?.length || 0})</button>
        </div>

        {tab === 'details' && (
          <>
            <div className='ob-card'>
              <div className='ob-card-head'>Store banner</div>
              <div className='ob-card-body'>
                <input ref={bannerRef} type='file' accept='image/*' onChange={e => { const f = e.target.files?.[0]; if (!f) return; setBannerFile(f); setBannerPreview(URL.createObjectURL(f)); }} style={{ display: 'none' }} />
                {bannerPreview
                  ? <div className='se-banner-prev'><img src={bannerPreview} alt='banner' /><button onClick={() => bannerRef.current?.click()} className='se-banner-change'>Change</button></div>
                  : <div onClick={() => bannerRef.current?.click()} className='se-banner-zone'><div className='se-banner-ic'>🖼️</div><div className='se-banner-label'>Click to upload banner</div></div>}
              </div>
            </div>
            <div className='ob-card'>
              <div className='ob-card-head'>Store info</div>
              <div className='ob-card-body'>
                <div className='ob-field'><label className='ob-label'>Store name *</label><input className='ob-input' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className='ob-field'><label className='ob-label'>Tagline</label><input className='ob-input' placeholder='One line about what you sell' value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} /></div>
                <div className='ob-field'><label className='ob-label'>Description</label><textarea className='ob-textarea' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className='ob-field last'><label className='ob-label'>X (Twitter) handle</label><input className='ob-input' placeholder='@yourhandle' value={form.xHandle} onChange={e => setForm({ ...form, xHandle: e.target.value })} /></div>
              </div>
            </div>
            <div className='ob-card'>
              <div className='ob-card-head'>Category</div>
              <div className='se-cats'>
                {CATS.map(c => <div key={c.name} onClick={() => setForm({ ...form, category: c.name })} className={'se-cat' + (form.category === c.name ? ' sel' : '')}><div className='se-cat-ic'>{c.icon}</div><div className='se-cat-name'>{c.name}</div></div>)}
              </div>
            </div>
            {error && <div className='ob-error'>{error}</div>}
            {success && <div className='ob-success'>{success}</div>}
            <button onClick={handleSave} disabled={saving} className='v4btn v4btn-amber ob-cta'>{saving ? 'Saving…' : 'Save changes →'}</button>
          </>
        )}

        {tab === 'products' && (
          <>
            <div className='se-prodhead'>
              <div className='se-prodhead-c'>{store?.products?.length || 0} products listed</div>
              <button onClick={() => { setShowAdd(!showAdd); setError(''); }} className={'v4btn se-sm ' + (showAdd ? 'v4btn-ghost' : 'v4btn-amber')}>{showAdd ? 'Cancel' : '+ Add product'}</button>
            </div>
            {showAdd && (
              <div className='se-addcard'>
                <div className='se-addhead'>New product</div>
                <div className='ob-card-body'>
                  <div className='ob-field'><label className='ob-label'>Product image</label>
                    <input ref={imgRef} type='file' accept='image/*' onChange={e => { const f = e.target.files?.[0]; if (!f) return; setProdFile(f); setProdPreview(URL.createObjectURL(f)); }} style={{ display: 'none' }} />
                    {prodPreview
                      ? <div className='se-prodimg-prev'><img src={prodPreview} alt='product' /><button onClick={() => imgRef.current?.click()} className='se-prodimg-change'>Change</button></div>
                      : <div onClick={() => imgRef.current?.click()} className='se-prodimg-zone'><div className='se-prodimg-ic'>📷</div><div className='se-prodimg-cap'>Add photo</div></div>}
                  </div>
                  <div className='ob-field'><label className='ob-label'>Product name *</label><input className='ob-input' placeholder='e.g. Gold Ring' value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} /></div>
                  <div className='ob-field'><label className='ob-label'>Description</label><input className='ob-input' placeholder='What is this product?' value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} /></div>
                  <div className='ob-field' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div><label className='ob-label'>Price (USDC) *</label><input className='ob-input' type='number' placeholder='e.g. 25' value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} /></div>
                    <div><label className='ob-label'>Type</label><select className='ob-input' value={newProd.type} onChange={e => setNewProd({ ...newProd, type: e.target.value })}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  </div>
                  {error && <div className='ob-error' style={{ marginBottom: 12 }}>{error}</div>}
                  <button onClick={handleAddProduct} disabled={adding} className='v4btn v4btn-amber ob-cta'>{adding ? 'Adding…' : 'Add product →'}</button>
                </div>
              </div>)}
            <div className='se-prods'>
              {!store?.products?.length
                ? <div className='se-prods-empty'>No products yet — add your first one above.</div>
                : store.products.map((p:any) => (
                  <div key={p.id} className='se-prod'>
                    {p.image_url ? <img src={p.image_url} alt={p.name} className='se-prod-img' /> : <div className='se-prod-box'>📦</div>}
                    <div style={{ flex: 1, minWidth: 0 }}><div className='se-prod-name'>{p.name}</div><div className='se-prod-meta'>{p.type} · ${p.price} USDC</div></div>
                    <button onClick={() => handleDeleteProduct(p.id)} disabled={deletingId === p.id} className='pf-del'>{deletingId === p.id ? '…' : 'Remove'}</button>
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
