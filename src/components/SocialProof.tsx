'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const NOTIFICATIONS = [
  { name: 'Chidinma', area: 'Lekki', product: 'Cream Cheese Banana Cake', mins: 3, img: '1569762404472-026308ba6b64' },
  { name: 'Emeka', area: 'Victoria Island', product: 'Almond Croissants', mins: 7, img: '1691480162735-9b91238080f6' },
  { name: 'Folake', area: 'Ibadan', product: 'Family Bundle', mins: 12, img: '1587241321921-91a834d6d191' },
  { name: 'Tunde', area: 'Ikoyi', product: 'Caramel Popcorn', mins: 5, img: '1523207911345-32501502db22' },
  { name: 'Amaka', area: 'Ajah', product: 'Chocolate Chip Banana Cake', mins: 9, img: '1606983340126-99ab4feaa64a' },
  { name: 'Bello', area: 'Ilorin', product: 'Classic Butter Croissants', mins: 14, img: '1623334044303-241021148842' },
  { name: 'Sade', area: 'Yaba', product: 'Mini Banana Cupcakes', mins: 2, img: '1651378527289-36b9e2b8be58' },
  { name: 'Kemi', area: 'Surulere', product: 'Caramel Drizzle Banana Cake', mins: 18, img: '1602483289282-f9c08b1f9992' },
];

export default function SocialProof() {
  const [current, setCurrent] = useState<typeof NOTIFICATIONS[0] | null>(null);
  const [visible, setVisible] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Shuffle order
    const shuffled = [...NOTIFICATIONS].sort(() => Math.random() - 0.5);

    const show = () => {
      const notif = shuffled[indexRef.current % shuffled.length];
      indexRef.current++;
      setCurrent(notif);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    // First appearance after 8s, then every 18s
    const first = setTimeout(show, 8000);
    const interval = setInterval(show, 18000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (!current) return null;

  return (
    <div
      className={`fixed bottom-24 left-4 z-40 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-3.5 flex items-center gap-3 max-w-[280px]">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-amber-100">
          <Image
            src={`https://images.unsplash.com/photo-${current.img}?auto=format&fit=crop&w=40&h=40&q=80`}
            alt={current.product}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p className="text-stone-800 text-xs font-semibold leading-tight">
            {current.name} from {current.area}
          </p>
          <p className="text-stone-500 text-[11px] mt-0.5 truncate">
            ordered <span className="text-amber-700 font-medium">{current.product}</span>
          </p>
          <p className="text-stone-400 text-[10px] mt-0.5">{current.mins} min ago</p>
        </div>
      </div>
    </div>
  );
}
