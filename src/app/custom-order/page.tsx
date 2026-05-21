'use client';

import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CustomOrderRequest } from '@/types';

const EVENT_TYPES = [
  'Birthday', 'Wedding', 'Baby Shower', 'Corporate Event',
  'Anniversary', 'Graduation', 'Christmas / Holiday', 'Other',
];

export default function CustomOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CustomOrderRequest>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    cakeQuantity: '',
    croissantQuantity: '',
    specialRequirements: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.eventType || !form.eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 pt-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 text-center">Request Received!</h1>
        <p className="text-stone-500 text-center max-w-sm leading-relaxed">
          We&apos;ll review your custom order and reach out within 24 hours to discuss details and confirm pricing.
        </p>
        <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-20 pb-16">
      {/* Header */}
      <div className="hero-gradient py-20 px-4 sm:px-6 text-center">
        <h1 className="font-display text-5xl font-bold text-white mb-3 mt-8">Custom Orders</h1>
        <p className="text-white/80 text-lg max-w-md mx-auto">
          Tell us about your celebration and we&apos;ll create something truly special, just for you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Tell Us About Your Order</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Your Name *</label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="Amara Okafor"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Phone / WhatsApp *</label>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  type="tel" placeholder="+234 8XX XXX XXXX"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email *</label>
              <input
                name="email" value={form.email} onChange={handleChange}
                type="email" placeholder="you@example.com"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Event info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Event Type *</label>
                <select
                  name="eventType" value={form.eventType} onChange={handleChange}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                >
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Event Date *</label>
                <input
                  name="eventDate" value={form.eventDate} onChange={handleChange}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Banana Cake Quantity
                  <span className="text-stone-400 font-normal"> (optional)</span>
                </label>
                <input
                  name="cakeQuantity" value={form.cakeQuantity} onChange={handleChange}
                  placeholder="e.g. 2 whole cakes"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Croissant Quantity
                  <span className="text-stone-400 font-normal"> (optional)</span>
                </label>
                <input
                  name="croissantQuantity" value={form.croissantQuantity} onChange={handleChange}
                  placeholder="e.g. 24 assorted"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Special requirements */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Special Requirements
                <span className="text-stone-400 font-normal"> (optional)</span>
              </label>
              <textarea
                name="specialRequirements" value={form.specialRequirements} onChange={handleChange}
                rows={4}
                placeholder="e.g. Custom message on cake, specific flavours, dietary restrictions, packaging preferences..."
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <Send size={18} />
                  Submit Custom Order Request
                </>
              )}
            </button>

            <p className="text-center text-xs text-stone-400">
              We&apos;ll reach out within 24 hours. For urgent requests, WhatsApp us directly.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
