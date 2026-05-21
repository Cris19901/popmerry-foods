'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/products-data';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.isAvailable) return;
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const imageUrl = `https://images.unsplash.com/photo-${product.imageId}?auto=format&fit=crop&w=400&h=300&q=80`;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-amber-100 card-hover flex flex-col">
      {/* Clickable image → product detail */}
      <Link href={`/products/${product.id}`} className="block">
        <div
          className="relative h-52 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {product.tag && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.tag}
            </span>
          )}

          {!product.isAvailable && (
            <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
              <span className="bg-white text-stone-700 text-sm font-semibold px-4 py-2 rounded-full">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/products/${product.id}`} className="block mb-1.5">
          <h3 className="font-display text-lg font-bold text-stone-900 leading-tight hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-display text-xl font-bold text-amber-700">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
              product.isAvailable
                ? 'bg-amber-700 hover:bg-amber-800 text-white hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Plus size={16} strokeWidth={2.5} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
