'use client';

import { useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WaitlistButton({ productId }: { productId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success("We'll notify you when it's back in stock!");
      } else {
        toast.error("Couldn't sign you up. Try again.");
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
        <CheckCircle size={18} /> You&apos;re on the waitlist!
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-stone-800 hover:bg-stone-900 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
        >
          {loading ? '…' : 'Notify me'}
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-full transition-colors text-sm"
    >
      <Bell size={16} />
      Notify me when available
    </button>
  );
}
