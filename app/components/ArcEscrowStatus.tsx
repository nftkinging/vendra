'use client';

interface Props { orderId?: string; status?: string; amount?: number; createdAt?: string; }

export default function ArcEscrowStatus({ orderId, status = 'locked', amount = 0, createdAt }: Props) {
  const releaseDate = createdAt ? new Date(new Date(createdAt).getTime() + 48 * 60 * 60 * 1000) : null;
  const isReleased = status === 'released';
  return (
    <div className={'aes' + (isReleased ? ' rel' : '')}>
      <div className='aes-top'>
        <span className='aes-label'>ERC-8183 Escrow</span>
        <span className='aes-status'><span className='aes-dot' />{isReleased ? 'Released' : 'Locked'}</span>
      </div>
      <div className='aes-amt'>${amount.toFixed(2)} USDC</div>
      <div className='aes-note'>{isReleased ? 'Funds released to seller.' : releaseDate ? `Releases ${releaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} if no dispute is raised.` : 'Protected by smart-contract escrow.'}</div>
    </div>
  );
}
