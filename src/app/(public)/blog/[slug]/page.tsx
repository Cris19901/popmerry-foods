import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { posts } from '../posts';
import type { Metadata } from 'next';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://popmerryfoods.com.ng/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      siteName: 'PopMerry Foods',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
  if (!post) notFound();

  const related = posts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <section className="hero-gradient py-28 px-4 text-center">
        <span className="inline-block text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">{post.category}</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
          <span>{new Date(post.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readMins} min read</span>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <Link href="/blog" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-10 text-sm font-medium">
          <ArrowLeft size={16} /> All posts
        </Link>

        <div
          className="prose prose-stone prose-lg max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-stone-900
            prose-p:text-stone-600 prose-p:leading-relaxed
            prose-a:text-amber-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-ul:text-stone-600 prose-li:my-1
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-14 bg-amber-700 rounded-3xl p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white mb-2">Ready to order?</h3>
          <p className="text-amber-100 text-sm mb-5">Fresh baked. Same-day delivery across Lagos, Ibadan, Ilorin and more.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-amber-700 font-bold px-6 py-3 rounded-full hover:bg-amber-50 transition-colors text-sm">
            Browse the Menu <ArrowLeft size={15} className="rotate-180" />
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-5">More from the blog</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group bg-white rounded-2xl border border-amber-100 p-5 hover:shadow-sm transition-shadow">
                  <span className="text-xs font-bold text-amber-700">{r.category}</span>
                  <h4 className="font-semibold text-stone-900 text-sm mt-1 leading-snug group-hover:text-amber-700 transition-colors">{r.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
