import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  token: z.string().min(16).max(64),
  reference: z.string().min(4).max(120),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(ip, 10, 60_000)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }

  const { token, reference } = parsed.data;
  const db = getSupabaseAdmin();

  // The quote must exist for this token
  const { data: quote } = await db
    .from('custom_order_requests')
    .select('id, deposit_amount')
    .eq('quote_token', token)
    .single();

  if (!quote) {
    return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
  }

  // Verify the payment really happened, with Paystack as the source of truth
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await res.json();

    if (!data.status || data.data?.status !== 'success') {
      return NextResponse.json({ success: false, error: 'Payment not verified' });
    }

    // Guard against under-payment (Paystack amounts are in kobo)
    const paid = Math.floor((data.data.amount ?? 0) / 100);
    if (quote.deposit_amount && paid < quote.deposit_amount) {
      return NextResponse.json({ success: false, error: 'Amount paid is less than the deposit due' });
    }

    const { error } = await db
      .from('custom_order_requests')
      .update({ deposit_paid: true, deposit_reference: reference, status: 'deposit_paid' })
      .eq('id', quote.id);

    if (error) {
      console.error('Deposit update failed:', error);
      return NextResponse.json({ success: false, error: 'Could not record payment' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Quote verify error:', err);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
