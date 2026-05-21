'use client';

import { formatPrice } from '@/lib/products-data';

interface Props {
  data: Record<string, number>;
}

export default function RevenueChart({ data }: Props) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div>
      <div className="flex items-end gap-1.5 h-40">
        {entries.map(([date, value]) => {
          const pct = (value / max) * 100;
          const label = new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              {value > 0 && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {formatPrice(value)}
                </div>
              )}
              <div className="w-full flex items-end" style={{ height: '130px' }}>
                <div
                  className={`w-full rounded-t-md transition-all ${value > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-100'}`}
                  style={{ height: `${Math.max(pct, value > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="text-[9px] text-stone-400 leading-none">{label}</span>
            </div>
          );
        })}
      </div>
      {max === 1 && (
        <p className="text-center text-stone-400 text-xs mt-4">No paid orders yet — chart will populate as orders come in.</p>
      )}
    </div>
  );
}
