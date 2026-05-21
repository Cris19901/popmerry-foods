'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = ['pending', 'paid', 'preparing', 'delivered'];

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-stone-100 text-stone-700',
  paid:      'bg-blue-50 text-blue-700',
  preparing: 'bg-amber-50 text-amber-700',
  delivered: 'bg-green-50 text-green-700',
};

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    setStatus(newStatus);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      disabled={loading}
      className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${STATUS_STYLES[status] ?? 'bg-stone-100 text-stone-700'}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s} className="bg-white text-stone-800 capitalize">{s}</option>
      ))}
    </select>
  );
}
