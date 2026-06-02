'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products-data';

type Promo = {
  id: string;
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

const inputCls = 'w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500';

export default function PromosAdminClient({ promos: initial }: { promos: Promo[] }) {
  const router = useRouter();
  const [promos, setPromos] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: '',
    min_order: '',
    max_uses: '',
    expires_at: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discount_value) {
      toast.error('Code and discount value are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase().trim(),
          description: form.description,
          discount_type: form.discount_type,
          discount_value: parseInt(form.discount_value),
          min_order: form.min_order ? parseInt(form.min_order) : 0,
          max_uses: form.max_uses ? parseInt(form.max_uses) : null,
          expires_at: form.expires_at || null,
        }),
      });
      if (res.ok) {
        toast.success('Promo code created');
        setShowForm(false);
        router.refresh();
      } else {
        const d = await res.json();
        toast.error(d.error ?? 'Failed to create');
      }
    } catch {
      toast.error('Failed to create promo code');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (promo: Promo) => {
    const res = await fetch(`/api/admin/promos/${promo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !promo.is_active }),
    });
    if (res.ok) {
      setPromos(ps => ps.map(p => p.id === promo.id ? { ...p, is_active: !p.is_active } : p));
    }
  };

  const deletePromo = async (id: string) => {
    if (!confirm('Delete this promo code?')) return;
    const res = await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPromos(ps => ps.filter(p => p.id !== id));
      toast.success('Deleted');
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Promo Codes</h1>
          <p className="text-stone-500 text-sm mt-0.5">{promos.length} codes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
        >
          <Plus size={15} /> New Code
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h2 className="font-semibold text-stone-900 mb-4">Create Promo Code</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Code *</label>
                <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="WELCOME10" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Description</label>
                <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="10% off for new customers" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Type *</label>
                <select value={form.discount_type} onChange={e => set('discount_type', e.target.value)} className={inputCls}>
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed (₦)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Value * {form.discount_type === 'percent' ? '(%)' : '(₦)'}
                </label>
                <input type="number" min="1" value={form.discount_value} onChange={e => set('discount_value', e.target.value)} placeholder={form.discount_type === 'percent' ? '10' : '500'} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Min Order (₦)</label>
                <input type="number" min="0" value={form.min_order} onChange={e => set('min_order', e.target.value)} placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Max Uses</label>
                <input type="number" min="1" value={form.max_uses} onChange={e => set('max_uses', e.target.value)} placeholder="Unlimited" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Expires At</label>
                <input type="datetime-local" value={form.expires_at} onChange={e => set('expires_at', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 text-sm font-semibold hover:bg-stone-50">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 rounded-xl text-white text-sm font-bold disabled:opacity-60">
                {saving ? 'Creating…' : 'Create Code'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {promos.length === 0 ? (
          <div className="py-20 text-center">
            <Tag size={36} className="text-stone-300 mx-auto mb-3" />
            <p className="text-stone-400 text-sm">No promo codes yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  {['Code', 'Discount', 'Min Order', 'Uses', 'Expires', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {promos.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-stone-900 font-mono">{p.code}</p>
                      {p.description && <p className="text-stone-400 text-xs mt-0.5">{p.description}</p>}
                    </td>
                    <td className="px-5 py-4 font-semibold text-amber-700">
                      {p.discount_type === 'percent' ? `${p.discount_value}%` : formatPrice(p.discount_value)}
                    </td>
                    <td className="px-5 py-4 text-stone-600 text-xs">
                      {p.min_order > 0 ? formatPrice(p.min_order) : '—'}
                    </td>
                    <td className="px-5 py-4 text-stone-600 text-xs">
                      {p.used_count}{p.max_uses ? ` / ${p.max_uses}` : ' / ∞'}
                    </td>
                    <td className="px-5 py-4 text-stone-500 text-xs">
                      {p.expires_at ? new Date(p.expires_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(p)} className={`flex items-center gap-1.5 text-xs font-semibold ${p.is_active ? 'text-green-600' : 'text-stone-400'}`}>
                        {p.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        {p.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => deletePromo(p.id)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
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
