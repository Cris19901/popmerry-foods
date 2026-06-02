'use client';

import { useState, useMemo } from 'react';
import { Search, X, Download } from 'lucide-react';
import { formatPrice } from '@/lib/products-data';
import OrderStatusSelect from './OrderStatusSelect';

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: { product: { name: string; price: number }; quantity: number }[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  paystack_reference: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-stone-100 text-stone-600',
  paid:      'bg-blue-50 text-blue-700',
  preparing: 'bg-amber-50 text-amber-700',
  delivered: 'bg-green-50 text-green-700',
};

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.002 2C6.477 2 2 6.477 2 12.001c0 1.761.461 3.413 1.27 4.847L2 22l5.315-1.246A9.96 9.96 0 0 0 12.002 22C17.525 22 22 17.523 22 12.001 22 6.477 17.525 2 12.002 2Zm4.48 13.056c-.245-.123-1.452-.716-1.677-.798-.226-.082-.39-.123-.554.123-.164.245-.636.798-.78.962-.143.164-.287.185-.532.062-.245-.123-1.035-.381-1.973-1.218-.729-.65-1.22-1.452-1.363-1.696-.143-.245-.015-.378.107-.5.11-.11.245-.287.368-.43.122-.143.163-.245.245-.41.082-.163.041-.307-.021-.43-.062-.123-.554-1.334-.76-1.826-.2-.48-.402-.414-.554-.422l-.472-.009c-.163 0-.43.062-.655.307s-.861.841-.861 2.05c0 1.21.88 2.378 1.002 2.541.123.163 1.73 2.645 4.196 3.71.587.253 1.044.404 1.401.517.588.187 1.124.16 1.548.097.472-.07 1.452-.594 1.657-1.167.205-.573.205-1.065.143-1.167-.062-.103-.225-.164-.47-.287Z"/>
  </svg>
);

function waLink(phone: string, name: string, orderId: string, status: string) {
  const messages: Record<string, string> = {
    preparing: `Hi ${name}! 👋 Your PopMerry order #${orderId.slice(0, 8).toUpperCase()} is now being prepared fresh for you. We'll notify you once it's on its way! 🍰`,
    delivered: `Hi ${name}! 🚀 Your PopMerry order #${orderId.slice(0, 8).toUpperCase()} is on its way to you. Our rider will be with you shortly. Enjoy! 🎉`,
  };
  const msg = messages[status] ?? `Hi ${name}! Update on your PopMerry order #${orderId.slice(0, 8).toUpperCase()}.`;
  const clean = phone.replace(/\D/g, '').replace(/^0/, '234');
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}

function exportCSV(orders: Order[]) {
  const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Address', 'Items', 'Subtotal', 'Delivery Fee', 'Total', 'Status', 'Paystack Ref'];
  const rows = orders.map(o => [
    o.id,
    new Date(o.created_at).toLocaleDateString('en-NG'),
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.customer_address,
    o.items.map(i => `${i.quantity}x ${i.product.name}`).join(' | '),
    o.subtotal,
    o.delivery_fee,
    o.total,
    o.status,
    o.paystack_reference ?? '',
  ]);

  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `popmerry-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_FILTERS = ['all', 'paid', 'preparing', 'delivered', 'pending'] as const;

export default function OrdersAdminClient({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS[number]>('all');

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(o =>
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, query, statusFilter]);

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Orders</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {filtered.length} of {orders.length} orders
          </p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, email, phone or order ID…"
            className="w-full bg-white border border-stone-200 rounded-full pl-10 pr-10 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-amber-700 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400'
              }`}
            >
              {s === 'all' ? `All (${orders.length})` : s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-stone-400 text-center py-20">
            {query || statusFilter !== 'all' ? 'No orders match your search.' : 'No orders yet.'}
          </p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-stone-100">
              {filtered.map((order) => {
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
                      {items.slice(0, 3).map((item, i) => (
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
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-green-700 hover:text-green-900"
                    >
                      {WA_SVG} WhatsApp update
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
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((order) => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    return (
                      <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-900">{order.customer_name}</p>
                          <p className="text-stone-400 text-xs">{order.customer_email}</p>
                          <p className="text-stone-400 text-xs">{order.customer_phone}</p>
                        </td>
                        <td className="px-5 py-4 text-stone-600 text-xs">
                          {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            {items.slice(0, 3).map((item, i) => (
                              <p key={i} className="text-stone-600 text-xs">{item.quantity}× {item.product?.name}</p>
                            ))}
                            {items.length > 3 && <p className="text-stone-400 text-xs">+{items.length - 3} more</p>}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-stone-900">{formatPrice(order.total)}</td>
                        <td className="px-5 py-4 text-stone-400 text-xs font-mono">{order.paystack_reference ?? '—'}</td>
                        <td className="px-5 py-4">
                          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                        </td>
                        <td className="px-5 py-4">
                          <a
                            href={waLink(order.customer_phone, order.customer_name, order.id, order.status)}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 whitespace-nowrap"
                          >
                            {WA_SVG} WA Update
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
