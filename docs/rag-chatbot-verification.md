# RAG Chatbot — Task 9 Verification Note

Evidence from the finalize + deploy-de-risk pass on branch `feature/rag-chatbot`.
Recorded so the change can be reviewed without re-running everything.

## Build

- `npm run build` → **exit 0**. Compiled successfully (Next.js 16.1.7, Turbopack).
- Route table shows `/api/chat` and `/api/feedback` as dynamic Node functions
  (`ƒ`), home `/` and `/_not-found` static. No new warnings about bundling
  `@xenova/transformers`.

## Tests

- `npm run test` (`vitest run`) → **9 files, 34 tests, all passed.**
  - New hermetic tests pass (no network):
    - `lib/rag/generate.missing-key.test.ts` — `generateAnswer` throws a
      `/GROQ_API_KEY/` error when the key is unset, no network call.
    - `app/api/chat/injection.route.test.ts` — injection short-circuit returns
      the refusal as `text/plain` 200 and NEVER calls `GENERATION_MODEL`
      (asserted against the mocked groq-sdk call list).
    - `app/api/chat/stream.route.test.ts` — streaming happy path pipes mocked
      deltas as `text/plain` and the body concatenates to `"Hello world"`.
  - `lib/rag/retrieve.test.ts` (9 tests) still passes with the new guarded
    bundled JSON import (real index loads, top-K queries correct, `loadIndex`
    still returns a cached singleton).
  - The 3 live-Groq safety tests in `lib/rag/generate.test.ts` PASSED this run
    (Groq generation quota was available at test time): system-prompt
    non-disclosure, PII phone withholding, off-topic redirect, plus the live
    grounded SynthLab happy path.

## Dev-server smoke test (`next dev`, then killed)

- `GET /` → **200**.
- `POST /api/feedback` `{"rating":"up"}` → **204**; `{"rating":"maybe"}` → **400**.
- `POST /api/chat` `{"message":"What is SynthLab?"}` → **502** (streaming path)
  and `?debug=1` → **500** (non-streaming path).

  Root cause confirmed = **Groq daily token cap (TPD) exhausted**, NOT a
  regression. The generation model `openai/gpt-oss-120b` returned HTTP 429:
  `tokens per day (TPD): Limit 200000, Used 197939` — the full chat request
  (prompt + up to 600 output tokens) exceeds the remaining daily budget. A tiny
  direct Groq probe (`max_tokens:5`, streaming and non-streaming) returned 200,
  which is why only the full request fails. `retrieve()` returned 5 contexts
  successfully, so the local-embedding + bundled-index path works; the
  route/pipeline are unchanged. The 429 surfaces as 502 in the streaming catch
  and as 500 in the (un-try/caught) debug path. Chat generation could not be
  live-exercised end-to-end due to the daily cap; re-run after the cap resets
  (~10 min window reported) or with a paid key to see a streamed answer +
  `?debug=1` contexts.
- Dev server process terminated; port 3000 confirmed free afterward.

## Production debug gate

- Unchanged. In `app/api/chat/route.ts` the debug flag is computed as
  `process.env.NODE_ENV !== "production" && (?debug=1 || x-rag-debug:1)`, so the
  `NODE_ENV` check is evaluated FIRST and no code path returns `contexts` when
  `NODE_ENV === "production"`. Covered by the existing passing test
  "never returns JSON contexts in production, even with debug flag + header".

## Deploy-hardening checks

- `data/knowledge.json` is now bundled via a static import in
  `lib/rag/retrieve.ts` (fs read kept as fallback), plus
  `outputFileTracingIncludes` for `/api/chat` in `next.config.ts`.
- `@xenova/transformers` externalized via `serverExternalPackages`.
- Client bundle: no client component imports `data/knowledge.json`; the chat UI
  is lazy (`ChatWidgetLoader`, `next/dynamic ssr:false`) and only
  `data/knowledge-meta.json`-scale data reaches the client. The build produced
  no client chunk carrying the embedding index.

## HF_TOKEN

- Removed the stale entry from `.env.example`. Grep over tracked
  `**/*.{ts,tsx,js,mjs,cjs}` for `HF_TOKEN` → no matches; no app/build code reads
  it. (It appears only in gitignored env files and as incidental prose inside
  `data/knowledge.json`, which is data, not code.)
