import { getSupabaseAdmin } from '@/lib/supabase';
import { formatPrice } from '@/lib/products-data';
import OrderStatusSelect from './OrderStatusSelect';

async function getOrders() {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-stone-100 text-stone-600',
  paid:      'bg-blue-50 text-blue-700',
  preparing: 'bg-amber-50 text-amber-700',
  delivered: 'bg-green-50 text-green-700',
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-900">Orders</h1>
        <p className="text-stone-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-stone-400 text-center py-20">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  {['Customer', 'Date', 'Items', 'Total', 'Reference', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  return (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-stone-900">{order.customer_name}</p>
                        <p className="text-stone-400 text-xs">{order.customer_email}</p>
                        <p className="text-stone-400 text-xs">{order.customer_phone}</p>
                      </td>
                      <td className="px-5 py-4 text-stone-600">
                        {new Date(order.created_at).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          {items.slice(0, 3).map((item: { product: { name: string }; quantity: number }, i: number) => (
                            <p key={i} className="text-stone-600 text-xs">
                              {item.quantity}× {item.product?.name}
                            </p>
                          ))}
                          {items.length > 3 && (
                            <p className="text-stone-400 text-xs">+{items.length - 3} more</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-stone-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-4 text-stone-400 text-xs font-mono">
                        {order.paystack_reference ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
