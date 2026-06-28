'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gift, Copy, CheckCircle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SITE = 'https://popmerryfoods.com.ng';

export default function ReferPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; reward: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes('@')) {
      toast.error('Please enter your name and a valid email');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/referral/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ code: data.code, reward: data.reward });
      } else {
        toast.error(data.error ?? 'Something went wrong');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareLink = result ? `${SITE}/products?ref=${result.code}` : '';
  const shareMsg = result
    ? `I love PopMerry Foods! 🍰 Use my code *${result.code}* for ₦500 off your first order: ${shareLink}`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  return (
    <div className="min-h-screen bg-amber-50 pt-20 pb-16">
      <div className="hero-gradient py-20 px-4 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-8">
          <Gift size={26} className="text-white" />
        </div>
        <h1 className="font-display text-5xl font-bold text-white mb-3">Refer &amp; Earn</h1>
        <p className="text-white/80 text-lg max-w-md mx-auto">
          Give your friends ₦500 off their first order. Earn ₦500 for every friend who orders.
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { n: '1', t: 'Get your code', s: 'Enter your details below' },
            { n: '2', t: 'Share it', s: 'Send to friends & family' },
            { n: '3', t: 'Earn ₦500', s: 'For each friend who orders' },
          ].map(({ n, t, s }) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-amber-100 text-center">
              <div className="w-7 h-7 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2">{n}</div>
              <p className="font-semibold text-stone-800 text-sm leading-tight">{t}</p>
              <p className="text-stone-400 text-xs mt-1">{s}</p>
            </div>
          ))}
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
            <h2 className="font-display text-xl font-bold text-stone-900">Get Your Referral Code</h2>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Your Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Amara Okafor"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Phone / WhatsApp <span className="text-stone-400 font-normal">(optional)</span></label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 8XX XXX XXXX"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200">
              {loading ? 'Generating…' : 'Get My Code'}
            </button>
            <p className="text-xs text-stone-400 text-center">We&apos;ll use your email to track your rewards. No spam.</p>
          </form>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={30} className="text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-1">Your Code is Ready! 🎉</h2>
            <p className="text-stone-500 text-sm mb-5">Share it with friends — you both win.</p>

            <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl py-5 mb-5">
              <p className="text-stone-400 text-xs uppercase tracking-widest mb-1">Your code</p>
              <p className="font-display text-3xl font-bold text-amber-700 tracking-wider">{result.code}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMsg)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-full transition-colors text-sm"
              >
                <Share2 size={16} /> Share on WhatsApp
              </a>
              <button
                onClick={copyLink}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-bold py-3.5 rounded-full transition-colors text-sm"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <p className="text-xs text-stone-400 mt-5">
              You earn ₦{result.reward.toLocaleString()} for each friend who places their first order using your code.
              Rewards are paid out via bank transfer or store credit — we&apos;ll reach out to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
