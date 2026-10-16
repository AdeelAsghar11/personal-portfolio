import { describe, expect, it } from "vitest";
import { getStarterAnswer, normalizeQuery, STARTER_ANSWERS } from "./starters";

describe("lib/rag/starters", () => {
  it("normalizes queries correctly", () => {
    expect(normalizeQuery("What's Adeel's strongest project?")).toBe(
      "whats adeels strongest project",
    );
    expect(normalizeQuery("  Tell me about the HACKATHON wins!  ")).toBe(
      "tell me about the hackathon wins",
    );
  });

  it("matches starter 1 (strongest project)", () => {
    expect(getStarterAnswer("What's Adeel's strongest project?")).toBe(
      STARTER_ANSWERS.project,
    );
    expect(getStarterAnswer("What is his best project?")).toBe(
      STARTER_ANSWERS.project,
    );
  });

  it("matches starter 2 (competitions & hackathons)", () => {
    expect(getStarterAnswer("Tell me about the competition wins")).toBe(
      STARTER_ANSWERS.competitions,
    );
    expect(getStarterAnswer("Tell me about the hackathon wins")).toBe(
      STARTER_ANSWERS.competitions,
    );
    expect(getStarterAnswer("What competitions has Adeel won?")).toBe(
      STARTER_ANSWERS.competitions,
    );
  });

  it("matches starter 3 (tech stack)", () => {
    expect(getStarterAnswer("What's his AI/ML tech stack?")).toBe(
      STARTER_ANSWERS.stack,
    );
    expect(getStarterAnswer("What technologies does he use?")).toBe(
      STARTER_ANSWERS.stack,
    );
  });

  it("matches starter 4 (experience & education)", () => {
    expect(getStarterAnswer("What's his experience and education?")).toBe(
      STARTER_ANSWERS.experience,
    );
    expect(getStarterAnswer("Tell me about his education and experience")).toBe(
      STARTER_ANSWERS.experience,
    );
  });

  it("returns null for custom, un-cached queries", () => {
    expect(getStarterAnswer("How did he implement MobileNetV2?")).toBeNull();
    expect(getStarterAnswer("Can you write a poem about Adeel?")).toBeNull();
  });
});
