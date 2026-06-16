// Vendra on-chain escrow — addresses + minimal ABIs used by the app.
// Deployed + verified on Arc Testnet.
export const ESCROW_ADDRESS = '0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f' as `0x${string}`;
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000' as `0x${string}`;

// USDC is exposed as a standard ERC-20 at USDC_ADDRESS (6 decimals).
export const erc20Abi = [
  {
    type: 'function', name: 'approve', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function', name: 'allowance', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export const escrowAbi = [
  {
    type: 'function', name: 'fund', stateMutability: 'nonpayable',
    inputs: [
      { name: 'seller', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'ref', type: 'bytes32' },
    ],
    outputs: [{ name: 'id', type: 'uint256' }],
  },
  {
    type: 'function', name: 'confirmReceipt', stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }], outputs: [],
  },
  {
    type: 'function', name: 'markShipped', stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }], outputs: [],
  },
  {
    type: 'function', name: 'raiseDispute', stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }], outputs: [],
  },
  {
    type: 'event', name: 'OrderFunded',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'ref', type: 'bytes32', indexed: false },
    ],
  },
] as const;