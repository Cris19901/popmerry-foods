import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// ── In-memory fallback (used when Upstash env vars are not set) ──────────────
const inMemory = new Map<string, number[]>();

function inMemoryLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (inMemory.get(ip) ?? []).filter(t => t > now - windowMs);
  if (timestamps.length >= limit) return false;
  timestamps.push(now);
  inMemory.set(ip, timestamps);
  return true;
}

// ── Upstash Redis limiter (used in production when env vars are set) ─────────
let redisLimiter: Ratelimit | null = null;

try {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token && url.startsWith('https://')) {
    const redis = new Redis({ url, token });
    redisLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: 'popmerry_rl',
    });
  }
} catch {
  // Upstash unavailable — fall back to in-memory limiter silently
}

// ── Public helper ─────────────────────────────────────────────────────────────
// Returns true = allow, false = block
export async function rateLimitAsync(ip: string): Promise<boolean> {
  if (redisLimiter) {
    const { success } = await redisLimiter.limit(ip);
    return success;
  }
  return inMemoryLimit(ip, 10, 60_000);
}

// Synchronous fallback kept for routes that haven't been migrated yet
export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  return inMemoryLimit(ip, limit, windowMs);
}
