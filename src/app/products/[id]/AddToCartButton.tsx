'use client';

import { useState } from 'react';
import { ShoppingCart, Zap, X, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cart-store';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, setItems, items } = useCartStore();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showPrompt, setShowPrompt] = useState(false);

  const increment = () => setQty(q => q + 1);
  const decrement = () => setQty(q => Math.max(1, q - 1));

  const addQty = (clearFirst = false) => {
    if (clearFirst) {
      setItems([{ product, quantity: qty }]);
    } else {
      for (let i = 0; i < qty; i++) addItem(product);
    }
  };

  const handleAddToCart = () => {
    addQty();
    toast.success(`${qty > 1 ? `${qty}× ` : ''}${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (items.length > 0) {
      setShowPrompt(true);
    } else {
      addQty();
      router.push('/checkout');
    }
  };

  const buyJustThis = () => {
    setItems([{ product, quantity: qty }]);
    setShowPrompt(false);
    router.push('/checkout');
  };

  const buyWithCart = () => {
    addQty();
    setShowPrompt(false);
    router.push('/checkout');
  };

  if (!product.isAvailable) {
    return (
      <button disabled className="w-full bg-stone-200 text-stone-400 font-bold py-3.5 rounded-full cursor-not-allowed text-sm">
        Currently Unavailable
      </button>
    );
  }

  return (
    <>
      {/* Quantity selector */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-stone-600">Quantity</span>
        <div className="flex items-center gap-3 bg-stone-100 rounded-full px-2 py-1">
          <button
            onClick={decrement}
            disabled={qty === 1}
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center font-bold text-stone-900 text-sm">{qty}</span>
          <button
            onClick={increment}
            className="w-7 h-7 rounded-full flex items-center justify-center text-amber-700 hover:bg-white hover:shadow-sm transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleBuyNow}
          className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 active:translate-y-0 text-sm"
        >
          <Zap size={17} />
          Buy Now
        </button>

        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 border-2 border-amber-700 text-amber-700 hover:bg-amber-50 font-bold py-3.5 rounded-full transition-all text-sm"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>
      </div>

      {/* Prompt modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={() => setShowPrompt(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
            <button onClick={() => setShowPrompt(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 transition-colors">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-stone-900 mb-1">You have items in your cart</h3>
            <p className="text-stone-500 text-sm mb-6">What would you like to do with your existing cart?</p>
            <div className="space-y-3">
              <button onClick={buyJustThis} className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm">
                Checkout just this item{qty > 1 ? ` (×${qty})` : ''}
              </button>
              <button onClick={buyWithCart} className="w-full border-2 border-amber-700 text-amber-700 hover:bg-amber-50 font-bold py-3.5 rounded-2xl transition-colors text-sm">
                Add to cart &amp; checkout everything
              </button>
              <button onClick={() => setShowPrompt(false)} className="w-full text-stone-400 hover:text-stone-600 font-medium py-2 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
