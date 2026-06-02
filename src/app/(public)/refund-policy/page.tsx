import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'PopMerry Foods refund and returns policy.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Refund Policy</h1>
        <p className="text-stone-400 text-sm mb-10">Last updated: June 2025</p>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">Our Commitment</h2>
            <p>At PopMerry Foods, we take pride in every item we make. If something is wrong with your order, we will make it right.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">When You Qualify for a Refund</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Wrong item received</strong> — we sent you something different from what you ordered</li>
              <li><strong>Quality issue</strong> — item arrived damaged, spoiled, or not as described</li>
              <li><strong>Non-delivery</strong> — your order was confirmed and paid for but never arrived</li>
              <li><strong>Cancellation within 1 hour</strong> — before production has started</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">When Refunds Do Not Apply</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Change of mind after production has started</li>
              <li>Incorrect delivery address provided at checkout</li>
              <li>Products that have been consumed or partially consumed</li>
              <li>Requests made more than 24 hours after delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">How to Request a Refund</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Contact us via WhatsApp or email within <strong>24 hours</strong> of receiving your order</li>
              <li>Describe the issue and include a photo where possible</li>
              <li>We will review and respond within 2 business hours</li>
              <li>Approved refunds are processed within 3–5 business days to the original payment method</li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-3">Contact Us</h2>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/2347039571698" className="text-amber-700 hover:underline">+234 703 957 1698</a></p>
            <p><strong>Email:</strong> hello@popmerryfoods.com.ng</p>
          </section>
        </div>
      </div>
    </div>
  );
}
