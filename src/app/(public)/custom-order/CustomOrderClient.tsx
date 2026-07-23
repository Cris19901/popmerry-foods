'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Copy, Banknote, MessageCircle, ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products-data';
import { waLink } from '@/lib/constants';
import type { CustomConfig, CustomOption } from '@/lib/custom-cake';

const EVENT_TYPES = [
  'Birthday', 'Wedding', 'Baby Shower', 'Corporate Event',
  'Anniversary', 'Graduation', 'Christmas / Holiday', 'Other',
];

interface Props {
  config: CustomConfig;
  options: CustomOption[];
}

export default function CustomOrderClient({ config, options }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', eventType: '', eventDate: '', specialRequirements: '',
  });
  const [refImages, setRefImages] = useState<string[]>([]);
  const [uploadingRef, setUploadingRef] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  const uploadRefs = async (files: FileList) => {
    setUploadingRef(true);
    for (const file of Array.from(files).slice(0, 5)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/upload/reference', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok) setRefImages(p => [...p, data.url]);
        else toast.error(data.error ?? 'Upload failed');
      } catch {
        toast.error('Upload failed. Please try again.');
      }
    }
    setUploadingRef(false);
    if (refInput.current) refInput.current.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const groups = useMemo(() => {
    return options.reduce<Record<string, CustomOption[]>>((acc, o) => {
      (acc[o.group_name] ??= []).push(o);
      return acc;
    }, {});
  }, [options]);

  const chosen = useMemo(() => options.filter(o => selected.has(o.id)), [options, selected]);
  const total = useMemo(() => config.base_price + chosen.reduce((s, o) => s + o.price_delta, 0), [config.base_price, chosen]);

  // Earliest event date = today + lead time
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + config.lead_time_days);
    return d.toISOString().split('T')[0];
  }, [config.lead_time_days]);

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
        body: JSON.stringify({
          ...form,
          selectedOptions: chosen.map(o => ({ group_name: o.group_name, name: o.name, price_delta: o.price_delta })),
          estimatedPrice: total,
          referenceImages: refImages,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  const bankNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '';
  const copyAccount = () => {
    navigator.clipboard.writeText(bankNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    const summary = [
      `*New Custom Cake Order*`,
      `Name: ${form.name}`,
      `Event: ${form.eventType} on ${form.eventDate}`,
      `Base: ${config.base_label}`,
      ...chosen.map(o => `+ ${o.name} (${o.price_delta > 0 ? formatPrice(o.price_delta) : 'free'})`),
      `Total: ${formatPrice(total)}`,
      form.specialRequirements ? `Notes: ${form.specialRequirements}` : '',
    ].filter(Boolean).join('\n');

    return (
      <div className="min-h-screen bg-amber-50 pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-stone-900">Order Received! 🎂</h1>
            <p className="text-stone-500 mt-2 leading-relaxed">
              To confirm your cake, please pay <span className="font-bold text-amber-700">{formatPrice(total)}</span> to the account below.
            </p>
          </div>

          {/* Bank details */}
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Banknote size={18} className="text-amber-600" />
              <h2 className="font-semibold text-stone-900">Pay by Bank Transfer</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-stone-500">Bank</span><span className="font-semibold text-stone-800">{process.env.NEXT_PUBLIC_BANK_NAME ?? 'See WhatsApp'}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Account Name</span><span className="font-semibold text-stone-800">{process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? 'PopMerry Foods'}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Account No.</span>
                <span className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 font-mono">{bankNumber || '—'}</span>
                  {bankNumber && (
                    <button onClick={copyAccount} className="text-amber-600 hover:text-amber-800">
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100"><span className="text-stone-500">Amount</span><span className="font-bold text-amber-700">{formatPrice(total)}</span></div>
            </div>
          </div>

          <a
            href={waLink(summary)}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm mb-3"
          >
            <MessageCircle size={18} /> Send Order Details on WhatsApp
          </a>
          <p className="text-center text-xs text-stone-400 mb-6">
            Send your payment receipt on WhatsApp and we&apos;ll confirm your order right away.
          </p>

          <Link href="/" className="block text-center text-stone-500 hover:text-amber-600 text-sm font-medium">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-20 pb-16">
      <div className="hero-gradient py-20 px-4 sm:px-6 text-center">
        <h1 className="font-display text-5xl font-bold text-white mb-3 mt-8">Build Your Cake</h1>
        <p className="text-white/80 text-lg max-w-md mx-auto mb-5">
          Choose your flavours and finishes, see your price instantly, and order for your special day.
        </p>
        <Link href="/gallery" className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold text-sm transition-colors">
          See cakes we&apos;ve made →
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: configurator + event details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Options */}
            {Object.keys(groups).length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
                <h2 className="font-display text-xl font-bold text-stone-900 mb-1">Customise Your Cake</h2>
                <p className="text-stone-400 text-sm mb-5">Tap to add. Prices update live.</p>
                <div className="space-y-6">
                  {Object.entries(groups).map(([group, opts]) => (
                    <div key={group}>
                      <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">{group}</h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        {opts.map(o => {
                          const active = selected.has(o.id);
                          return (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => toggle(o.id)}
                              className={`text-left px-4 py-3 rounded-2xl border-2 transition-all ${
                                active
                                  ? 'border-amber-500 bg-amber-50'
                                  : 'border-stone-200 bg-white hover:border-amber-300'
                              }`}
                            >
                              <span className="block text-sm font-semibold text-stone-800">{o.name}</span>
                              <span className={`block text-xs mt-0.5 font-medium ${active ? 'text-amber-700' : 'text-stone-400'}`}>
                                {o.price_delta > 0 ? `+${formatPrice(o.price_delta)}` : 'Included'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-5">Event Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Your Name *"><input name="name" value={form.name} onChange={handleChange} placeholder="Amara Okafor" className={inputCls} /></Field>
                  <Field label="Phone / WhatsApp *"><input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="+234 8XX XXX XXXX" className={inputCls} /></Field>
                </div>
                <Field label="Email *"><input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" className={inputCls} /></Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Event Type *">
                    <select name="eventType" value={form.eventType} onChange={handleChange} className={`${inputCls} bg-white`}>
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </Field>
                  <Field label="Event Date *">
                    <input name="eventDate" value={form.eventDate} onChange={handleChange} type="date" min={minDate} className={inputCls} />
                  </Field>
                </div>
                <Field label="Special Requirements (optional)">
                  <textarea name="specialRequirements" value={form.specialRequirements} onChange={handleChange} rows={3}
                    placeholder="Message on cake, colour theme, number of guests, dietary notes…" className={`${inputCls} resize-none`} />
                </Field>

                {/* Inspiration images */}
                <Field label="Inspiration Photos (optional)">
                  <div className="flex flex-wrap gap-3">
                    {refImages.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200">
                        <Image src={url} alt={`Reference ${i + 1}`} fill className="object-cover" sizes="80px" />
                        <button
                          type="button"
                          onClick={() => setRefImages(p => p.filter((_, idx) => idx !== i))}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {refImages.length < 5 && (
                      <button
                        type="button"
                        onClick={() => refInput.current?.click()}
                        disabled={uploadingRef}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:border-amber-400 hover:text-amber-600 transition-colors disabled:opacity-50"
                      >
                        <ImagePlus size={18} />
                        <span className="text-[10px] mt-1">{uploadingRef ? 'Uploading…' : 'Add'}</span>
                      </button>
                    )}
                  </div>
                  <input
                    ref={refInput}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => { if (e.target.files?.length) uploadRefs(e.target.files); }}
                    className="hidden"
                  />
                  <p className="text-xs text-stone-400 mt-2">Share any design ideas or Pinterest screenshots — helps us match your vision. Up to 5 images.</p>
                </Field>

                <p className="text-xs text-stone-400">Earliest event date is {config.lead_time_days} days from today so we can prepare properly.</p>
              </div>
            </div>
          </div>

          {/* Right: sticky summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm sticky top-24">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-4">Your Cake</h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-600">{config.base_label}</span>
                <span className="font-semibold text-stone-800">{formatPrice(config.base_price)}</span>
              </div>
              {chosen.length > 0 && (
                <div className="border-t border-stone-100 pt-2 mt-2 space-y-1.5">
                  {chosen.map(o => (
                    <div key={o.id} className="flex justify-between text-sm">
                      <span className="text-stone-500">{o.name}</span>
                      <span className="text-stone-600">{o.price_delta > 0 ? `+${formatPrice(o.price_delta)}` : 'Free'}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center border-t border-stone-200 pt-3 mt-3">
                <span className="font-bold text-stone-900">Estimated Total</span>
                <span className="font-display text-2xl font-bold text-amber-700">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 text-sm"
              >
                {loading ? 'Placing order…' : 'Place Order'}
              </button>
              <p className="text-center text-xs text-stone-400 mt-3">
                You&apos;ll pay by bank transfer to confirm. Final price may adjust for complex designs — we&apos;ll confirm on WhatsApp.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent';
