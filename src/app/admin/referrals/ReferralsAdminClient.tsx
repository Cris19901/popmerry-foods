'use client';

import { useState, useMemo } from 'react';
import { Search, X, Download, Gift } from 'lucide-react';
import { formatPrice } from '@/lib/products-data';

type Referral = {
  id: string;
  code: string;
  referrer_name: string;
  referrer_email: string;
  referrer_phone: string | null;
  uses: number;
  reward_per_referral: number;
  created_at: string;
};

function exportCSV(rows: (Referral & { revenue: number; owed: number })[]) {
  const headers = ['Code', 'Referrer', 'Email', 'Phone', 'Successful Referrals', 'Reward Owed', 'Revenue Driven'];
  const data = rows.map(r => [r.code, r.referrer_name, r.referrer_email, r.referrer_phone ?? '', r.uses, r.owed, r.revenue]);
  const csv = [headers, ...data].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `popmerry-referrals-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReferralsAdminClient({ referrals, revenue }: { referrals: Referral[]; revenue: Record<string, number> }) {
  const [query, setQuery] = useState('');

  const rows = useMemo(() => referrals.map(r => ({
    ...r,
    revenue: revenue[r.code.toUpperCase()] ?? 0,
    owed: r.uses * r.reward_per_referral,
  })), [referrals, revenue]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(r =>
      r.referrer_name.toLowerCase().includes(q) ||
      r.referrer_email.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const totalReferrals = rows.reduce((s, r) => s + r.uses, 0);
  const totalOwed = rows.reduce((s, r) => s + r.owed, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Referrals</h1>
          <p className="text-stone-500 text-sm mt-0.5">{referrals.length} customers referring</p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="inline-flex items-center gap-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Successful Referrals', value: totalReferrals },
          { label: 'Rewards Owed', value: formatPrice(totalOwed), accent: 'text-amber-700' },
          { label: 'Revenue Driven', value: formatPrice(totalRevenue), accent: 'text-green-700' },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-white rounded-2xl border border-stone-200 p-4">
            <p className="text-stone-500 text-xs font-medium mb-1">{label}</p>
            <p className={`font-display text-xl font-bold ${accent ?? 'text-stone-900'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, email or code…"
          className="w-full bg-white border border-stone-200 rounded-full pl-10 pr-10 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Gift size={32} className="text-stone-300 mx-auto mb-2" />
            <p className="text-stone-400 text-sm">{query ? 'No referrers match your search.' : 'No referrals yet. Share the /refer page to get started.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  {['Referrer', 'Code', 'Referrals', 'Reward Owed', 'Revenue', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-stone-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-stone-900">{r.referrer_name}</p>
                      <p className="text-stone-400 text-xs">{r.referrer_email}</p>
                      {r.referrer_phone && <p className="text-stone-400 text-xs">{r.referrer_phone}</p>}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-stone-800">{r.code}</td>
                    <td className="px-5 py-4 text-stone-800 font-semibold">{r.uses}</td>
                    <td className="px-5 py-4 font-bold text-amber-700">{r.owed > 0 ? formatPrice(r.owed) : '—'}</td>
                    <td className="px-5 py-4 font-bold text-green-700">{r.revenue > 0 ? formatPrice(r.revenue) : '—'}</td>
                    <td className="px-5 py-4">
                      {r.referrer_phone && (
                        <a
                          href={`https://wa.me/${r.referrer_phone.replace(/\D/g, '').replace(/^0/, '234')}?text=${encodeURIComponent(`Hi ${r.referrer_name}! You've earned ₦${r.owed.toLocaleString()} in PopMerry referral rewards 🎉`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-green-700 font-semibold hover:text-green-900 whitespace-nowrap"
                        >
                          Pay out
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
