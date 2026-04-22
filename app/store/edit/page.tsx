'use client';
import Nav from '../../Nav';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoreByWallet, updateStore, saveProduct, deleteProduct, uploadImage } from '../../lib/supabase';

const categories = [
  { icon: '👗', name: 'Fashion' }, { icon: '💾', name: 'Digital' },
  { icon: '🎨', name: 'Art' }, { icon: '🛠', name: 'Services' },
  { icon: '🍱', name: 'Food' }, { icon: '📱', name: 'Tech' },
  { icon: '🎵', name: 'Music' }, { icon: '✨', name: 'Other' },
];
const productTypes = ['Physical', 'Digital', 'Service'];

function EditStoreContent() {
  const { address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerRef = useRef<HTMLInputElement>(null);
  const productImgRef = useRef<HTMLInputElement>(null);

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'products'>('details');
  const [form, setForm] = useState({ name: '', tagline: '', description: '', xHandle: '', category: 'Fashion' });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', type: 'Physical' });
  const [productImgFile, setProductImgFile] = useState<File | null>(null);
  const [productImgPreview, setProductImgPreview] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (searchParams.get('tab') === 'products') setActiveTab('products');
  }, [searchParams]);

  useEffect(() => {
    if (!address) return;
    const load = async () => {
      const s = await getStoreByWallet(address);
      if (!s) { router.push('/store/create'); return; }
      setStore(s);
      setForm({
        name: s.name || '',
        tagline: s.tagline || '',
        description: s.description || '',
        xHandle: s.x_handle || '',
        category: s.category || 'Fashion',
      });
      setBannerPreview(s.banner_url || '');
      setLoading(false);
    };
    load();
  }, [address, router]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleProductImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductImgFile(file);
    setProductImgPreview(URL.createObjectURL(file));
  };

  const handleSaveDetails = async () => {
    if (!form.name) { setError('Store name is required'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      let bannerUrl = store.banner_url || '';
      if (bannerFile && address) {
        bannerUrl = await uploadImage(`banners/${address}`, bannerFile);
      }
      await updateStore(store.id, {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        category: form.category,
        x_handle: form.xHandle,
        banner_url: bannerUrl,
      });
      setSuccess('Store updated!');
      setTimeout(() => setSuccess(''), 2500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) { setError('Name and price are required'); return; }
    setAddingProduct(true); setError('');
    try {
      let imageUrl = '';
      if (productImgFile && address) {
        imageUrl = await uploadImage(`products/${store.id}/${Date.now()}`, productImgFile);
      }
      const product = await saveProduct({
        store_id: store.id,
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        type: newProduct.type,
        image_url: imageUrl,
      });
      setStore({ ...store, products: [...(store.products || []), product] });
      setNewProduct({ name: '', description: '', price: '', type: 'Physical' });
      setProductImgFile(null);
      setProductImgPreview('');
      setShowAddProduct(false);
    } catch {
      setError('Failed to add product. Please try again.');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setStore({ ...store, products: store.products.filter((p: any) => p.id !== productId) });
    } catch {
      setError('Failed to delete product.');
    } finally {
      setDeletingId('');
    }
  };

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' };
  const blockHead = { padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'var(--bg3)' };

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Nav />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading store...</div>
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '7rem 2.5rem 4rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Manage Store</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>{store?.name}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
            {store?.products?.length || 0} products · {store?.category} · Arc Testnet
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <a href={`/store/${store?.slug}`} target="_blank" rel="noopener noreferrer">
            <button style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.5rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              View Storefront ↗
            </button>
          </a>
          <button onClick={() => router.push('/profile')} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', padding: '0.5rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
            ← Back to Profile
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('details')} style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.75rem', border: 'none', cursor: 'pointer', background: activeTab === 'details' ? 'var(--accent)' : 'transparent', color: activeTab === 'details' ? '#fff' : 'var(--muted)', transition: 'all 0.2s' }}>
            Store Details
          </button>
          <button onClick={() => setActiveTab('products')} style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.75rem', border: 'none', cursor: 'pointer', background: activeTab === 'products' ? 'var(--accent)' : 'transparent', color: activeTab === 'products' ? '#fff' : 'var(--muted)', transition: 'all 0.2s' }}>
            Products ({store?.products?.length || 0})
          </button>
        </div>

        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <>
            {/* Banner */}
            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={blockHead}>Store Banner</div>
              <div style={{ padding: '1.25rem' }}>
                <input ref={bannerRef} type="file" accept="image/*" onChange={handleBannerChange} style={{ display: 'none' }} />
                {bannerPreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={bannerPreview} alt="banner" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                    <button onClick={() => bannerRef.current?.click()} style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', background: 'rgba(10,6,18,0.85)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      Change
                    </button>
                  </div>
                ) : (
                  <div onClick={() => bannerRef.current?.click()}
                    style={{ height: 140, border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.5rem' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <div style={{ fontSize: '1.8rem' }}>🖼️</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Click to upload banner</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', opacity: 0.6 }}>Recommended: 1200×400px</div>
                  </div>
                )}
              </div>
            </div>

            {/* Store info */}
            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={blockHead}>Store Info</div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Store name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Tagline</label>
                  <input type="text" placeholder="One line about what you sell" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea placeholder="Tell buyers what makes your store special..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
                </div>
                <div>
                  <label style={labelStyle}>X (Twitter) handle</label>
                  <input type="text" placeholder="@yourhandle" value={form.xHandle} onChange={e => setForm({ ...form, xHandle: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Category */}
            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={blockHead}>Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {categories.map(cat => (
                  <div key={cat.name} onClick={() => setForm({ ...form, category: cat.name })}
                    style={{ padding: '0.75rem 0.5rem', textAlign: 'center', cursor: 'pointer', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: form.category === cat.name ? 'var(--accent)' : 'transparent', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: form.category === cat.name ? '#fff' : 'var(--muted)' }}>{cat.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {error && <div style={{ border: '1px solid rgba(232,80,80,0.3)', background: 'rgba(232,80,80,0.08)', padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#e85050', letterSpacing: '0.05em', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ border: '1px solid rgba(80,200,80,0.3)', background: 'rgba(80,200,80,0.08)', padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: '#50c850', letterSpacing: '0.05em', marginBottom: '1rem' }}>{success}</div>}

            <button onClick={handleSaveDetails} disabled={saving} style={{ width: '100%', background: saving ? 'var(--muted)' : 'var(--accent)', color: '#fff', border: 'none', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.15em', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : 'Save Changes →'}
            </button>
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {store?.products?.length || 0} products listed
              </div>
              <button onClick={() => { setShowAddProduct(!showAddProduct); setError(''); }}
                style={{ background: showAddProduct ? 'transparent' : 'var(--accent)', color: showAddProduct ? 'var(--muted)' : '#fff', border: showAddProduct ? '1px solid var(--border)' : 'none', padding: '0.5rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                {showAddProduct ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {/* Add product form */}
            {showAddProduct && (
              <div style={{ border: '1px solid var(--accent)', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(201,77,122,0.08)' }}>New Product</div>
                <div style={{ padding: '1.25rem' }}>
                  {/* Product image */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={labelStyle}>Product Image</label>
                    <input ref={productImgRef} type="file" accept="image/*" onChange={handleProductImgChange} style={{ display: 'none' }} />
                    {productImgPreview ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={productImgPreview} alt="product preview" style={{ width: 120, height: 120, objectFit: 'cover', display: 'block', border: '1px solid var(--border)' }} />
                        <button onClick={() => productImgRef.current?.click()} style={{ position: 'absolute', bottom: '0.4rem', right: '0.4rem', background: 'rgba(10,6,18,0.85)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '0.25rem 0.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Change
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => productImgRef.current?.click()}
                        style={{ width: 120, height: 120, border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.3rem' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                        <div style={{ fontSize: '1.5rem' }}>📷</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: 'var(--muted)', textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Add photo</div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Product name *</label>
                    <input type="text" placeholder="e.g. Gold Ring" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Description</label>
                    <input type="text" placeholder="What is this product?" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={labelStyle}>Price (USDC) *</label>
                      <input type="number" placeholder="e.g. 25" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Type</label>
                      <select value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {productTypes.map(t => <option key={t} value={t} style={{ background: '#1a1330' }}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {error && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: '#e85050', marginBottom: '0.75rem' }}>{error}</div>}

                  <button onClick={handleAddProduct} disabled={addingProduct} style={{ width: '100%', background: addingProduct ? 'var(--muted)' : 'var(--accent)', color: '#fff', border: 'none', padding: '0.75rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.1em', cursor: addingProduct ? 'not-allowed' : 'pointer' }}>
                    {addingProduct ? 'Adding...' : 'Add Product →'}
                  </button>
                </div>
              </div>
            )}

            {/* Products list */}
            <div style={{ border: '1px solid var(--border)' }}>
              {!store?.products?.length ? (
                <div style={{ padding: '3rem', textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  No products yet — add your first one above
                </div>
              ) : store.products.map((product: any) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: 56, height: 56, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: 56, height: 56, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem', border: '1px solid var(--border)' }}>📦</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{product.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {product.type} · ${product.price} USDC
                    </div>
                    {product.description && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.2rem', fontWeight: 300 }}>{product.description}</div>
                    )}
                  </div>
                  <button onClick={() => handleDeleteProduct(product.id)} disabled={deletingId === product.id}
                    style={{ background: 'transparent', color: '#e84040', border: '1px solid rgba(232,64,64,0.3)', padding: '0.35rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0 }}>
                    {deletingId === product.id ? '...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function EditStore() {
  return (
    <Suspense>
      <EditStoreContent />
    </Suspense>
  );
}