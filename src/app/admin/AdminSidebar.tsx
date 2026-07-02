'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ClipboardList, Package, Cake, Image as ImageIcon, Users, Tag, Star, Gift, LogOut, MoreHorizontal, X } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { href: '/admin/custom-orders', label: 'Custom', icon: ClipboardList, exact: false },
  { href: '/admin/custom-cake', label: 'Custom Cake', icon: Cake, exact: false },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon, exact: false },
  { href: '/admin/customers', label: 'Customers', icon: Users, exact: false },
  { href: '/admin/promos', label: 'Promo Codes', icon: Tag, exact: false },
  { href: '/admin/referrals', label: 'Referrals', icon: Gift, exact: false },
  { href: '/admin/reviews', label: 'Reviews', icon: Star, exact: false },
];

// Mobile bottom bar shows 4 primary items; the rest live in a "More" sheet
const BOTTOM_NAV = NAV.slice(0, 4);
const MORE_NAV = NAV.slice(4);

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────── */}
      <aside className="hidden lg:flex w-56 bg-[#1A0800] flex-col min-h-screen sticky top-0">
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-5 py-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-700 text-white rounded-lg flex items-center justify-center font-display font-bold text-sm">PM</span>
              <div>
                <p className="font-display text-sm font-bold text-white leading-tight">PopMerry</p>
                <p className="text-stone-500 text-xs">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map(({ href, label, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(href, exact)
                    ? 'bg-amber-700 text-white'
                    : 'text-stone-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={17} />
              Sign Out
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-xs text-stone-600 hover:text-stone-400 transition-colors"
            >
              ↗ View live site
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar (brand only, no hamburger) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1A0800] border-b border-white/10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-700 text-white rounded-lg flex items-center justify-center font-display font-bold text-sm">PM</span>
          <p className="font-display text-sm font-bold text-white">PopMerry Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-stone-400 hover:text-white p-1 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* ── Mobile "More" sheet ───────────────────────── */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 right-0 bg-[#1A0800] rounded-t-3xl p-5 pb-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-white font-bold">All Sections</p>
              <button onClick={() => setMoreOpen(false)} className="text-stone-400 hover:text-white p-1" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {MORE_NAV.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-semibold text-center transition-colors ${
                      active ? 'bg-amber-700 text-white' : 'bg-white/5 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={22} />
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/"
                target="_blank"
                onClick={() => setMoreOpen(false)}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-semibold text-center bg-white/5 text-stone-300 hover:bg-white/10 transition-colors"
              >
                <span className="text-[22px] leading-none">↗</span>
                Live site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom nav bar ─────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A0800] border-t border-white/10 flex items-stretch">
        {BOTTOM_NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                active ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
            MORE_NAV.some(n => isActive(n.href, n.exact)) ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <MoreHorizontal size={20} />
          More
        </button>
      </nav>
    </>
  );
}
