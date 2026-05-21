'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

interface Props {
  product?: Product;
  onClose: () => void;
}

const CATEGORIES = [
  { value: 'banana-cake', label: 'Banana Cake' },
  { value: 'croissant', label: 'Croissant' },
  { value: 'bundle', label: 'Bundle' },
] as const;

export default function ProductFormModal({ product, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    id: product?.id ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    category: product?.category ?? 'banana-cake',
    imageId: product?.imageId ?? '',
    tag: product?.tag ?? '',
    gradientFrom: product?.gradientFrom ?? '#5C1E00',
    gradientTo: product?.gradientTo ?? '#C27A1A',
    isAvailable: product?.isAvailable ?? true,
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: parseInt(form.price, 10),
      tag: form.tag || undefined,
    };

    const url = isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(isEdit ? 'Product updated' : 'Product created');
      router.refresh();
      onClose();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? 'Failed to save product');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="font-display text-lg font-bold text-stone-900">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isEdit && (
            <Field label="Product ID" hint="e.g. bc-lemon — lowercase, hyphens only">
              <input
                required
                value={form.id}
                onChange={e => set('id', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="bc-lemon"
                className={inputCls}
              />
            </Field>
          )}

          <Field label="Name">
            <input
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Classic Banana Cake"
              className={inputCls}
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Mouth-watering description…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₦)">
              <input
                required
                type="number"
                min={1}
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="3500"
                className={inputCls}
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Unsplash Image ID" hint="e.g. 1569762404472-026308ba6b64">
            <input
              value={form.imageId}
              onChange={e => set('imageId', e.target.value)}
              placeholder="1569762404472-026308ba6b64"
              className={inputCls}
            />
          </Field>

          <Field label="Tag (optional)" hint="e.g. Bestseller, New, Premium">
            <input
              value={form.tag}
              onChange={e => set('tag', e.target.value)}
              placeholder="Bestseller"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Gradient From">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.gradientFrom}
                  onChange={e => set('gradientFrom', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5"
                />
                <input
                  value={form.gradientFrom}
                  onChange={e => set('gradientFrom', e.target.value)}
                  className={`${inputCls} flex-1`}
                />
              </div>
            </Field>
            <Field label="Gradient To">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.gradientTo}
                  onChange={e => set('gradientTo', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5"
                />
                <input
                  value={form.gradientTo}
                  onChange={e => set('gradientTo', e.target.value)}
                  className={`${inputCls} flex-1`}
                />
              </div>
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('isAvailable', !form.isAvailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isAvailable ? 'bg-amber-700' : 'bg-stone-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-stone-700">
              {form.isAvailable ? 'Available for purchase' : 'Unavailable (hidden from customers)'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
        {label}
        {hint && <span className="ml-1.5 text-stone-400 normal-case font-normal tracking-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500';
