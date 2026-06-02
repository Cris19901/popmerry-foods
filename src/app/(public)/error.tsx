'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-6">😕</p>
      <h1 className="font-display text-3xl font-bold text-white mb-3">Something went wrong</h1>
      <p className="text-white/70 text-base max-w-sm mb-8 leading-relaxed">
        We hit an unexpected error. Try refreshing or head back to the menu.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="bg-white text-amber-700 font-bold px-6 py-3 rounded-full hover:bg-amber-50 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
        >
          Browse Menu <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
