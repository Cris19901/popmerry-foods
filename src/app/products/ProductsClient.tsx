'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import type { Product, ProductCategory } from '@/types';

const CATEGORIES: { value: 'all' | ProductCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'banana-cake', label: 'Banana Cakes' },
  { value: 'croissant', label: 'Croissants' },
  { value: 'bundle', label: 'Bundle Deals' },
];

export default function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') as ProductCategory | null;
  const [active, setActive] = useState<'all' | ProductCategory>(initialCat ?? 'all');

  const filtered = useMemo(
    () => (active === 'all' ? products : products.filter(p => p.category === active)),
    [active, products]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              active === value
                ? 'bg-amber-700 text-white shadow-md shadow-amber-200'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400 hover:text-amber-700'
            }`}
          >
            {label}
            <span className={`text-xs ${active === value ? 'text-amber-100' : 'text-stone-400'}`}>
              ({value === 'all' ? products.length : products.filter(p => p.category === value).length})
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg font-medium">No products in this category yet.</p>
        </div>
      )}
    </div>
  );
}
