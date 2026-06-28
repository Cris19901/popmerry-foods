'use client';

import { useEffect } from 'react';

// Captures a ?ref=CODE query param anywhere on the site and stores it
// so the checkout can auto-apply the referral discount later.
export default function RefCapture() {
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get('ref');
      if (ref) {
        localStorage.setItem('popmerry_ref', ref.toUpperCase());
      }
    } catch {}
  }, []);

  return null;
}
