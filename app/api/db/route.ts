import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-only admin client. Uses the service-role key, which bypasses RLS and
// must NEVER be exposed to the browser. Only this route may write to the DB.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

const BUCKET = 'avatars';
const BOT_NAME = /^\s*botstore/i;

function bad(msg: string, code = 400) { return NextResponse.json({ error: msg }, { status: code }); }
function ok(data: any) { return NextResponse.json({ data }); }

function pathFromUrl(u?: string | null): string | null {
  if (!u) return null;
  const marker = '/object/public/' + BUCKET + '/';
  const i = u.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(u.slice(i + marker.length));
}
async function removePaths(paths: (string | null)[]) {
  const clean = paths.filter((p): p is string => !!p);
  if (clean.length) { try { await admin.storage.from(BUCKET).remove(clean); } catch { /* best-effort */ } }
}

async function deleteStoreCascade(storeId: string) {
  const { data: s } = await admin.from('stores').select('*, products(*)').eq('id', storeId).single();
  const paths: (string | null)[] = [];
  if (s) {
    paths.push(pathFromUrl((s as any).banner_url));
    ((s as any).products || []).forEach((p: any) => paths.push(pathFromUrl(p.image_url)));
  }
  await admin.from('orders').update({ store_id: null }).eq('store_id', storeId);
  await admin.from('products').delete().eq('store_id', storeId);
  await admin.from('stores').delete().eq('id', storeId);
  await removePaths(paths);
}

async function deleteAccount(wallet: string, role: 'buyer' | 'seller') {
  const paths: (string | null)[] = [];
  const { data: profRows } = await admin.from('profiles').select('*').eq('wallet_address', wallet);
  const profiles = profRows || [];
  const thisProfile = profiles.find((p: any) => p.role === role);
  const isLastProfile = profiles.length <= 1;
  if (isLastProfile && (thisProfile as any)?.avatar_url) paths.push(pathFromUrl((thisProfile as any).avatar_url));

  if (role === 'seller') {
    const { data: storeRows } = await admin.from('stores').select('id').eq('owner_wallet', wallet);
    for (const st of (storeRows || [])) await deleteStoreCascade((st as any).id);
    await admin.from('seller_reputation').delete().eq('wallet_address', wallet);
  }
  if (role === 'buyer') {
    const { data: orderRows } = await admin.from('orders').select('id').eq('buyer_wallet', wallet);
    const ids = (orderRows || []).map((o: any) => o.id);
    if (ids.length) {
      await admin.from('escrow_jobs').delete().in('order_id', ids);
      await admin.from('orders').delete().eq('buyer_wallet', wallet);
    }
  }
  const { data: dm } = await admin.from('dispute_messages').select('evidence_url').eq('wallet', wallet).eq('role', role);
  (dm || []).forEach((m: any) => paths.push(pathFromUrl(m.evidence_url)));
  await admin.from('dispute_messages').delete().eq('wallet', wallet).eq('role', role);
  await admin.from('profiles').delete().eq('wallet_address', wallet).eq('role', role);
  await removePaths(paths);
}

export async function POST(req: Request) {
  if (!serviceKey) return bad('server not configured', 500);
  let body: any;
  try { body = await req.json(); } catch { return bad('invalid json'); }
  const { action, payload } = body || {};
  if (!action) return bad('missing action');
  const p = payload || {};

  try {
    switch (action) {
      case 'saveProfile': {
        if (!p.wallet_address || !p.role) return bad('missing fields');
        const { data, error } = await admin.from('profiles').upsert(p, { onConflict: 'wallet_address,role' }).select().single();
        if (error) throw error; return ok(data);
      }
      case 'saveStore': {
        if (!p.owner_wallet || !p.name || !p.slug) return bad('missing fields');
        if (BOT_NAME.test(p.name)) return bad('rejected');
        if (!p.tagline || !p.description || !p.banner_url) return bad('store incomplete');
        const { data, error } = await admin.from('stores').upsert(p, { onConflict: 'slug' }).select().single();
        if (error) throw error; return ok(data);
      }
      case 'updateStore': {
        if (!p.storeId) return bad('missing storeId');
        const { data, error } = await admin.from('stores').update(p.updates || {}).eq('id', p.storeId).select().single();
        if (error) throw error; return ok(data);
      }
      case 'deleteStore': {
        if (!p.storeId) return bad('missing storeId');
        const { error } = await admin.from('stores').delete().eq('id', p.storeId);
        if (error) throw error; return ok(true);
      }
      case 'deleteStoreCascade': {
        if (!p.storeId) return bad('missing storeId');
        await deleteStoreCascade(p.storeId); return ok(true);
      }
      case 'saveProduct': {
        if (!p.store_id || !p.name) return bad('missing fields');
        const { data, error } = await admin.from('products').insert(p).select().single();
        if (error) throw error; return ok(data);
      }
      case 'deleteProduct': {
        if (!p.productId) return bad('missing productId');
        const { error } = await admin.from('products').delete().eq('id', p.productId);
        if (error) throw error; return ok(true);
      }
      case 'saveOrder': {
        if (!p.buyer_wallet || !p.seller_wallet) return bad('missing fields');
        const { data, error } = await admin.from('orders').insert(p).select().single();
        if (error) throw error; return ok(data);
      }
      case 'upsertSellerReputation': {
        if (!p.wallet_address) return bad('missing wallet');
        const { data, error } = await admin.from('seller_reputation').upsert({ wallet_address: p.wallet_address, ...(p.updates || {}) }, { onConflict: 'wallet_address' }).select().single();
        if (error) throw error; return ok(data);
      }
      case 'createEscrowJob': {
        if (!p.buyer_wallet || !p.seller_wallet) return bad('missing fields');
        const { data, error } = await admin.from('escrow_jobs').insert(p).select().single();
        if (error) throw error; return ok(data);
      }
      case 'releaseEscrow': {
        if (!p.jobId) return bad('missing jobId');
        const { data, error } = await admin.from('escrow_jobs').update({ status: 'released', release_tx: p.releaseTx }).eq('id', p.jobId).select().single();
        if (error) throw error; return ok(data);
      }
      case 'addDisputeMessage': {
        if (p.escrow_id == null || !p.wallet) return bad('missing fields');
        const { data, error } = await admin.from('dispute_messages').insert(p).select().single();
        if (error) throw error; return ok(data);
      }
      case 'deleteAccount': {
        if (!p.wallet || !p.role) return bad('missing fields');
        await deleteAccount(p.wallet, p.role); return ok(true);
      }
      default:
        return bad('unknown action');
    }
  } catch (e: any) {
    return bad(e?.message || 'server error', 500);
  }
}
