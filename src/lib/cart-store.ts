'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

const CART_EXPIRY_DAYS = 30;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  savedAt?: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      savedAt: Date.now(),

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find(item => item.product.id === product.id);
        if (existing) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
        set({ isOpen: true });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      setItems: (items) => set({ items, savedAt: Date.now() }),
      clearCart: () => set({ items: [], savedAt: Date.now() }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      getCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'popmerry-cart',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const expiredMs = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        if (state.savedAt && Date.now() - state.savedAt > expiredMs) {
          state.items = [];
          state.savedAt = Date.now();
        }
      },
    }
  )
);
