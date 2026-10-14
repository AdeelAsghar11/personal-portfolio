/**
 * stream.route.test.ts — HERMETIC streaming happy-path (no network, no live Groq).
 *
 * Stubs groq-sdk so the guard completion returns a benign label and the
 * generation completion (stream: true) returns an async-iterable of fake chunks.
 * retrieve() is mocked to a fixed small context so no local embedding model
 * loads. Asserts /api/chat returns 200 text/plain and pipes the deltas so the
 * streamed body concatenates to the expected text.
 *
 * Fully offline — complements the live-Groq safety tests in
 * lib/rag/generate.test.ts; it does not depend on Groq quota.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createMock = vi.fn();

vi.mock("groq-sdk", () => {
  class FakeGroq {
    chat = { completions: { create: createMock } };
    constructor() {
      // no-op; never hits the network
    }
  }
  return { default: FakeGroq };
});

vi.mock("../../../lib/rag/retrieve", () => ({
  retrieve: vi.fn(async () => [
    {
      id: "profile#0",
      source: "profile",
      title: "About Adeel Asghar",
      type: "profile",
      text: "Adeel Asghar is an AI/ML engineer.",
      score: 0.9,
    },
  ]),
}));

import { POST } from "./route";
import { INJECTION_MODEL } from "../../../lib/rag/generate";

const URL = "http://localhost/api/chat";

function post(body: unknown) {
  return POST(
    new Request(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

/** Build an async-iterable of fake streaming chunks (groq-sdk shape). */
function fakeStream(parts: string[]) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const content of parts) {
        yield { choices: [{ delta: { content } }] };
      }
    },
  };
}

beforeEach(() => {
  createMock.mockReset();
  process.env.GROQ_API_KEY = "test-key-not-used";

  createMock.mockImplementation(
    ({ model, stream }: { model: string; stream?: boolean }) => {
      // Guard model: return a benign (non-injection) label.
      if (model === INJECTION_MODEL) {
        return Promise.resolve({
          choices: [{ message: { content: "benign" } }],
        });
      }
      // Generation model streaming: return the fake chunk iterator.
      if (stream) {
        return Promise.resolve(fakeStream(["Hello", " world"]));
      }
      return Promise.reject(new Error(`unexpected call for model ${model}`));
    },
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/chat — streaming happy path (hermetic)", () => {
  it("pipes streamed deltas as text/plain and concatenates to the full answer", async () => {
    const res = await post({ message: "What is SynthLab?" });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/plain");

    const text = await res.text();
    expect(text).toBe("Hello world");
  });
});
