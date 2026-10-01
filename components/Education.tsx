"use client";

import profile from "@/data/profile.json";
import SectionReveal from "./SectionReveal";

export default function Education() {
  return (
    <section id="education" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[var(--accent-green)]">// 02.</span>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Education</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
            Academic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)]">
              Journey
            </span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-stretch">
          {/* LEFT: School & Program Details */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/25 flex items-center justify-center flex-shrink-0 text-xl text-[var(--accent-cyan)] font-mono">
                  &lt;/&gt;
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)] tracking-tight">
                    {profile.degree}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[var(--accent-cyan)] mt-1 font-medium">
                    {profile.university}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border-color)] pt-6 space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--text-secondary)]">Semester:</span>
                <span className="text-[var(--text-primary)] font-semibold px-2.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-color)]">
                  {profile.semester}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--text-secondary)]">Expected Graduation:</span>
                <span className="text-[var(--text-primary)] font-semibold">
                  {profile.expectedGrad}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--text-secondary)]">Status:</span>
                <span className="text-[var(--accent-green)] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                  Active Undergraduate
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Standout CGPA Metric Card */}
          <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-[rgba(0,255,136,0.06)] backdrop-blur-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
            {/* Subtle glow orb */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--accent-green)]/10 filter blur-3xl pointer-events-none" />

            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
              Cumulative GPA
            </span>

            <div
              className="font-display font-bold text-6xl sm:text-7xl leading-none text-[var(--accent-green)] my-2"
              style={{
                textShadow: "0 0 35px rgba(0, 255, 136, 0.25)",
              }}
            >
              {profile.cgpa ? profile.cgpa.split("/")[0].trim() : "3.85"}
            </div>

            <div className="w-16 h-0.5 my-3" style={{ background: "var(--border-color)" }} />

            <span className="font-mono text-sm text-[var(--text-secondary)] font-medium">
              Scale: 4.00
            </span>

            <div className="mt-6 px-4 py-2 rounded-full border border-[var(--accent-cyan)]/25 bg-[var(--accent-cyan)]/10 backdrop-blur-sm">
              <p className="font-mono text-xs text-[var(--accent-cyan)] font-semibold flex items-center gap-1.5">
                <span>✦</span> Academic Excellence Scholar
              </p>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
