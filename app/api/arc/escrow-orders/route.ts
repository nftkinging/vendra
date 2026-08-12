import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, formatUnits, decodeEventLog } from 'viem';
import { ESCROW_ADDRESS, escrowAbi } from '../../../lib/escrow';
import { getOrdersByBuyer, getOrdersBySeller } from '../../../lib/supabase';

const RPC_URL = 'https://rpc.testnet.arc.network';
const arcTestnet = {
  id: 5042002, name: 'Arc Testnet',
  nativeCurrency: { name: 'USD Coin', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};

type OrderOut = { id: number; buyer: string; seller: string; amount: string; fundedAt: number; shippedAt: number; state: number };

const cache = new Map<string, { at: number; data: OrderOut[] }>();
const TTL = 12_000;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Pull the on-chain escrow id out of a funding tx receipt by decoding its
// OrderFunded log. One RPC call per order — no full-chain scan.
async function idFromTx(client: any, txHash: string): Promise<bigint | null> {
  for (let t = 0; t < 3; t++) {
    try {
      const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });
      for (const log of receipt.logs || []) {
        if (String(log.address).toLowerCase() !== ESCROW_ADDRESS.toLowerCase()) continue;
        try {
          const ev = decodeEventLog({ abi: escrowAbi, data: log.data, topics: log.topics });
          if (ev.eventName === 'OrderFunded') return (ev.args as any).id as bigint;
        } catch { /* not this event */ }
      }
      return null;
    } catch { await sleep(300 * (t + 1)); }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address = body?.address as string | undefined;
    const fresh = !!body?.fresh;
    if (!address) return NextResponse.json({ orders: [] });
    const acct = address.toLowerCase();

    const hit = cache.get(acct);
    if (!fresh && hit && Date.now() - hit.at < TTL) return NextResponse.json({ orders: hit.data, cached: true });

    // 1) Read this user's orders from our own DB (instant, no RPC).
    const [asBuyer, asSeller] = await Promise.all([getOrdersByBuyer(address), getOrdersBySeller(address)]);
    const rows = [...(asBuyer || []), ...(asSeller || [])];
    // de-dupe by tx_hash, keep only real on-chain hashes
    const seen = new Set<string>();
    const txs: string[] = [];
    for (const r of rows) {
      const h = (r as any).tx_hash as string | undefined;
      if (h && h.startsWith('0x') && !seen.has(h)) { seen.add(h); txs.push(h); }
    }

    const client = createPublicClient({ chain: arcTestnet as any, transport: http(RPC_URL) });

    // 2) For each order, resolve its on-chain id via the funding receipt, then
    //    read current state. Only a handful of calls — the user's own orders.
    const orders: OrderOut[] = [];
    const idsSeen = new Set<string>();
    for (const tx of txs) {
      const id = await idFromTx(client, tx);
      if (id === null || idsSeen.has(id.toString())) continue;
      idsSeen.add(id.toString());
      let o: any = null;
      for (let t = 0; t < 3; t++) {
        try { o = await client.readContract({ address: ESCROW_ADDRESS, abi: escrowAbi, functionName: 'getOrder', args: [id] }); break; }
        catch { await sleep(300 * (t + 1)); }
      }
      if (!o || Number(o.state) === 0) continue;
      const buyer = String(o.buyer), seller = String(o.seller);
      if (buyer.toLowerCase() === acct || seller.toLowerCase() === acct) {
        orders.push({
          id: Number(id), buyer, seller,
          amount: formatUnits(o.amount as bigint, 6),
          fundedAt: Number(o.fundedAt), shippedAt: Number(o.shippedAt), state: Number(o.state),
        });
      }
    }
    orders.sort((a, b) => b.id - a.id);
    cache.set(acct, { at: Date.now(), data: orders });
    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ orders: [], error: e?.message || 'failed to load orders' });
  }
}
