/**
 * retrieve.ts — framework-agnostic, in-memory vector retrieval core (Task 4).
 *
 * Loads the committed knowledge index (data/knowledge.json), embeds a user
 * query with the SAME local model used to build the index, and returns the
 * top-K most similar chunks by cosine similarity.
 *
 * Pure/deterministic apart from two module-scope caches (the parsed index and
 * the embedding pipeline singleton). NO Next.js / React / HTTP imports — this
 * module must be usable from an API route AND a plain script/test.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * EMBEDDING / RETRIEVAL CONTRACT (mirrors scripts/build-index.ts exactly):
 *
 * - Model: Xenova/bge-small-en-v1.5, 384-dim, mean-pooled + L2-normalized.
 * - bge is ASYMMETRIC. PASSAGES were embedded in build-index WITHOUT any
 *   prefix. QUERIES here MUST be prefixed with QUERY_PREFIX below. Breaking
 *   this parity degrades cosine similarity.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "@xenova/transformers";

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

// ── Deploy-hardening: bundle the index via a static import ───────────────────
// On Vercel's Node serverless runtime, an fs read whose path is derived from
// import.meta.url is NOT reliably traced into the function bundle, so the file
// can be missing at runtime. Importing the JSON makes the compiler/bundler
// trace it into the function deterministically. We keep the fs read below as a
// FALLBACK so the plain-Node / vitest path (and any environment where the
// bundled import isn't resolved) still works unchanged. Behavior is identical:
// both paths yield the same validated KnowledgeIndex object.
import bundledIndex from "../../data/knowledge.json";

// ── Paths (resolved relative to this module, not a hardcoded absolute) ────────
const __dirname = dirname(fileURLToPath(import.meta.url));
// lib/rag/retrieve.ts -> project root is two levels up.
const ROOT = join(__dirname, "..", "..");
const INDEX_FILE = join(ROOT, "data", "knowledge.json");

// ── Module-scope caches ───────────────────────────────────────────────────-
let indexCache: KnowledgeIndex | null = null;
// Singleton promise so the pipeline loads at most once per process even under
// concurrent calls (every caller awaits the same promise).
let extractorPromise: Promise<FeatureExtractor> | null = null;

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

  // Prefer the statically-imported, bundle-traced index. Fall back to the fs
  // read if the import did not resolve to a usable object (e.g. some plain-Node
  // loaders). Both routes feed the SAME validation below.
  let parsed: KnowledgeIndex | null = null;
  const bundled = bundledIndex as unknown as KnowledgeIndex | undefined;
  if (
    bundled &&
    typeof bundled === "object" &&
    Array.isArray(bundled.chunks)
  ) {
    parsed = bundled;
  }

  if (!parsed) {
    let raw: string;
    try {
      raw = readFileSync(INDEX_FILE, "utf8");
    } catch (err) {
      throw new Error(
        `Failed to read knowledge index at ${INDEX_FILE}: ${(err as Error).message}`,
      );
    }

    try {
      parsed = JSON.parse(raw) as KnowledgeIndex;
    } catch (err) {
      throw new Error(
        `knowledge index at ${INDEX_FILE} is not valid JSON: ${(err as Error).message}`,
      );
    }
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
 * Lazy-load the singleton feature-extraction pipeline (cached as a promise).
 */
function getExtractor(): Promise<FeatureExtractor> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODEL) as Promise<FeatureExtractor>;
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
 * Retrieve the top-K chunks most similar to `query` by cosine similarity.
 */
export async function retrieve(
  query: string,
  topK = 5,
): Promise<RetrievedChunk[]> {
  const index = loadIndex();
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
}
