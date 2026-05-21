'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductFormModal from './ProductFormModal';
import AvailabilityToggle from './AvailabilityToggle';
import { formatPrice } from '@/lib/products-data';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  dbReady: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  'banana-cake': 'Banana Cake',
  croissant: 'Croissant',
  bundle: 'Bundle',
};

export default function ProductsAdminClient({ products, dbReady }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<'add' | Product | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed' }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      toast.success(`Seeded ${data.seeded} products`);
      router.refresh();
    } else {
      toast.error(data.error ?? 'Seed failed');
    }
    setSeeding(false);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Product deleted');
      router.refresh();
    } else {
      toast.error('Failed to delete');
    }
    setDeletingId(null);
  };

  return (
    <>
      {/* Setup banner */}
      {!dbReady && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Database size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Database table not found</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Run <code className="bg-amber-100 px-1.5 py-0.5 rounded">supabase/products-migration.sql</code> in your Supabase SQL editor to enable product management.
            </p>
          </div>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Products</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {products.length} products
            {!dbReady && ' · showing static data · '}
            {dbReady && products.length === 0 && ' · '}
            {dbReady && products.length === 0 && (
              <button onClick={handleSeed} disabled={seeding} className="text-amber-700 font-semibold underline">
                {seeding ? 'Seeding…' : 'Seed from code'}
              </button>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dbReady && products.length > 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="text-xs text-stone-500 hover:text-stone-800 border border-stone-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {seeding ? 'Syncing…' : 'Re-seed from code'}
            </button>
          )}
          {dbReady && (
            <button
              onClick={() => setModal('add')}
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              <Plus size={15} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {['Product', 'Category', 'Price', 'Tag', 'Available', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
                    >
                      {product.imageId && (
                        <img
                          src={`https://images.unsplash.com/photo-${product.imageId}?auto=format&fit=crop&w=40&h=40&q=70`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 leading-tight">{product.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-stone-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-5 py-4">
                  {product.tag ? (
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                      {product.tag}
                    </span>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <AvailabilityToggle productId={product.id} isAvailable={product.isAvailable} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    {dbReady && (
                      <>
                        <button
                          onClick={() => setModal(product)}
                          className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && dbReady && (
          <div className="py-16 text-center text-stone-400">
            <p className="text-sm">No products yet.</p>
            <button onClick={handleSeed} className="mt-2 text-amber-700 font-semibold text-sm underline">
              Seed from code defaults
            </button>
          </div>
        )}
      </div>

      {modal && (
        <ProductFormModal
          product={modal === 'add' ? undefined : modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
