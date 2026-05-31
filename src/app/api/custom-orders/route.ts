import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const customOrderSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  eventType: z.string().min(1).max(100),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'),
  cakeQuantity: z.string().max(200).optional(),
  croissantQuantity: z.string().max(200).optional(),
  popcornQuantity: z.string().max(200).optional(),
  specialRequirements: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = customOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, eventType, eventDate, cakeQuantity, croissantQuantity, popcornQuantity, specialRequirements } = parsed.data;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from('custom_order_requests').insert({
      name,
      email,
      phone,
      event_type: eventType,
      event_date: eventDate,
      cake_quantity: cakeQuantity ?? null,
      croissant_quantity: croissantQuantity ?? null,
      popcorn_quantity: popcornQuantity ?? null,
      special_requirements: specialRequirements ?? null,
      status: 'new',
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Custom order API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
