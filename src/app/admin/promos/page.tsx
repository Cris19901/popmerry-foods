import { getSupabaseAdmin } from '@/lib/supabase';
import PromosAdminClient from './PromosAdminClient';

async function getPromos() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AdminPromosPage() {
  const promos = await getPromos();
  return <PromosAdminClient promos={promos} />;
}
