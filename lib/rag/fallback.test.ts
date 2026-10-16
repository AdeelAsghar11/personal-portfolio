import { describe, expect, it } from "vitest";
import {
  formatExtractiveFallback,
  streamTextInChunks,
} from "./fallback";
import { RetrievedChunk } from "./retrieve";

describe("lib/rag/fallback", () => {
  it("streamTextInChunks emits all characters as a readable stream", async () => {
    const text = "Hello from the multi-tier fallback pipeline!";
    const stream = streamTextInChunks(text, 10);
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value);
    }

    expect(accumulated).toBe(text);
  });

  it("formatExtractiveFallback formats retrieved chunks into a clear summary", () => {
    const fakeContexts: RetrievedChunk[] = [
      {
        id: "proj#1",
        source: "projects",
        title: "Sortd",
        type: "project",
        text: "AI-powered content capture platform winning 1st place at HACKDATA V1.",
        score: 0.95,
      },
    ];

    const result = formatExtractiveFallback("What is Sortd?", fakeContexts);
    expect(result).toContain("Sortd");
    expect(result).toContain("HACKDATA V1");
    expect(result).toContain("adeelyt157@gmail.com");
  });

  it("formatExtractiveFallback handles empty contexts gracefully", () => {
    const result = formatExtractiveFallback("Random query", []);
    expect(result).toContain("adeelyt157@gmail.com");
  });
});
