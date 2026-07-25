import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Clock, Package } from 'lucide-react';
import { getProducts, getProduct, formatPrice } from '@/lib/products-db';
import { productImageUrl } from '@/lib/products-data';
import { FREE_DELIVERY_THRESHOLD } from '@/lib/constants';
import AddToCartButton from './AddToCartButton';
import WaitlistButton from './WaitlistButton';

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
  const canonicalUrl = `https://popmerryfoods.com.ng/products/${id}`;
  const imageUrl = product.imageId
    ? productImageUrl(product.imageId, 'auto=format&fit=crop&w=1200&h=630&q=80')
    : 'https://popmerryfoods.com.ng/og-default.jpg';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'PopMerry Foods',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
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

  const imageUrl = productImageUrl(product.imageId, 'auto=format&fit=crop&w=1200&h=700&q=85');

  const categoryLabel =
    product.category === 'banana-cake' ? 'Banana Cakes'
    : product.category === 'croissant' ? 'Croissants'
    : product.category === 'popcorn' ? 'Popcorn'
    : 'Bundle Deals';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    brand: { '@type': 'Brand', name: 'PopMerry Foods' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'NGN',
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'PopMerry Foods' },
    },
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Hero image */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
        />
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
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
                  { icon: Sparkles, title: 'Premium Quality', body: 'Finest ingredients, zero shortcuts. You taste the difference.' },
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

            {/* WhatsApp share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} from PopMerry Foods 🍰 https://popmerryfoods.com.ng/products/${product.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-700 font-semibold hover:text-green-800 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.002 2C6.477 2 2 6.477 2 12.001c0 1.761.461 3.413 1.27 4.847L2 22l5.315-1.246A9.96 9.96 0 0 0 12.002 22C17.525 22 22 17.523 22 12.001 22 6.477 17.525 2 12.002 2Zm0 18.18a8.147 8.147 0 0 1-4.148-1.134l-.298-.177-3.095.73.754-3.02-.194-.31A8.133 8.133 0 0 1 3.82 12c0-4.513 3.672-8.18 8.18-8.18 4.51 0 8.18 3.667 8.18 8.18 0 4.513-3.67 8.18-8.178 8.18Zm4.48-6.124c-.245-.123-1.452-.716-1.677-.798-.226-.082-.39-.123-.554.123-.164.245-.636.798-.78.962-.143.164-.287.185-.532.062-.245-.123-1.035-.381-1.973-1.218-.729-.65-1.22-1.452-1.363-1.696-.143-.245-.015-.378.107-.5.11-.11.245-.287.368-.43.122-.143.163-.245.245-.41.082-.163.041-.307-.021-.43-.062-.123-.554-1.334-.76-1.826-.2-.48-.402-.414-.554-.422l-.472-.009c-.163 0-.43.062-.655.307-.226.245-.861.841-.861 2.05 0 1.21.88 2.378 1.002 2.541.123.163 1.73 2.645 4.196 3.71.587.253 1.044.404 1.401.517.588.187 1.124.16 1.548.097.472-.07 1.452-.594 1.657-1.167.205-.573.205-1.065.143-1.167-.062-.103-.225-.164-.47-.287Z"/>
              </svg>
              Share on WhatsApp
            </a>
          </div>

          {/* Right — order card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 sticky top-24">
              <p className="text-stone-500 text-sm mb-1">Price</p>
              <p className="font-display text-3xl font-bold text-amber-700 mb-6">
                {formatPrice(product.price)}
              </p>

              <AddToCartButton product={product} />
              {!product.isAvailable && (
                <div className="mt-3">
                  <WaitlistButton productId={product.id} />
                </div>
              )}

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
                    className="relative h-36 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${rel.gradientFrom}, ${rel.gradientTo})` }}
                  >
                    {rel.imageId && (
                      <Image
                        src={productImageUrl(rel.imageId, 'auto=format&fit=crop&w=400&h=200&q=75')}
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    )}
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
