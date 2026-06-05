'use client';
import { useCart } from '../lib/cart';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCart();
  const router = useRouter();
  const grouped = items.reduce((acc: any, item) => { if (!acc[item.storeSlug]) acc[item.storeSlug] = []; acc[item.storeSlug].push(item); return acc; }, {} as Record<string, typeof items>);
  const sellerCount = Object.keys(grouped).length;
  return (
    <>
      {isOpen && <div onClick={closeCart} className='v4-cart-backdrop' />}
      <div className={'v4-cart' + (isOpen ? ' open' : '')}>
        <div className='v4-cart-head'>
          <div>
            <div className='v4-cart-title'>Your cart</div>
            <div className='v4-cart-meta'>{count()} item{count() !== 1 ? 's' : ''} · {sellerCount} store{sellerCount !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={closeCart} className='v4-cart-x' aria-label='Close cart'>✕</button>
        </div>
        <div className='v4-cart-body'>
          {items.length === 0 ? (
            <div className='v4-cart-empty'>
              <div className='v4-cart-empty-ic'>🛒</div>
              <div className='v4-cart-empty-h'>Cart is empty</div>
              <div className='v4-cart-empty-p'>Add products from any store.</div>
              <button onClick={() => { closeCart(); router.push('/marketplace'); }} className='v4btn v4btn-amber'>Browse marketplace</button>
            </div>
          ) : (
            Object.entries(grouped).map(([slug, storeItems]: any) => (
              <div key={slug} className='v4-cart-group'>
                <div className='v4-cart-store'>{storeItems[0].storeName}</div>
                {storeItems.map((item: any) => (
                  <div key={item.id} className='v4-cart-item'>
                    {item.image
                      ? <img src={item.image} alt={item.productName} className='v4-cart-item-img' />
                      : <div className='v4-cart-item-img'>📦</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className='v4-cart-item-name'>{item.productName}</div>
                      <div className='v4-cart-item-price'>{(item.price * item.quantity).toFixed(2)} USDC</div>
                      <div className='v4-cart-qty'>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='v4-cart-qbtn' aria-label='Decrease'>−</button>
                        <span className='v4-cart-qn'>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='v4-cart-qbtn' aria-label='Increase'>+</button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className='v4-cart-rm' aria-label='Remove item'>✕</button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className='v4-cart-foot'>
            {sellerCount > 1 && <div className='v4-cart-warn'>⚡ {sellerCount} separate transactions — one per store</div>}
            <div className='v4-cart-total'>
              <div>
                <div className='v4-cart-total-l'>Total</div>
                <div className='v4-cart-total-v'>{total().toFixed(2)}<span className='v4-cart-total-u'>USDC</span></div>
              </div>
              <div className='v4-cart-meta2'>Arc Testnet</div>
            </div>
            <button onClick={() => { closeCart(); router.push('/cart/checkout'); }} className='v4btn v4btn-amber v4-cart-checkout'>Checkout · {total().toFixed(2)} USDC <span className='arr'>→</span></button>
          </div>
        )}
      </div>
    </>
  );
}
