'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { PortfolioItem } from '@/lib/portfolio';

export default function GalleryClient({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.event_type));
    return ['All', ...Array.from(set)];
  }, [items]);

  const filtered = active === 'All' ? items : items.filter(i => i.event_type === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              active === cat
                ? 'bg-amber-700 text-white shadow-md shadow-amber-200'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400 hover:text-amber-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-ish grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map(item => (
          <button
            key={item.id}
            onClick={() => setLightbox(item)}
            className="block w-full break-inside-avoid rounded-2xl overflow-hidden group relative"
          >
            <Image
              src={item.image_url}
              alt={item.title || 'Custom cake'}
              width={400}
              height={500}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
            {item.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium">{item.title}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <div className="relative max-w-3xl w-full max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <Image
              src={lightbox.image_url}
              alt={lightbox.title || 'Custom cake'}
              width={1000}
              height={1000}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
            {lightbox.title && <p className="text-white text-center mt-3 text-sm">{lightbox.title} · {lightbox.event_type}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
