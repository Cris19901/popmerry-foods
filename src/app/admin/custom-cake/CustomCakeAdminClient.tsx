'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/products-data';
import type { CustomConfig, CustomOption, CustomOptionGroup } from '@/lib/custom-cake';

const inputCls = 'w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500';

interface Props {
  config: CustomConfig;
  options: CustomOption[];
  groups: CustomOptionGroup[];
}

export default function CustomCakeAdminClient({ config, options: initial, groups: initialGroups }: Props) {
  const router = useRouter();
  const [options, setOptions] = useState(initial);
  const [groupMeta, setGroupMeta] = useState<Record<string, CustomOptionGroup>>(
    Object.fromEntries(initialGroups.map(g => [g.name, g]))
  );

  const metaFor = (name: string): CustomOptionGroup =>
    groupMeta[name] ?? { name, selection_type: 'multi', required: false, sort_order: 100 };

  const saveGroupMeta = async (meta: CustomOptionGroup) => {
    setGroupMeta(m => ({ ...m, [meta.name]: meta }));
    const res = await fetch('/api/admin/custom-groups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meta),
    });
    if (res.ok) toast.success(`"${meta.name}" settings saved`);
    else toast.error('Failed to save group settings');
  };

  // ── Base config ─────────────────────────────
  const [basePrice, setBasePrice] = useState(String(config.base_price));
  const [baseLabel, setBaseLabel] = useState(config.base_label);
  const [leadTime, setLeadTime] = useState(String(config.lead_time_days));
  const [savingConfig, setSavingConfig] = useState(false);

  const saveConfig = async () => {
    setSavingConfig(true);
    const res = await fetch('/api/admin/custom-config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_price: parseInt(basePrice) || 0,
        base_label: baseLabel,
        lead_time_days: parseInt(leadTime) || 0,
      }),
    });
    setSavingConfig(false);
    if (res.ok) toast.success('Base settings saved');
    else toast.error('Failed to save');
  };

  // ── New option form ─────────────────────────
  const [form, setForm] = useState({ group_name: '', name: '', description: '', price_delta: '' });
  const [adding, setAdding] = useState(false);

  const addOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.group_name.trim() || !form.name.trim()) {
      toast.error('Group and name are required');
      return;
    }
    setAdding(true);
    const res = await fetch('/api/admin/custom-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_name: form.group_name.trim(),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price_delta: parseInt(form.price_delta) || 0,
      }),
    });
    setAdding(false);
    if (res.ok) {
      toast.success('Option added');
      setForm({ group_name: form.group_name, name: '', description: '', price_delta: '' });
      router.refresh();
    } else {
      toast.error('Failed to add option');
    }
  };

  const toggle = async (opt: CustomOption) => {
    const res = await fetch(`/api/admin/custom-options/${opt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: !opt.is_available }),
    });
    if (res.ok) setOptions(os => os.map(o => o.id === opt.id ? { ...o, is_available: !o.is_available } : o));
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this option?')) return;
    const res = await fetch(`/api/admin/custom-options/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setOptions(os => os.filter(o => o.id !== id));
      toast.success('Deleted');
    }
  };

  // Group options for display
  const groups = options.reduce<Record<string, CustomOption[]>>((acc, o) => {
    (acc[o.group_name] ??= []).push(o);
    return acc;
  }, {});

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-900">Custom Cake</h1>
        <p className="text-stone-500 text-sm mt-0.5">Set the base price and the add-on options customers can choose.</p>
      </div>

      {/* Base config */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4">Base Cake</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Base Price (₦)</label>
            <input type="number" min="0" value={basePrice} onChange={e => setBasePrice(e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Label</label>
            <input value={baseLabel} onChange={e => setBaseLabel(e.target.value)} placeholder="Standard custom cake (serves ~12)" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Lead Time (days)</label>
            <input type="number" min="0" value={leadTime} onChange={e => setLeadTime(e.target.value)} className={inputCls} />
          </div>
        </div>
        <button onClick={saveConfig} disabled={savingConfig} className="mt-4 inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors disabled:opacity-60">
          <Save size={15} /> {savingConfig ? 'Saving…' : 'Save Base Settings'}
        </button>
      </div>

      {/* Add option */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-900 mb-4">Add an Option</h2>
        <form onSubmit={addOption} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_140px_auto] gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Group</label>
            <input value={form.group_name} onChange={e => setForm(f => ({ ...f, group_name: e.target.value }))} placeholder="Flavour" list="groups" className={inputCls} />
            <datalist id="groups">
              {Object.keys(groups).map(g => <option key={g} value={g} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Chocolate" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">+ Price (₦)</label>
            <input type="number" min="0" value={form.price_delta} onChange={e => setForm(f => ({ ...f, price_delta: e.target.value }))} placeholder="0" className={inputCls} />
          </div>
          <button type="submit" disabled={adding} className="inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 h-[42px]">
            <Plus size={15} /> Add
          </button>
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
              Short description <span className="text-stone-400 normal-case font-normal">(shown under the option, optional)</span>
            </label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Melty, rich & irresistible" maxLength={120} className={inputCls} />
          </div>
        </form>
      </div>

      {/* Options list */}
      {Object.keys(groups).length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 py-12 text-center text-stone-400 text-sm">
          No options yet. Add your first above.
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groups).map(([group, opts]) => {
            const meta = metaFor(group);
            return (
            <div key={group} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-100 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-stone-800 text-sm">{group}</h3>
                <div className="flex items-center gap-3">
                  {/* single / multi */}
                  <div className="flex rounded-full border border-stone-200 overflow-hidden text-[11px] font-semibold">
                    {(['single', 'multi'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => saveGroupMeta({ ...meta, selection_type: t })}
                        className={`px-2.5 py-1 transition-colors ${
                          meta.selection_type === t ? 'bg-amber-700 text-white' : 'bg-white text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        {t === 'single' ? 'Pick one' : 'Add many'}
                      </button>
                    ))}
                  </div>
                  {/* required (single only) */}
                  {meta.selection_type === 'single' && (
                    <button
                      onClick={() => saveGroupMeta({ ...meta, required: !meta.required })}
                      className={`flex items-center gap-1 text-[11px] font-semibold ${meta.required ? 'text-green-600' : 'text-stone-400'}`}
                      title="Customer must choose one"
                    >
                      {meta.required ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      Required
                    </button>
                  )}
                </div>
              </div>
              <div className="divide-y divide-stone-100">
                {opts.map(o => (
                  <div key={o.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <span className={`text-sm block ${o.is_available ? 'text-stone-800' : 'text-stone-400 line-through'}`}>{o.name}</span>
                        {o.description && <span className="text-xs text-stone-400 block truncate">{o.description}</span>}
                      </div>
                      <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">
                        {o.price_delta > 0 ? `+${formatPrice(o.price_delta)}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggle(o)} className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 ${o.is_available ? 'text-green-600' : 'text-stone-400'}`} title={o.is_available ? 'Available' : 'Hidden'}>
                        {o.is_available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => remove(o.id)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
