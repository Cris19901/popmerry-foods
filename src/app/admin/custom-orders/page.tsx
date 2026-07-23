import Image from 'next/image';
import { getSupabaseAdmin } from '@/lib/supabase';
import { formatPrice } from '@/lib/products-data';
import CustomOrderStatusSelect from './CustomOrderStatusSelect';
import QuoteForm from './QuoteForm';

type SelectedOption = { group_name: string; name: string; price_delta: number };

async function getCustomOrders() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('custom_order_requests')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AdminCustomOrdersPage() {
  const orders = await getCustomOrders();

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-900">Custom Orders</h1>
        <p className="text-stone-500 text-sm mt-1">{orders.length} custom order requests</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 py-20 text-center text-stone-400">
          No custom orders yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-stone-900">{order.name}</p>
                  <p className="text-stone-500 text-sm">{order.email}</p>
                  <p className="text-stone-500 text-sm">{order.phone}</p>
                </div>
                <CustomOrderStatusSelect orderId={order.id} currentStatus={order.status ?? 'new'} />
              </div>

              {/* Event + date */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Event', value: order.event_type },
                  { label: 'Event Date', value: new Date(order.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-stone-50 rounded-xl p-3">
                    <p className="text-stone-400 text-xs mb-0.5">{label}</p>
                    <p className="text-stone-800 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {/* Configured cake (new configurator orders) */}
              {order.estimated_price != null && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Configured Cake</p>
                    <p className="font-display text-lg font-bold text-amber-700">{formatPrice(order.estimated_price)}</p>
                  </div>
                  {Array.isArray(order.selected_options) && order.selected_options.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {(order.selected_options as SelectedOption[]).map((o, i) => (
                        <span key={i} className="text-xs bg-white border border-amber-200 text-stone-700 px-2.5 py-1 rounded-full">
                          {o.group_name}: <span className="font-semibold">{o.name}</span>
                          {o.price_delta > 0 && <span className="text-amber-600"> +{formatPrice(o.price_delta)}</span>}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-500 text-xs">Standard cake, no add-ons.</p>
                  )}
                </div>
              )}

              {/* Legacy quantity fields (older requests) */}
              {(order.cake_quantity || order.croissant_quantity || order.popcorn_quantity) && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Cakes', value: order.cake_quantity },
                    { label: 'Croissants', value: order.croissant_quantity },
                    { label: 'Popcorn', value: order.popcorn_quantity },
                  ].filter(f => f.value).map(({ label, value }) => (
                    <div key={label} className="bg-stone-50 rounded-xl p-3">
                      <p className="text-stone-400 text-xs mb-0.5">{label}</p>
                      <p className="text-stone-800 text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quote + deposit */}
              <QuoteForm
                orderId={order.id}
                customerName={order.name}
                customerPhone={order.phone}
                estimatedPrice={order.estimated_price ?? null}
                quotedPrice={order.quoted_price ?? null}
                depositAmount={order.deposit_amount ?? null}
                quoteNote={order.quote_note ?? null}
                quoteToken={order.quote_token ?? null}
                depositPaid={!!order.deposit_paid}
              />

              {order.special_requirements && (
                <div className="bg-amber-50 rounded-xl p-3 mb-4">
                  <p className="text-stone-400 text-xs mb-0.5">Special Requirements</p>
                  <p className="text-stone-700 text-sm">{order.special_requirements}</p>
                </div>
              )}

              {/* Reference / inspiration images */}
              {Array.isArray(order.reference_images) && order.reference_images.length > 0 && (
                <div className="mb-4">
                  <p className="text-stone-400 text-xs mb-1.5">Inspiration Photos</p>
                  <div className="flex flex-wrap gap-2">
                    {(order.reference_images as string[]).map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 block">
                        <Image src={url} alt={`Reference ${i + 1}`} fill className="object-cover" sizes="64px" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <p className="text-stone-400 text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <a
                  href={`mailto:${order.email}?subject=Your Custom Order Request - PopMerry Foods`}
                  className="inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
