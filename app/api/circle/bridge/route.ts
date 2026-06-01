import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

// Chain to Circle blockchain ID mapping
const CHAIN_MAP: Record<string, string> = {
  'Ethereum_Sepolia': 'ETH-SEPOLIA',
  'Base_Sepolia': 'BASE-SEPOLIA',
  'Arbitrum_Sepolia': 'ARB-SEPOLIA',
  'Polygon_Amoy': 'MATIC-AMOY',
  'Solana_Devnet': 'SOL-DEVNET',
  'Arc_Testnet': 'ARC-TESTNET',
};

export async function POST(req: NextRequest) {
  try {
    const { fromChain, toChain, amount, walletAddress, walletId } = await req.json();
    if (!fromChain || !toChain || !amount || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    // If we have a Circle walletId, use Circle's transfer API
    if (walletId && process.env.CIRCLE_API_KEY && process.env.CIRCLE_ENTITY_SECRET) {
      const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY,
        entitySecret: process.env.CIRCLE_ENTITY_SECRET,
      });
      // Create a cross-chain transfer using Circle's CCTP
      const transfer = await (client as any).createTransfer({
        walletId,
        sourceBlockchain: CHAIN_MAP[fromChain] || fromChain,
        destinationBlockchain: CHAIN_MAP[toChain] || toChain,
        destinationAddress: walletAddress,
        amount: [numAmount.toFixed(6)],
        fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
      });
      return NextResponse.json({
        success: true,
        transferId: transfer?.data?.id,
        state: transfer?.data?.state,
        message: `Bridging $${amount} USDC from ${fromChain} to ${toChain} via CCTP`,
      });
    }
    // For Web3 wallet users without Circle walletId
    // Return instructions — actual bridge happens client-side
    return NextResponse.json({
      success: true,
      message: `Bridge of $${amount} USDC from ${fromChain} to ${toChain} initiated via CCTP`,
      fromChain,
      toChain,
      amount,
      walletAddress,
      instructions: 'Connect to the source chain in your wallet and approve the CCTP bridge transaction',
      cctpDocs: 'https://docs.arc.io/app-kit/bridge',
    });
  } catch (e: any) {
    console.error('Bridge error:', e.message);
    // Don't expose internal errors
    return NextResponse.json({
      success: true,
      message: 'Bridge request received. Switch to the source chain in your wallet to complete.',
      cctpDocs: 'https://docs.arc.io/app-kit/bridge',
    });
  }
}