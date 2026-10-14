/**
 * app/api/feedback/route.ts — lightweight chat feedback log endpoint (Task 7).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WIRE FORMAT
 *
 * POST /api/feedback with JSON body { rating: "up" | "down", question?, answer? }.
 * The ChatWidget fires this fire-and-forget when a user thumbs a completed
 * assistant message. It is intentionally STORAGE-FREE: a successful call simply
 * logs ONE structured line (lengths only, never the raw user text) and returns
 * 204 with an empty body as fast as possible.
 *
 * Errors are JSON (never thrown):
 *   400 { error, reason? }  invalid JSON / rating not "up"|"down"
 *   429 { error }           light per-IP rate limit (+ Retry-After header)
 *
 * Missing/garbage question/answer are tolerated: coerced to strings and capped.
 * ───────────────────────────────────────────────────────────────────────────
 */

import {
  createInMemoryRateLimiter,
  type RateLimiter,
} from "../../../lib/rate-limit";

// Node runtime: parity with the chat route; no edge-specific needs.
export const runtime = "nodejs";

// Cap stored/forwarded text sizes so a hostile body can't bloat logs.
const MAX_TEXT_LENGTH = 2000;

// Light per-IP limiter (its own instance, more generous than chat since this
// is a cheap no-op log). PER-INSTANCE in-memory state (see lib/rate-limit.ts).
const feedbackLimiter: RateLimiter = createInMemoryRateLimiter({
  max: 30,
  windowMs: 60_000,
});

/** JSON error helper (mirrors the chat route). */
function jsonError(
  status: number,
  body: Record<string, unknown>,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/**
 * Derive the client IP: first hop of x-forwarded-for, then x-real-ip, else
 * "unknown". Same logic as the chat route for a consistent limiter key.
 */
function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real && real.trim()) return real.trim();
  return "unknown";
}

/** Coerce an unknown value to a trimmed, length-capped string. */
function cappedString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.slice(0, MAX_TEXT_LENGTH);
}

export async function POST(req: Request): Promise<Response> {
  // (a) Light rate limit (per client IP).
  const ip = getClientIp(req);
  const limit = feedbackLimiter.check(ip);
  if (!limit.allowed) {
    return jsonError(
      429,
      { error: "Too many requests. Please slow down and try again shortly." },
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  // (b) Parse body safely — never throw on bad input.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, { error: "Invalid JSON body." });
  }

  const parsed = (body ?? {}) as {
    rating?: unknown;
    question?: unknown;
    answer?: unknown;
  };

  // (c) Validate rating is exactly "up" or "down".
  if (parsed.rating !== "up" && parsed.rating !== "down") {
    return jsonError(400, {
      error: "Invalid input.",
      reason: 'rating must be "up" or "down".',
    });
  }
  const rating = parsed.rating;

  // (d) Coerce + cap text (tolerate missing/garbage fields).
  const question = cappedString(parsed.question);
  const answer = cappedString(parsed.answer);

  // (e) Log a single structured line — lengths only, not the raw user text.
  console.log(
    JSON.stringify({
      evt: "chat_feedback",
      rating,
      qLen: question.length,
      aLen: answer.length,
      ts: new Date().toISOString(),
    }),
  );

  // (f) Fast, empty, storage-free acknowledgement.
  return new Response(null, { status: 204 });
}
