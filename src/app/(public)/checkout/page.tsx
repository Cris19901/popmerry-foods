'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, Lock, ArrowLeft, Tag, X, Banknote, CreditCard, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Script from 'next/script';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice, productImageUrl } from '@/lib/products-data';
import { calcDeliveryFee, FREE_DELIVERY_THRESHOLD, waLink } from '@/lib/constants';
import { CustomerDetails } from '@/types';

declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const subtotal = getTotal();
  const deliveryFee = calcDeliveryFee(subtotal);

  const [promo, setPromo] = useState<{ code: string; discount: number; description: string; kind: 'promo' | 'referral' } | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const discount = promo?.discount ?? 0;
  const total = subtotal + deliveryFee - discount;

  const applyPromo = async (codeArg?: string, silent = false) => {
    const code = (codeArg ?? promoInput).trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!silent) toast.error(data.error ?? 'Invalid promo code');
      } else {
        setPromo({ code: data.code, discount: data.discount, description: data.description, kind: data.kind ?? 'promo' });
        setPromoInput(data.code);
        toast.success(`Code applied! You saved ${formatPrice(data.discount)} 🎉`);
      }
    } catch {
      if (!silent) toast.error('Could not apply code. Try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  // Auto-apply a referral code captured from a ?ref= link
  const autoApplied = useRef(false);
  useEffect(() => {
    if (autoApplied.current || promo || items.length === 0) return;
    let ref: string | null = null;
    try { ref = localStorage.getItem('popmerry_ref'); } catch {}
    if (ref) {
      autoApplied.current = true;
      applyPromo(ref, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const [payMethod, setPayMethod] = useState<'paystack' | 'transfer'>('paystack');
  const [transferRef, setTransferRef] = useState('');
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [form, setForm] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryNote: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) { toast.error('Please enter your name'); return false; }
    if (!form.email.trim() || !form.email.includes('@')) { toast.error('Please enter a valid email'); return false; }
    if (!form.phone.trim()) { toast.error('Please enter your phone number'); return false; }
    if (!form.address.trim()) { toast.error('Please enter your delivery address'); return false; }
    if (items.length === 0) { toast.error('Your cart is empty'); return false; }
    return true;
  };

  const createOrder = async () => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form, items, subtotal, deliveryFee, discount, total,
        promoCode: promo?.code, promoKind: promo?.kind,
        paymentMethod: payMethod,
        transferReference: payMethod === 'transfer' ? (transferRef || undefined) : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to create order');
    try { localStorage.removeItem('popmerry_ref'); } catch {}
    return data.orderId as string;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const orderId = await createOrder();
      const reference = `popmerry_${orderId}_${Date.now()}`;
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: total * 100,
        currency: 'NGN',
        ref: reference,
        metadata: { orderId, customerName: form.name, customerPhone: form.phone },
        onClose: () => {
          setLoading(false);
          toast('Payment cancelled. Your order is saved — you can pay later.', { icon: '⚠️' });
        },
        callback: async (response: { reference: string }) => {
          const verifyRes = await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference, orderId }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            clearCart();
            router.push(`/order-confirmation?orderId=${orderId}`);
          } else {
            toast.error('Payment verification failed. Contact us with ref: ' + response.reference);
            setLoading(false);
          }
        },
      });
      handler.openIframe();
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const orderId = await createOrder();
      clearCart();
      const waMsg = `Hi! I just placed a PopMerry order #${orderId.slice(0, 8).toUpperCase()} for ${formatPrice(total)}. I'll be sending payment via bank transfer${transferRef ? `. Transfer reference: ${transferRef}` : ''}.`;
      window.open(waLink(waMsg), '_blank');
      router.push(`/order-confirmation?orderId=${orderId}&method=transfer`);
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 pt-20">
        <span className="text-6xl">🛒</span>
        <h2 className="font-display text-2xl font-bold text-stone-900">Your cart is empty</h2>
        <Link href="/products" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      <div className="min-h-screen bg-amber-50 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link href="/products" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Continue shopping
          </Link>

          <h1 className="font-display text-4xl font-bold text-stone-900 mb-10">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Form ─────────────────── */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100">
                <h2 className="font-display text-xl font-bold text-stone-900 mb-6">Delivery Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Amara Okafor"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Phone / WhatsApp *</label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+234 8XX XXX XXXX"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Delivery Address *</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Full address including street, area, city"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                    <p className="text-xs text-stone-400 mt-1.5">
                      We deliver to <span className="text-stone-600 font-medium">Lagos Island, Lagos Mainland, Ibadan, Ilorin, Osun, Ogun, Oyo Town</span> and <span className="text-stone-600 font-medium">Ogbomosho</span>.{' '}
                      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">
                        WhatsApp us
                      </a>{' '}if unsure about your area.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                      Delivery Note <span className="text-stone-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="deliveryNote"
                      value={form.deliveryNote}
                      onChange={handleChange}
                      placeholder="e.g. Leave at the gate, call when nearby..."
                      rows={2}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Order Summary ─────────── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 border border-amber-100 sticky top-24">
                <h2 className="font-display text-xl font-bold text-stone-900 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div
                        className="relative w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${item.product.gradientFrom}, ${item.product.gradientTo})` }}
                      >
                        {item.product.imageId && (
                          <Image
                            src={productImageUrl(item.product.imageId, 'auto=format&fit=crop&w=40&h=40&q=80')}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-stone-800 text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-stone-500 text-xs">{formatPrice(item.product.price)} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 text-stone-400 hover:text-stone-600">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 text-amber-500 hover:text-amber-700">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => removeItem(item.product.id)} className="p-1 text-stone-300 hover:text-red-400 ml-1">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="border-t border-stone-100 pt-4">
                  {promo ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-green-600" />
                        <div>
                          <p className="text-green-800 text-xs font-bold">{promo.code}</p>
                          <p className="text-green-600 text-xs">{promo.description}</p>
                        </div>
                      </div>
                      <button onClick={() => { setPromo(null); setPromoInput(''); }} className="text-green-500 hover:text-green-700">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mb-3">
                      <input
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                        placeholder="Promo code"
                        className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent uppercase"
                      />
                      <button
                        onClick={() => applyPromo()}
                        disabled={promoLoading || !promoInput}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 border border-amber-300 hover:border-amber-500 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {promoLoading ? '…' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery fee</span>
                    {deliveryFee === 0 ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({promo?.code})</span>
                      <span className="font-semibold">−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-stone-900 text-base border-t border-stone-100 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-amber-600 text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="mt-5 grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setPayMethod('paystack')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      payMethod === 'paystack'
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <CreditCard size={15} /> Pay Online
                  </button>
                  <button
                    onClick={() => setPayMethod('transfer')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      payMethod === 'transfer'
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <Banknote size={15} /> Bank Transfer
                  </button>
                </div>

                {payMethod === 'paystack' ? (
                  <>
                    <button
                      onClick={handlePay}
                      disabled={loading}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? <span className="animate-pulse">Processing...</span> : <><Lock size={16} /> Pay {formatPrice(total)} securely</>}
                    </button>
                    <p className="text-center text-xs text-stone-400 mt-3 flex items-center justify-center gap-1">
                      <Lock size={11} /> Secured by Paystack
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    {/* Bank details */}
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
                      <p className="text-xs font-bold text-stone-700 uppercase tracking-widest mb-2">Transfer to</p>
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
                          <button onClick={copyAccount} className="text-amber-600 hover:text-amber-800">
                            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm pt-1 border-t border-amber-200">
                        <span className="text-stone-500">Amount</span>
                        <span className="font-bold text-amber-700">{formatPrice(total)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Transfer Reference / Narration <span className="text-stone-400 font-normal">(optional)</span></label>
                      <input
                        value={transferRef}
                        onChange={e => setTransferRef(e.target.value)}
                        placeholder="e.g. PopMerry order payment"
                        className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={handleTransfer}
                      disabled={loading}
                      className="w-full bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? <span className="animate-pulse">Placing order...</span> : <><Banknote size={16} /> Place Order & Pay by Transfer</>}
                    </button>
                    <p className="text-center text-xs text-stone-400">Your order will be confirmed once we receive your payment. We&apos;ll contact you on WhatsApp.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
