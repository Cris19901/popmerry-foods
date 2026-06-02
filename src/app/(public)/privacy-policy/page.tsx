import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PopMerry Foods collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-stone-400 text-sm mb-10">Last updated: June 2025</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">1. Who We Are</h2>
            <p>PopMerry Foods is a food business based in Lagos, Nigeria. We operate the website at <strong>popmerryfoods.com.ng</strong> and deliver handcrafted baked goods and snacks across Southwest Nigeria.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">2. Information We Collect</h2>
            <p>When you place an order, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Delivery address</li>
              <li>Order details and payment reference</li>
            </ul>
            <p className="mt-3">We also collect anonymised usage data via Vercel Analytics and Microsoft Clarity (heatmaps, page views) to improve the site experience.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and deliver your order</li>
              <li>To send you an order confirmation email</li>
              <li>To contact you via WhatsApp or phone about your order</li>
              <li>To improve our website and service</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">4. Payment Security</h2>
            <p>Payments are processed by <strong>Paystack</strong>, a PCI-DSS compliant payment processor. We do not store your card details. All payment data is handled directly by Paystack.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">5. Data Retention</h2>
            <p>We retain your order information for up to 2 years to comply with financial record-keeping requirements. You may request deletion of your data by contacting us.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">6. Your Rights (NDPR)</h2>
            <p>Under the Nigeria Data Protection Regulation (NDPR), you have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">7. Contact</h2>
            <p>For any privacy concerns or data requests, contact us at:</p>
            <p className="mt-2"><strong>Email:</strong> hello@popmerryfoods.com.ng</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/2347039571698" className="text-amber-700 hover:underline">+234 703 957 1698</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
