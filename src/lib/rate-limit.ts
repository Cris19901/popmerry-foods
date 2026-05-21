const requests = new Map<string, number[]>();

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (requests.get(ip) ?? []).filter(t => t > windowStart);
  if (timestamps.length >= limit) return false;
  timestamps.push(now);
  requests.set(ip, timestamps);
  return true;
}
