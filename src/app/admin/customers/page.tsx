import { getSupabaseAdmin } from '@/lib/supabase';
import { formatPrice } from '@/lib/products-data';
import CustomersAdminClient from './CustomersAdminClient';

async function getCustomers() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('orders')
    .select('customer_name, customer_email, customer_phone, customer_address, total, status, created_at')
    .in('status', ['paid', 'preparing', 'delivered'])
    .order('created_at', { ascending: false });

  if (!data) return [];

  // Group by phone number (primary unique key)
  const map = new Map<string, {
    name: string;
    email: string;
    phone: string;
    address: string;
    orders: number;
    totalSpent: number;
    lastOrder: string;
  }>();

  for (const row of data) {
    const key = row.customer_phone;
    if (!map.has(key)) {
      map.set(key, {
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone,
        address: row.customer_address,
        orders: 0,
        totalSpent: 0,
        lastOrder: row.created_at,
      });
    }
    const entry = map.get(key)!;
    entry.orders += 1;
    entry.totalSpent += row.total;
    if (row.created_at > entry.lastOrder) entry.lastOrder = row.created_at;
  }

  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  return <CustomersAdminClient customers={customers} />;
}
