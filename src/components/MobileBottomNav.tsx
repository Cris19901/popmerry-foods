'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, Cake, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

const LINKS = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/products', label: 'Menu', icon: UtensilsCrossed, exact: false },
  { href: '/custom-order', label: 'Custom', icon: Cake, exact: false },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, getCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const count = getCount();

  useEffect(() => setMounted(true), []);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-amber-100 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] flex items-stretch">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
              active ? 'text-amber-700' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
            {label}
          </Link>
        );
      })}

      {/* Cart — opens the drawer */}
      <button
        onClick={openCart}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold text-stone-400 hover:text-stone-600 transition-colors relative"
      >
        <span className="relative">
          <ShoppingBag size={21} strokeWidth={1.8} />
          {mounted && count > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </span>
        Cart
      </button>
    </nav>
  );
}
