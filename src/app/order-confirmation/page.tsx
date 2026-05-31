import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { getSupabaseAdmin } from '@/lib/supabase';
import { formatPrice } from '@/lib/products-data';

async function OrderDetails({ orderId }: { orderId: string }) {
  const db = getSupabaseAdmin();
  const { data: order } = await db
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!order) return null;

  const items: { product: { name: string }; quantity: number }[] = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="bg-white rounded-3xl border border-amber-100 text-left mb-6 overflow-hidden">
      <div className="px-6 py-4 border-b border-amber-50 flex items-center justify-between">
        <h2 className="font-semibold text-stone-900 text-base flex items-center gap-2">
          <ShoppingBag size={17} className="text-amber-600" />
          Order Summary
        </h2>
        <span className="text-xs text-stone-400 font-mono">#{order.id?.slice(0, 8).toUpperCase()}</span>
      </div>

      <div className="divide-y divide-stone-50">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 w-6 h-6 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
              <span className="text-stone-700 text-sm">{item.product?.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-stone-50 space-y-1.5">
        <div className="flex justify-between text-sm text-stone-500">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-stone-500">
          <span>Delivery</span>
          <span>{formatPrice(order.delivery_fee)}</span>
        </div>
        <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200 mt-1">
          <span>Total Paid</span>
          <span className="text-amber-700">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-amber-50">
        <p className="text-xs text-stone-400">
          Delivering to: <span className="text-stone-600 font-medium">{order.customer_address}</span>
        </p>
        {order.paystack_reference && (
          <p className="text-xs text-stone-400 mt-0.5">
            Ref: <span className="font-mono">{order.paystack_reference}</span>
          </p>
        )}
      </div>
    </div>
  );
}

async function ConfirmationContent({ orderId }: { orderId?: string }) {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 pt-20 pb-10">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        <h1 className="font-display text-4xl font-bold text-stone-900 mb-3">Order Confirmed!</h1>
        <p className="text-stone-500 text-lg mb-8 leading-relaxed">
          Payment received. Our bakers are already on it — we&apos;ll reach out on WhatsApp shortly.
        </p>

        {orderId && <OrderDetails orderId={orderId} />}

        {/* What happens next */}
        <div className="bg-white rounded-3xl p-6 border border-amber-100 text-left mb-6 space-y-4">
          <h2 className="font-semibold text-stone-900 text-base">What happens next?</h2>
          {[
            { step: '1', text: 'We confirm your order via WhatsApp within 30 minutes' },
            { step: '2', text: 'Your items are prepared fresh on the day of delivery' },
            { step: '3', text: 'A rider picks up your order and delivers to your address' },
            { step: '4', text: 'Enjoy every bite!' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-7 h-7 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {step}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 mb-8">
          <MessageCircle size={20} className="text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">
            Questions? WhatsApp us at{' '}
            <a href="https://wa.me/234XXXXXXXXXX" className="font-bold underline">
              +234 XXX XXX XXXX
            </a>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 text-sm"
          >
            Order Again <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-stone-200 text-stone-700 font-semibold px-6 py-3.5 rounded-full hover:border-amber-300 hover:text-amber-700 transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { orderId } = await searchParams;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500">Loading your order…</div>}>
      <ConfirmationContent orderId={orderId} />
    </Suspense>
  );
}
