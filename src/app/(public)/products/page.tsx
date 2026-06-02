import { Suspense } from 'react';
import { getProducts } from '@/lib/products-db';
import ProductsClient from './ProductsClient';

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
        <Suspense fallback={<div className="text-center py-20 text-stone-400">Loading…</div>}>
          <ProductsClient products={products} />
        </Suspense>
      </div>
    </div>
  );
}
