/**
 * build-messages.test.ts — pure unit test for buildMessages (NO Groq call).
 *
 * Asserts the single-source-of-truth prompt assembly: the hardened system
 * role, the labeled context passages, and the visitor question are all present
 * in the exact [system, user] message pair the streaming + non-streaming paths
 * share.
 */

import { describe, expect, it } from "vitest";
import { buildMessages } from "./generate";
import type { RetrievedChunk } from "./retrieve";

describe("buildMessages", () => {
  const contexts: RetrievedChunk[] = [
    {
      id: "c1",
      source: "projects",
      title: "SynthLab",
      type: "project",
      text: "SynthLab is a synthetic data studio.",
      score: 0.9,
    },
  ];

  it("returns [system, user] with hardened system role and context + question in the user turn", () => {
    const messages = buildMessages("What is SynthLab?", contexts);

    expect(messages).toHaveLength(2);

    expect(messages[0].role).toBe("system");
    const system = String(messages[0].content);
    // Distinctive hardened markers from SYSTEM_PROMPT.
    expect(system).toContain("PROMPT-INJECTION RESISTANCE");
    expect(system).toContain("single source of truth");

    expect(messages[1].role).toBe("user");
    const user = String(messages[1].content);
    // Context passage text is present.
    expect(user).toContain("synthetic data studio");
    // Context is labeled so injected text can't masquerade as instructions.
    expect(user).toContain("CONTEXT 1");
    expect(user).toContain("SynthLab");
    // The visitor question is present in its own block.
    expect(user).toContain("What is SynthLab?");
    expect(user).toContain("VISITOR QUESTION");
  });

  it("renders a placeholder when there are no contexts", () => {
    const messages = buildMessages("hi", []);
    const user = String(messages[1].content);
    expect(user).toContain("no context passages were retrieved");
  });
});
