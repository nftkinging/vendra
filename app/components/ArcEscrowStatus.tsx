'use client';
import { useState } from 'react';

interface Props { orderId?: string; status?: string; amount?: number; createdAt?: string; }

export default function ArcEscrowStatus({ orderId, status='locked', amount=0, createdAt }: Props) {
  const releaseDate = createdAt ? new Date(new Date(createdAt).getTime() + 48*60*60*1000) : null;
  const isReleased = status === 'released';
  return (
    <div style={{ border: `1px solid ${isReleased ? 'var(--gr3)' : 'rgba(212,176,90,0.2)'}`, background: isReleased ? 'var(--gr2)' : 'rgba(212,176,90,0.04)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg,transparent,${isReleased ? 'rgba(143,196,152,0.4)' : 'rgba(212,176,90,0.3)'},transparent)` }} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--w18)' }}>ERC-8183 Escrow</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: isReleased ? 'var(--gr)' : 'var(--a2)', boxShadow: `0 0 6px ${isReleased ? 'var(--gr)' : 'var(--a2)'}` }} />
            <span style={{ fontSize: 9, fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.12em', textTransform: 'uppercase', color: isReleased ? 'var(--gr)' : 'var(--a)' }}>{isReleased ? 'Released' : 'Locked'}</span>
          </div>
        </div>
        <div style={{ fontFamily: "'Cormorant',serif", fontSize: 22, fontWeight: 300, color: isReleased ? 'var(--gr)' : 'var(--a2)', marginBottom: 4 }}>{'$'}{amount.toFixed(2)}{' USDC'}</div>
        <div style={{ fontSize: 11, fontWeight: 300, fontStyle: 'italic', color: 'var(--w35)', lineHeight: 1.6 }}>
          {isReleased ? 'Funds released to seller.' : releaseDate ? `Releases ${releaseDate.toLocaleDateString('en-US',{month:'short',day:'numeric'})} if no dispute raised.` : 'Protected by smart contract escrow.'}
        </div>
      </div>
    </div>
  );
}