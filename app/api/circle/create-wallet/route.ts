import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

export async function POST(req: NextRequest) {
  try {
    const { userAddress } = await req.json();
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    const wallet = (await client.createWallets({
      walletSetId: process.env.CIRCLE_WALLET_SET_ID!,
      blockchains: ['ARC-TESTNET'],
      count: 1,
      accountType: 'EOA',
      metadata: [{ name: userAddress, refId: userAddress }],
    })).data?.wallets?.[0];
    if (!wallet) return NextResponse.json({ error: 'Wallet creation failed' }, { status: 500 });
    return NextResponse.json({ walletId: wallet.id, address: wallet.address });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}