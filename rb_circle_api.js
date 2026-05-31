const fs = require('fs');

// ── Create directories ───────────────────────────────────────────────────────
fs.mkdirSync('app/api/circle/create-wallet', { recursive: true });
fs.mkdirSync('app/api/circle/balance', { recursive: true });
fs.mkdirSync('app/api/circle/send', { recursive: true });

// ── 1. Create Wallet Route ───────────────────────────────────────────────────
const createWallet = [];
createWallet.push("import { NextRequest, NextResponse } from 'next/server';");
createWallet.push("import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';");
createWallet.push("");
createWallet.push("export async function POST(req: NextRequest) {");
createWallet.push("  try {");
createWallet.push("    const { userAddress } = await req.json();");
createWallet.push("    const client = initiateDeveloperControlledWalletsClient({");
createWallet.push("      apiKey: process.env.CIRCLE_API_KEY!,");
createWallet.push("      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,");
createWallet.push("    });");
createWallet.push("    const wallet = (await client.createWallets({");
createWallet.push("      walletSetId: process.env.CIRCLE_WALLET_SET_ID!,");
createWallet.push("      blockchains: ['ARC-TESTNET'],");
createWallet.push("      count: 1,");
createWallet.push("      accountType: 'EOA',");
createWallet.push("      metadata: [{ name: userAddress, refId: userAddress }],");
createWallet.push("    })).data?.wallets?.[0];");
createWallet.push("    if (!wallet) return NextResponse.json({ error: 'Wallet creation failed' }, { status: 500 });");
createWallet.push("    return NextResponse.json({ walletId: wallet.id, address: wallet.address });");
createWallet.push("  } catch (e: any) {");
createWallet.push("    return NextResponse.json({ error: e.message }, { status: 500 });");
createWallet.push("  }");
createWallet.push("}");
fs.writeFileSync('app/api/circle/create-wallet/route.ts', createWallet.join('\n'), 'utf8');
console.log('create-wallet route done');

// ── 2. Balance Route ─────────────────────────────────────────────────────────
const balance = [];
balance.push("import { NextRequest, NextResponse } from 'next/server';");
balance.push("import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';");
balance.push("");
balance.push("export async function POST(req: NextRequest) {");
balance.push("  try {");
balance.push("    const { walletId } = await req.json();");
balance.push("    const client = initiateDeveloperControlledWalletsClient({");
balance.push("      apiKey: process.env.CIRCLE_API_KEY!,");
balance.push("      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,");
balance.push("    });");
balance.push("    const balances = (await client.getWalletTokenBalance({ id: walletId })).data?.tokenBalances;");
balance.push("    const usdc = balances?.find(b => b.token?.symbol === 'USDC');");
balance.push("    return NextResponse.json({ balance: usdc?.amount || '0', balances });");
balance.push("  } catch (e: any) {");
balance.push("    return NextResponse.json({ error: e.message }, { status: 500 });");
balance.push("  }");
balance.push("}");
fs.writeFileSync('app/api/circle/balance/route.ts', balance.join('\n'), 'utf8');
console.log('balance route done');

// ── 3. Send Route ────────────────────────────────────────────────────────────
const send = [];
send.push("import { NextRequest, NextResponse } from 'next/server';");
send.push("import { initiateDeveloperControlledWalletsClient, type TokenBlockchain } from '@circle-fin/developer-controlled-wallets';");
send.push("");
send.push("const ARC_USDC = '0x3600000000000000000000000000000000000000';");
send.push("");
send.push("export async function POST(req: NextRequest) {");
send.push("  try {");
send.push("    const { walletId, walletAddress, toAddress, amount } = await req.json();");
send.push("    if (!walletId || !walletAddress || !toAddress || !amount) {");
send.push("      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });");
send.push("    }");
send.push("    const client = initiateDeveloperControlledWalletsClient({");
send.push("      apiKey: process.env.CIRCLE_API_KEY!,");
send.push("      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,");
send.push("    });");
send.push("    const tx = (await client.createTransaction({");
send.push("      blockchain: 'ARC-TESTNET' as TokenBlockchain,");
send.push("      walletId,");
send.push("      walletAddress,");
send.push("      destinationAddress: toAddress,");
send.push("      amount: [amount.toString()],");
send.push("      tokenAddress: ARC_USDC,");
send.push("      fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },");
send.push("    })).data;");
send.push("    return NextResponse.json({ txId: tx?.id, state: tx?.state });");
send.push("  } catch (e: any) {");
send.push("    return NextResponse.json({ error: e.message }, { status: 500 });");
send.push("  }");
send.push("}");
fs.writeFileSync('app/api/circle/send/route.ts', send.join('\n'), 'utf8');
console.log('send route done');

console.log('\nAll Circle API routes done!');
