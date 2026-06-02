'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Clock, CheckCircle, ChefHat, ArrowLeft, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/products-data';

type OrderStatus = 'pending' | 'paid' | 'preparing' | 'delivered';

interface TrackedOrder {
  id: string;
  status: OrderStatus;
  customer_name: string;
  customer_address: string;
  items: { product: { name: string; price: number }; quantity: number }[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
}

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'paid',      label: 'Order Confirmed',  icon: CheckCircle, description: 'Payment received, order confirmed.' },
  { key: 'preparing', label: 'Being Prepared',   icon: ChefHat,     description: 'Our bakers are working on your order.' },
  { key: 'delivered', label: 'Out for Delivery',  icon: Package,     description: 'Your order is on its way!' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: -1, paid: 0, preparing: 1, delivered: 2,
};

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/track-order?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.order) {
        setError('No order found. Check your order ID or phone number and try again.');
      } else {
        setOrder(data.order);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_ORDER[order.status] : -1;

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-amber-700" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Track Your Order</h1>
          <p className="text-stone-500">Enter your order ID or the phone number you used at checkout.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 mb-6">
          <label className="block text-sm font-semibold text-stone-700 mb-2">Order ID or Phone Number</label>
          <div className="flex gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. 07039571698 or a1b2c3d4..."
              className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-bold px-5 py-3 rounded-xl transition-colors"
            >
              {loading ? <Clock size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        {order && (
          <div className="space-y-4">
            {/* Status timeline */}
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
              <h2 className="font-display font-bold text-stone-900 mb-5">Order Status</h2>
              <div className="space-y-4">
                {STATUS_STEPS.map((step, i) => {
                  const stepIndex = STATUS_ORDER[step.key];
                  const done = currentStep >= stepIndex;
                  const active = currentStep === stepIndex;
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        done ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-400'
                      }`}>
                        <step.icon size={18} />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-semibold text-sm ${done ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.label}
                          {active && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Current</span>}
                        </p>
                        {done && <p className="text-stone-500 text-xs mt-0.5">{step.description}</p>}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`absolute ml-5 mt-10 w-px h-4 ${done && currentStep > stepIndex ? 'bg-amber-700' : 'bg-stone-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6">
              <h2 className="font-display font-bold text-stone-900 mb-4">Order Details</h2>
              <p className="text-xs text-stone-400 font-mono mb-4">#{order.id.slice(0, 8).toUpperCase()}</p>
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-stone-700">{item.quantity}× {item.product.name}</span>
                    <span className="text-stone-500">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery</span>
                  <span>{order.delivery_fee === 0 ? 'Free' : formatPrice(order.delivery_fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-100">
                  <span>Total Paid</span>
                  <span className="text-amber-700">{formatPrice(order.total)}</span>
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-3">Delivering to: {order.customer_address}</p>
            </div>

            {/* WhatsApp contact */}
            <a
              href={`https://wa.me/2347039571698?text=${encodeURIComponent(`Hi, I'm checking on my order #${order.id.slice(0, 8).toUpperCase()}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm"
            >
              <MessageCircle size={18} />
              Questions? Chat with us on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
