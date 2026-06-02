import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { posts } from '../posts';

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
      images: [{ url: post.image, width: 800, height: 500 }],
      type: 'article',
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
      <div className="relative w-full h-[45vh] overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0800]/80 via-[#1A0800]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-3xl mx-auto">
          <span className="inline-block text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">{post.category}</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">{post.title}</h1>
          <p className="text-white/60 text-sm mt-2">{post.date}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> All Posts
        </Link>

        <div className="prose prose-stone prose-lg max-w-none
          prose-headings:font-display prose-headings:text-stone-900
          prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-stone-900">
          {post.content.split('\n\n').map((block, i) => {
            if (block.startsWith('## ')) {
              return <h2 key={i} className="font-display text-2xl font-bold text-stone-900 mt-8 mb-3">{block.slice(3)}</h2>;
            }
            if (block.startsWith('**') && block.includes('**:')) {
              const [bold, ...rest] = block.split('**:');
              return <p key={i} className="text-stone-600 leading-relaxed mb-4"><strong className="text-stone-800">{bold.slice(2)}:</strong>{rest.join('')}</p>;
            }
            if (block.startsWith('- ')) {
              return (
                <ul key={i} className="list-disc pl-6 space-y-1 mb-4">
                  {block.split('\n').map((li, j) => (
                    <li key={j} className="text-stone-600 text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: li.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                  ))}
                </ul>
              );
            }
            if (block === '---') return <hr key={i} className="border-stone-200 my-8" />;
            if (block.startsWith('[') && block.includes('](')) {
              const match = block.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                return (
                  <div key={i} className="mt-6">
                    <Link href={match[2]} className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-3 rounded-full transition-colors">
                      {match[1]}
                    </Link>
                  </div>
                );
              }
            }
            return <p key={i} className="text-stone-600 text-base leading-relaxed mb-4">{block}</p>;
          })}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-stone-200">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">More from the Blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-amber-100 hover:shadow-md transition-shadow">
                  <div className="relative h-36 overflow-hidden">
                    <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">{r.category}</span>
                    <h3 className="font-display text-base font-bold text-stone-900 mt-1 group-hover:text-amber-700 transition-colors leading-tight">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
