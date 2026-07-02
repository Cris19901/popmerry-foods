'use client';

import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  product?: string;
};

const COLORS = ['bg-amber-800', 'bg-stone-700', 'bg-amber-900', 'bg-amber-700', 'bg-stone-800'];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', location: 'Lagos', rating: 5, review: '', product: '' });

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d.reviews) ? d.reviews : []))
      .catch(() => setReviews([]));
  }, []);

  const displayed = reviews;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.review || form.review.length < 10) {
      toast.error('Please fill in your name and a review (min 10 characters)');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Thank you! Your review is pending approval 🎉');
        setShowForm(false);
        setForm({ name: '', location: 'Lagos', rating: 5, review: '', product: '' });
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">
            What Our Customers
            <br />
            <span className="text-gradient-gold italic">Are Saying</span>
          </h2>
        </div>

        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {displayed.slice(0, 3).map((r, i) => (
              <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                {r.product && <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-2">{r.product}</p>}
                <p className="text-stone-600 text-sm leading-relaxed mb-5 italic">&ldquo;{r.review}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${COLORS[i % COLORS.length]} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{r.name}</p>
                    <p className="text-stone-400 text-xs">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-10">
            <p className="text-stone-500 text-lg max-w-md mx-auto">
              Been a PopMerry customer? We&apos;d love to hear about it — leave the first review and help others discover us.
            </p>
          </div>
        )}

        {/* Leave a review */}
        {!showForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white font-bold px-6 py-3 rounded-full transition-all text-sm"
            >
              <Star size={16} /> Leave a Review
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 sm:p-8 max-w-xl mx-auto">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-5">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Your Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Amara"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">City</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Lagos"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">What did you order? (optional)</label>
                <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="e.g. Almond Croissant"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                      <Star size={24} className={n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Your Review *</label>
                <textarea value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} rows={4}
                  placeholder="Tell us about your experience…"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 text-sm font-semibold hover:bg-stone-50">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? 'Submitting…' : <><Send size={15} /> Submit</>}
                </button>
              </div>
              <p className="text-xs text-stone-400 text-center">Reviews are reviewed before being published.</p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
