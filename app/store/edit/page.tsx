'use client';
import Nav from '../../Nav';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { getStoreByWallet, updateStore, saveProduct, deleteProduct } from '../../lib/supabase';

const categories = [
  { icon: '👗', name: 'Fashion' }, { icon: '💾', name: 'Digital' },
  { icon: '🎨', name: 'Art' }, { icon: '🛠', name: 'Services' },
  { icon: '🍱', name: 'Food' }, { icon: '📱', name: 'Tech' },
  { icon: '🎵', name: 'Music' }, { icon: '✨', name: 'Other' },
];

const productTypes = ['Physical', 'Digital', 'Service'];

export default function EditStore() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'products'>('details');
  const [form, setForm] = useState({ name: '', tagline: '', description: '', xHandle: '', category: 'Fashion' });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', type: 'Physical' });
  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    if (!address) return;
    const load = async () => {
      const s = await getStoreByWallet(address);
      if (!s) { router.push('/store/create'); return; }
      setStore(s);
      setForm({ name: s.name || '', tagline: s.tagline || '', description: s.description || '', xHandle: s.x_handle || '', category: s.category || 'Fashion' });
      setLoading(false);
    };
    load();
  }, [address, router]);

  const handleSaveDetails = async () => {
    if (!form.name) { setError('Store name is required'); return; }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateStore(store.id, { name: form.name, tagline: form.tagline, description: form.description, category: form.category, x_handle: form.xHandle });
      setSuccess('Store updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) { setError('Product name and price are required'); return; }
    setAddingProduct(true);
    setError('');
    try {
      const product = await saveProduct({ store_id: store.id, name: newProduct.name, description: newProduct.description, price: Number(newProduct.price), type: newProduct.type });
      setStore({ ...store, products: [...(store.products || []), product] });
      setNewProduct({ name: '', description: '', price: '', type: 'Physical' });
      setShowAddProduct(false);
    } catch (e) {
      setError('Failed to add product.');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setStore({ ...store, products: store.products.filter((p: any) => p.id !== productId) });
    } catch (e) {
      setError('Failed to delete product.');
    } finally {
      setDeletingId('');
    }
  };

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '0.6rem 0', color: 'var(--ink)', fontFamily: "'Barlow', sans-serif", fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { display: 'block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' };

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

        {/* Quick links */}
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
            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg3)' }}>Store Info</div>
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

            <div style={{ border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--bg3)' }}>Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {categories.map(cat => (
                  <div key={cat.name} onClick={() => setForm({ ...form, category: cat.name })} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', cursor: 'pointer', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: form.category === cat.name ? 'var(--accent)' : 'transparent', transition: 'all 0.2s' }}>
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
              <button onClick={() => setShowAddProduct(!showAddProduct)} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.5rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                {showAddProduct ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {/* Add product form */}
            {showAddProduct && (
              <div style={{ border: '1px solid var(--accent)', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(201,77,122,0.08)' }}>New Product</div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Product name *</label>
                    <input type="text" placeholder="e.g. Gold Ring" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Description</label>
                    <input type="text" placeholder="What is this product?" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Price (USDC) *</label>
                      <input type="number" placeholder="e.g. 25" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Type</label>
                      <select value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {productTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{product.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {product.type} · ${product.price} USDC
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(product.id)} disabled={deletingId === product.id} style={{ background: 'transparent', color: '#e84040', border: '1px solid rgba(232,64,64,0.3)', padding: '0.35rem 0.75rem', fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
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