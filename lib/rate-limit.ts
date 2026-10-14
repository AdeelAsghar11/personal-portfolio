/**
 * rate-limit.ts — framework-agnostic per-key rate limiting (Task 6).
 *
 * NO Next.js / React / HTTP imports — usable from an API route AND a plain
 * script/test, and unit-testable with a deterministic injected clock.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * CLEAN SEAM FOR A DISTRIBUTED LIMITER
 *
 * The route depends ONLY on the `RateLimiter` interface and a single
 * module-level limiter instance. The default `createInMemoryRateLimiter()` is a
 * fixed-window counter kept in a process-local Map.
 *
 * IMPORTANT: this in-memory state is PER-INSTANCE. On Vercel (and any
 * horizontally-scaled host) each serverless/lambda instance has its OWN Map, so
 * the limit is NOT globally accurate — a client can get up to `max` requests
 * per instance. This is an acceptable, cheap first line of defense.
 *
 * To make it globally accurate later, implement the SAME `RateLimiter`
 * interface backed by Upstash Redis (e.g. `createUpstashRateLimiter()`) and
 * swap the single `createInMemoryRateLimiter()` call in the route for it. No
 * route logic changes. We deliberately do NOT add the Upstash dependency now.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type RateLimitResult = {
  /** Whether this request is permitted. */
  allowed: boolean;
  /** Requests remaining in the current window (0 when blocked). */
  remaining: number;
  /** The configured max requests per window. */
  limit: number;
  /** Seconds the client should wait before retrying (0 when allowed). */
  retryAfterSeconds: number;
};

/**
 * The seam. Any backend (in-memory, Upstash Redis, ...) implements this. The
 * route only ever sees `check(key)`.
 */
export interface RateLimiter {
  check(key: string): RateLimitResult;
}

export type RateLimitOptions = {
  /** Max requests allowed per window per key. Default 12. */
  max?: number;
  /** Window length in milliseconds. Default 60_000 (60s). */
  windowMs?: number;
  /** Clock function (injectable for deterministic tests). Default Date.now. */
  now?: () => number;
};

type WindowState = { count: number; windowStart: number };

/**
 * Create an in-memory fixed-window rate limiter.
 *
 * Per key we track { count, windowStart }. When `now() - windowStart` reaches
 * `windowMs` the window resets. Requests are allowed while `count < max`;
 * otherwise the request is blocked with a `retryAfterSeconds` computed from the
 * time left in the current window.
 */
export function createInMemoryRateLimiter(
  options: RateLimitOptions = {},
): RateLimiter {
  const max = options.max ?? 12;
  const windowMs = options.windowMs ?? 60_000;
  const now = options.now ?? Date.now;

  const buckets = new Map<string, WindowState>();

  return {
    check(key: string): RateLimitResult {
      const t = now();
      let state = buckets.get(key);

      if (!state || t - state.windowStart >= windowMs) {
        // Start (or reset) the window.
        state = { count: 0, windowStart: t };
        buckets.set(key, state);
      }

      if (state.count < max) {
        state.count += 1;
        return {
          allowed: true,
          remaining: max - state.count,
          limit: max,
          retryAfterSeconds: 0,
        };
      }

      const msLeft = state.windowStart + windowMs - t;
      const retryAfterSeconds = Math.max(1, Math.ceil(msLeft / 1000));
      return {
        allowed: false,
        remaining: 0,
        limit: max,
        retryAfterSeconds,
      };
    },
  };
}
