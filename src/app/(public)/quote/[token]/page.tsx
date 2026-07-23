import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, CalendarDays, Cake } from 'lucide-react';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase';
import { formatPrice } from '@/lib/products-data';
import QuotePayment from './QuotePayment';

type SelectedOption = { group_name: string; name: string; price_delta: number };

// Quote links are private capability URLs — keep them out of search engines.
export const metadata: Metadata = {
  title: 'Your Quote',
  robots: { index: false, follow: false },
};

async function getQuote(token: string) {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('custom_order_requests')
    .select('*')
    .eq('quote_token', token)
    .single();
  return data;
}

export default async function QuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const quote = await getQuote(token);

  if (!quote || quote.quoted_price == null) notFound();

  const total: number = quote.quoted_price;
  const deposit: number = quote.deposit_amount ?? 0;
  const balance = total - deposit;
  const paid = !!quote.deposit_paid;
  const options: SelectedOption[] = Array.isArray(quote.selected_options) ? quote.selected_options : [];
  const refs: string[] = Array.isArray(quote.reference_images) ? quote.reference_images : [];

  return (
    <div className="min-h-screen bg-amber-50 pt-20 pb-16">
      <div className="hero-gradient py-16 px-4 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-6">
          <Cake size={26} className="text-white" />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">Your Custom Cake Quote</h1>
        <p className="text-white/80">Prepared for {quote.name}</p>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        {/* Paid banner */}
        {paid && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle size={22} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-green-800">Deposit received — your order is confirmed! 🎉</p>
              <p className="text-green-700 text-sm mt-0.5">
                We&apos;ve started planning your cake. We&apos;ll be in touch on WhatsApp with updates.
                {balance > 0 && <> The remaining {formatPrice(balance)} is due on delivery.</>}
              </p>
            </div>
          </div>
        )}

        {/* Event */}
        <div className="bg-white rounded-3xl border border-amber-100 p-6">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-3">
            <CalendarDays size={16} />
            <span>
              {quote.event_type} ·{' '}
              {new Date(quote.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {options.length > 0 && (
            <>
              <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-2">Your cake</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {options.map((o, i) => (
                  <span key={i} className="text-xs bg-amber-50 border border-amber-200 text-stone-700 px-2.5 py-1 rounded-full">
                    {o.group_name}: <span className="font-semibold">{o.name}</span>
                  </span>
                ))}
              </div>
            </>
          )}

          {quote.special_requirements && (
            <div className="bg-stone-50 rounded-xl p-3 mb-4">
              <p className="text-stone-400 text-xs mb-0.5">Your notes</p>
              <p className="text-stone-700 text-sm">{quote.special_requirements}</p>
            </div>
          )}

          {refs.length > 0 && (
            <div>
              <p className="text-stone-400 text-xs mb-1.5">Your inspiration photos</p>
              <div className="flex flex-wrap gap-2">
                {refs.map((url, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200">
                    <Image src={url} alt={`Reference ${i + 1}`} fill className="object-cover" sizes="56px" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Note from the baker */}
        {quote.quote_note && (
          <div className="bg-amber-100/60 border border-amber-200 rounded-2xl p-5">
            <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1">A note from PopMerry</p>
            <p className="text-stone-700 text-sm leading-relaxed">{quote.quote_note}</p>
          </div>
        )}

        {/* Price breakdown */}
        <div className="bg-white rounded-3xl border border-amber-100 p-6">
          <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">Quote</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Total price</span>
              <span className="font-semibold text-stone-900">{formatPrice(total)}</span>
            </div>
            {deposit > 0 && (
              <>
                <div className="flex justify-between text-stone-600">
                  <span>{paid ? 'Deposit paid' : 'Deposit due now'}</span>
                  <span className={`font-semibold ${paid ? 'text-green-600' : 'text-amber-700'}`}>{formatPrice(deposit)}</span>
                </div>
                <div className="flex justify-between text-stone-600 pt-2 border-t border-stone-100">
                  <span>Balance on delivery</span>
                  <span className="font-semibold text-stone-900">{formatPrice(balance)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment */}
        {!paid && (
          <QuotePayment
            token={token}
            email={quote.email}
            customerName={quote.name}
            amount={deposit > 0 ? deposit : total}
            isDeposit={deposit > 0}
          />
        )}
      </div>
    </div>
  );
}
