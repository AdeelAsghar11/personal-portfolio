"use client";

import { motion, useReducedMotion } from "framer-motion";
import experience from "@/data/experience.json";
import SectionReveal from "./SectionReveal";

const stats = [
  { value: "5+", label: "Workshops Hosted" },
  { value: "2+", label: "Years Building" },
];

export default function Experience() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">

          {/* LEFT: Section Headline & Metrics */}
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[var(--accent-green)]">// 06.</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Journey</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              Work &amp; Leadership{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[#38bdf8] to-[var(--accent-green)]">
                Experience
              </span>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] my-6 rounded-full" />

            <p className="font-sans text-base text-[var(--text-secondary)] leading-relaxed mb-8 max-w-md">
              My engineering trajectory co-founding startups, building agentic AI pipelines, and leading community technology initiatives.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-xs">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl p-4 sm:p-5 shadow-sm"
                >
                  <p className="font-display font-bold text-3xl sm:text-4xl text-[var(--accent-cyan)] tracking-tight leading-none mb-2">
                    {value}
                  </p>
                  <p className="font-mono text-xs text-[var(--text-secondary)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Polished Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l border-[var(--border-color)] space-y-10 sm:space-y-12">
            {experience.map((item, idx) => (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot Node */}
                <span
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                    item.current
                      ? "bg-[var(--accent-cyan)] border-[var(--bg)] shadow-[0_0_12px_var(--accent-cyan)] ring-4 ring-[var(--accent-cyan)]/20"
                      : "bg-[var(--bg)] border-[var(--border-color)]"
                  }`}
                />

                {/* Experience Card */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-cyan)]/40 hover:shadow-[0_8px_30px_-10px_rgba(0,240,255,0.12)] backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)]">
                      {item.role}
                    </h3>
                    {item.current && (
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--accent-green)]/40 text-[var(--accent-green)] bg-[var(--accent-green)]/10 font-medium">
                        Present
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-sm text-[var(--accent-cyan)] font-medium mb-1">
                    {item.company}
                  </p>

                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-5">
                    {item.period} · {item.type}
                  </p>

                  <ul className="space-y-3">
                    {item.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[var(--accent-green)] text-xs mt-1 select-none flex-shrink-0">
                          ▸
                        </span>
                        <span className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </SectionReveal>
    </section>
  );
}
