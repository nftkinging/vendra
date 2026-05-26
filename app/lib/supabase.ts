import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orqdqhrhqtehxawjpjkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycWRxaHJocXRlaHhhd2pwamtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTg0NjksImV4cCI6MjA5MTQ5NDQ2OX0.G3ijP8DJ8I35SXsSMZE834Q8x_tqWT1yp-3gi---bQo';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { data, error } = await supabase.from('profiles').upsert(profile, { onConflict: 'wallet_address,role' }).select().single();
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase.from('stores').select('*, products(*)').eq('owner_wallet', walletAddress).single();
  if (error) return null;
  return data;
}

export async function saveStore(store: {
  owner_wallet: string; name: string; tagline: string; description: string;
  category: string; slug: string; x_handle?: string; deploy_fee_tx?: string; banner_url?: string;
}) {
  const { data, error } = await supabase.from('stores').upsert(store, { onConflict: 'slug' }).select().single();
  if (error) throw error;
  return data;
}

export async function updateStore(storeId: string, updates: {
  name?: string; tagline?: string; description?: string; category?: string; x_handle?: string; banner_url?: string;
}) {
  const { data, error } = await supabase.from('stores').update(updates).eq('id', storeId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteStore(storeId: string) {
  const { error } = await supabase.from('stores').delete().eq('id', storeId);
  if (error) throw error;
}

export async function saveProduct(product: {
  store_id: string; name: string; description: string; price: number; type: string; image_url?: string;
}) {
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
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
  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase.from('seller_reputation').upsert({ wallet_address: walletAddress, ...updates }, { onConflict: 'wallet_address' }).select().single();
  if (error) throw error;
  return data;
}

export async function createEscrowJob(job: {
  order_id?: string; buyer_wallet: string; seller_wallet: string; amount: number; tx_hash: string;
}) {
  const { data, error } = await supabase.from('escrow_jobs').insert(job).select().single();
  if (error) throw error;
  return data;
}

export async function releaseEscrow(jobId: string, releaseTx: string) {
  const { data, error } = await supabase.from('escrow_jobs').update({ status: 'released', release_tx: releaseTx }).eq('id', jobId).select().single();
  if (error) throw error;
  return data;
}

export async function getEscrowByOrder(orderId: string) {
  const { data } = await supabase.from('escrow_jobs').select('*').eq('order_id', orderId).single();
  return data;
}