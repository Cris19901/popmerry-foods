import { Suspense } from 'react';
import { getProducts } from '@/lib/products-db';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

function ProductsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-3 mb-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-stone-200 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden border border-amber-100">
            <div className="h-52 bg-stone-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-stone-200 rounded-full w-3/4" />
              <div className="h-4 bg-stone-100 rounded-full w-full" />
              <div className="h-4 bg-stone-100 rounded-full w-2/3" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-stone-200 rounded-full w-20" />
                <div className="h-9 bg-stone-200 rounded-full w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Our Menu — PopMerry Foods',
  description: 'Browse our full range of freshly baked banana cakes, croissants, and bundle deals.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-24 px-4 sm:px-6 text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-4 mt-10">
          Our Menu
        </h1>
        <p className="text-white/80 text-lg max-w-lg mx-auto">
          Every item made fresh. Every bite a moment worth savouring.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsClient products={products} />
        </Suspense>
      </div>
    </div>
  );
}
