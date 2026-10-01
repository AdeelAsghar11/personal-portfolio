"use client";

import { motion, useReducedMotion } from "framer-motion";
import skills from "@/data/skills.json";
import SectionReveal from "./SectionReveal";

const categoryTheme: Record<string, { color: string; border: string; bg: string }> = {
  Languages: {
    color: "var(--accent-green)",
    border: "rgba(0, 255, 136, 0.25)",
    bg: "rgba(0, 255, 136, 0.05)",
  },
  "LLM & RAG Systems": {
    color: "var(--accent-cyan)",
    border: "rgba(0, 240, 255, 0.25)",
    bg: "rgba(0, 240, 255, 0.06)",
  },
  "AI / Machine Learning": {
    color: "var(--accent-teal)",
    border: "rgba(20, 184, 166, 0.25)",
    bg: "rgba(20, 184, 166, 0.05)",
  },
  "Deep Learning & Computer Vision": {
    color: "var(--accent-violet)",
    border: "rgba(139, 92, 246, 0.28)",
    bg: "rgba(139, 92, 246, 0.06)",
  },
  "Data & Analytics": {
    color: "var(--accent-green)",
    border: "rgba(0, 255, 136, 0.25)",
    bg: "rgba(0, 255, 136, 0.05)",
  },
  "MLOps & Deployment": {
    color: "var(--accent-cyan)",
    border: "rgba(0, 240, 255, 0.25)",
    bg: "rgba(0, 240, 255, 0.06)",
  },
};

export default function Skills() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[var(--accent-green)]">// 04.</span>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Capabilities</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
            Technical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-teal)] to-[var(--accent-green)]">
              Stack &amp; Tooling
            </span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((category) => {
            const theme = categoryTheme[category.category] || {
              color: "var(--accent-cyan)",
              border: "rgba(0, 240, 255, 0.25)",
              bg: "rgba(0, 240, 255, 0.05)",
            };

            return (
              <motion.div
                key={category.category}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 hover:border-[var(--border-hover)] backdrop-blur-xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[var(--border-color)]">
                    <span className="text-base select-none">{category.icon}</span>
                    <h3
                      className="font-mono font-bold text-xs uppercase tracking-wider"
                      style={{ color: theme.color }}
                    >
                      {category.category}
                    </h3>
                  </div>

                  {/* Skill Badges Cloud */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="font-mono text-xs px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--bg-elevated)] transition-all duration-200 select-none cursor-default"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionReveal>
    </section>
  );
}
