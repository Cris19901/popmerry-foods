'use client';

import { useState, useMemo } from 'react';
import { Search, X, Download, Users } from 'lucide-react';
import { formatPrice } from '@/lib/products-data';

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
};

function exportCSV(customers: Customer[]) {
  const headers = ['Name', 'Email', 'Phone', 'Address', 'Total Orders', 'Total Spent', 'Last Order'];
  const rows = customers.map(c => [
    c.name, c.email, c.phone, c.address, c.orders, c.totalSpent,
    new Date(c.lastOrder).toLocaleDateString('en-NG'),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `popmerry-customers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CustomersAdminClient({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  }, [customers, query]);

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const repeatCustomers = customers.filter(c => c.orders > 1).length;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Customers</h1>
          <p className="text-stone-500 text-sm mt-0.5">{customers.length} unique customers</p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users },
          { label: 'Repeat Customers', value: repeatCustomers, sub: `${Math.round((repeatCustomers / customers.length) * 100) || 0}% of all` },
          { label: 'Total Revenue', value: formatPrice(totalRevenue) },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-200 p-4">
            <p className="text-stone-500 text-xs font-medium mb-1">{label}</p>
            <p className="font-display text-xl font-bold text-stone-900">{value}</p>
            {sub && <p className="text-stone-400 text-xs mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full bg-white border border-stone-200 rounded-full pl-10 pr-10 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-stone-400 text-center py-16">No customers found.</p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-stone-100">
              {filtered.map((c) => (
                <div key={c.phone} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-stone-900 text-sm">{c.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{c.email}</p>
                      <p className="text-stone-400 text-xs">{c.phone}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-amber-700 text-sm">{formatPrice(c.totalSpent)}</p>
                      <p className="text-stone-400 text-xs">{c.orders} order{c.orders !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-stone-400 text-xs truncate max-w-[60%]">{c.address}</p>
                    <a
                      href={`https://wa.me/${c.phone.replace(/\D/g, '').replace(/^0/, '234')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs text-green-700 font-semibold hover:text-green-900"
                    >
                      WhatsApp
                    </a>
                  </div>
                  {c.orders > 1 && (
                    <span className="inline-block mt-2 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                      Repeat Customer
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {['Customer', 'Contact', 'Orders', 'Total Spent', 'Last Order', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((c) => (
                    <tr key={c.phone} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-stone-900">{c.name}</p>
                          {c.orders > 1 && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                              Repeat
                            </span>
                          )}
                        </div>
                        <p className="text-stone-400 text-xs mt-0.5 truncate max-w-[200px]">{c.address}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-stone-700 text-xs">{c.email}</p>
                        <p className="text-stone-400 text-xs">{c.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-stone-700 font-semibold">{c.orders}</td>
                      <td className="px-5 py-4 font-bold text-amber-700">{formatPrice(c.totalSpent)}</td>
                      <td className="px-5 py-4 text-stone-500 text-xs">
                        {new Date(c.lastOrder).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={`https://wa.me/${c.phone.replace(/\D/g, '').replace(/^0/, '234')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-green-700 font-semibold hover:text-green-900 whitespace-nowrap"
                        >
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
