import { getPortfolio } from '@/lib/portfolio';
import GalleryClient from './GalleryClient';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work — Custom Cake Gallery',
  description: 'Browse real custom cakes, croissants and celebration bakes made by PopMerry Foods for birthdays, weddings and events.',
};

export default async function GalleryPage() {
  const items = await getPortfolio(true);

  return (
    <div className="min-h-screen bg-amber-50">
      <section className="hero-gradient py-28 px-4 text-center">
        <span className="inline-block text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Our Work</span>
        <h1 className="font-display text-5xl font-bold text-white mb-3">Cakes We&apos;ve Made</h1>
        <p className="text-white/80 text-lg max-w-md mx-auto">
          Real cakes for real celebrations. Yours could be next.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg mb-6">Our gallery is coming soon — but we&apos;d love to bake for you.</p>
            <Link href="/custom-order" className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-3 rounded-full transition-colors">
              Build Your Cake <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <GalleryClient items={items} />
        )}
      </div>

      {items.length > 0 && (
        <section className="py-16 px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-stone-900 mb-4">Love what you see?</h2>
          <Link href="/custom-order" className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-4 rounded-full transition-all hover:-translate-y-0.5">
            Build Your Custom Cake <ArrowRight size={18} />
          </Link>
        </section>
      )}
    </div>
  );
}
