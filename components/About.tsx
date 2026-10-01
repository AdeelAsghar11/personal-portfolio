"use client";

import profile from "@/data/profile.json";
import SectionReveal from "./SectionReveal";

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">

          {/* LEFT: Bio & Persona */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[var(--accent-green)]">// 01.</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">About</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              Engineering AI Systems with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)]">
                Precision &amp; Purpose
              </span>
            </h2>

            <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] my-6 rounded-full" />

            <div className="space-y-4">
              <p className="font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* RIGHT: Interactive Terminal Box */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/70">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#eab308]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#22c55e]/80 inline-block" />
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">research.py</span>
              <span className="w-8" />
            </div>

            {/* Terminal Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-green)] mb-5">
                <span>$</span>
                <span>python3 -m research --interests</span>
              </div>

              <div className="space-y-4">
                {profile.researchInterests.map((interest, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg)]/50 hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--bg-elevated)]/40 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-sm text-[var(--accent-cyan)] mt-0.5 group-hover:translate-x-0.5 transition-transform duration-200">
                        →
                      </span>
                      <p className="font-sans text-sm text-[var(--text-primary)] leading-normal">
                        {interest}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </SectionReveal>
    </section>
  );
}
