/**
 * build-index.ts — LOCAL, build-time knowledge index generator (Task 3).
 *
 * Reads local docs (personal/docs/*.md + *.pdf) and committed repo data
 * (data/*.json), chunks them, embeds each chunk with a LOCAL transformer model
 * (no API, no token), and writes data/knowledge.json (committed).
 *
 * Run manually:  npm run build:index
 * NEVER wired into `next build`.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * EMBEDDING / RETRIEVAL CONTRACT (read before touching retrieval):
 *
 * - Model: Xenova/bge-small-en-v1.5, 384-dim, mean-pooled + L2-normalized.
 * - bge is an ASYMMETRIC retrieval model. PASSAGES (the chunks indexed here)
 *   are embedded WITHOUT any prefix. At RETRIEVAL time the later task MUST
 *   prepend the query prefix to the user's question before embedding it:
 *
 *       "Represent this sentence for searching relevant passages: "
 *
 *   Do NOT add that prefix here — doing so would break the query/passage
 *   asymmetry and degrade retrieval. This file embeds raw chunk text only.
 *
 * - The first run downloads the model weights (~30MB) one time from the HF hub
 *   and caches them locally. That download needs network but NO auth/token.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * TUNING KNOBS (the eval task retunes these):
 *   CHUNK_WORDS   — target max words per chunk
 *   OVERLAP_WORDS — trailing words carried into the next chunk for continuity
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "@xenova/transformers";
import { PDFParse } from "pdf-parse";

// ── Tunable constants ───────────────────────────────────────────────────────
const CHUNK_WORDS = 550; // target max words per chunk
const OVERLAP_WORDS = 90; // trailing words repeated into the next chunk
const MODEL = "Xenova/bge-small-en-v1.5";
const DIM = 384;

// ── Paths ─────────────────────────────────────────────────────────────────-
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS_DIR = join(ROOT, "personal", "docs");
const DATA_DIR = join(ROOT, "data");
const OUT_FILE = join(DATA_DIR, "knowledge.json");
const CACHE_FILE = join(__dirname, ".embcache.json");

// ── Types ────────────────────────────────────────────────────────────────-
type ChunkType =
  | "markdown"
  | "pdf"
  | "profile"
  | "projects"
  | "skills"
  | "experience"
  | "achievements"
  | "certifications";

interface Passage {
  source: string;
  title: string;
  type: ChunkType;
  text: string;
}

interface Chunk extends Passage {
  id: string;
  embedding: number[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "") // drop extension
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** Collapse excessive whitespace while preserving paragraph breaks. */
function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Un-hyphenate words broken across PDF line wraps: "exam-\nple" -> "example". */
function dehyphenate(text: string): string {
  return text.replace(/([A-Za-z])-\n([a-z])/g, "$1$2");
}

function firstHeading(md: string): string | null {
  const m = md.match(/^#{1,6}\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

// ── Source extraction → Passage[] ────────────────────────────────────────────

function readMarkdownPassages(): Passage[] {
  if (!existsSync(DOCS_DIR)) return [];
  const files = readdirSync(DOCS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort();
  const out: Passage[] = [];
  for (const file of files) {
    const raw = readFileSync(join(DOCS_DIR, file), "utf8");
    const text = normalizeWhitespace(raw);
    if (!text) continue;
    out.push({
      source: file,
      title: firstHeading(raw) ?? file.replace(/\.md$/i, ""),
      type: "markdown",
      text,
    });
  }
  return out;
}

async function readPdfPassages(): Promise<Passage[]> {
  if (!existsSync(DOCS_DIR)) return [];
  const files = readdirSync(DOCS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();
  const out: Passage[] = [];
  for (const file of files) {
    const path = join(DOCS_DIR, file);
    try {
      const buf = readFileSync(path);
      const parser = new PDFParse({ data: new Uint8Array(buf) });
      const res = await parser.getText();
      await parser.destroy();
      const text = normalizeWhitespace(dehyphenate(res.text ?? ""));
      if (!text) {
        console.warn(`  [pdf] ${file}: no extractable text, skipping`);
        continue;
      }
      out.push({
        source: file,
        title: file.replace(/\.pdf$/i, ""),
        type: "pdf",
        text,
      });
    } catch (err) {
      console.warn(
        `  [pdf] ${file}: failed to parse (${(err as Error).message}); skipping`,
      );
    }
  }
  return out;
}

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, name), "utf8")) as T;
}

function dataPassages(): Passage[] {
  const out: Passage[] = [];

  // profile.json → one coherent identity/contact block
  const p = readJson<{
    name: string;
    title: string;
    role: string;
    university: string;
    degree: string;
    expectedGrad: string;
    cgpa: string;
    location: string;
    bio: string;
    researchInterests: string[];
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    resume: string;
  }>("profile.json");
  const profileText = [
    `${p.name} — ${p.title}.`,
    `Role: ${p.role}.`,
    `${p.degree} at ${p.university} (${p.expectedGrad}), CGPA ${p.cgpa}. Based in ${p.location}.`,
    "",
    p.bio,
    "",
    "Research interests:",
    ...p.researchInterests.map((r) => `- ${r}`),
    "",
    "Contact:",
    `- Email: ${p.email}`,
    `- Phone: ${p.phone}`,
    `- GitHub: ${p.github}`,
    `- LinkedIn: ${p.linkedin}`,
    `- Resume: ${p.resume}`,
  ].join("\n");
  out.push({
    source: "profile",
    title: "About Adeel Asghar",
    type: "profile",
    text: profileText,
  });

  // projects.json → one passage per project
  const projects = readJson<
    Array<{
      title: string;
      description: string;
      tags: string[];
      github: string | null;
      demo: string | null;
      featured: boolean;
      category: string | null;
      status: string | null;
      insight: string | null;
    }>
  >("projects.json");
  for (const pr of projects) {
    const lines = [`Project: ${pr.title}`, pr.description];
    if (pr.tags?.length) lines.push(`Tags: ${pr.tags.join(", ")}`);
    if (pr.category) lines.push(`Category: ${pr.category}`);
    if (pr.status) lines.push(`Status: ${pr.status}`);
    if (pr.insight) lines.push(`Insight: ${pr.insight}`);
    if (pr.github) lines.push(`Repo: ${pr.github}`);
    if (pr.demo) lines.push(`Demo: ${pr.demo}`);
    out.push({
      source: "projects",
      title: pr.title,
      type: "projects",
      text: lines.join("\n"),
    });
  }

  // skills.json → one combined passage grouped by category
  const skills = readJson<
    Array<{ category: string; icon: string; skills: Array<{ name: string }> }>
  >("skills.json");
  const skillsText = [
    "Skills by category:",
    ...skills.map(
      (c) => `- ${c.category}: ${c.skills.map((s) => s.name).join(", ")}`,
    ),
  ].join("\n");
  out.push({
    source: "skills",
    title: "Skills",
    type: "skills",
    text: skillsText,
  });

  // experience.json → one passage per role
  const experience = readJson<
    Array<{
      role: string;
      company: string;
      type: string;
      period: string;
      current: boolean;
      bullets: string[];
    }>
  >("experience.json");
  for (const e of experience) {
    const header = `${e.role} — ${e.company} (${e.type}, ${e.period})${
      e.current ? " (current)" : ""
    }`;
    const text = [header, ...e.bullets.map((b) => `- ${b}`)].join("\n");
    out.push({
      source: "experience",
      title: `${e.role} @ ${e.company}`,
      type: "experience",
      text,
    });
  }

  // achievements.json → one combined passage
  const achievements = readJson<
    Array<{ title: string; org: string; desc: string }>
  >("achievements.json");
  const achievementsText = [
    "Achievements:",
    ...achievements.map((a) => `- ${a.title} — ${a.org}: ${a.desc}`),
  ].join("\n");
  out.push({
    source: "achievements",
    title: "Achievements",
    type: "achievements",
    text: achievementsText,
  });

  // certifications.json → one combined passage
  const certifications = readJson<
    Array<{
      title: string;
      issuer: string;
      date: string;
      credentialId: string | null;
    }>
  >("certifications.json");
  const certsText = [
    "Certifications:",
    ...certifications.map(
      (c) =>
        `- ${c.title} — ${c.issuer} (${c.date})${
          c.credentialId ? `, credential ${c.credentialId}` : ""
        }`,
    ),
  ].join("\n");
  out.push({
    source: "certifications",
    title: "Certifications",
    type: "certifications",
    text: certsText,
  });

  return out;
}

// ── Chunking ─────────────────────────────────────────────────────────────-
/**
 * Word-count chunking that respects paragraph boundaries and never splits a
 * word. Packs whole paragraphs until CHUNK_WORDS is reached, then carries the
 * trailing OVERLAP_WORDS into the next chunk. A single paragraph longer than
 * CHUNK_WORDS is split on word boundaries with the same overlap.
 */
function chunkPassage(passage: Passage): Chunk[] {
  const paragraphs = passage.text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Fallback: if there were no blank-line breaks, treat the whole thing as one.
  const blocks = paragraphs.length ? paragraphs : [passage.text.trim()];

  const chunkTexts: string[] = [];
  let current: string[] = []; // words accumulated for the current chunk
  let count = 0;

  const flush = () => {
    if (!current.length) return;
    chunkTexts.push(current.join(" "));
    // carry overlap
    const overlap = current.slice(Math.max(0, current.length - OVERLAP_WORDS));
    current = overlap.slice();
    count = current.length;
  };

  for (const block of blocks) {
    const words = block.split(/\s+/).filter(Boolean);

    // A single oversized block: emit it in word-windows.
    if (words.length > CHUNK_WORDS) {
      // Close whatever is pending first so it isn't merged into the window.
      if (current.length) flush();
      current = [];
      count = 0;
      let i = 0;
      while (i < words.length) {
        const window = words.slice(i, i + CHUNK_WORDS);
        chunkTexts.push(window.join(" "));
        if (i + CHUNK_WORDS >= words.length) break;
        i += CHUNK_WORDS - OVERLAP_WORDS;
      }
      current = [];
      count = 0;
      continue;
    }

    if (count + words.length > CHUNK_WORDS && count > 0) {
      flush();
    }
    current.push(...words);
    count = current.length;
  }
  if (current.length) chunkTexts.push(current.join(" "));

  // De-duplicate the trailing overlap-only chunk edge case: ensure non-empty.
  const base = slug(passage.source);
  return chunkTexts
    .map((t) => t.trim())
    .filter(Boolean)
    .map((text, i) => ({
      id: `${base}#${i}`,
      source: passage.source,
      title: passage.title,
      type: passage.type,
      text,
      embedding: [], // filled in later
    }));
}

// ── Embedding cache ──────────────────────────────────────────────────────-
function loadCache(): Record<string, number[]> {
  if (!existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_FILE, "utf8")) as Record<
      string,
      number[]
    >;
  } catch {
    console.warn("  [cache] unreadable cache file, starting fresh");
    return {};
  }
}

// ── Main ─────────────────────────────────────────────────────────────────-
async function main(): Promise<void> {
  console.log("Building knowledge index…");

  // 1. Collect passages (data first, then markdown, then pdf — deterministic).
  const passages: Passage[] = [
    ...dataPassages(),
    ...readMarkdownPassages(),
    ...(await readPdfPassages()),
  ];
  console.log(`  Collected ${passages.length} passages.`);

  // 2. Chunk.
  const chunks: Chunk[] = passages.flatMap(chunkPassage);
  console.log(`  Produced ${chunks.length} chunks.`);
  if (chunks.length === 0) {
    throw new Error("No chunks produced — check source directories.");
  }

  // 3. Incremental embedding with sha256 cache.
  const cache = loadCache();
  const toEmbed: Chunk[] = [];
  let cacheHits = 0;
  for (const c of chunks) {
    const key = sha256(c.text);
    const cached = cache[key];
    if (cached && cached.length === DIM) {
      c.embedding = cached;
      cacheHits++;
    } else {
      toEmbed.push(c);
    }
  }
  console.log(
    `  Cache: ${cacheHits} hits, ${toEmbed.length} to embed (of ${chunks.length}).`,
  );

  if (toEmbed.length > 0) {
    console.log(`  Loading model ${MODEL} (first run downloads ~30MB)…`);
    // NOTE: passages are embedded WITHOUT a prefix (see contract at top).
    const extractor = await pipeline("feature-extraction", MODEL);
    let done = 0;
    for (const c of toEmbed) {
      const out = await extractor(c.text, { pooling: "mean", normalize: true });
      const vec = Array.from(out.data as Float32Array);
      if (vec.length !== DIM) {
        throw new Error(
          `Embedding for ${c.id} has dim ${vec.length}, expected ${DIM}.`,
        );
      }
      c.embedding = vec;
      cache[sha256(c.text)] = vec;
      done++;
      if (done % 10 === 0 || done === toEmbed.length) {
        console.log(`    embedded ${done}/${toEmbed.length}`);
      }
    }
    // Persist cache (gitignored).
    writeFileSync(CACHE_FILE, JSON.stringify(cache));
  }

  // 4. Sanity assertions.
  for (const c of chunks) {
    if (!Array.isArray(c.embedding) || c.embedding.length !== DIM) {
      throw new Error(`Chunk ${c.id} has bad embedding length.`);
    }
    if (!c.text.trim()) throw new Error(`Chunk ${c.id} has empty text.`);
  }

  // 5. Write committed artifact.
  const knowledge = {
    model: MODEL,
    dim: DIM,
    builtAt: new Date().toISOString(),
    chunkWords: CHUNK_WORDS,
    overlapWords: OVERLAP_WORDS,
    chunks,
  };
  writeFileSync(OUT_FILE, `${JSON.stringify(knowledge, null, 2)}\n`);

  // 6. Report.
  const sources = [...new Set(chunks.map((c) => c.source))].sort();
  console.log("\n── Index report ──────────────────────────────");
  console.log(`  Total chunks : ${chunks.length}`);
  console.log(`  Dim          : ${DIM}`);
  console.log(`  Cache hits   : ${cacheHits}`);
  console.log(`  Newly embedded: ${toEmbed.length}`);
  console.log(`  Sources (${sources.length}): ${sources.join(", ")}`);
  console.log(`  Written to   : ${OUT_FILE}`);
  console.log("──────────────────────────────────────────────");
}

main().catch((err) => {
  console.error("build-index failed:", err);
  process.exit(1);
});
