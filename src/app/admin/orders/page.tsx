import { getSupabaseAdmin } from '@/lib/supabase';
import OrdersAdminClient from './OrdersAdminClient';

async function getOrders() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersAdminClient orders={orders} />;
}
