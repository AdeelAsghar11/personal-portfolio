"use client";

import { motion, useReducedMotion } from "framer-motion";
import certifications from "@/data/certifications.json";
import SectionReveal from "./SectionReveal";

function getIssuerGroups() {
  const groups: Record<string, number> = {};
  for (const cert of certifications) {
    const issuer = cert.issuer.replace(" (Andrew Ng)", "");
    groups[issuer] = (groups[issuer] ?? 0) + 1;
  }
  return Object.entries(groups);
}

export default function Certifications() {
  const issuerGroups = getIssuerGroups();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="certifications" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">

          {/* LEFT: Section Intro & Summary Terminal */}
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[var(--accent-green)]">// 07.</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Verification</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              Certifications &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[#38bdf8] to-[var(--accent-green)]">
                Credentials
              </span>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] my-6 rounded-full" />

            <p className="font-sans text-base text-[var(--text-secondary)] leading-relaxed mb-8 max-w-md">
              Specialized coursework and verified certifications across machine learning, deep learning, data engineering, and agentic workflows.
            </p>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-green)] mb-4">
                <span>$</span>
                <span>issuers --summary</span>
              </div>

              <div className="space-y-3">
                {issuerGroups.map(([issuer, count]) => (
                  <div
                    key={issuer}
                    className="flex justify-between items-center py-1 text-sm border-b border-[var(--border-color)]/50 last:border-0"
                  >
                    <span className="font-sans text-xs sm:text-sm text-[var(--text-secondary)]">
                      {issuer}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10">
                      {count} {count === 1 ? "cert" : "certs"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Responsive Certifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-cyan)]/40 hover:shadow-[0_8px_30px_-10px_rgba(0,240,255,0.12)] backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-sm"
              >
                <div>
                  <span className="font-mono text-xs text-[var(--accent-cyan)] font-medium block mb-1.5">
                    {cert.issuer.replace(" (Andrew Ng)", "")}
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug">
                    {cert.title}
                  </h3>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-color)]/60 flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="uppercase tracking-wider text-[var(--text-muted)]">
                    {cert.date}
                  </span>
                  {cert.credentialId && (
                    <span
                      title={cert.credentialId}
                      className="text-[var(--text-secondary)] truncate max-w-[120px]"
                    >
                      ID: {cert.credentialId}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </SectionReveal>
    </section>
  );
}
