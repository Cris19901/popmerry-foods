'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ClipboardList, Package, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { href: '/admin/custom-orders', label: 'Custom Orders', icon: ClipboardList, exact: false },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
];

function NavLinks({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <>
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-700 text-white rounded-lg flex items-center justify-center font-display font-bold text-sm">PM</span>
          <div>
            <p className="font-display text-sm font-bold text-white leading-tight">PopMerry</p>
            <p className="text-stone-500 text-xs">Admin Panel</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-stone-500 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLinks pathname={pathname} onNav={() => setOpen(false)} />
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
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-[#1A0800] flex-col min-h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1A0800] border-b border-white/10 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-700 text-white rounded-lg flex items-center justify-center font-display font-bold text-sm">PM</span>
          <p className="font-display text-sm font-bold text-white">PopMerry Admin</p>
        </div>
        <button onClick={() => setOpen(true)} className="text-stone-400 hover:text-white p-1">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-[#1A0800] flex flex-col h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
