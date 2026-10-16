/**
 * fallback.ts — Multi-tier failover and streaming utilities (Tier 3 & Tier 4).
 *
 * Implements:
 *   - streamGemini()            : Tier 3 secondary LLM via Google Gemini Flash API.
 *   - formatExtractiveFallback(): Tier 4 offline RAG summary from local retrieval.
 *   - streamTextInChunks()      : Smoothly streams any string as plain text chunks.
 *
 * NO extra npm dependencies required (uses built-in fetch and Web Streams).
 */

import type { RetrievedChunk } from "./retrieve";
import { CONTACT_EMAIL, CONTACT_SECTION } from "./generate";

export const GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Split text into progressive chunks and yield them as a ReadableStream
 * so the frontend UI gets the same dynamic, real-time typing experience.
 */
export function streamTextInChunks(
  text: string,
  chunkSize = 32,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      let index = 0;
      while (index < text.length) {
        const nextIndex = Math.min(index + chunkSize, text.length);
        const chunk = text.slice(index, nextIndex);
        controller.enqueue(encoder.encode(chunk));
        index = nextIndex;
      }
      controller.close();
    },
  });
}

/**
 * Format retrieved contexts into an accurate, readable bulleted summary (Tier 4).
 * Used when external LLM APIs (Groq, Gemini) are temporarily unavailable or unconfigured.
 */
export function formatExtractiveFallback(
  query: string,
  contexts: RetrievedChunk[],
): string {
  if (contexts.length === 0) {
    return `I don't have that specific information in Adeel's portfolio right now. Feel free to contact Adeel directly at [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) or via the [${CONTACT_SECTION}](${CONTACT_SECTION}) section.`;
  }

  const highlights = contexts
    .slice(0, 3)
    .map((c) => {
      // Clean up text snippet: strip long markdown separators if any
      const snippet = c.text
        .replace(/---.*?---/g, "")
        .replace(/\s+/g, " ")
        .trim();
      // Keep snippet to a reasonable length
      const trimmed =
        snippet.length > 280 ? snippet.slice(0, 280).trimEnd() + "..." : snippet;
      return `* **${c.title}** (${c.source}): ${trimmed}`;
    })
    .join("\n\n");

  return `Here is what I found in Adeel's portfolio regarding your question:\n\n${highlights}\n\nFor more details or custom inquiries, you can reach Adeel directly at [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) or through the [contact form](${CONTACT_SECTION}).`;
}

/**
 * Stream a chat response from Google Gemini Flash via SSE (Tier 3).
 * Returns null if the call fails, allowing automatic failover to Tier 4.
 */
export async function streamGemini(
  systemInstruction: string,
  userPrompt: string,
  apiKey: string,
): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!res.ok || !res.body) {
      return null;
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = res.body.getReader();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const jsonStr = trimmed.slice(6).trim();
                if (jsonStr === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(jsonStr) as {
                    candidates?: {
                      content?: {
                        parts?: { text?: string }[];
                      };
                    }[];
                  };
                  const chunkText =
                    parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (chunkText) {
                    controller.enqueue(encoder.encode(chunkText));
                  }
                } catch {
                  // Ignore JSON parse errors on partial chunks
                }
              }
            }
          }
          controller.close();
        } catch {
          try {
            controller.close();
          } catch {
            // Already closed
          }
        }
      },
    });
  } catch {
    return null;
  }
}
