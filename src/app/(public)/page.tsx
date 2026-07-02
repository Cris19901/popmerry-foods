import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Clock, Star, Package, Flame, Heart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import NewsletterForm from '@/components/NewsletterForm';
import { getProducts } from '@/lib/products-db';

const FEATURED_IDS = ['bc-classic', 'cr-butter', 'pc-classic', 'bn-morning'];

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: 'PopMerry Foods',
  description: 'Handcrafted banana cakes, artisan croissants, and freshly popped popcorn made daily in Lagos.',
  url: 'https://popmerryfoods.com.ng',
  telephone: '+2347039571698',
  email: 'hello@popmerryfoods.com.ng',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressRegion: 'Lagos State',
    addressCountry: 'NG',
  },
  areaServed: [
    'Lagos Island', 'Lagos Mainland', 'Ibadan', 'Ilorin',
    'Osun', 'Ogun', 'Oyo Town', 'Ogbomosho',
  ],
  servesCuisine: ['Baked Goods', 'Cakes', 'Croissants', 'Popcorn'],
  openingHours: 'Mo-Sa 07:00-19:00',
  priceRange: '₦₦',
  sameAs: ['https://instagram.com/popmerryfoods'],
};

export default async function HomePage() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts
    .filter(p => FEATURED_IDS.includes(p.id))
    .sort((a, b) => FEATURED_IDS.indexOf(a.id) - FEATURED_IDS.indexOf(b.id));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-orange-900/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center mt-16 sm:mt-0">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Sparkles size={14} className="text-warm-gold" />
            Fresh from our kitchen every morning
            <Sparkles size={14} className="text-warm-gold" />
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            Life Tastes Better
            <br />
            <span className="text-warm-gold italic">with PopMerry</span>
          </h1>

          <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Handcrafted banana cakes, artisan croissants, and freshly popped popcorn — made with the finest ingredients, crafted with love, delivered warm to your door.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-amber-700 font-bold px-8 py-4 rounded-full hover:bg-amber-50 transition-all hover:shadow-xl hover:-translate-y-1 text-base"
            >
              View Our Menu
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/custom-order"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all text-base"
            >
              Custom Orders
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ─── DELIVERY ZONES ───────────────────────────────────── */}
      <section className="bg-amber-700 py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          <span className="text-amber-100 text-xs font-semibold uppercase tracking-widest flex-shrink-0">We deliver to</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Lagos Island', 'Lagos Mainland', 'Ibadan', 'Ilorin', 'Osun', 'Ogun', 'Oyo Town', 'Ogbomosho'].map(zone => (
              <span key={zone} className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {zone}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─────────────────────────────────────── */}
      <section className="bg-white border-y border-amber-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Flame, title: 'Baked Fresh Daily', subtitle: 'Ready by 7am every day' },
              { icon: Sparkles, title: 'Premium Ingredients', subtitle: 'No shortcuts, ever' },
              { icon: Package, title: 'Careful Packaging', subtitle: 'Arrives warm and perfect' },
              { icon: Heart, title: 'Made with Love', subtitle: 'You can taste the difference' },
            ].map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <Icon size={22} className="text-amber-600" />
                </div>
                <p className="font-semibold text-stone-800 text-sm">{title}</p>
                <p className="text-stone-500 text-xs">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Customer Favourites
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
              So Good, They&apos;re Always
              <br />
              <span className="text-gradient-gold italic">Selling Out</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-1"
            >
              See Full Menu
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#1A0800]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple as 1-2-3</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Order', body: 'Pick your favourites from our menu and checkout securely with Paystack in under 2 minutes.', icon: '🛒' },
              { step: '02', title: 'We Bake Fresh', body: 'Your order triggers our bakers. Everything is made fresh the morning of your delivery — never pre-made.', icon: '👨‍🍳' },
              { step: '03', title: 'Delivered Warm', body: 'We deliver straight to your door across Lagos, Ibadan, Ilorin and more. Arrive warm, leave happy.', icon: '🚀' },
            ].map(({ step, title, body, icon }) => (
              <div key={step} className="relative text-center">
                <div className="text-5xl mb-4">{icon}</div>
                <span className="text-amber-700/50 font-display text-6xl font-bold absolute -top-2 left-1/2 -translate-x-1/2 select-none pointer-events-none">
                  {step}
                </span>
                <h3 className="font-display text-xl font-bold text-white mb-2 relative">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed relative">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">
              Three Obsessions,
              <br />
              <span className="text-gradient-gold italic">Endless Possibilities</span>
            </h2>
            <p className="text-stone-500 mt-4 max-w-md mx-auto">
              Every variant is crafted to give you a completely new experience. Same love, different delight.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Banana Cakes */}
            <Link
              href="/products?cat=banana-cake"
              className="group relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col justify-end min-h-64 cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1569762404472-026308ba6b64?auto=format&fit=crop&w=800&h=500&q=80"
                alt="Banana Cakes"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0800]/90 via-[#5C1E00]/50 to-transparent" />
              <div className="relative z-10">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  6 Flavours
                </span>
                <h3 className="font-display text-3xl font-bold text-white mb-1">Banana Cakes</h3>
                <p className="text-white/80 text-sm">Classic to premium — every one is moist, golden, and irresistible.</p>
                <div className="flex items-center gap-1 text-white font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  Shop now <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Croissants */}
            <Link
              href="/products?cat=croissant"
              className="group relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col justify-end min-h-64 cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&h=500&q=80"
                alt="Croissants"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0800]/90 via-[#7C2D12]/50 to-transparent" />
              <div className="relative z-10">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  6 Varieties
                </span>
                <h3 className="font-display text-3xl font-bold text-white mb-1">Croissants</h3>
                <p className="text-white/80 text-sm">Buttery, flaky, and filled with your favourite things.</p>
                <div className="flex items-center gap-1 text-white font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  Shop now <ArrowRight size={16} />
                </div>
              </div>
            </Link>

            {/* Popcorn */}
            <Link
              href="/products?cat=popcorn"
              className="group relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col justify-end min-h-64 cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1523207911345-32501502db22?auto=format&fit=crop&w=800&h=500&q=80"
                alt="Popcorn"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D1A00]/90 via-[#6B3A0A]/50 to-transparent" />
              <div className="relative z-10">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  3 Flavours
                </span>
                <h3 className="font-display text-3xl font-bold text-white mb-1">Popcorn</h3>
                <p className="text-white/80 text-sm">Salted, caramel, spicy — freshly popped and impossible to put down.</p>
                <div className="flex items-center gap-1 text-white font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  Shop now <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CUSTOM ORDERS CTA ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-[#1A0800]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-amber-700" />
            <Sparkles size={20} className="text-warm-gold" />
            <div className="h-px w-12 bg-amber-700" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Planning a Celebration?
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            Birthdays, weddings, baby showers, corporate events — build your dream cake online, pick your flavours and finishes, and see your price instantly.
          </p>
          <Link
            href="/custom-order"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-amber-900/50 hover:-translate-y-1 text-base"
          >
            Build Your Custom Cake
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-amber-700">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Get Early Access & Offers
          </h2>
          <p className="text-amber-100 text-sm mb-6 leading-relaxed">
            Be the first to hear about new flavours, seasonal specials, and exclusive discounts.
          </p>
          <NewsletterForm />
          <p className="text-amber-200/70 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <div id="reviews">
        <Testimonials />
      </div>
    </>
  );
}
