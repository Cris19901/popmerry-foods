import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendCustomerReceipt, sendAdminNewOrderAlert } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { reference, orderId } = await req.json();

    if (!reference || !orderId) {
      return NextResponse.json({ success: false, error: 'Missing reference or orderId' }, { status: 400 });
    }

    // Verify with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== 'success') {
      return NextResponse.json({ success: false, error: 'Payment not verified' });
    }

    const supabase = getSupabaseAdmin();

    // Update order status
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid', paystack_reference: reference })
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order status:', error);
    }

    // Fetch full order to send emails
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();

    if (order) {
      const emailData = {
        orderId: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        items: Array.isArray(order.items) ? order.items : [],
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        total: order.total,
        paystackReference: reference,
      };
      // Fire emails without blocking the response
      Promise.all([
        sendCustomerReceipt(emailData),
        sendAdminNewOrderAlert(emailData),
      ]).catch(err => console.error('Email send error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Paystack verify error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
