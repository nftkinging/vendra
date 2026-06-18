import { NextRequest, NextResponse } from 'next/server';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';

// This route waits on up to two on-chain txs; give it headroom (honored on Vercel Pro).
export const maxDuration = 60;

const ESCROW = '0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f';
const USDC = '0x3600000000000000000000000000000000000000';
const ZERO_REF = '0x0000000000000000000000000000000000000000000000000000000000000000';

function getClient() {
  return initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
  });
}

// Exact decimal string -> 6-decimal base-units string (no float drift).
function toUnits6(amount: string | number) {
  const s = String(amount).trim();
  const [whole, frac = ''] = s.split('.');
  const fracPadded = (frac + '000000').slice(0, 6);
  return (BigInt(whole || '0') * BigInt(1000000) + BigInt(fracPadded || '0')).toString();
}

async function exec(client: any, walletId: string, contractAddress: string, sig: string, params: any[]) {
  const res = (await client.createContractExecutionTransaction({
    walletId,
    contractAddress,
    abiFunctionSignature: sig,
    abiParameters: params,
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  } as any)).data;
  return res as { id: string; state: string };
}

// Poll until the Circle tx reaches a terminal state. Returns the tx object.
async function waitFor(client: any, id: string, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r: any = await client.getTransaction({ id });
    const t = r?.data?.transaction || r?.data || {};
    const state = t.state;
    if (state === 'COMPLETE' || state === 'CONFIRMED') return t;
    if (state === 'FAILED' || state === 'CANCELLED' || state === 'DENIED') {
      throw new Error('Circle tx ' + id + ' ended as ' + state);
    }
    await new Promise((res) => setTimeout(res, 2500));
  }
  throw new Error('Circle tx ' + id + ' timed out');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletId, action } = body;
    if (!walletId || !action) return NextResponse.json({ error: 'Missing walletId or action' }, { status: 400 });
    const client = getClient();

    if (action === 'fund') {
      const { seller, amount, ref } = body;
      if (!seller || !amount) return NextResponse.json({ error: 'Missing seller or amount' }, { status: 400 });
      if (!seller.startsWith('0x') || seller.length !== 42) return NextResponse.json({ error: 'Invalid seller address' }, { status: 400 });
      const units = toUnits6(amount);
      // 1) approve escrow to pull USDC, wait for it to land
      const approve = await exec(client, walletId, USDC, 'approve(address,uint256)', [ESCROW, units]);
      await waitFor(client, approve.id);
      // 2) fund the escrow
      const fund = await exec(client, walletId, ESCROW, 'fund(address,uint256,bytes32)', [seller, units, ref || ZERO_REF]);
      const fundTx = await waitFor(client, fund.id);
      return NextResponse.json({ success: true, approveTxId: approve.id, fundTxId: fund.id, txHash: fundTx?.txHash, state: fundTx?.state });
    }

    // Single-call lifecycle actions keyed by escrow order id.
    const oneArg: Record<string, string> = {
      markShipped: 'markShipped(uint256)',
      confirmReceipt: 'confirmReceipt(uint256)',
      raiseDispute: 'raiseDispute(uint256)',
      autoRelease: 'autoRelease(uint256)',
      reclaimUnshipped: 'reclaimUnshipped(uint256)',
    };
    if (oneArg[action]) {
      const { id } = body;
      if (id === undefined || id === null) return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
      const tx = await exec(client, walletId, ESCROW, oneArg[action], [String(id)]);
      const done = await waitFor(client, tx.id);
      return NextResponse.json({ success: true, txId: tx.id, txHash: done?.txHash, state: done?.state });
    }

    if (action === 'resolve') {
      // toBuyer is in 6-decimal base units (string). arbiter-only on-chain.
      const { id, toBuyer } = body;
      if (id === undefined || toBuyer === undefined) return NextResponse.json({ error: 'Missing id or toBuyer' }, { status: 400 });
      const tx = await exec(client, walletId, ESCROW, 'resolve(uint256,uint256)', [String(id), String(toBuyer)]);
      const done = await waitFor(client, tx.id);
      return NextResponse.json({ success: true, txId: tx.id, txHash: done?.txHash, state: done?.state });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    console.error('Circle escrow error:', e?.message);
    return NextResponse.json({ error: e?.message || 'Circle escrow failed' }, { status: 500 });
  }
}
