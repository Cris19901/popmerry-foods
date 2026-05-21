'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AvailabilityToggle({ productId, isAvailable }: { productId: string; isAvailable: boolean }) {
  const [available, setAvailable] = useState(isAvailable);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    const next = !available;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: next }),
    });
    if (res.ok) {
      setAvailable(next);
      toast.success(next ? 'Marked as available' : 'Marked as unavailable');
      router.refresh();
    } else {
      toast.error('Failed to update');
    }
    setSaving(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={saving}
      title={available ? 'Click to mark unavailable' : 'Click to mark available'}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 disabled:opacity-50 ${
        available ? 'bg-amber-700' : 'bg-stone-300'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${available ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
