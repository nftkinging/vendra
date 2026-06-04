'use client';
import { useCart } from '../lib/cart';
export default function CartButton() {
  const { toggleCart, count } = useCart();
  const n = count();
  return (
    <button onClick={toggleCart} className='v-cart-btn' aria-label='Cart'>
      🛒
      {n > 0 && <span className='v-cart-badge'>{n > 9 ? '9+' : n}</span>}
    </button>
  );
}
