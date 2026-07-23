export const DELIVERY_FEE = 1000;
export const FREE_DELIVERY_THRESHOLD = 10_000;

export function calcDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

// ── Site ─────────────────────────────────────────────────────────────
export const SITE_URL = 'https://popmerryfoods.com.ng';

// ── Contact ──────────────────────────────────────────────────────────
// International format for wa.me / tel: links (no +, no spaces)
export const WHATSAPP_NUMBER = '2347039571698';
// Human-readable versions for display
export const CONTACT_PHONE_INTL = '+234 703 957 1698';
export const CONTACT_PHONE_LOCAL = '07039571698';

/** Build a WhatsApp deep link, optionally pre-filled with a message. */
export function waLink(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
