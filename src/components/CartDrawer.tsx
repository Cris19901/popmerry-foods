'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/products-data';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, calcDeliveryFee } from '@/lib/constants';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const subtotal = getTotal();
  const delivery = subtotal > 0 ? calcDeliveryFee(subtotal) : 0;
  const total = subtotal + delivery;
  const freeDeliveryLeft = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-600" />
            <h2 className="font-display text-lg font-bold text-stone-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-amber-200" />
              <div>
                <p className="font-display text-lg font-bold text-stone-800">Your cart is empty</p>
                <p className="text-stone-500 text-sm mt-1">Add something delicious to get started!</p>
              </div>
              <button
                onClick={closeCart}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex items-start gap-3 bg-amber-50 rounded-2xl p-3.5">
                {/* Product thumbnail */}
                <div
                  className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${item.product.gradientFrom}, ${item.product.gradientTo})`,
                  }}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${item.product.imageId}?auto=format&fit=crop&w=56&h=56&q=80`}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm leading-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="text-amber-600 font-bold text-sm mt-0.5">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-white rounded-full border border-stone-200">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 rounded-full hover:bg-amber-50 text-amber-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals */}
        {items.length > 0 && (
          <div className="border-t border-amber-100 px-5 py-5 space-y-3">
            {/* Free delivery progress */}
            {freeDeliveryLeft > 0 ? (
              <div className="bg-amber-50 rounded-xl px-3 py-2.5">
                <p className="text-xs text-amber-700 mb-1.5">
                  Add <span className="font-bold">{formatPrice(freeDeliveryLeft)}</span> more for free delivery
                </p>
                <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${freeDeliveryProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl px-3 py-2 text-center">
                <p className="text-xs text-green-700 font-semibold">🎉 You've unlocked free delivery!</p>
              </div>
            )}

            <div className="flex justify-between text-sm text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600">
              <span>Delivery fee</span>
              <span className={`font-semibold ${delivery === 0 ? 'text-green-600 line-through' : ''}`}>
                {formatPrice(DELIVERY_FEE)}
              </span>
              {delivery === 0 && <span className="font-semibold text-green-600 ml-1">Free</span>}
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 border-t border-amber-100 pt-3">
              <span>Total</span>
              <span className="text-amber-700 text-lg">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white text-center py-3.5 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-amber-200 mt-2"
            >
              Proceed to Checkout →
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-stone-500 hover:text-stone-700 text-sm py-1 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
