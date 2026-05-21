'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ClipboardList, Package, LogOut } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: ClipboardList, exact: false },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-56 bg-[#1A0800] flex flex-col min-h-screen sticky top-0">
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
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
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
    </aside>
  );
}
