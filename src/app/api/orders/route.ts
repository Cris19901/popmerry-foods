import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const orderItemSchema = z.object({
  product: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    price: z.number().positive(),
    imageId: z.string().optional(),
  }),
  quantity: z.number().int().positive().max(100),
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
  promoCode: z.string().max(50).optional(),
  promoKind: z.enum(['promo', 'referral']).optional(),
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

    const { customer, items, subtotal, deliveryFee, total, promoCode, promoKind } = parsed.data;
    const supabase = getSupabaseAdmin();

    const isReferral = promoKind === 'referral';
    const isPromo = promoCode && promoKind !== 'referral';

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
        promo_code: isPromo ? promoCode : null,
        referral_code: isReferral ? promoCode : null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }

    // Increment usage counters (best-effort, non-blocking on failure)
    if (promoCode) {
      try {
        if (isReferral) {
          // Don't credit self-referrals
          const { data: ref } = await supabase
            .from('referrals')
            .select('referrer_email')
            .ilike('code', promoCode)
            .single();
          if (ref && ref.referrer_email.toLowerCase() !== customer.email.toLowerCase()) {
            await supabase.rpc('increment_referral_usage', { p_code: promoCode });
          }
        } else {
          await supabase.rpc('increment_promo_usage', { p_code: promoCode });
        }
      } catch (e) {
        console.error('Usage increment failed:', e);
      }
    }

    return NextResponse.json({ orderId: data.id });
  } catch (err) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
