// USDC contract on Arc Testnet
export const USDC_CONTRACT = '0x3600000000000000000000000000000000000000' as const;

export const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

// Arc USDC ERC-20 uses 6 decimals
// e.g. $1.00 USDC = 1_000_000 units
export function toUSDCUnits(amount: number): bigint {
  return BigInt(Math.round(amount * 1_000_000));
}

// Format raw USDC units back to dollars
export function fromUSDCUnits(units: bigint): number {
  return Number(units) / 1_000_000;
}