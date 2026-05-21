'use client';
import { useCart } from '../lib/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCart();
  const router = useRouter();

  const groupedBySeller = items.reduce((acc, item) => {
    if (!acc[item.storeSlug]) acc[item.storeSlug] = [];
    acc[item.storeSlug].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const sellerCount = Object.keys(groupedBySeller).length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,18,0.7)', zIndex: 150, backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: 'var(--bg2)', borderLeft: '1px solid var(--border)',
        zIndex: 151, transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.05em' }}>
              Your Cart
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {count()} item{count() !== 1 ? 's' : ''} · {sellerCount} store{sellerCount !== 1 ? 's' : ''}
            </div>
          </div>
          <button onClick={closeCart} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', width: 36, height: 36, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', marginBottom: '0.5rem' }}>Cart is empty</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
                Add products from any store
              </div>
              <button onClick={() => { closeCart(); router.push('/marketplace'); }} className="btn-3d-purple" style={{ padding: '0.65rem 1.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Browse Marketplace
              </button>
            </div>
          ) : (
            Object.entries(groupedBySeller).map(([slug, storeItems]) => (
              <div key={slug} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🏪 {storeItems[0].storeName}
                </div>
                {storeItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg3)', marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.productName} style={{ width: 56, height: 56, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>📦</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--accent2)' }}>${(item.price * item.quantity).toFixed(2)} USDC</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                      <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--ink)', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>-</button>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--ink)', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            {sellerCount > 1 && (
              <div style={{ background: 'rgba(201,77,122,0.08)', border: '1px solid rgba(201,77,122,0.2)', padding: '0.6rem 0.75rem', marginBottom: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                ⚡ {sellerCount} separate transactions — one per store
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color: 'var(--accent2)' }}>${total().toFixed(2)} USDC</span>
            </div>
            <button
              onClick={() => { closeCart(); router.push('/cart/checkout'); }}
              className="btn-3d-accent"
              style={{ width: '100%', padding: '1rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
            >
              Checkout · ${total().toFixed(2)} USDC →
            </button>
          </div>
        )}
      </div>
    </>
  );
}