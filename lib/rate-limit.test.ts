/**
 * rate-limit.test.ts — deterministic unit tests for the in-memory limiter.
 *
 * No network, no real timers: an injected `now()` clock advances time so the
 * window behavior is fully deterministic.
 */

import { describe, expect, it } from "vitest";
import { createInMemoryRateLimiter } from "./rate-limit";

describe("createInMemoryRateLimiter", () => {
  it("allows up to max, then blocks with a positive retryAfter", () => {
    let clock = 0;
    const limiter = createInMemoryRateLimiter({
      max: 3,
      windowMs: 1000,
      now: () => clock,
    });

    expect(limiter.check("ip").allowed).toBe(true);
    expect(limiter.check("ip").allowed).toBe(true);
    const third = limiter.check("ip");
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    const blocked = limiter.check("ip");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.limit).toBe(3);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    let clock = 0;
    const limiter = createInMemoryRateLimiter({
      max: 2,
      windowMs: 1000,
      now: () => clock,
    });

    expect(limiter.check("ip").allowed).toBe(true);
    expect(limiter.check("ip").allowed).toBe(true);
    expect(limiter.check("ip").allowed).toBe(false);

    // Advance past the window → budget refreshes.
    clock = 1000;
    expect(limiter.check("ip").allowed).toBe(true);
  });

  it("tracks independent budgets per key", () => {
    let clock = 0;
    const limiter = createInMemoryRateLimiter({
      max: 1,
      windowMs: 1000,
      now: () => clock,
    });

    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
    // Different key still has its full budget.
    expect(limiter.check("b").allowed).toBe(true);
  });
});
