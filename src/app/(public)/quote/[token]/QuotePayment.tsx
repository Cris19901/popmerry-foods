'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Lock, Banknote, CreditCard, Copy, CheckCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products-data';
import { waLink } from '@/lib/constants';

declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

interface Props {
  token: string;
  email: string;
  customerName: string;
  amount: number;
  isDeposit: boolean;
}

export default function QuotePayment({ token, email, customerName, amount, isDeposit }: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<'paystack' | 'transfer'>('paystack');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const label = isDeposit ? 'deposit' : 'payment';

  const copyAccount = () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const payNow = () => {
    if (!window.PaystackPop) {
      toast.error('Payment is still loading — please try again in a moment.');
      return;
    }
    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // kobo
      currency: 'NGN',
      ref: `quote_${token.slice(0, 8)}_${Date.now()}`,
      metadata: { quoteToken: token, customerName },
      onClose: () => {
        setLoading(false);
        toast('Payment cancelled — your quote is still saved.', { icon: '⚠️' });
      },
      callback: (response: { reference: string }) => {
        // Paystack's callback is not async-friendly; kick off verification and let it resolve
        fetch('/api/quote/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, reference: response.reference }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              toast.success('Payment confirmed! 🎉');
              router.refresh();
            } else {
              toast.error(data.error ?? `Could not verify payment. Reference: ${response.reference}`);
            }
          })
          .catch(() => toast.error(`Verification failed. Please send us this reference: ${response.reference}`))
          .finally(() => setLoading(false));
      },
    });
    handler.openIframe();
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      <div className="bg-white rounded-3xl border border-amber-100 p-6">
        <p className="font-display text-lg font-bold text-stone-900 mb-1">
          Pay your {label} to confirm
        </p>
        <p className="text-stone-500 text-sm mb-5">
          We start baking once your {label} of <span className="font-semibold text-amber-700">{formatPrice(amount)}</span> is received.
        </p>

        {/* Method toggle */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setMethod('paystack')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              method === 'paystack' ? 'bg-amber-700 text-white border-amber-700' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
            }`}
          >
            <CreditCard size={15} /> Pay Online
          </button>
          <button
            onClick={() => setMethod('transfer')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              method === 'transfer' ? 'bg-amber-700 text-white border-amber-700' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
            }`}
          >
            <Banknote size={15} /> Bank Transfer
          </button>
        </div>

        {method === 'paystack' ? (
          <>
            <button
              onClick={payNow}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <span className="animate-pulse">Processing…</span> : <><Lock size={16} /> Pay {formatPrice(amount)} securely</>}
            </button>
            <p className="text-center text-xs text-stone-400 mt-3 flex items-center justify-center gap-1">
              <Lock size={11} /> Secured by Paystack
            </p>
          </>
        ) : (
          <div className="space-y-3">
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
              <p className="text-xs font-bold text-stone-700 uppercase tracking-widest mb-1">Transfer to</p>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Bank</span>
                <span className="font-semibold text-stone-800">{process.env.NEXT_PUBLIC_BANK_NAME ?? 'See WhatsApp'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Account Name</span>
                <span className="font-semibold text-stone-800">{process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? 'PopMerry Foods'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Account No.</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 font-mono">{process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '—'}</span>
                  <button onClick={copyAccount} className="text-amber-600 hover:text-amber-800" aria-label="Copy account number">
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-amber-200">
                <span className="text-stone-500">Amount</span>
                <span className="font-bold text-amber-700">{formatPrice(amount)}</span>
              </div>
            </div>

            <a
              href={waLink(`Hi PopMerry! I've sent the ${label} of ${formatPrice(amount)} for my custom cake quote. Here's my receipt:`)}
              target="_blank" rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-full transition-colors text-sm"
            >
              <MessageCircle size={16} /> Send receipt on WhatsApp
            </a>
            <p className="text-center text-xs text-stone-400">
              We&apos;ll confirm your order as soon as we receive your transfer.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
