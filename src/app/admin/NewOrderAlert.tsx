'use client';

import { useEffect, useRef, useState } from 'react';

export default function NewOrderAlert() {
  const lastCountRef = useRef<number | null>(null);
  const [permissionAsked, setPermissionAsked] = useState(false);

  // Request notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default' && !permissionAsked) {
      setPermissionAsked(true);
      Notification.requestPermission();
    }
  }, [permissionAsked]);

  useEffect(() => {
    const beep = () => {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch {}
    };

    const notify = (count: number) => {
      beep();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🛒 New PopMerry Order!', {
          body: `You have ${count} new order${count > 1 ? 's' : ''} waiting.`,
          icon: '/favicon.ico',
        });
      }
    };

    const poll = async () => {
      try {
        const res = await fetch('/api/admin/orders/new-count', { cache: 'no-store' });
        if (!res.ok) return;
        const { count } = await res.json();
        if (lastCountRef.current === null) {
          lastCountRef.current = count;
          return;
        }
        const newOrders = count - lastCountRef.current;
        if (newOrders > 0) {
          notify(newOrders);
          lastCountRef.current = count;
        }
      } catch {}
    };

    // Poll every 30 seconds
    poll();
    const interval = setInterval(poll, 30_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
