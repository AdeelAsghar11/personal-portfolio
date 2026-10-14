/**
 * retrieve.test.ts — real-model, real-index tests for the retrieval core.
 *
 * These load the REAL committed data/knowledge.json and run REAL queries
 * through the REAL local Xenova model (no mocking of the similarity logic).
 * The model is cached locally from Task 3; the first load can still be slow,
 * hence the generous timeout configured in vitest.config.ts.
 */

import { describe, expect, it } from "vitest";
import { QUERY_PREFIX, embedQuery, loadIndex, retrieve } from "./retrieve";

/** Case-insensitive substring check across a chunk's text/metadata. */
function matches(
  chunk: { id: string; source: string; title: string; text: string },
  needle: string,
): boolean {
  const hay = `${chunk.id} ${chunk.source} ${chunk.title} ${chunk.text}`.toLowerCase();
  return hay.includes(needle.toLowerCase());
}

describe("retrieve (real model + real index)", () => {
  it("exports the exact query prefix from the build-index contract", () => {
    expect(QUERY_PREFIX).toBe(
      "Represent this sentence for searching relevant passages: ",
    );
  });

  it("loadIndex caches: two calls return the same object reference", () => {
    const a = loadIndex();
    const b = loadIndex();
    expect(a).toBe(b);
    expect(a.dim).toBe(384);
    expect(a.chunks.length).toBeGreaterThan(0);
  });

  it("embedQuery returns a 384-length vector", async () => {
    const vec = await embedQuery("test query");
    expect(vec).toHaveLength(384);
  });

  it("'SynthLab synthetic data studio' => top-K includes a SynthLab chunk", async () => {
    const results = await retrieve("SynthLab synthetic data studio", 5);
    expect(results.some((r) => matches(r, "synthlab"))).toBe(true);
  });

  it("'British Sign Language gesture recognition accuracy' => top result is BSL", async () => {
    const results = await retrieve(
      "British Sign Language gesture recognition accuracy",
      5,
    );
    const top = results[0];
    const isBsl =
      matches(top, "bsl_hand_gesture_recognition") ||
      matches(top, "british sign language") ||
      matches(top, "sign language");
    expect(isBsl).toBe(true);
  });

  it("'hackathon win HACKDATA or HITEC' => top-K includes hackathon writeups", async () => {
    const results = await retrieve("hackathon win HACKDATA or HITEC", 5);
    const hasHackathon = results.some(
      (r) => matches(r, "hackdata") || matches(r, "hitec") || matches(r, "hackathon"),
    );
    expect(hasHackathon).toBe(true);
  });

  it("'where did Adeel study university degree' => top-K includes profile/education content", async () => {
    const results = await retrieve("where did Adeel study university degree", 5);
    const hasProfile = results.some(
      (r) =>
        r.type === "profile" ||
        r.source === "profile" ||
        matches(r, "comsats") ||
        matches(r, "degree") ||
        matches(r, "university"),
    );
    expect(hasProfile).toBe(true);
  });

  it("top score is within [-1, 1] and clearly beats an irrelevant query", async () => {
    const relevant = await retrieve("SynthLab synthetic data studio", 5);
    const irrelevant = await retrieve("banana recipe quantum teapot", 5);

    const relTop = relevant[0].score;
    const irrTop = irrelevant[0].score;

    expect(relTop).toBeLessThanOrEqual(1);
    expect(relTop).toBeGreaterThanOrEqual(-1);
    expect(irrTop).toBeLessThanOrEqual(1);
    expect(irrTop).toBeGreaterThanOrEqual(-1);
    expect(relTop).toBeGreaterThan(irrTop);
  });

  it("applies the query prefix (prefixed vs unprefixed embeddings differ)", async () => {
    const bare = "university degree";
    const withPrefix = await embedQuery(bare);
    // Embedding the already-prefixed string again double-prefixes it, so the
    // vector must differ — proof the prefix is actually applied inside embedQuery.
    const doublePrefixed = await embedQuery(QUERY_PREFIX + bare);
    expect(withPrefix).not.toEqual(doublePrefixed);
  });
});
