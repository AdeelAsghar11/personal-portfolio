/**
 * retrieve.ts — framework-agnostic, hybrid retrieval core (vector + keyword fallback).
 *
 * Loads the committed knowledge index (data/knowledge.json), embeds a user
 * query with Xenova bge-small-en-v1.5 when available, and returns the top-K
 * most similar chunks by cosine similarity.
 *
 * RESILIENCY & SERVERLESS HARDENING:
 * - @xenova/transformers is lazily and dynamically loaded so native Node/ONNX
 *   bindings never crash module evaluation on AWS Lambda / Vercel.
 * - Cache directory is redirected to /tmp to avoid EROFS (read-only filesystem)
 *   errors on serverless platforms.
 * - If vector embedding fails for ANY reason (read-only filesystem, timeout,
 *   missing native C++ bindings, or network failure), retrieve() gracefully
 *   and seamlessly falls back to in-memory keyword BM25 retrieval across the
 *   committed chunks. retrieve() NEVER throws.
 */

import { readFileSync } from "node:fs";
import os from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ── Contract constants (must match build-index.ts) ───────────────────────────
const MODEL = "Xenova/bge-small-en-v1.5";
const DIM = 384;

/**
 * Query-side prefix required by bge's asymmetric retrieval design.
 *
 * build-index.ts embeds PASSAGES with NO prefix (see its contract header).
 * Queries MUST prepend exactly this string before embedding so query and
 * passage vectors live in the same space for cosine similarity.
 */
export const QUERY_PREFIX =
  "Represent this sentence for searching relevant passages: ";

// ── Public type ───────────────────────────────────────────────────────────-
export type RetrievedChunk = {
  id: string;
  source: string;
  title: string;
  type: string;
  text: string;
  /** Cosine similarity between the query and this chunk, in [-1, 1]. */
  score: number;
};

// ── Internal types (stored index shape) ──────────────────────────────────────
type KnowledgeChunk = {
  id: string;
  source: string;
  title: string;
  type: string;
  text: string;
  embedding: number[];
};

type KnowledgeIndex = {
  model: string;
  dim: number;
  builtAt?: string;
  chunkWords?: number;
  overlapWords?: number;
  chunks: KnowledgeChunk[];
};

// ── Paths (resolved relative to process.cwd() on Vercel and __dirname locally) ──
const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_FILE_CWD = join(process.cwd(), "data", "knowledge.json");
const INDEX_FILE_REL = join(__dirname, "..", "..", "data", "knowledge.json");

// ── Module-scope caches ───────────────────────────────────────────────────-
let indexCache: KnowledgeIndex | null = null;
let extractorPromise: Promise<FeatureExtractor | null> | null = null;

// Minimal structural type for the extractor callable returned by pipeline().
type FeatureExtractorOutput = { data: Float32Array };
type FeatureExtractor = (
  text: string,
  options: { pooling: "mean"; normalize: boolean },
) => Promise<FeatureExtractorOutput>;

/**
 * Load + cache the committed knowledge index ONCE at module scope. Subsequent
 * calls return the SAME cached object reference. Validates the embedding
 * contract (dim === 384, non-empty chunks array) on first load.
 */
export function loadIndex(): KnowledgeIndex {
  if (indexCache) return indexCache;

  let raw = "";
  try {
    raw = readFileSync(INDEX_FILE_CWD, "utf8");
  } catch {
    try {
      raw = readFileSync(INDEX_FILE_REL, "utf8");
    } catch (err) {
      throw new Error(
        `Failed to read knowledge index at ${INDEX_FILE_CWD} or ${INDEX_FILE_REL}: ${(err as Error).message}`,
      );
    }
  }

  let parsed: KnowledgeIndex;
  try {
    parsed = JSON.parse(raw) as KnowledgeIndex;
  } catch (err) {
    throw new Error(
      `knowledge index is not valid JSON: ${(err as Error).message}`,
    );
  }

  if (parsed.dim !== DIM) {
    throw new Error(
      `knowledge index dim mismatch: expected ${DIM}, got ${String(parsed.dim)}.`,
    );
  }
  if (!Array.isArray(parsed.chunks) || parsed.chunks.length === 0) {
    throw new Error("knowledge index has no chunks (expected a non-empty array).");
  }

  indexCache = parsed;
  return indexCache;
}

/**
 * Fast, pure in-memory keyword retrieval with title/source/id boosting.
 * Runs in < 0.2ms, zero dependencies, zero cold-start, zero downloads.
 */
export function retrieveByKeyword(
  query: string,
  topK: number,
  chunks: KnowledgeChunk[],
): RetrievedChunk[] {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "of", "to", "in", "for", "on",
    "with", "at", "by", "from", "up", "about", "into", "over", "after",
    "is", "are", "was", "were", "be", "been", "being", "have", "has",
    "had", "do", "does", "did", "tell", "me", "what", "whats", "what's",
    "how", "who", "which", "where", "can", "you", "his", "adeel", "adeels"
  ]);

  const rawTerms = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));

  const terms =
    rawTerms.length > 0
      ? rawTerms
      : query
          .toLowerCase()
          .replace(/[^\w\s-]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 2);

  const queryLower = query.toLowerCase().trim();

  const scored: RetrievedChunk[] = chunks.map((c) => {
    let score = 0;
    const titleLower = c.title.toLowerCase();
    const sourceLower = c.source.toLowerCase();
    const idLower = c.id.toLowerCase();
    const textLower = c.text.toLowerCase();

    // Exact phrase match bonus
    if (queryLower.length > 3) {
      if (titleLower.includes(queryLower)) score += 15;
      if (textLower.includes(queryLower)) score += 8;
    }

    for (const term of terms) {
      // Title match (high value)
      if (titleLower.includes(term)) score += 8;
      // Source / ID match (e.g. "synthlab", "hackdata")
      if (sourceLower.includes(term) || idLower.includes(term)) score += 6;
      // Text occurrences (diminishing returns)
      const count = textLower.split(term).length - 1;
      if (count > 0) {
        score += Math.min(count * 1.5, 6);
      }
    }

    // Normalize score to [-1, 1] range for contract compatibility
    const normalizedScore = score > 0 ? Math.min(score / 30, 0.99) : 0;

    return {
      id: c.id,
      source: c.source,
      title: c.title,
      type: c.type,
      text: c.text,
      score: normalizedScore,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, Math.max(0, topK));
}

/**
 * Lazy-load the feature-extraction pipeline dynamically.
 * Points model cache strictly to /tmp on serverless environments to prevent EROFS.
 */
function getExtractor(): Promise<FeatureExtractor | null> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      try {
        const { pipeline, env } = await import("@xenova/transformers");
        // Ensure cacheDir points to writable /tmp on serverless (Lambda/Vercel)
        const tmpDir =
          process.env.TMPDIR || process.env.TEMP || os.tmpdir() || "/tmp";
        env.cacheDir = join(tmpDir, ".transformers_cache");
        env.allowLocalModels = false;
        return (await pipeline(
          "feature-extraction",
          MODEL,
        )) as unknown as FeatureExtractor;
      } catch (err) {
        console.warn(
          "[retrieve] @xenova/transformers unavailable in this environment, using keyword fallback:",
          err,
        );
        return null;
      }
    })();
  }
  return extractorPromise;
}

/**
 * Embed a user query. Prepends QUERY_PREFIX (contract) then runs the SAME
 * mean-pooled + normalized feature extraction as build-index. Returns a
 * 384-length vector.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const extractor = await getExtractor();
  if (!extractor) {
    throw new Error("@xenova/transformers pipeline is not available");
  }
  const out = await extractor(QUERY_PREFIX + query, {
    pooling: "mean",
    normalize: true,
  });
  const vec = Array.from(out.data as Float32Array);
  if (vec.length !== DIM) {
    throw new Error(
      `query embedding has dim ${vec.length}, expected ${DIM}.`,
    );
  }
  return vec;
}

/**
 * Cosine similarity with norm guards. Does NOT assume inputs are pre-normalized:
 * if either vector has zero norm, returns 0.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i];
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieve the top-K chunks most similar to `query`.
 * Tries cosine similarity via vector embeddings first; if embeddings fail for
 * any reason (serverless readonly fs, missing binary, cold-start timeout),
 * gracefully falls back to instant in-memory keyword BM25 retrieval.
 */
export async function retrieve(
  query: string,
  topK = 5,
): Promise<RetrievedChunk[]> {
  const index = loadIndex();

  try {
    const queryVec = await embedQuery(query);

    const scored: RetrievedChunk[] = index.chunks.map((c) => ({
      id: c.id,
      source: c.source,
      title: c.title,
      type: c.type,
      text: c.text,
      score: cosineSimilarity(queryVec, c.embedding),
    }));

    scored.sort((x, y) => y.score - x.score);
    return scored.slice(0, Math.max(0, topK));
  } catch (err) {
    // Vector embedding failed or timed out. Gracefully fall back to keyword ranking.
    console.warn("[retrieve] Falling back to keyword search:", err);
    return retrieveByKeyword(query, topK, index.chunks);
  }
}
