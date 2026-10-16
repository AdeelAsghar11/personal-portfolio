import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @xenova/transformers ships a large ONNX runtime + model loading code that
  // must NOT be bundled by Next's server compiler — bundling native/large deps
  // into the serverless function is a common cold-start/breakage cause. Keeping
  // it external lets Next trace it as a normal node_module dependency instead.
  serverExternalPackages: ["@xenova/transformers", "onnxruntime-node"],

  // Belt-and-suspenders for the serverless file trace: retrieve.ts imports
  // data/knowledge.json statically (the primary bundling mechanism), and this
  // explicitly includes the file in the /api/chat function trace as well, so
  // the committed index is always present at runtime on Vercel.
  outputFileTracingIncludes: {
    "/api/chat": ["./data/knowledge.json"],
  },
};

export default nextConfig;
