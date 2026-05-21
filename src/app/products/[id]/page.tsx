import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Clock, Package } from 'lucide-react';
import { getProducts, getProduct, formatPrice } from '@/lib/products-db';
import { FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import AddToCartButton from './AddToCartButton';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  const title = `${product.name} — PopMerry Foods`;
  const description = product.description;
  const imageUrl = `https://images.unsplash.com/photo-${product.imageId}?auto=format&fit=crop&w=1200&h=630&q=80`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const [product, allProducts] = await Promise.all([getProduct(id), getProducts()]);
  if (!product) notFound();

  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const imageUrl = `https://images.unsplash.com/photo-${product.imageId}?auto=format&fit=crop&w=1200&h=700&q=85`;

  const categoryLabel =
    product.category === 'banana-cake' ? 'Banana Cakes'
    : product.category === 'croissant' ? 'Croissants'
    : 'Bundle Deals';

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      {/* Hero image */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
        />
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0800]/70 via-transparent to-[#1A0800]/30" />

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 pt-24 px-4 sm:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            {product.tag && (
              <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {product.tag}
              </span>
            )}
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-white/70 text-sm mt-2">{categoryLabel}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Left — details */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-bold text-stone-900 mb-3">About this item</h2>
              <p className="text-stone-600 leading-relaxed text-base">{product.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="font-display text-xl font-bold text-stone-900 mb-4">Why you'll love it</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Clock, title: 'Baked Fresh', body: 'Made the morning of your order — never a day old.' },
                  { icon: Star, title: 'Premium Quality', body: 'Finest ingredients, zero shortcuts. You taste the difference.' },
                  { icon: Package, title: 'Safe Packaging', body: 'Arrives warm, intact, and exactly as it left our kitchen.' },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="bg-white rounded-2xl p-4 border border-amber-100">
                    <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                      <Icon size={18} className="text-amber-700" />
                    </div>
                    <p className="font-semibold text-stone-800 text-sm mb-1">{title}</p>
                    <p className="text-stone-500 text-xs leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className={product.isAvailable ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                {product.isAvailable ? 'In stock — ready to order' : 'Currently unavailable'}
              </span>
            </div>
          </div>

          {/* Right — order card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 sticky top-24">
              <p className="text-stone-500 text-sm mb-1">Price</p>
              <p className="font-display text-3xl font-bold text-amber-700 mb-6">
                {formatPrice(product.price)}
              </p>

              <AddToCartButton product={product} />

              <div className="mt-4 pt-4 border-t border-amber-50 text-center">
                <p className="text-stone-400 text-xs">Free delivery on orders over {formatPrice(FREE_DELIVERY_THRESHOLD)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-amber-100 hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-36 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${rel.gradientFrom}, ${rel.gradientTo})` }}
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${rel.imageId}?auto=format&fit=crop&w=400&h=200&q=75`}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-stone-900 text-sm leading-tight">{rel.name}</p>
                    <p className="text-amber-700 font-bold text-sm mt-1">{formatPrice(rel.price)}</p>
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
