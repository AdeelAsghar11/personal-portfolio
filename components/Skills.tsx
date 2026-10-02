"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2, Zap, Bot, Cpu, BarChart3, Wrench, LucideIcon } from "lucide-react";
import skills from "@/data/skills.json";
import SectionReveal from "./SectionReveal";

const categoryIcons: Record<string, LucideIcon> = {
  Languages: Code2,
  "LLM & RAG Systems": Zap,
  "AI / Machine Learning": Bot,
  "Deep Learning & Computer Vision": Cpu,
  "Data & Analytics": BarChart3,
  "MLOps & Deployment": Wrench,
};

const categoryTheme: Record<string, { color: string }> = {
  Languages: {
    color: "var(--accent-green)",
  },
  "LLM & RAG Systems": {
    color: "var(--accent-cyan)",
  },
  "AI / Machine Learning": {
    color: "var(--accent-teal)",
  },
  "Deep Learning & Computer Vision": {
    color: "var(--accent-violet)",
  },
  "Data & Analytics": {
    color: "var(--accent-green)",
  },
  "MLOps & Deployment": {
    color: "var(--accent-cyan)",
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
            };
            const Icon = categoryIcons[category.category] || Code2;

            return (
              <motion.div
                key={category.category}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--border-hover)] backdrop-blur-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[var(--border-color)]">
                    <span
                      className="p-1.5 rounded-md flex items-center justify-center border border-[var(--border-color)] bg-[var(--bg-tertiary)]"
                      style={{ color: theme.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
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
                        className="font-mono text-xs px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--bg-elevated)] transition-all duration-200 select-none cursor-default font-medium"
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
