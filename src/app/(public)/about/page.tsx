import Link from 'next/link';
import { ArrowRight, Heart, Flame, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The story behind PopMerry Foods — handcrafted cakes, croissants and popcorn made with love in Lagos.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <section className="hero-gradient py-32 px-4 text-center">
        <span className="inline-block text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4">Our Story</span>
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-5 leading-tight">
          Made with Love,<br />
          <span className="text-warm-gold italic">Baked with Purpose</span>
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
          PopMerry Foods started with one mission — to bring the warmth of a real home kitchen to every doorstep across Nigeria.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-8 text-stone-700 text-lg leading-relaxed">
          <p>
            We believe food is more than fuel — it&apos;s memory, celebration, and comfort. Every banana cake we bake, every croissant we fold, every bag of popcorn we pop is made with this in mind.
          </p>
          <p>
            PopMerry Foods was born in Lagos out of a passion for craft and a gap in the market for truly premium baked goods that didn&apos;t compromise on quality. We source the finest ingredients, refuse shortcuts, and bake everything fresh on the morning of your delivery.
          </p>
          <p>
            Today, we deliver across Lagos, Ibadan, Ilorin, Osun, Ogun, Oyo Town, and Ogbomosho — but the spirit hasn&apos;t changed. Every order is personal to us.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-stone-900 text-center mb-14">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Flame,
                title: 'Always Fresh',
                body: 'Nothing leaves our kitchen more than a few hours old. If you order it today, we bake it today.',
                color: 'bg-amber-50 text-amber-700',
              },
              {
                icon: Sparkles,
                title: 'No Compromise',
                body: 'We use real butter, real eggs, real chocolate. We will never swap quality for margin.',
                color: 'bg-amber-50 text-amber-700',
              },
              {
                icon: Heart,
                title: 'Made with Love',
                body: 'Every item we make is something we\'d be proud to eat ourselves. That\'s the only standard we know.',
                color: 'bg-amber-50 text-amber-700',
              },
            ].map(({ icon: Icon, title, body, color }) => (
              <div key={title} className="text-center">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-stone-900 mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-display text-4xl font-bold text-stone-900 mb-5">Ready to taste the difference?</h2>
        <p className="text-stone-500 text-lg max-w-md mx-auto mb-8">
          Browse our menu and experience what fresh, made-with-love really means.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5"
        >
          Shop Now <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
