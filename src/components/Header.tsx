'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, getCount } = useCartStore();
  const cartCount = getCount();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 bg-amber-700 text-white rounded-lg flex items-center justify-center font-display font-bold text-sm flex-shrink-0 group-hover:bg-amber-600 transition-colors">PM</span>
            <span
              className={`font-display text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                scrolled ? 'text-stone-900' : 'text-white drop-shadow'
              }`}
            >
              PopMerry Foods
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/products', label: 'Our Menu' },
              { href: '/custom-order', label: 'Custom Orders' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold transition-colors hover:text-amber-500 ${
                  scrolled ? 'text-stone-700' : 'text-white/90 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className={`relative p-2.5 rounded-full transition-colors ${
                scrolled ? 'text-stone-700 hover:bg-amber-50' : 'text-white hover:bg-white/15'
              }`}
            >
              <ShoppingCart size={22} strokeWidth={2} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* CTA button */}
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200"
            >
              Order Now
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-stone-700' : 'text-white'
              }`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-4 py-5 shadow-lg">
          <nav className="flex flex-col gap-4">
            <Link
              href="/products"
              className="text-stone-800 font-semibold text-base py-1"
              onClick={() => setMobileOpen(false)}
            >
              Our Menu
            </Link>
            <Link
              href="/custom-order"
              className="text-stone-800 font-semibold text-base py-1"
              onClick={() => setMobileOpen(false)}
            >
              Custom Orders
            </Link>
            <Link
              href="/products"
              className="bg-amber-500 hover:bg-amber-600 text-white text-center py-3 rounded-full font-semibold transition-colors mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
