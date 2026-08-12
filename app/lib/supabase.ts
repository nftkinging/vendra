import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// All writes go through the server route (service-role key) so the public anon
// key can be locked to read-only. Reads and storage uploads stay client-side.
export async function dbWrite(action: string, payload: any) {
  const res = await fetch('/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || 'request failed');
  return json.data;
}

export async function getAllProfiles(walletAddress: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('wallet_address', walletAddress);
  if (error) return [];
  return data || [];
}
export async function getProfile(walletAddress: string, role: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('wallet_address', walletAddress).eq('role', role).single();
  if (error) return null;
  return data;
}
export async function saveProfile(profile: {
  wallet_address: string; role: string; display_name: string; bio: string;
  avatar_url?: string; store_name?: string; category?: string; x_handle?: string;
}) {
  return dbWrite('saveProfile', profile);
}
export async function getStores() {
  const { data, error } = await supabase.from('stores').select('*, products(*)').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}
export async function getStoreBySlug(slug: string) {
  const { data, error } = await supabase.from('stores').select('*, products(*)').eq('slug', slug).single();
  if (error) return null;
  return data;
}
export async function getStoreByWallet(walletAddress: string) {
  // A wallet may own more than one store (e.g. shared seed-seller), so don't use
  // .single() (which errors on multiple rows). Return the most recent match.
  const { data, error } = await supabase.from('stores').select('*, products(*)').eq('owner_wallet', walletAddress).order('created_at', { ascending: false }).limit(1);
  if (error || !data || !data.length) return null;
  return data[0];
}
export async function saveStore(store: {
  owner_wallet: string; name: string; tagline: string; description: string;
  category: string; slug: string; x_handle?: string; deploy_fee_tx?: string; banner_url?: string;
}) {
  return dbWrite('saveStore', store);
}
export async function updateStore(storeId: string, updates: {
  name?: string; tagline?: string; description?: string; category?: string; x_handle?: string; banner_url?: string;
}) {
  return dbWrite('updateStore', { storeId, updates });
}
export async function deleteStore(storeId: string) {
  await dbWrite('deleteStore', { storeId });
}
export async function saveProduct(product: {
  store_id: string; name: string; description: string; price: number; type: string; image_url?: string;
}) {
  return dbWrite('saveProduct', product);
}
export async function deleteProduct(productId: string) {
  await dbWrite('deleteProduct', { productId });
}
export async function getProducts(storeId: string) {
  const { data, error } = await supabase.from('products').select('*').eq('store_id', storeId).order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}
export async function saveOrder(order: {
  buyer_wallet: string; seller_wallet: string; store_id?: string;
  product_name: string; amount: number; tx_hash: string;
}) {
  return dbWrite('saveOrder', order);
}
export async function getOrdersByBuyer(walletAddress: string) {
  const { data, error } = await supabase.from('orders').select('*').eq('buyer_wallet', walletAddress).order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}
export async function getOrdersBySeller(walletAddress: string) {
  const { data, error } = await supabase.from('orders').select('*').eq('seller_wallet', walletAddress).order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}
export async function uploadAvatar(walletAddress: string, file: File) {
  const ext = file.name.split('.').pop();
  const path = walletAddress + '.' + ext;
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}
export async function uploadImage(path: string, file: File) {
  const ext = file.name.split('.').pop();
  const fullPath = path + '.' + ext;
  const { error } = await supabase.storage.from('avatars').upload(fullPath, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(fullPath);
  return data.publicUrl;
}
export async function getSellerReputation(walletAddress: string) {
  const { data } = await supabase.from('seller_reputation').select('*').eq('wallet_address', walletAddress).single();
  return data;
}
export async function upsertSellerReputation(walletAddress: string, updates: {
  total_sales?: number; trust_score?: number; disputes?: number;
}) {
  return dbWrite('upsertSellerReputation', { wallet_address: walletAddress, updates });
}
export async function createEscrowJob(job: {
  order_id?: string; buyer_wallet: string; seller_wallet: string; amount: number; tx_hash: string;
}) {
  return dbWrite('createEscrowJob', job);
}
export async function releaseEscrow(jobId: string, releaseTx: string) {
  return dbWrite('releaseEscrow', { jobId, releaseTx });
}
export async function getEscrowByOrder(orderId: string) {
  const { data } = await supabase.from('escrow_jobs').select('*').eq('order_id', orderId).single();
  return data;
}
