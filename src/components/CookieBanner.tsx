'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900 border-t border-stone-800 px-4 py-4 sm:py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="text-stone-300 text-sm flex-1 leading-relaxed">
          We use cookies to improve your experience and analyse site traffic.
          By continuing, you agree to our{' '}
          <Link href="/privacy-policy" className="underline text-amber-400 hover:text-amber-300">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={accept}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            Accept
          </button>
          <button
            onClick={accept}
            className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
