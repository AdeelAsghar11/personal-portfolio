/**
 * generate.missing-key.test.ts — HERMETIC (no network, no live Groq).
 *
 * Asserts that generateAnswer throws a clear, explicit error when
 * GROQ_API_KEY is absent, WITHOUT making any network call. getGroqClient()
 * throws before any Groq request is constructed, so this is fully offline and
 * independent of Groq quota. We call generateAnswer(query, []) directly with an
 * empty context array so retrieve() / the embedding model is never invoked.
 *
 * This complements (does NOT replace) the live-Groq safety tests in
 * generate.test.ts.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { generateAnswer } from "./generate";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("generateAnswer — missing GROQ_API_KEY (hermetic)", () => {
  it("throws a clear GROQ_API_KEY error with no network call", async () => {
    vi.stubEnv("GROQ_API_KEY", "");

    await expect(generateAnswer("What is SynthLab?", [])).rejects.toThrow(
      /GROQ_API_KEY/,
    );
  });
});
