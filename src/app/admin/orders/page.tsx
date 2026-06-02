import { getSupabaseAdmin } from '@/lib/supabase';
import { formatPrice } from '@/lib/products-data';
import OrderStatusSelect from './OrderStatusSelect';

function waLink(phone: string, name: string, orderId: string, status: string) {
  const messages: Record<string, string> = {
    preparing: `Hi ${name}! 👋 Your PopMerry order #${orderId.slice(0, 8).toUpperCase()} is now being prepared fresh for you. We'll notify you once it's on its way! 🍰`,
    delivered: `Hi ${name}! 🚀 Your PopMerry order #${orderId.slice(0, 8).toUpperCase()} is on its way to you. Our rider will be with you shortly. Enjoy! 🎉`,
  };
  const msg = messages[status] ?? `Hi ${name}! Update on your PopMerry order #${orderId.slice(0, 8).toUpperCase()}.`;
  const clean = phone.replace(/\D/g, '').replace(/^0/, '234');
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}

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
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-stone-100">
              {orders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                return (
                  <div key={order.id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-medium text-stone-900 text-sm">{order.customer_name}</p>
                        <p className="text-stone-400 text-xs mt-0.5">{order.customer_email}</p>
                        <p className="text-stone-400 text-xs">{order.customer_phone}</p>
                      </div>
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </div>
                    <div className="space-y-0.5 mb-3">
                      {items.slice(0, 3).map((item: { product: { name: string }; quantity: number }, i: number) => (
                        <p key={i} className="text-stone-600 text-xs">{item.quantity}× {item.product?.name}</p>
                      ))}
                      {items.length > 3 && <p className="text-stone-400 text-xs">+{items.length - 3} more</p>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 text-sm">{formatPrice(order.total)}</span>
                      <span className="text-stone-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {order.paystack_reference && (
                      <p className="text-stone-300 text-xs font-mono mt-1">{order.paystack_reference}</p>
                    )}
                    <a
                      href={waLink(order.customer_phone, order.customer_name, order.id, order.status)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-green-700 hover:text-green-900"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12.002 2C6.477 2 2 6.477 2 12.001c0 1.761.461 3.413 1.27 4.847L2 22l5.315-1.246A9.96 9.96 0 0 0 12.002 22C17.525 22 22 17.523 22 12.001 22 6.477 17.525 2 12.002 2Zm4.48 13.056c-.245-.123-1.452-.716-1.677-.798-.226-.082-.39-.123-.554.123-.164.245-.636.798-.78.962-.143.164-.287.185-.532.062-.245-.123-1.035-.381-1.973-1.218-.729-.65-1.22-1.452-1.363-1.696-.143-.245-.015-.378.107-.5.11-.11.245-.287.368-.43.122-.143.163-.245.245-.41.082-.163.041-.307-.021-.43-.062-.123-.554-1.334-.76-1.826-.2-.48-.402-.414-.554-.422l-.472-.009c-.163 0-.43.062-.655.307s-.861.841-.861 2.05c0 1.21.88 2.378 1.002 2.541.123.163 1.73 2.645 4.196 3.71.587.253 1.044.404 1.401.517.588.187 1.124.16 1.548.097.472-.07 1.452-.594 1.657-1.167.205-.573.205-1.065.143-1.167-.062-.103-.225-.164-.47-.287Z"/></svg>
                      WhatsApp update
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {['Customer', 'Date', 'Items', 'Total', 'Reference', 'Status', ''].map(h => (
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
                        <td className="px-5 py-4">
                          <a
                            href={waLink(order.customer_phone, order.customer_name, order.id, order.status)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 whitespace-nowrap"
                            title="Send WhatsApp update"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M12.002 2C6.477 2 2 6.477 2 12.001c0 1.761.461 3.413 1.27 4.847L2 22l5.315-1.246A9.96 9.96 0 0 0 12.002 22C17.525 22 22 17.523 22 12.001 22 6.477 17.525 2 12.002 2Zm4.48 13.056c-.245-.123-1.452-.716-1.677-.798-.226-.082-.39-.123-.554.123-.164.245-.636.798-.78.962-.143.164-.287.185-.532.062-.245-.123-1.035-.381-1.973-1.218-.729-.65-1.22-1.452-1.363-1.696-.143-.245-.015-.378.107-.5.11-.11.245-.287.368-.43.122-.143.163-.245.245-.41.082-.163.041-.307-.021-.43-.062-.123-.554-1.334-.76-1.826-.2-.48-.402-.414-.554-.422l-.472-.009c-.163 0-.43.062-.655.307s-.861.841-.861 2.05c0 1.21.88 2.378 1.002 2.541.123.163 1.73 2.645 4.196 3.71.587.253 1.044.404 1.401.517.588.187 1.124.16 1.548.097.472-.07 1.452-.594 1.657-1.167.205-.573.205-1.065.143-1.167-.062-.103-.225-.164-.47-.287Z"/></svg>
                            WA Update
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
