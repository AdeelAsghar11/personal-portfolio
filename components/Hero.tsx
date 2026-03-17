"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import profile from "@/data/profile.json";

const titles = [
  "AI Engineer & Systems Thinker",
  "ML · DL · DevOps",
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
      className="relative overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "35%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 w-full px-12 flex items-center"
        style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "100vh" }}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_420px] gap-12 md:gap-20 items-center">

          {/* LEFT COLUMN */}
          <div>
            <div className="font-mono text-sm flex items-center gap-2" style={{ marginBottom: "24px" }}>
              <span style={{ color: "var(--accent-green)" }}>~/portfolio</span>
              <span style={{ color: "var(--border-color)" }}>$</span>
              <span style={{ color: "var(--text-secondary)" }}>whoami</span>
            </div>

            <h1
              className="font-mono font-bold"
              style={{
                fontSize: "clamp(48px, 7vw, 72px)",
                letterSpacing: "-2px",
                lineHeight: 1,
                marginBottom: "24px",
              }}
            >
              <span style={{ color: "var(--text-primary)" }}>Adeel </span>
              <span style={{ color: "var(--accent-cyan)" }}>Asghar</span>
            </h1>

            <div style={{ height: "40px", display: "flex", alignItems: "center", marginBottom: "24px" }}>
              <span
                className="font-mono"
                style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "var(--accent-green)" }}
              >
                {displayed}
                <span className="animate-pulse" style={{ marginLeft: "2px" }}>|</span>
              </span>
            </div>

            <p
              className="font-mono text-sm"
              style={{ color: "var(--text-secondary)", margin: "24px 0", maxWidth: "480px", lineHeight: 1.8 }}
            >
              <span style={{ color: "var(--accent-cyan)" }}>// </span>
              {profile.tagline}
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { label: "↓ Download Resume", href: profile.resume, color: "var(--accent-cyan)" },
                { label: "GitHub →", href: profile.github, color: "var(--accent-green)" },
                { label: "LinkedIn →", href: profile.linkedin, color: "var(--accent-green)" },
              ].map(({ label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono"
                  style={{
                    padding: "10px 24px",
                    border: `1px solid ${color}`,
                    color,
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = color;
                    (e.currentTarget as HTMLElement).style.color = "var(--bg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = color;
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Image
              src="/images/profile.jpg"
              alt="Adeel Asghar"
              width={320}
              height={320}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "top center",
                border: "2px solid var(--accent-cyan)",
                boxShadow: "0 0 40px rgba(0,255,255,0.15)",
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
