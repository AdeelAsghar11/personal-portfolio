/**
 * vitest.setup.ts — load environment variables for the test process.
 *
 * The project does NOT auto-load dotenv in test context, but the live RAG
 * generation tests (lib/rag/generate.test.ts) need process.env.GROQ_API_KEY.
 * This setup file (registered via test.setupFiles in vitest.config.ts) loads
 * .env.local FIRST, then .env, so a value already set by .env.local wins —
 * dotenv does not override already-defined vars by default.
 *
 * The key is never logged or printed here.
 */

import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });
