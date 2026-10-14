import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Generous timeout: the first run loads/downloads the local transformer
    // model, which can take a while.
    testTimeout: 180000,
    hookTimeout: 180000,
    // Let @xenova/transformers resolve as real ESM (same as tsx loads it in
    // build-index) rather than being pre-bundled by vite.
    server: {
      deps: {
        external: ["@xenova/transformers"],
      },
    },
  },
});
