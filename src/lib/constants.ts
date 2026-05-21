export const DELIVERY_FEE = 1000;
export const FREE_DELIVERY_THRESHOLD = 10_000;

export function calcDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
