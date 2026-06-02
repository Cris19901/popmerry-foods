import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 4) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  const db = getSupabaseAdmin();

  // Try by order ID prefix first, then by phone number
  const [byId, byPhone] = await Promise.all([
    db.from('orders').select('*').ilike('id', `${q}%`).limit(1).single(),
    db.from('orders').select('*').eq('customer_phone', q).order('created_at', { ascending: false }).limit(1).single(),
  ]);

  const order = byId.data ?? byPhone.data ?? null;

  if (!order) {
    return NextResponse.json({ order: null }, { status: 404 });
  }

  // Return only safe fields — no email exposed
  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      customer_name: order.customer_name,
      customer_address: order.customer_address,
      items: order.items,
      subtotal: order.subtotal,
      delivery_fee: order.delivery_fee,
      total: order.total,
      created_at: order.created_at,
    },
  });
}
