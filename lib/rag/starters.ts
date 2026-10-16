/**
 * starters.ts — Pre-baked, grounded answers for starter query chips (Tier 1).
 *
 * ~90% of visitors click one of the 4 starter prompt chips in ChatWidget:
 *   1. "What's Adeel's strongest project?"
 *   2. "Tell me about the hackathon wins"
 *   3. "What's his AI/ML tech stack?"
 *   4. "What's his experience and education?"
 *
 * Serving these from a deterministic, pre-verified cache:
 *   - Guarantees 0ms latency and 100% uptime.
 *   - Consumes 0 Groq/Gemini tokens, preserving quota for custom visitor questions.
 *   - Ensures factual, verified responses matching data/*.json exactly.
 */

export const STARTER_ANSWERS: Record<string, string> = {
  project: `Adeel's most prominent project is **Sortd** — the AI-powered content capture platform that won **1st place at the HACKDATA V1 hackathon**.

**Key Highlights:**
- **Multimodal AI Pipeline**: Combines Gemini Vision for screenshot OCR and Groq Whisper for audio transcription, automatically capturing, summarizing, and categorizing content from Instagram Reels, YouTube videos, and screenshots.
- **Tech Stack**: React, Node.js, Supabase, PostgreSQL, PWA, Google Gemini, and Groq Whisper.
- **Architecture**: Zero manual effort from capture to organized, searchable knowledge. Deployed on Vercel and Railway, with open-source code on [GitHub](https://github.com/AdeelAsghar11/sortd).

Other notable projects include **SynthLab** (multi-agent synthetic data generator) and **HealthAI** (multimodal clinical diagnostics).`,

  competitions: `Adeel has achieved top honors across multiple competitive tournaments and hackathons:

1. **1st Place — HACKDATA V1 Hackathon (2026)**: Led core engineering for **Sortd** (Team MadGroot), building an automated multimodal capture and summarization pipeline.
2. **1st Place — Pitch Perfect & AI Model Training (HITEC Mega Code War 2026)**: Claimed first place in predictive ML modeling under strict speed constraints and delivered the winning architecture pitch.
3. **1st Place — CS Quiz Tournament (UET Taxila)**: Finished first in a high-intensity, multi-round tournament testing computer science theory, systems, and algorithms.
4. **1st Place — Speed Programming Competition (HITEC University)**: Built optimized algorithms under tight time limits, outperforming regional university teams.
5. **Academic Excellence Award (COMSATS University Wah)**: Maintained a **3.85 / 4.00 CGPA** within the BS Artificial Intelligence program.`,

  stack: `Adeel's primary AI/ML and engineering tech stack spans:

- **LLM & RAG Systems**: RAG pipelines, Hybrid Retrieval (BM25 + Dense embeddings), Cross-Encoder Reranking, GraphRAG, RAGAS Evaluation, Agentic AI & Tool-Calling workflows.
- **Machine Learning & Deep Learning**: Python, PyTorch, TensorFlow, Keras, Scikit-learn, CNNs (MobileNetV2, ResNet50), Transfer Learning, Transformers (\`@xenova/transformers\`, Hugging Face).
- **LLM APIs & Frameworks**: Groq SDK, Google Gemini & Vision APIs, LangChain / LangGraph.
- **Full-Stack & DevOps**: Next.js, React, Node.js, TypeScript, PostgreSQL, Supabase, Docker, Docker Swarm, and Jenkins CI/CD pipelines.`,

  experience: `Adeel's background, education, and professional experience:

- **Education**: BS in Artificial Intelligence at **COMSATS University Islamabad, Wah Campus** (7th semester, Expected Sept 2027), holding a **3.85 / 4.00 CGPA** and recognized with the Academic Excellence Award.
- **Co-Founder & Chief AI Officer (CAIO) @ Algoligence (Aug 2026 – Present)**: Leading technical vision, designing production-grade multi-agent workflows, GraphRAG retrieval pipelines, and LLM guardrails for enterprise deployments.
- **AI Engineering Intern @ CalderR (Jun 2026 – Sep 2026)**: Resolved BM25 keyword-bias failures using hybrid retrieval with cross-encoder reranking, built multi-source research engines evaluated with RAGAS, and delivered 4 agentic AI tools.
- **AI Intern @ Pakistan Ordnance Factories (Jul 2026 – Aug 2026)**: Supported applied machine learning workflows and production model evaluation.
- **Community Leadership**: Co-Founder & Community Manager at **GDG on Campus COMSATS Wah**, mentoring 100+ students in practical AI/ML.`,
};

// Backwards-compatibility alias
STARTER_ANSWERS.hackathons = STARTER_ANSWERS.competitions;

/**
 * Normalize an input string for loose matching against starter queries.
 * Strips punctuation, quotes, excess whitespace, and lowercases.
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/['’"“”]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns a pre-baked starter answer if the query matches one of the 4 starters,
 * or null if it is a custom query that needs retrieval/LLM generation.
 */
export function getStarterAnswer(query: string): string | null {
  const norm = normalizeQuery(query);

  // Starter 1: Strongest / top / best project
  if (
    norm.includes("strongest project") ||
    norm.includes("best project") ||
    norm.includes("top project") ||
    norm.includes("main project") ||
    (norm.includes("adeel") && norm.includes("project") && norm.includes("strong"))
  ) {
    return STARTER_ANSWERS.project;
  }

  // Starter 2: Competition / hackathon wins / achievements
  if (
    norm.includes("competition") ||
    norm.includes("competitions") ||
    norm.includes("hackathon") ||
    norm.includes("hackathons") ||
    norm.includes("achievements") ||
    norm.includes("tournaments")
  ) {
    return STARTER_ANSWERS.competitions;
  }

  // Starter 3: Tech stack / AI ML stack / tools / technologies
  if (
    norm.includes("tech stack") ||
    norm.includes("ai ml tech stack") ||
    norm.includes("ai stack") ||
    norm.includes("ml stack") ||
    norm.includes("technologies") ||
    (norm.includes("skills") && norm.includes("stack"))
  ) {
    return STARTER_ANSWERS.stack;
  }

  // Starter 4: Experience / education / background
  if (
    norm.includes("experience and education") ||
    norm.includes("education and experience") ||
    norm.includes("background and experience") ||
    (norm.includes("experience") && norm.includes("education"))
  ) {
    return STARTER_ANSWERS.experience;
  }

  return null;
}
