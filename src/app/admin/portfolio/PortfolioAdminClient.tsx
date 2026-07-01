'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Upload, Trash2, Eye, EyeOff, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import type { PortfolioItem } from '@/lib/portfolio';

const EVENT_TYPES = ['Birthday', 'Wedding', 'Baby Shower', 'Corporate Event', 'Anniversary', 'Graduation', 'Other'];

export default function PortfolioAdminClient({ items: initial }: { items: PortfolioItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Birthday');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('event_type', eventType);
    try {
      const res = await fetch('/api/admin/portfolio', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        toast.success('Image added to portfolio');
        setTitle('');
        if (fileRef.current) fileRef.current.value = '';
        router.refresh();
        setItems(prev => [data.item, ...prev]);
      } else {
        toast.error(data.error ?? 'Upload failed');
      }
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggle = async (item: PortfolioItem) => {
    const res = await fetch(`/api/admin/portfolio/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: !item.is_visible }),
    });
    if (res.ok) setItems(is => is.map(i => i.id === item.id ? { ...i, is_visible: !i.is_visible } : i));
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems(is => is.filter(i => i.id !== id));
      toast.success('Deleted');
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-900">Portfolio</h1>
        <p className="text-stone-500 text-sm mt-0.5">Photos of your past work shown on the gallery and custom-order pages.</p>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4">Add a Photo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Caption (optional)</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. 3-tier wedding cake for Chidinma"
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Event Type</label>
            <select value={eventType} onChange={e => setEventType(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold px-4 py-2.5 rounded-full transition-colors disabled:opacity-60"
        >
          <Upload size={15} /> {uploading ? 'Uploading…' : 'Choose Image'}
        </button>
        <p className="text-xs text-stone-400 mt-2">JPG, PNG, WebP or GIF · max 5MB</p>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 py-16 text-center">
          <ImageIcon size={32} className="text-stone-300 mx-auto mb-2" />
          <p className="text-stone-400 text-sm">No photos yet. Upload your best work above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl border overflow-hidden group ${item.is_visible ? 'border-stone-200' : 'border-stone-200 opacity-60'}`}>
              <div className="relative aspect-square bg-stone-100">
                <Image src={item.image_url} alt={item.title || 'Portfolio'} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => toggle(item)} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-stone-600 hover:text-amber-700 shadow-sm" title={item.is_visible ? 'Hide' : 'Show'}>
                    {item.is_visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button onClick={() => remove(item.id)} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-stone-600 hover:text-red-600 shadow-sm" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-stone-700 truncate">{item.title || '—'}</p>
                <p className="text-[10px] text-stone-400">{item.event_type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
