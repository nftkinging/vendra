'use client';
import { useCart } from '../lib/cart';
export default function CartButton() {
  const { toggleCart, count } = useCart();
  const n = count();
  return (
    <button onClick={toggleCart} style={{ position: 'relative', background: 'transparent', border: '1px solid var(--b1)', color: 'var(--w35)', width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', transition: 'border-color 0.35s var(--ease)', flexShrink: 0, borderRadius: 2 }} onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--a)')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--b1)')}>
      {'🛒'}
      {n > 0 && (
        <div style={{ position: 'absolute', top: -6, right: -6, background: 'var(--a2)', color: 'var(--bg)', width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: '0.55rem', fontWeight: 500, border: '2px solid var(--bg)' }}>
          {n > 9 ? '9+' : n}
        </div>
      )}
    </button>
  );
}