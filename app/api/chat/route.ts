/**
 * app/api/chat/route.ts — streaming RAG chat endpoint (Task 6).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * WIRE FORMAT (normal mode)
 *
 * POST /api/chat with JSON body { message: string } (also accepts { query }).
 * On success the response is a STREAMED, plain chunked body:
 *   Content-Type: text/plain; charset=utf-8
 * Each chunk is raw assistant text (the model's token deltas) with NO SSE
 * framing, NO JSON envelope. Consume it by reading the fetch Response body as a
 * stream and appending each decoded chunk. This is the simplest format for the
 * later chat UI. (SSE was intentionally not used.)
 *
 * Error / short-circuit responses are JSON (never streamed):
 *   400 { error, reason? }  invalid JSON / failed input validation
 *   429 { error }           rate limit exceeded (+ Retry-After header)
 *   500 { error }           server misconfiguration (e.g. missing GROQ_API_KEY)
 * An injection-detected request is NOT an error: it returns a friendly refusal
 * streamed as plain text with HTTP 200 (mirrors answerQuestion), never calling
 * the big generation model.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * DEV-ONLY DEBUG MODE (for the RAGAS eval harness)
 *
 * When NODE_ENV !== "production" AND the request opts in via `?debug=1` OR
 * header `x-rag-debug: 1`, the endpoint uses the NON-streaming path and returns
 * JSON instead of a stream:
 *   200 { answer: string, contexts: RetrievedChunk[], grounded: boolean, refused: boolean }
 * The harness can parse this directly (Content-Type application/json).
 *
 * SECURITY: the NODE_ENV check is evaluated FIRST, so in production the debug
 * flag/header can NEVER expose contexts — no code path returns context data
 * when NODE_ENV === "production".
 * ───────────────────────────────────────────────────────────────────────────
 */

import Groq from "groq-sdk";
import {
  GENERATION_MODEL,
  buildMessages,
  checkInjection,
  generateAnswer,
  validateInput,
} from "../../../lib/rag/generate";
import { retrieve } from "../../../lib/rag/retrieve";
import { getStarterAnswer } from "../../../lib/rag/starters";
import {
  formatExtractiveFallback,
  streamGemini,
  streamTextInChunks,
} from "../../../lib/rag/fallback";
import {
  createInMemoryRateLimiter,
  type RateLimiter,
} from "../../../lib/rate-limit";

// Node runtime (NOT edge): retrieve() runs @xenova/transformers in-process and
// generation uses groq-sdk — both need Node, not the edge runtime.
export const runtime = "nodejs";

// How many context chunks to retrieve (tunable).
const RETRIEVE_TOP_K = 5;

// Friendly refusal reused for injection short-circuit (mirrors answerQuestion).
const INJECTION_REFUSAL =
  "I can only help with questions about Adeel and his work. Feel free to ask about his projects, skills, or experience.";

const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Accel-Buffering": "no",
};

// Module-level limiter behind the RateLimiter seam. Swap this single call for
// an Upstash-backed limiter later without touching the route logic below.
// NOTE: in-memory state is PER-INSTANCE on Vercel (see lib/rate-limit.ts).
const rateLimiter: RateLimiter = createInMemoryRateLimiter();

/** JSON error helper. */
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

/** Stream a fixed plain-text string (used for injection refusal). */
function streamText(text: string): Response {
  return new Response(streamTextInChunks(text), {
    status: 200,
    headers: STREAM_HEADERS,
  });
}

/**
 * Derive the client IP: first hop of x-forwarded-for, then x-real-ip, else
 * "unknown". Single source for the rate-limit key.
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

export async function POST(req: Request): Promise<Response> {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  // (b) Parse body safely.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, { error: "Invalid JSON body." });
  }

  const parsed = (body ?? {}) as { message?: unknown; query?: unknown };
  const message = parsed.message ?? parsed.query;

  // (c) Input validation (enforces type, non-empty, max length).
  const validation = validateInput(message);
  if (!validation.ok) {
    return jsonError(400, {
      error: "Invalid input.",
      reason: validation.reason,
    });
  }
  const query = message as string;

  // (d) Rate limiting (per client IP).
  const ip = getClientIp(req);
  const limit = rateLimiter.check(ip);
  if (!limit.allowed) {
    return jsonError(
      429,
      { error: "Too many requests. Please slow down and try again shortly." },
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  // (e) Debug gating. NODE_ENV check FIRST so production can never expose
  // contexts, even with the header/param set.
  const url = new URL(req.url);
  const debug =
    process.env.NODE_ENV !== "production" &&
    (url.searchParams.get("debug") === "1" ||
      req.headers.get("x-rag-debug") === "1");

  // (f) Injection pre-filter: short-circuit WITHOUT calling the big model.
  const guard = await checkInjection(query);
  if (guard.injection) {
    if (debug) {
      return Response.json({
        answer: INJECTION_REFUSAL,
        contexts: [],
        grounded: false,
        refused: true,
      });
    }
    return streamText(INJECTION_REFUSAL);
  }

  // ── Tier 1: Instant Pre-baked Starters (0ms latency, 0 tokens consumed) ──────
  // Common starter chips like "What's Adeel's strongest project?" are served
  // instantly with 100% uptime and verified accuracy.
  const starterAnswer = getStarterAnswer(query);
  if (starterAnswer && !debug) {
    return new Response(streamTextInChunks(starterAnswer), {
      status: 200,
      headers: STREAM_HEADERS,
    });
  }

  // (g) Retrieve grounding context.
  const contexts = await retrieve(query, RETRIEVE_TOP_K);

  // (h) Debug mode: non-streaming JSON with contexts (dev only — see gate).
  if (debug) {
    const result = await generateAnswer(query, contexts);
    return Response.json({
      answer: result.answer,
      contexts,
      grounded: result.grounded,
      refused: result.refused,
    });
  }

  // ── Tier 2: Primary LLM (Groq fast streaming) ──────────────────────────────
  if (groqKey) {
    try {
      const client = new Groq({ apiKey: groqKey });
      const groqStream = await client.chat.completions.create({
        model: GENERATION_MODEL,
        messages: buildMessages(query, contexts),
        temperature: 0.2,
        max_tokens: 600,
        stream: true,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            // groq-sdk streaming returns an async iterable of chunks.
            for await (const chunk of groqStream as AsyncIterable<{
              choices?: { delta?: { content?: string | null } }[];
            }>) {
              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) {
                controller.enqueue(encoder.encode(delta));
              }
            }
            controller.close();
          } catch {
            try {
              controller.close();
            } catch {}
          }
        },
      });

      return new Response(stream, {
        status: 200,
        headers: STREAM_HEADERS,
      });
    } catch {
      // Groq failed (429 rate limit / daily token cap exhausted, 502, or network).
      // Seamlessly fall through to Tier 3.
    }
  }

  // ── Tier 3: Secondary LLM (Google Gemini Flash fallback) ───────────────────
  if (geminiKey) {
    try {
      const messages = buildMessages(query, contexts);
      const systemText =
        (messages.find((m) => m.role === "system")?.content as string) || "";
      const userText =
        (messages.find((m) => m.role === "user")?.content as string) || query;

      const geminiStream = await streamGemini(systemText, userText, geminiKey);
      if (geminiStream) {
        return new Response(geminiStream, {
          status: 200,
          headers: STREAM_HEADERS,
        });
      }
    } catch {
      // Gemini failed. Seamlessly fall through to Tier 4.
    }
  }

  // ── Tier 4: Local Extractive Fallback (Zero external API dependencies) ──────
  // If all external LLMs are down or keys are unconfigured, format the retrieved
  // in-memory passages into a clean grounded summary with direct contact links.
  const fallbackText = formatExtractiveFallback(query, contexts);
  return new Response(streamTextInChunks(fallbackText), {
    status: 200,
    headers: STREAM_HEADERS,
  });
}
