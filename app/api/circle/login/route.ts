import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    // Search for existing wallet by refId (email)
    const wallets = (await client.listWallets({ refId: email })).data?.wallets;
    if (wallets && wallets.length > 0) {
      const wallet = wallets[0];
      return NextResponse.json({ found: true, walletId: wallet.id, address: wallet.address });
    }
    return NextResponse.json({ found: false });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}