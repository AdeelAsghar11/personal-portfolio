"use client";

import { useState, useEffect } from "react";

const titles = [
  "AI Engineer & Systems Thinker",
  "ML, DL, DevOps",
  "BSAI @ COMSATS Islamabad",
];

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = titles[titleIndex];
    const len = displayed.length;

    if (typing) {
      if (len < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, len + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (len > 0) {
        const t = setTimeout(() => setDisplayed(current.slice(0, len - 1)), 30);
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
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Terminal prompt */}
        <div className="font-mono text-sm text-slate-500 mb-8 flex items-center justify-center gap-2">
          <span className="text-[#00FF88]">~/portfolio</span>
          <span className="text-slate-600">$</span>
          <span className="text-slate-400">whoami</span>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold font-mono mb-4 tracking-tight">
          <span className="text-white">Adeel </span>
          <span className="text-[#00FFFF]">Asghar</span>
        </h1>

        {/* Animated title */}
        <div className="h-10 flex items-center justify-center mb-8">
          <span className="text-xl md:text-2xl font-mono text-[#00FF88]">
            {displayed}
            <span className="animate-pulse ml-0.5">|</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-slate-400 font-mono text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          <span className="text-[#00FFFF]">// </span>
          Building AI Solutions with Code, Curiosity, and Data.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-[#00FFFF] text-[#00FFFF] font-mono text-sm rounded hover:bg-[#00FFFF] hover:text-[#0a0a0a] transition-all duration-200 font-bold"
          >
            <span>↓</span>
            <span>Download Resume</span>
          </a>
          <a
            href="https://github.com/AdeelAsghar11"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-[#00FF88] text-[#00FF88] font-mono text-sm rounded hover:bg-[#00FF88] hover:text-[#0a0a0a] transition-all duration-200 font-bold"
          >
            <span>⌥</span>
            <span>GitHub</span>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-20 animate-bounce">
          <span className="text-slate-700 font-mono text-xs">scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
