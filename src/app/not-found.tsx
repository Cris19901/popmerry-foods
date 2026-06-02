import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-4 text-center">
      <p className="text-amber-400 font-display font-bold text-8xl mb-4 opacity-40">404</p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
        This page doesn&apos;t exist
      </h1>
      <p className="text-white/70 text-lg max-w-md mb-10 leading-relaxed">
        Looks like you wandered off the menu. Let&apos;s get you back to the good stuff.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 font-bold px-8 py-4 rounded-full hover:bg-amber-50 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          Browse Our Menu <ArrowRight size={18} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
