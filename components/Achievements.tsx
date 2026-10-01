"use client";

import { motion, useReducedMotion } from "framer-motion";
import achievements from "@/data/achievements.json";
import SectionReveal from "./SectionReveal";

export default function Achievements() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="achievements" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[var(--accent-green)]">// 03.</span>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Recognition</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
            Honors &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[#38bdf8] to-[var(--accent-green)]">
              Achievements
            </span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 hover:border-[var(--accent-cyan)]/50 hover:shadow-[0_8px_30px_-10px_rgba(0,240,255,0.15)] backdrop-blur-xl p-6 flex gap-4 items-start transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center flex-shrink-0 text-[var(--accent-cyan)]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="font-display font-bold text-base text-[var(--text-primary)] leading-snug">
                  {item.title}
                </h3>
                <p className="font-mono text-xs font-semibold text-[var(--accent-cyan)] mt-1.5">
                  {item.org}
                </p>
                {item.desc && (
                  <p className="font-sans text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
                    {item.desc}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
