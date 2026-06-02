import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { posts } from './posts';

export const metadata: Metadata = {
  title: 'Blog — Recipes, Tips & Stories',
  description: 'Baking tips, recipe ideas, event planning guides, and stories from the PopMerry Foods kitchen.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="hero-gradient py-24 px-4 text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-4 mt-10">From Our Kitchen</h1>
        <p className="text-white/80 text-lg max-w-lg mx-auto">Recipes, baking tips, event guides, and stories from the PopMerry team.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">{post.category}</span>
                <h2 className="font-display text-xl font-bold text-stone-900 mt-1 mb-2 leading-tight group-hover:text-amber-700 transition-colors">{post.title}</h2>
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                <p className="text-stone-400 text-xs mt-3">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
