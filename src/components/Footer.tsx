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
              Handcrafted banana cakes, artisan croissants, and freshly popped popcorn made daily. Every bite tells a story of warmth, love, and the very best ingredients.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/2347039571698"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                WhatsApp Us
              </a>
              <a
                href="https://instagram.com/popmerryfoods"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-800 hover:bg-amber-700 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-stone-300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/blog', label: 'Blog' },
                { href: '/products?cat=banana-cake', label: 'Banana Cakes' },
                { href: '/products?cat=croissant', label: 'Croissants' },
                { href: '/products?cat=popcorn', label: 'Popcorn' },
                { href: '/products?cat=bundle', label: 'Bundle Deals' },
                { href: '/custom-order', label: 'Custom Orders' },
                { href: '/track-order', label: 'Track My Order' },
                { href: '/refer', label: 'Refer & Earn' },
                { href: '/catering', label: 'Corporate Catering' },
              ].map(({ href, label }) => (
                <li key={label}>
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
                <a href="mailto:hello@popmerryfoods.com.ng" className="hover:text-amber-400 transition-colors">
                  hello@popmerryfoods.com.ng
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
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">Terms & Conditions</Link>
            <Link href="/refund-policy" className="hover:text-stone-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
