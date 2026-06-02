import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const db = getSupabaseAdmin();
  const { count } = await db
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'paid');

  return NextResponse.json({ count: count ?? 0 });
}
