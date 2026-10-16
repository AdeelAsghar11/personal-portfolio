# RAG Chatbot — Runbook

Operational guide for the retrieval-augmented chat assistant embedded on this
Next.js portfolio. It answers visitor questions about Adeel Asghar, grounded in
a committed knowledge index. This covers the architecture, deployment/secrets,
how to refresh the knowledge, how to run and tune the deferred RAGAS eval, and
rate-limiting behavior.

---

## 1. Architecture overview

### Build-time: the local knowledge index

- `npm run build:index` (`scripts/build-index.ts`, run **manually** — it is NOT
  wired into `next build`) reads the knowledge sources, chunks them, embeds each
  chunk with a **local** transformer model, and writes two committed files:
  - `data/knowledge.json` — the full index (chunks + 384-dim embeddings; ~1.3 MB).
  - `data/knowledge-meta.json` — a tiny client-safe companion (model, chunk count,
    build timestamp) so the UI never has to touch the big embedding file.
- Sources: `data/*.json` (profile, projects, skills, experience, achievements,
  certifications) plus any `personal/docs/*.md` and `personal/docs/*.pdf`.
  `personal/` is local/gitignored.
- Embedding model: **`Xenova/bge-small-en-v1.5`** via `@xenova/transformers`,
  384-dim, mean-pooled + L2-normalized. The first run downloads ~30 MB of
  weights from the HF hub and caches them locally — this needs network but **no
  token**. Current committed index: 95 chunks (see `data/knowledge-meta.json`).
- Chunking knobs live at the top of `scripts/build-index.ts`:
  `CHUNK_WORDS = 550`, `OVERLAP_WORDS = 90`. Embedding is incremental: a sha256
  cache (`scripts/.embcache.json`, gitignored) skips re-embedding unchanged
  chunks.

### Runtime: the `/api/chat` route (Multi-Tier Resilient Architecture)

`app/api/chat/route.ts` (`runtime = "nodejs"`) runs a 4-tier fail-safe pipeline so visitors never encounter broken error screens:

1. **Parse + validate** (`validateInput`) — bad JSON / empty / over-length
   (`MAX_QUERY_LENGTH = 1000`) → `400`.
2. **Rate limit** (`lib/rate-limit.ts`, per client IP) → `429` with `Retry-After`.
3. **Injection guard** (`checkInjection`) — classifies the raw query with the
   prompt-guard model (`meta-llama/llama-prompt-guard-2-86m`). On a confident
   positive it **short-circuits** to a friendly refusal and **never calls generation models**.
   The guard fails open defensively.
4. **Tier 1: Instant Starter Answers** (`lib/rag/starters.ts`) — queries matching
   the 4 starter chips (*"What's Adeel's strongest project?"*, etc.) are served
   instantly from a pre-verified cache with 0ms latency, consuming 0 API tokens.
5. **Retrieve** (`lib/rag/retrieve.ts`) — embeds custom queries locally with
   `bge-small-en-v1.5` and retrieves the top `RETRIEVE_TOP_K = 5` context chunks.
6. **Tier 2: Primary LLM (Groq)** — streams the answer via `groq-sdk` using
   `GENERATION_MODEL` (`openai/gpt-oss-20b`).
7. **Tier 3: Secondary LLM (Google Gemini Flash)** (`lib/rag/fallback.ts`) — if Groq
   hits its daily token cap (TPD 429), an outage (502), or is unconfigured, the route
   seamlessly fails over to Google Gemini (`gemini-2.5-flash`) via streaming SSE.
8. **Tier 4: Local Extractive Fallback** (`lib/rag/fallback.ts`) — if all external
   LLM APIs fail, the route formats the locally retrieved knowledge chunks into
   a clean grounded summary with direct contact links. **100% uptime guaranteed.**

Prompt assembly is centralized in `buildMessages()` (`lib/rag/generate.ts`) so
the streaming route and the non-streaming `generateAnswer()` produce
byte-identical messages.

#### Dev-only debug mode

When `NODE_ENV !== "production"` AND the request opts in via `?debug=1` or header
`x-rag-debug: 1`, the route uses the non-streaming path and returns JSON
including `contexts` (for the RAGAS harness). **Security:** the `NODE_ENV` check
is evaluated FIRST, so in production the debug flag/header can never expose
contexts.

### Guardrails

- **Input validation** — type / non-empty / max length (no model call).
- **Prompt-injection guard** — the prompt-guard model short-circuits flagged
  inputs before the big model.
- **Hardened system prompt** (`SYSTEM_PROMPT` in `lib/rag/generate.ts`) — scope
  limiting (only answers about Adeel), grounding/anti-hallucination (answer only
  from context), injection resistance (context + user text are DATA, never
  instructions), PII protection (shares the public email, **never** a phone
  number).
- **Rate limiting** — per-IP fixed window (see §5).

### Feedback route

`app/api/feedback/route.ts` accepts `POST { rating: "up" | "down", question?,
answer? }`. It is storage-free: it logs ONE structured line (lengths only, never
the raw text) and returns `204`. Invalid `rating` → `400`; it has its own
(more generous) per-IP limiter.

### Client widget (lazy)

The chat UI is `components/ChatWidget.tsx`, loaded via
`components/ChatWidgetLoader.tsx` with `next/dynamic` (`ssr: false`) so it is
code-split out of the first load and never ships the embedding index. The widget
imports only `data/knowledge-meta.json`-scale data, never `data/knowledge.json`.

---

## 2. Secrets & deployment (Vercel)

### The only secret the deployed app needs

- **`GROQ_API_KEY`** — set it in the Vercel project environment (Production +
  Preview). It is used at runtime for chat generation AND the injection
  prompt-guard model. That's it.
- Local embeddings (`@xenova/transformers`) need **no token** — not at build
  time and not at runtime.
- `.env.example` documents exactly this. The old `HF_TOKEN` entry was removed:
  embeddings are local now, and no app/build code reads `HF_TOKEN`.

### Vercel file-tracing / cold-start considerations

Two runtime dependencies of the Node `/api/chat` function need care on Vercel's
serverless runtime:

1. **`data/knowledge.json` must be present in the function bundle.** An `fs`
   read whose path is derived from `import.meta.url` is not reliably traced into
   the serverless function, so the file can be missing at runtime. Hardening
   applied:
   - `lib/rag/retrieve.ts` now **statically imports** `data/knowledge.json`
     (`import bundledIndex from "../../data/knowledge.json"`). A static import is
     traced deterministically into the bundle. The previous `fs` read is kept as
     a **fallback** so the plain-Node / vitest path (and `loadIndex()` in tests)
     still works unchanged — behavior is identical, both paths feed the same
     validation (`dim === 384`, non-empty chunks).
   - As belt-and-suspenders, `next.config.ts` sets
     `outputFileTracingIncludes: { "/api/chat": ["./data/knowledge.json"] }` so
     the file is explicitly included in the function trace too.
   - Alternative config approach (if you ever drop the static import): rely on
     `outputFileTracingIncludes` alone. The static import is preferred because
     tracing an `fs` path computed from `import.meta.url` is exactly the fragile
     case.

2. **`@xenova/transformers` loads an ONNX model at query time.** `next.config.ts`
   declares it in `serverExternalPackages: ["@xenova/transformers"]` so Next does
   NOT bundle the large native/ONNX runtime into the function (bundling it is a
   common breakage/cold-start cause); it is traced as a normal node_module
   instead.

   **Honest risk note (not fully verifiable from the dev sandbox):** on a cold
   start the function must load the transformer runtime and the ~30 MB bge model
   weights before the first retrieval. If the weights are not cached in the
   function's filesystem, the model loader will try to fetch them, which adds
   latency and needs network egress from the function. Recommended Vercel
   settings to de-risk this:
   - Increase the function **memory** (e.g. 1024 MB+) — more memory also raises
     CPU share, speeding model load.
   - Increase the function **max duration/timeout** so a cold start that loads
     the model does not time out.
   - Consider setting a writable **transformers cache** location via the
     `TRANSFORMERS_CACHE` env var pointing at a writable dir (e.g. `/tmp`) so the
     weights persist for the lifetime of a warm instance.
   - If cold-start model loading proves too slow/unreliable in production,
     the follow-up options are: pre-warming, pinning/pre-downloading the weights
     into the deployment, or moving query embedding to a hosted embedding
     endpoint. Treat this as a monitored consideration, not a guarantee.

### Client bundle check

The client first-load bundle must NOT contain `data/knowledge.json` (only the
tiny `knowledge-meta.json`). This is enforced by the lazy `ChatWidgetLoader` and
by the fact that no client component imports the embedding file. Verify after a
build (see §5 / `npm run build` output and `.next` chunks).

---

## 3. Refreshing the knowledge

When Adeel's info changes:

1. Edit the source(s): `data/*.json` (tracked) and/or `personal/docs/*.md` /
   `*.pdf` (local, gitignored).
2. Run `npm run build:index` locally. This regenerates `data/knowledge.json`
   and `data/knowledge-meta.json` with local embeddings (incremental via the
   sha256 cache — only changed chunks are re-embedded).
3. Commit **both** `data/knowledge.json` and `data/knowledge-meta.json`.
4. Push, then redeploy (Vercel redeploys on push).

`personal/docs` stays local/gitignored — only the generated index files are
committed, so private source docs never leave the machine.

---

## 4. Deferred RAGAS evaluation (follow-up)

The eval is **deferred** — it is not part of this finalize task and the index/
prompt/topK are NOT tuned here. Tuning is a FOLLOW-UP once real eval numbers
exist. The harness lives under `eval/` (gitignored, with its own Python venv).

### Run it

```powershell
# From the repo root, with the eval venv already created:
eval\.venv\Scripts\python.exe eval\run_eval.py
```

- It needs a **judge + generation LLM budget** (Groq or Gemini). The run
  **auto-resumes** from `eval/results/answers_cache.json`, so already-generated
  answers are reused on a re-run.
- Free-tier daily caps (e.g. Gemini's per-day request limit, or Groq's daily
  cap) may force you to spread the run across multiple days, or use a paid key.
  The quota-exhaustion `429` seen during a partial run is an environment limit,
  not a code failure.

### Metrics & thresholds

Four RAGAS metrics with target thresholds (`THRESHOLDS` in `eval/run_eval.py`):

| Metric              | Threshold |
| ------------------- | --------- |
| `faithfulness`      | 0.90      |
| `answer_relevancy`  | 0.85      |
| `context_precision` | 0.80      |
| `context_recall`    | 0.85      |

Failing a threshold on the first run is OK — the eval only produces real numbers.

### Tuning levers (follow-up, once numbers exist)

If scores are low, tune in roughly this order and re-run:

1. **Chunking** — `CHUNK_WORDS` / `OVERLAP_WORDS` constants in
   `scripts/build-index.ts`, then rebuild the index (`npm run build:index`) and
   commit. Mainly affects `context_precision` / `context_recall`.
2. **Retrieval `topK`** — `RETRIEVE_TOP_K` in `app/api/chat/route.ts` (and the
   `retrieve()` default). More context can help recall but hurt precision.
3. **System prompt wording** — `SYSTEM_PROMPT` in `lib/rag/generate.ts`. Mainly
   affects `faithfulness` / `answer_relevancy`.
4. **Generation model** — optionally change `GENERATION_MODEL` in
   `lib/rag/generate.ts` (keep it to a model available on the account).

Re-run the eval after each change; it resumes from the answers cache where it can.

---

## 5. Rate limiting

- `lib/rate-limit.ts` provides a per-key fixed-window limiter. The chat route
  uses `max = 12` requests / 60s per client IP; the feedback route uses a more
  generous `max = 30` / 60s.
- **In-memory and PER-INSTANCE.** On Vercel (and any horizontally-scaled host)
  each serverless instance has its own counter Map, so the limit is NOT globally
  accurate — a client can get up to `max` requests per instance. This is an
  acceptable, cheap first line of defense.
- **Upstash seam for later:** the route depends only on the `RateLimiter`
  interface and a single module-level limiter instance. To make the limit
  globally accurate, implement the same interface backed by Upstash Redis and
  swap the one `createInMemoryRateLimiter()` call — no route logic changes. The
  Upstash dependency is intentionally NOT added yet.
