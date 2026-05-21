'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Incorrect password. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0800] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-10 h-10 bg-amber-700 text-white rounded-xl flex items-center justify-center font-display font-bold">PM</span>
            <span className="font-display text-xl font-bold text-white">PopMerry Admin</span>
          </div>
          <p className="text-stone-400 text-sm">Enter your admin password to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
          <div>
            <label className="block text-stone-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-stone-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
