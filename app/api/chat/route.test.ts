/**
 * route.test.ts — logic tests for the /api/chat POST handler.
 *
 * These cover the paths that run BEFORE any Groq/retrieve network call:
 *   - 400 on empty input
 *   - 400 on over-length input
 *   - 400 on malformed JSON
 *   - production never returns contexts even with the debug flag/header
 *
 * The 429 rate-limit behavior is covered deterministically in
 * lib/rate-limit.test.ts (the route uses a module-scope limiter that cannot be
 * reconfigured per-test without a network call for each permitted request).
 * A real streamed Groq generation is intentionally NOT exercised here to avoid
 * cost/flakiness; it is verified via `npm run build` + manual dev-server curl.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { MAX_QUERY_LENGTH } from "../../../lib/rag/generate";

const URL = "http://localhost/api/chat";

function post(body: unknown, init?: { url?: string; headers?: Record<string, string> }) {
  return POST(
    new Request(init?.url ?? URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...init?.headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

// Ensure the handler's 500 config gate passes in tests (loaded via dotenv).
beforeEach(() => {
  if (!process.env.GROQ_API_KEY) {
    // Provide a dummy so we exercise validation/debug logic, never a real call
    // in the tests below (they all return before any Groq request).
    process.env.GROQ_API_KEY = "test-key-not-used";
  }
});

describe("POST /api/chat — input validation", () => {
  it("returns 400 for empty message", async () => {
    const res = await post({ message: "" });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns 400 for over-length message", async () => {
    const res = await post({ message: "x".repeat(MAX_QUERY_LENGTH + 1) });
    expect(res.status).toBe(400);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await post("{ not json ");
    expect(res.status).toBe(400);
  });
});

describe("POST /api/chat — production debug gate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("never returns JSON contexts in production, even with debug flag + header", async () => {
    vi.stubEnv("NODE_ENV", "production");

    // Over-length input still fails fast at 400 (before any model call), and
    // critically the response is NOT the debug JSON-with-contexts envelope.
    const res = await post(
      { message: "x".repeat(MAX_QUERY_LENGTH + 1) },
      { url: `${URL}?debug=1`, headers: { "x-rag-debug": "1" } },
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).not.toHaveProperty("contexts");
  });
});
