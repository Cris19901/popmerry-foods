import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const orderItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(100),
  imageId: z.string().optional(),
});

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().min(7).max(20),
    address: z.string().min(5).max(500),
    deliveryNote: z.string().max(500).optional(),
  }),
  items: z.array(orderItemSchema).min(1).max(50),
  subtotal: z.number().positive(),
  deliveryFee: z.number().min(0),
  total: z.number().positive(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!rateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid order data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { customer, items, subtotal, deliveryFee, total } = parsed.data;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: customer.address,
        delivery_note: customer.deliveryNote ?? null,
        items,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }

    return NextResponse.json({ orderId: data.id });
  } catch (err) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
