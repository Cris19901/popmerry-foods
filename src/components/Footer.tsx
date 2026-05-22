import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 bg-amber-700 text-white rounded-lg flex items-center justify-center font-display font-bold text-sm flex-shrink-0">PM</span>
              <span className="font-display text-xl font-bold text-amber-400">PopMerry Foods</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Handcrafted banana cakes and artisan croissants made fresh daily. Every bite tells a story of warmth, love, and the very best ingredients.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/2347039571698"
                className="bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Menu</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/products?cat=banana-cake', label: 'Banana Cakes' },
                { href: '/products?cat=croissant', label: 'Croissants' },
                { href: '/products?cat=bundle', label: 'Bundle Deals' },
                { href: '/custom-order', label: 'Custom Orders' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <span className="block text-stone-500 text-xs mb-0.5">Phone / WhatsApp</span>
                <a href="tel:+2347039571698" className="hover:text-amber-400 transition-colors">
                  07039571698
                </a>
              </li>
              <li>
                <span className="block text-stone-500 text-xs mb-0.5">Email</span>
                <a href="mailto:hello@popmerryfoods.com" className="hover:text-amber-400 transition-colors">
                  hello@popmerryfoods.com
                </a>
              </li>
              <li>
                <span className="block text-stone-500 text-xs mb-0.5">Hours</span>
                <span>Mon – Sat: 7am – 7pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} PopMerry Foods. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>and the freshest ingredients.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
