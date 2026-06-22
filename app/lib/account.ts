import { supabase } from './supabase';

// All Vendra uploads live in the public "avatars" bucket. We can recover the
// storage path from a public URL to delete the underlying file.
const BUCKET = 'avatars';

function pathFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const marker = '/object/public/' + BUCKET + '/';
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

async function removePaths(paths: (string | null)[]) {
  const clean = paths.filter((p): p is string => !!p);
  if (clean.length) { try { await supabase.storage.from(BUCKET).remove(clean); } catch (e) { /* best-effort */ } }
}

// Delete a store and everything under it, in FK-safe order, plus its uploads.
export async function deleteStoreCascade(storeId: string) {
  const { data: s } = await supabase.from('stores').select('*, products(*)').eq('id', storeId).single();
  const paths: (string | null)[] = [];
  if (s) {
    paths.push(pathFromUrl(s.banner_url));
    (s.products || []).forEach((p: any) => paths.push(pathFromUrl(p.image_url)));
  }
  // orders reference the store — unlink them so the store can be removed (keeps order history)
  await supabase.from('orders').update({ store_id: null }).eq('store_id', storeId);
  await supabase.from('products').delete().eq('store_id', storeId);
  await supabase.from('stores').delete().eq('id', storeId);
  await removePaths(paths);
}

// Wipe a single role's account (buyer or seller) and everything tied to it.
// On-chain escrow is untouched — this only removes off-chain Vendra data.
export async function deleteAccount(wallet: string, role: 'buyer' | 'seller') {
  const paths: (string | null)[] = [];

  // Is this the wallet's last profile? If so we can also remove the shared avatar.
  const { data: profRows } = await supabase.from('profiles').select('*').eq('wallet_address', wallet);
  const profiles = profRows || [];
  const thisProfile = profiles.find((p: any) => p.role === role);
  const isLastProfile = profiles.length <= 1;
  if (isLastProfile && thisProfile?.avatar_url) paths.push(pathFromUrl(thisProfile.avatar_url));

  if (role === 'seller') {
    const { data: storeRows } = await supabase.from('stores').select('id').eq('owner_wallet', wallet);
    for (const st of (storeRows || [])) await deleteStoreCascade(st.id);
    await supabase.from('seller_reputation').delete().eq('wallet_address', wallet);
  }

  if (role === 'buyer') {
    const { data: orderRows } = await supabase.from('orders').select('id').eq('buyer_wallet', wallet);
    const ids = (orderRows || []).map((o: any) => o.id);
    if (ids.length) {
      await supabase.from('escrow_jobs').delete().in('order_id', ids);
      await supabase.from('orders').delete().eq('buyer_wallet', wallet);
    }
  }

  // dispute messages this profile posted (collect evidence uploads first)
  const { data: dm } = await supabase.from('dispute_messages').select('evidence_url').eq('wallet', wallet).eq('role', role);
  (dm || []).forEach((m: any) => paths.push(pathFromUrl(m.evidence_url)));
  await supabase.from('dispute_messages').delete().eq('wallet', wallet).eq('role', role);

  // finally, the profile row itself
  await supabase.from('profiles').delete().eq('wallet_address', wallet).eq('role', role);

  await removePaths(paths);
}
