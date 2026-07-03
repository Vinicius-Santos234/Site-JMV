import { Ratelimit } from '@upstash/ratelimit';
import { createClient } from '@vercel/kv';

const MAX = 5;
const WINDOW = '10 m';
const WINDOW_MS = 10 * 60 * 1000;

const hits = new Map();
function memoryLimited(ip) {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX) {
    hits.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(ip, timestamps);
  return false;
}

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit =
  url && token
    ? new Ratelimit({
        redis: createClient({ url, token }),
        limiter: Ratelimit.slidingWindow(MAX, WINDOW),
        prefix: 'jmv:contact',
      })
    : null;

export async function isRateLimited(ip) {
  if (ratelimit) {
    try {
      const { success } = await ratelimit.limit(ip);
      return !success;
    } catch (err) {
      console.error('[rate-limit] KV indisponível, usando fallback:', err);
      return memoryLimited(ip);
    }
  }
  return memoryLimited(ip);
}
