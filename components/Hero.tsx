"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import profile from "@/data/profile.json";
import NetworkCanvas from "./NetworkCanvas";

const titles = [
  "Co-Founder & CAIO @ Algoligence",
  "Full Stack AI Engineer",
  "LLMs · RAG · Computer Vision · ML",
];

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const current = titles[titleIndex];
    const len = displayed.length;
    if (typing) {
      if (len < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, len + 1)), 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2400);
        return () => clearTimeout(t);
      }
    } else {
      if (len > 0) {
        const t = setTimeout(() => setDisplayed(current.slice(0, len - 1)), 25);
        return () => clearTimeout(t);
      } else {
        setTitleIndex((prev) => (prev + 1) % titles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, titleIndex]);

  return (
    <section
      id="hero"
      className="relative overflow-hidden flex items-center min-h-[100dvh]"
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(0, 240, 255, 0.09) 0%, rgba(139, 92, 246, 0.05) 45%, transparent 80%), var(--bg)",
      }}
    >
      {/* Interactive Agentic Network Canvas */}
      <NetworkCanvas />

      {/* Tech Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Hero Ambient Glow Spotlight */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-[550px] w-[550px] -translate-x-1/2 rounded-full opacity-15 dark:opacity-30 filter blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--accent-cyan) 0%, var(--accent-violet) 50%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-28 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">

          {/* LEFT COLUMN */}
          <div className="w-full">
            {/* Terminal Prompt Tag */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-md mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span className="font-mono text-xs text-[var(--accent-green)]">~/portfolio</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">$</span>
              <span className="font-mono text-xs text-[var(--text-secondary)]">whoami</span>
            </div>

            {/* Display Headline */}
            <h1
              className="font-display font-bold tracking-tight text-[var(--text-primary)] mb-4"
              style={{
                fontSize: "clamp(42px, 6.5vw, 76px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              <span>Adeel </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[#38bdf8] to-[var(--accent-green)]">
                Asghar
              </span>
            </h1>

            {/* Typewriter Rotator */}
            <div className="h-10 sm:h-12 flex items-center mb-6">
              <span className="font-mono text-base sm:text-xl md:text-2xl font-medium text-[var(--accent-cyan)] flex items-center">
                <span className="text-[var(--accent-green)] mr-2 select-none">&gt;</span>
                {displayed}
                <span className="inline-block w-2 sm:w-2.5 h-5 sm:h-6 bg-[var(--accent-cyan)] ml-1.5 animate-pulse" />
              </span>
            </div>

            {/* Tagline / Subtitle */}
            <p className="font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mb-8">
              {profile.tagline}
            </p>

            {/* Actions CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.a
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-semibold px-6 py-3 rounded-lg flex items-center gap-2 text-white dark:text-[#060913] transition-shadow duration-300"
                style={{
                  background: "linear-gradient(135deg, var(--accent-cyan), #38bdf8)",
                  boxShadow: "0 0 24px rgba(0, 240, 255, 0.35)",
                }}
              >
                <span>↓ Download Resume</span>
              </motion.a>

              <motion.a
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-medium px-5 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors duration-200 flex items-center gap-2"
              >
                <span>GitHub →</span>
              </motion.a>

              <motion.a
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-medium px-5 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] transition-colors duration-200 flex items-center gap-2"
              >
                <span>LinkedIn →</span>
              </motion.a>
            </div>
          </div>

          {/* RIGHT COLUMN — Avatar & Status Card */}
          <div className="flex flex-col items-center justify-center relative">
            {/* Ambient Aura Rings */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full scale-110 filter blur-xl opacity-40 animate-pulse pointer-events-none"
                style={{
                  background: "radial-gradient(circle, var(--accent-cyan) 0%, var(--accent-violet) 70%, transparent 100%)",
                }}
              />

              {/* Multi-layered Border Frame */}
              <div
                className="p-1 rounded-full relative z-10"
                style={{
                  background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet), var(--accent-green))",
                }}
              >
                <div className="p-1 rounded-full bg-[var(--bg)]">
                  <Image
                    src="/images/cover.jpeg"
                    alt={profile.name}
                    width={320}
                    height={320}
                    priority
                    className="w-56 h-56 sm:w-68 sm:h-68 md:w-80 md:h-80 rounded-full object-cover object-top select-none"
                  />
                </div>
              </div>
            </div>

            {/* Status Indicator Pill */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                Open to AI Systems &amp; Collabs
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
