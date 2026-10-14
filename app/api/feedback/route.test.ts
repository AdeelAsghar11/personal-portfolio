/**
 * route.test.ts — logic tests for the /api/feedback POST handler.
 *
 * Covers the validation + coercion paths (no network, no storage):
 *   - 204 on a valid { rating: "up", question, answer }
 *   - 400 on an invalid rating ("maybe")
 *   - 400 on malformed JSON
 *   - oversized answer is capped (not thrown) → still 204
 *
 * Rate-limit behavior is covered deterministically in lib/rate-limit.test.ts;
 * the route uses a module-scope limiter (max 30/min) that these few requests
 * never trip.
 */

import { describe, expect, it } from "vitest";
import { POST } from "./route";

const URL = "http://localhost/api/feedback";

function post(
  body: unknown,
  init?: { headers?: Record<string, string> },
) {
  return POST(
    new Request(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...init?.headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/feedback", () => {
  it("returns 204 for a valid up rating", async () => {
    const res = await post({ rating: "up", question: "q", answer: "a" });
    expect(res.status).toBe(204);
  });

  it("returns 204 for a valid down rating", async () => {
    const res = await post({ rating: "down", question: "q", answer: "a" });
    expect(res.status).toBe(204);
  });

  it("returns 400 for an invalid rating", async () => {
    const res = await post({ rating: "maybe" });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await post("{ not json ");
    expect(res.status).toBe(400);
  });

  it("caps an oversized answer without throwing (still 204)", async () => {
    const res = await post({
      rating: "up",
      question: "q",
      answer: "x".repeat(5000),
    });
    expect(res.status).toBe(204);
  });
});
