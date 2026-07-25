'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Receipt, Copy, CheckCircle, Clock, Pencil, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products-data';
import { SITE_URL } from '@/lib/constants';

interface Props {
  orderId: string;
  customerName: string;
  customerPhone: string;
  estimatedPrice: number | null;
  quotedPrice: number | null;
  depositAmount: number | null;
  quoteNote: string | null;
  quoteToken: string | null;
  depositPaid: boolean;
  depositMethod: 'paystack' | 'transfer' | null;
}

const inputCls = 'w-full border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500';

export default function QuoteForm({
  orderId, customerName, customerPhone, estimatedPrice,
  quotedPrice, depositAmount, quoteNote, quoteToken, depositPaid, depositMethod,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [price, setPrice] = useState(String(quotedPrice ?? estimatedPrice ?? ''));
  const [deposit, setDeposit] = useState(String(depositAmount ?? ''));
  const [note, setNote] = useState(quoteNote ?? '');
  const [token, setToken] = useState(quoteToken);

  const quoteUrl = token ? `${SITE_URL}/quote/${token}` : '';

  const confirmTransfer = async () => {
    if (!confirm(`Confirm you've received the ${formatPrice(depositAmount ?? 0)} deposit by bank transfer for ${customerName}?`)) return;
    setConfirming(true);
    try {
      const res = await fetch(`/api/admin/custom-orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_deposit_paid: true }),
      });
      if (res.ok) {
        toast.success('Deposit marked as received');
        router.refresh();
      } else {
        toast.error('Could not update. Try again.');
      }
    } catch {
      toast.error('Could not update. Try again.');
    } finally {
      setConfirming(false);
    }
  };

  const save = async () => {
    const p = parseInt(price, 10);
    const d = deposit ? parseInt(deposit, 10) : 0;
    if (!p || p <= 0) { toast.error('Enter a valid quoted price'); return; }
    if (d > p) { toast.error('Deposit cannot exceed the quoted price'); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/custom-orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoted_price: p, deposit_amount: d, quote_note: note || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.quoteToken);
        setOpen(false);
        toast.success('Quote saved — share the link with your customer');
        router.refresh();
      } else {
        toast.error(data.error ?? 'Could not save quote');
      }
    } catch {
      toast.error('Could not save quote');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(quoteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Quote link copied');
  };

  const waHref = () => {
    const msg = `Hi ${customerName}! 🍰 Your PopMerry custom cake quote is ready.\n\nTotal: ${formatPrice(quotedPrice ?? 0)}${depositAmount ? `\nDeposit to confirm: ${formatPrice(depositAmount)}` : ''}\n\nView and pay here: ${quoteUrl}`;
    const clean = customerPhone.replace(/\D/g, '').replace(/^0/, '234');
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  // ── Quote already issued ──────────────────────────────────────────
  if (token && quotedPrice && !open) {
    return (
      <div className={`rounded-xl p-4 mb-4 border ${depositPaid ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">Quote</p>
            <p className="font-display text-xl font-bold text-stone-900">{formatPrice(quotedPrice)}</p>
            {!!depositAmount && (
              <p className="text-stone-600 text-xs mt-0.5">
                Deposit {formatPrice(depositAmount)} · Balance {formatPrice(quotedPrice - depositAmount)}
              </p>
            )}
          </div>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
            depositPaid ? 'bg-green-600 text-white' : 'bg-blue-100 text-blue-700'
          }`}>
            {depositPaid
              ? <><CheckCircle size={12} /> Paid {depositMethod === 'transfer' ? '· transfer' : depositMethod === 'paystack' ? '· card' : ''}</>
              : <><Clock size={12} /> Awaiting deposit</>}
          </span>
        </div>

        {quoteNote && <p className="text-stone-600 text-xs italic mb-3">&ldquo;{quoteNote}&rdquo;</p>}

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={waHref()}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
          >
            Send on WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 border border-stone-300 text-stone-600 hover:text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
          >
            {copied ? <CheckCircle size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy link'}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-xs font-semibold px-2 py-1.5 transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
          {!depositPaid && (
            <button
              onClick={confirmTransfer}
              disabled={confirming}
              className="inline-flex items-center gap-1.5 border border-teal-300 text-teal-700 hover:bg-teal-50 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60"
              title="Use this once you've confirmed the customer's bank transfer landed"
            >
              <Banknote size={13} /> {confirming ? 'Confirming…' : 'Mark transfer received'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── No quote yet (collapsed) ──────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 mb-4 border-2 border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 text-sm font-semibold py-2.5 rounded-xl transition-colors"
      >
        <Receipt size={15} /> Send Quote
      </button>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
      <p className="font-semibold text-stone-900 text-sm mb-3">{quotedPrice ? 'Update quote' : 'Send a quote'}</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Final price (₦)</label>
          <input type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Deposit (₦)</label>
          <input type="number" min="0" value={deposit} onChange={e => setDeposit(e.target.value)} className={inputCls} />
          <button
            type="button"
            onClick={() => { const p = parseInt(price, 10); if (p) setDeposit(String(Math.round(p / 2))); }}
            className="text-[11px] text-amber-700 font-semibold mt-1 hover:underline"
          >
            Set 50%
          </button>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold text-stone-500 mb-1">Note to customer (optional)</label>
        <textarea
          rows={2} value={note} onChange={e => setNote(e.target.value)}
          placeholder="e.g. Includes 3 tiers, fondant finish and delivery within Lagos."
          className={`${inputCls} resize-none`}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="flex-1 py-2 border border-stone-300 rounded-xl text-stone-600 text-sm font-semibold hover:bg-white transition-colors">
          Cancel
        </button>
        <button onClick={save} disabled={saving} className="flex-1 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-bold disabled:opacity-60 transition-colors">
          {saving ? 'Saving…' : 'Save quote'}
        </button>
      </div>
    </div>
  );
}
