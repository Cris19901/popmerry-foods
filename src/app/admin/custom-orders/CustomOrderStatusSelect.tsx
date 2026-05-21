'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const STATUSES = ['new', 'contacted', 'quoted', 'confirmed', 'cancelled'];

const STATUS_STYLES: Record<string, string> = {
  new:        'bg-blue-50 text-blue-700',
  contacted:  'bg-amber-50 text-amber-700',
  quoted:     'bg-purple-50 text-purple-700',
  confirmed:  'bg-green-50 text-green-700',
  cancelled:  'bg-red-50 text-red-600',
};

export default function CustomOrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus ?? 'new');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    setStatus(newStatus);
    const res = await fetch(`/api/admin/custom-orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      toast.success('Status updated');
      router.refresh();
    } else {
      toast.error('Failed to update');
    }
    setLoading(false);
  };

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      disabled={loading}
      className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 capitalize ${STATUS_STYLES[status] ?? 'bg-stone-100 text-stone-600'}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s} className="bg-white text-stone-800 capitalize">{s}</option>
      ))}
    </select>
  );
}
