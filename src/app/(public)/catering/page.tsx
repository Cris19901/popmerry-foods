'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Metadata } from 'next';

export default function CateringPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '',
    contactName: '',
    phone: '',
    email: '',
    frequency: '',
    headcount: '',
    items: '',
    requirements: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.contactName || !form.phone || !form.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const msg = [
        `*Corporate Catering Inquiry*`,
        `Company: ${form.company}`,
        `Contact: ${form.contactName}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email}`,
        `Frequency: ${form.frequency}`,
        `Headcount: ${form.headcount}`,
        `Items Needed: ${form.items}`,
        `Requirements: ${form.requirements}`,
      ].join('\n');
      window.open(`https://wa.me/2347039571698?text=${encodeURIComponent(msg)}`, '_blank');
      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Try WhatsApp directly.');
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
        <h1 className="font-display text-3xl font-bold text-stone-900 text-center">Enquiry Sent!</h1>
        <p className="text-stone-500 text-center max-w-sm leading-relaxed">
          We&apos;ll review your catering requirements and reach out within 24 hours to discuss pricing and scheduling.
        </p>
        <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-20 pb-16">
      <div className="hero-gradient py-20 px-4 sm:px-6 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-8">
          <Building2 size={26} className="text-white" />
        </div>
        <h1 className="font-display text-5xl font-bold text-white mb-3">Corporate Catering</h1>
        <p className="text-white/80 text-lg max-w-md mx-auto">
          Regular office breakfasts, team events, or client meetings — we&apos;ll handle the food. You handle the business.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>

        {/* Perks */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Volume Pricing', sub: 'Better rates for regular orders' },
            { title: 'Scheduled Delivery', sub: 'Same time every week' },
            { title: 'Custom Menu', sub: 'Tailored to your team' },
          ].map(({ title, sub }) => (
            <div key={title} className="bg-white rounded-2xl p-4 border border-amber-100 text-center">
              <p className="font-semibold text-stone-800 text-sm">{title}</p>
              <p className="text-stone-400 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Tell Us About Your Needs</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Company Name *</label>
                <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Contact Name *</label>
                <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Adaeze Okonkwo"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Phone / WhatsApp *</label>
                <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="+234 8XX XXX XXXX"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email *</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@company.com"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Order Frequency</label>
                <select name="frequency" value={form.frequency} onChange={handleChange}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white">
                  <option value="">Select frequency</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                  <option>One-off event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Approx. Headcount</label>
                <input name="headcount" value={form.headcount} onChange={handleChange} placeholder="e.g. 50 people"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Items Needed</label>
              <input name="items" value={form.items} onChange={handleChange} placeholder="e.g. 30 croissants, 2 banana cakes, 20 bags popcorn"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Additional Requirements <span className="text-stone-400 font-normal">(optional)</span></label>
              <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3}
                placeholder="Delivery time, dietary restrictions, packaging preferences…"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 flex items-center justify-center gap-2">
              {loading ? <span className="animate-pulse">Sending…</span> : <><Send size={18} /> Submit Catering Enquiry</>}
            </button>
            <p className="text-center text-xs text-stone-400">We&apos;ll respond within 24 hours with a custom quote.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
