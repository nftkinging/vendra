import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient, type TokenBlockchain } from '@circle-fin/developer-controlled-wallets';

const ARC_USDC = '0x3600000000000000000000000000000000000000';

export async function POST(req: NextRequest) {
  try {
    const { walletId, walletAddress, toAddress, amount } = await req.json();
    if (!walletId || !walletAddress || !toAddress || !amount) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    const tx = (await client.createTransaction({
      blockchain: 'ARC-TESTNET' as TokenBlockchain,
      walletId,
      walletAddress,
      destinationAddress: toAddress,
      amount: [amount.toString()],
      tokenAddress: ARC_USDC,
      fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
    })).data;
    return NextResponse.json({ txId: tx?.id, state: tx?.state });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}