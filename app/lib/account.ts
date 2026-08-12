import { dbWrite } from './supabase';

// Account/store deletion now runs server-side (service-role key) so it keeps
// working once the public anon key is read-only. The full FK-safe cascade and
// upload cleanup live in app/api/db/route.ts. On-chain escrow is never affected.

export async function deleteStoreCascade(storeId: string) {
  return dbWrite('deleteStoreCascade', { storeId });
}

export async function deleteAccount(wallet: string, role: 'buyer' | 'seller') {
  return dbWrite('deleteAccount', { wallet, role });
}
