import { getSupabaseAdmin } from '@/lib/supabase';
import CustomOrderStatusSelect from './CustomOrderStatusSelect';

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
    <div className="p-8">
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

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Event', value: order.event_type },
                  { label: 'Event Date', value: new Date(order.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Cakes', value: order.cake_quantity || '—' },
                  { label: 'Croissants', value: order.croissant_quantity || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-stone-50 rounded-xl p-3">
                    <p className="text-stone-400 text-xs mb-0.5">{label}</p>
                    <p className="text-stone-800 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {order.special_requirements && (
                <div className="bg-amber-50 rounded-xl p-3 mb-4">
                  <p className="text-stone-400 text-xs mb-0.5">Special Requirements</p>
                  <p className="text-stone-700 text-sm">{order.special_requirements}</p>
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
