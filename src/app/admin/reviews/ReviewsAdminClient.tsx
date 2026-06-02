'use client';

import { useState } from 'react';
import { Star, CheckCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  product?: string;
  approved: boolean;
  created_at: string;
};

export default function ReviewsAdminClient({ reviews: initial }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const filtered = reviews.filter(r =>
    filter === 'all' ? true : filter === 'pending' ? !r.approved : r.approved
  );

  const pending = reviews.filter(r => !r.approved).length;

  const approve = async (id: string) => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
    });
    if (res.ok) {
      setReviews(rs => rs.map(r => r.id === id ? { ...r, approved: true } : r));
      toast.success('Review approved');
    }
  };

  const unapprove = async (id: string) => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: false }),
    });
    if (res.ok) {
      setReviews(rs => rs.map(r => r.id === id ? { ...r, approved: false } : r));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews(rs => rs.filter(r => r.id !== id));
      toast.success('Deleted');
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Reviews</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            {reviews.length} total · {pending > 0 && <span className="text-amber-600 font-semibold">{pending} pending approval</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {(['pending', 'approved', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-amber-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-400'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 py-16 text-center text-stone-400">
            <CheckCircle size={32} className="mx-auto mb-2 text-stone-300" />
            No {filter === 'all' ? '' : filter} reviews.
          </div>
        ) : (
          filtered.map(r => (
            <div key={r.id} className={`bg-white rounded-2xl border p-5 ${r.approved ? 'border-green-200' : 'border-amber-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-stone-900">{r.name}</p>
                    <span className="text-stone-400 text-xs">{r.location}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.approved ? 'Published' : 'Pending'}
                    </span>
                  </div>
                  {r.product && <p className="text-amber-600 text-xs font-medium mb-1">{r.product}</p>}
                  <p className="text-stone-600 text-sm leading-relaxed italic">&ldquo;{r.review}&rdquo;</p>
                  <p className="text-stone-400 text-xs mt-2">{new Date(r.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.approved ? (
                    <button onClick={() => unapprove(r.id)} className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Unpublish">
                      <EyeOff size={15} />
                    </button>
                  ) : (
                    <button onClick={() => approve(r.id)} className="p-1.5 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                      <Eye size={15} />
                    </button>
                  )}
                  <button onClick={() => remove(r.id)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
