import { getSupabaseAdmin } from '@/lib/supabase';
import { formatPrice } from '@/lib/products-data';
import { ShoppingBag, ClipboardList, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import RevenueChart from './RevenueChart';

async function getStats() {
  const db = getSupabaseAdmin();
  const [ordersRes, customRes] = await Promise.all([
    db.from('orders').select('*').order('created_at', { ascending: false }),
    db.from('custom_order_requests').select('id, name, event_type, created_at, status').order('created_at', { ascending: false }).limit(5),
  ]);

  const orders = ordersRes.data ?? [];
  const customOrders = customRes.data ?? [];

  const paid = orders.filter(o => ['paid', 'preparing', 'delivered'].includes(o.status));
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'paid').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;

  // Revenue by day for the last 14 days
  const now = new Date();
  const dailyRevenue: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyRevenue[d.toISOString().slice(0, 10)] = 0;
  }
  paid.forEach(o => {
    const day = o.created_at?.slice(0, 10);
    if (day && day in dailyRevenue) dailyRevenue[day] += o.total;
  });

  // Top products by qty sold
  const productCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach(o => {
    const items: { product: { id: string; name: string; price: number }; quantity: number }[] = Array.isArray(o.items) ? o.items : [];
    items.forEach(item => {
      const id = item.product?.id;
      if (!id) return;
      if (!productCounts[id]) productCounts[id] = { name: item.product.name, qty: 0, revenue: 0 };
      productCounts[id].qty += item.quantity;
      productCounts[id].revenue += item.product.price * item.quantity;
    });
  });
  const topProducts = Object.values(productCounts).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return { orders: orders.slice(0, 6), customOrders, totalRevenue, pendingCount, preparingCount, totalOrders: orders.length, dailyRevenue, topProducts };
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-stone-100 text-stone-600',
  paid:      'bg-blue-50 text-blue-700',
  preparing: 'bg-amber-50 text-amber-700',
  delivered: 'bg-green-50 text-green-700',
};

export default async function AdminDashboard() {
  const { orders, customOrders, totalRevenue, pendingCount, preparingCount, totalOrders, dailyRevenue, topProducts } = await getStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Awaiting Prep', value: pendingCount, icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'In Preparation', value: preparingCount, icon: ClipboardList, color: 'text-orange-700', bg: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-stone-200">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-stone-500 text-xs font-medium mb-1">{label}</p>
            <p className="font-display text-2xl font-bold text-stone-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4">Revenue — Last 14 Days</h2>
        <RevenueChart data={dailyRevenue} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-amber-700 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-stone-50">
            {orders.length === 0 && <p className="text-stone-400 text-sm text-center py-10">No orders yet.</p>}
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-stone-900 text-sm">{order.customer_name}</p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-stone-800 text-sm">{formatPrice(order.total)}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products + custom orders */}
        <div className="space-y-6">
          {topProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100">
                <h2 className="font-semibold text-stone-900">Top Products</h2>
              </div>
              <div className="divide-y divide-stone-50">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-400 w-4">#{i + 1}</span>
                      <p className="text-stone-700 text-sm font-medium">{p.name}</p>
                    </div>
                    <span className="text-xs text-stone-500">{p.qty} sold</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="font-semibold text-stone-900">Custom Requests</h2>
              <Link href="/admin/custom-orders" className="text-amber-700 text-sm font-medium hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-stone-50">
              {customOrders.length === 0 && <p className="text-stone-400 text-sm text-center py-8">None yet.</p>}
              {customOrders.map(co => (
                <div key={co.id} className="px-6 py-4">
                  <p className="font-medium text-stone-900 text-sm">{co.name}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{co.event_type}</p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    {new Date(co.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
