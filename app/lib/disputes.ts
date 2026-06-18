import { supabase } from './supabase';

export async function addDisputeMessage(m: {
  escrow_id: number; wallet: string; role?: string; message?: string; evidence_url?: string;
}) {
  const { data, error } = await supabase.from('dispute_messages').insert(m).select().single();
  if (error) throw error;
  return data;
}

export async function getDisputeMessages(escrowId: number) {
  const { data } = await supabase.from('dispute_messages').select('*').eq('escrow_id', escrowId).order('created_at', { ascending: true });
  return data || [];
}

// Uploads an evidence file to the same public bucket the app already uses
// (avatars), under an evidence/ prefix, and returns its public URL.
export async function uploadEvidence(file: File) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const path = 'evidence/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}
