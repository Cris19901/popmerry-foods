import { getSupabaseAdmin } from '@/lib/supabase';
import PromosAdminClient from './PromosAdminClient';

async function getData() {
  const db = getSupabaseAdmin();

  const [promosRes, ordersRes] = await Promise.all([
    db.from('promo_codes').select('*').order('created_at', { ascending: false }),
    db.from('orders')
      .select('promo_code, total, status')
      .not('promo_code', 'is', null)
      .in('status', ['paid', 'preparing', 'delivered']),
  ]);

  // Aggregate revenue + paid order count per code (case-insensitive)
  const stats: Record<string, { orders: number; revenue: number }> = {};
  for (const o of ordersRes.data ?? []) {
    const key = (o.promo_code as string).toUpperCase();
    if (!stats[key]) stats[key] = { orders: 0, revenue: 0 };
    stats[key].orders += 1;
    stats[key].revenue += o.total;
  }

  return { promos: promosRes.data ?? [], stats };
}

export default async function AdminPromosPage() {
  const { promos, stats } = await getData();
  return <PromosAdminClient promos={promos} stats={stats} />;
}
