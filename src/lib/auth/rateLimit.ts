/* ─────────────────────────────────────────────────────────────
   RATE LIMITING & BRUTE FORCE PROTECTION (In-memory token bucket)
   Prevents credential stuffing & brute-force login attacks.
───────────────────────────────────────────────────────────── */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateMap = new Map<string, RateLimitRecord>();

/**
 * Checks if a key (e.g. `login:${emailNormalized}`) has exceeded rate limits.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes window
): { allowed: boolean; remaining: number; retryAfterSecs?: number } {
  const now = Date.now();
  const record = rateMap.get(key);

  if (!record || now > record.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSecs = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSecs };
  }

  record.count += 1;
  rateMap.set(key, record);
  return { allowed: true, remaining: maxAttempts - record.count };
}

/**
 * Resets rate limit counter upon successful authentication.
 */
export function resetRateLimit(key: string): void {
  rateMap.delete(key);
}
