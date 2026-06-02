import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { posts } from './posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — PopMerry Foods',
  description: 'Recipes, baking tips, event planning guides and product news from PopMerry Foods.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <section className="hero-gradient py-28 px-4 text-center">
        <span className="inline-block text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Fresh from the kitchen</span>
        <h1 className="font-display text-5xl font-bold text-white mb-3">The PopMerry Blog</h1>
        <p className="text-white/80 text-lg max-w-md mx-auto">Recipes, baking tips, event planning guides and more.</p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl border border-amber-100 p-6 hover:shadow-md transition-shadow"
            >
              <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-3">
                {post.category}
              </span>
              <h2 className="font-display text-xl font-bold text-stone-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>{new Date(post.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>{post.readMins} min read</span>
              </div>
              <div className="flex items-center gap-1 text-amber-700 text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                Read more <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
