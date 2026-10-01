"use client";

import profile from "@/data/profile.json";

export default function About() {
  return (
    <section id="about">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-20 items-start">

          {/* LEFT: Bio */}
          <div>
            <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
              // 01. about
            </p>
            <h2
              className="font-mono font-bold text-3xl md:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              About <span style={{ color: "var(--accent-cyan)" }}>Me</span>
            </h2>
            <div
              style={{
                width: "64px",
                height: "2px",
                background: "var(--accent-cyan)",
                marginTop: "16px",
                marginBottom: "32px",
              }}
            />

            <p
              className="font-mono text-sm"
              style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}
            >
              {profile.bio}
            </p>
          </div>

          {/* RIGHT: Interests Terminal Block */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "24px",
              marginTop: "4px"
            }}
          >
            <p className="font-mono text-xs" style={{ color: "var(--accent-green)", marginBottom: "16px" }}>
              $ research --interests
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {profile.researchInterests.map((interest) => (
                <div key={interest} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span className="font-mono text-sm" style={{ color: "var(--accent-cyan)", flexShrink: 0, marginTop: "1px" }}>→</span>
                  <span className="font-mono text-sm" style={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
                    {interest}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
