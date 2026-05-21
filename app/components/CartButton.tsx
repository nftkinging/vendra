'use client';
import { useCart } from '../lib/cart';

export default function CartButton() {
  const { toggleCart, count } = useCart();
  const itemCount = count();

  return (
    <button
      onClick={toggleCart}
      style={{
        position: 'relative',
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--ink)',
        width: 38,
        height: 38,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      🛒
      {itemCount > 0 && (
        <div style={{
          position: 'absolute', top: -6, right: -6,
          background: 'var(--accent)', color: '#fff',
          width: 18, height: 18, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Mono', monospace", fontSize: '0.55rem',
          fontWeight: 700, border: '2px solid var(--bg)',
        }}>
          {itemCount > 9 ? '9+' : itemCount}
        </div>
      )}
    </button>
  );
}