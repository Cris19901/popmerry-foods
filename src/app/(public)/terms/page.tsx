import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { waLink, CONTACT_PHONE_INTL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for ordering from PopMerry Foods.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Terms & Conditions</h1>
        <p className="text-stone-400 text-sm mb-10">Last updated: June 2025</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">1. Ordering</h2>
            <p>By placing an order on popmerryfoods.com.ng, you confirm that the information provided is accurate and complete. Orders are confirmed once payment is received via Paystack.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">2. Freshness & Quality</h2>
            <p>All products are made fresh on the day of your order. We use premium, locally sourced ingredients. Product images are for illustrative purposes — actual appearance may vary slightly.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">3. Delivery</h2>
            <p>We currently deliver to Lagos Island, Lagos Mainland, Ibadan, Ilorin, Osun, Ogun, Oyo Town, and Ogbomosho. Delivery timelines are estimated and may vary based on traffic and location.</p>
            <p className="mt-2">A flat delivery fee applies. Orders above ₦10,000 qualify for free delivery within Lagos.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">4. Payments</h2>
            <p>All payments are processed securely via Paystack. We do not store card details. Prices are in Nigerian Naira (₦) and are subject to change without notice.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">5. Cancellations</h2>
            <p>Orders may be cancelled within 1 hour of placement by contacting us via WhatsApp. Once production has started, cancellations are not possible. See our <Link href="/refund-policy" className="text-amber-700 hover:underline">Refund Policy</Link> for details.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">6. Allergens</h2>
            <p>Our products are made in a kitchen that handles wheat, eggs, dairy, nuts, and other common allergens. If you have specific dietary requirements, please contact us before ordering.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">7. Contact</h2>
            <p><strong>Email:</strong> hello@popmerryfoods.com.ng</p>
            <p><strong>WhatsApp:</strong> <a href={waLink()} className="text-amber-700 hover:underline">{CONTACT_PHONE_INTL}</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
