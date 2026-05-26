'use client';
import { useCart } from '../lib/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCart();
  const router = useRouter();
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.storeSlug]) acc[item.storeSlug] = [];
    acc[item.storeSlug].push(item);
    return acc;
  }, {} as Record<string, typeof items>);
  const sellerCount = Object.keys(grouped).length;
  return (
    <>
      {isOpen && <div onClick={closeCart} style={{ position: 'fixed', inset: 0, background: 'rgba(12,14,26,0.75)', zIndex: 150, backdropFilter: 'blur(4px)' }} />}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--bg2)', borderLeft: '1px solid var(--b1)', zIndex: 151, transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s var(--ease)', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.5)' }}>
        <div className='v-cart-drawer-head'>
          <div>
            <div className='v-cart-drawer-title'>Your Cart</div>
            <div className='v-cart-drawer-meta'>{count()} item{count() !== 1 ? 's' : ''} · {sellerCount} store{sellerCount !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={closeCart} style={{ background: 'transparent', border: '1px solid var(--b1)', color: 'var(--w35)', width: 34, height: 34, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>{'🛒'}</div>
              <div style={{ fontFamily: "'Cormorant',serif", fontSize: 22, fontWeight: 300, color: 'var(--w85)', marginBottom: 8 }}>Cart is empty</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, fontStyle: 'italic', color: 'var(--w18)', letterSpacing: '0.10em', marginBottom: 28 }}>Add products from any store</div>
              <button onClick={() => { closeCart(); router.push('/marketplace'); }} className='btn-amber-ghost'>Browse Marketplace</button>
            </div>
          ) : Object.entries(grouped).map(([slug, storeItems]) => (
            <div key={slug} style={{ marginBottom: 24 }}>
              <div className='v-cart-store-head'>{'🏪 '}{storeItems[0].storeName}</div>
              {storeItems.map(item => (
                <div key={item.id} className='v-cart-item'>
                  {item.image ? <img src={item.image} alt={item.productName} style={{ width: 52, height: 52, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--b1)' }} /> : <div className='v-cart-item-img'>{'📦'}</div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className='v-cart-item-name'>{item.productName}</div>
                    <div className='v-cart-item-price'>{'$'}{(item.price * item.quantity).toFixed(2)}{' USDC'}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--w18)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='v-qty-btn'>-</button>
                      <span style={{ fontFamily: "'Cormorant',serif", fontSize: 14, fontWeight: 300, color: 'var(--w60)', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='v-qty-btn'>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className='v-cart-footer'>
            {sellerCount > 1 && <div className='v-cart-warn'>{'⚡ '}{sellerCount}{' separate transactions — one per store'}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              <div><div className='v-cart-total-label'>Total</div><div className='v-cart-total-val'>{'$'}{total().toFixed(2)}</div></div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 300, fontStyle: 'italic', color: 'var(--w18)', letterSpacing: '0.10em' }}>USDC · Arc Testnet</div>
            </div>
            <button onClick={() => { closeCart(); router.push('/cart/checkout'); }} className='btn-primary' style={{ width: '100%', padding: '14px' }}>{'Checkout · $'}{total().toFixed(2)}{' USDC →'}</button>
          </div>
        )}
      </div>
    </>
  );
}