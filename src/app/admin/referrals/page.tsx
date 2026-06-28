import { getSupabaseAdmin } from '@/lib/supabase';
import ReferralsAdminClient from './ReferralsAdminClient';

async function getData() {
  const db = getSupabaseAdmin();

  const [refsRes, ordersRes] = await Promise.all([
    db.from('referrals').select('*').order('uses', { ascending: false }),
    db.from('orders')
      .select('referral_code, total, status')
      .not('referral_code', 'is', null)
      .in('status', ['paid', 'preparing', 'delivered']),
  ]);

  // Revenue driven per referral code (paid orders only)
  const revenue: Record<string, number> = {};
  for (const o of ordersRes.data ?? []) {
    const key = (o.referral_code as string).toUpperCase();
    revenue[key] = (revenue[key] ?? 0) + o.total;
  }

  return { referrals: refsRes.data ?? [], revenue };
}

export default async function AdminReferralsPage() {
  const { referrals, revenue } = await getData();
  return <ReferralsAdminClient referrals={referrals} revenue={revenue} />;
}
