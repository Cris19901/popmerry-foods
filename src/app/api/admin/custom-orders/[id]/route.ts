import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';

const patchSchema = z.object({
  // Status-only update (existing behaviour)
  status: z.enum(['new', 'contacted', 'quoted', 'deposit_paid', 'confirmed', 'completed', 'cancelled']).optional(),
  // Quote payload — presence of quoted_price means "issue/update a quote"
  quoted_price: z.number().int().positive().max(100_000_000).optional(),
  deposit_amount: z.number().int().min(0).max(100_000_000).optional(),
  quote_note: z.string().max(1000).optional(),
  // Admin manually confirms a bank-transfer deposit — Paystack never sees these
  mark_deposit_paid: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { status, quoted_price, deposit_amount, quote_note, mark_deposit_paid } = parsed.data;
  const db = getSupabaseAdmin();

  // ── Manually confirm a bank-transfer deposit ────────────────────────
  if (mark_deposit_paid) {
    const { error } = await db
      .from('custom_order_requests')
      .update({
        deposit_paid: true,
        deposit_method: 'transfer',
        deposit_reference: 'Confirmed manually by admin',
        status: 'deposit_paid',
      })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // ── Issue / update a quote ──────────────────────────────────────────
  if (quoted_price !== undefined) {
    const deposit = deposit_amount ?? 0;
    if (deposit > quoted_price) {
      return NextResponse.json({ error: 'Deposit cannot exceed the quoted price' }, { status: 400 });
    }

    // Reuse the existing token so a previously shared link keeps working
    const { data: existing } = await db
      .from('custom_order_requests')
      .select('quote_token, deposit_paid')
      .eq('id', id)
      .single();

    const token = existing?.quote_token ?? crypto.randomUUID().replace(/-/g, '');

    const { error } = await db
      .from('custom_order_requests')
      .update({
        quoted_price,
        deposit_amount: deposit,
        quote_note: quote_note ?? null,
        quote_token: token,
        quoted_at: new Date().toISOString(),
        // Don't downgrade a request whose deposit is already settled
        status: existing?.deposit_paid ? 'deposit_paid' : 'quoted',
      })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, quoteToken: token });
  }

  // ── Status-only update ──────────────────────────────────────────────
  if (status) {
    const { error } = await db.from('custom_order_requests').update({ status }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
}
