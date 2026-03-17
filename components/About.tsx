"use client";

import profile from "@/data/profile.json";
import achievements from "@/data/achievements.json";

export default function About() {
  return (
    <section id="about">
      <div className="w-full px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* LEFT */}
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
              style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "32px" }}
            >
              {profile.bio}
            </p>

            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-green)", marginBottom: "16px" }}>
                $ research --interests
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Education */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-green)", marginBottom: "16px" }}>
                $ education --details
              </p>
              {[
                { label: "Degree", value: profile.degree },
                { label: "University", value: profile.university },
                { label: "Semester", value: profile.semester },
                { label: "CGPA", value: profile.cgpa },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="font-mono text-sm"
                  style={{ display: "flex", gap: "8px", padding: "4px 0", alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      color: "var(--accent-cyan)",
                      width: "84px",
                      flexShrink: 0,
                    }}
                  >
                    {label}:
                  </span>
                  <span
                    style={{
                      color: label === "CGPA" ? "var(--accent-green)" : "var(--text-primary)",
                      fontWeight: label === "CGPA" ? "bold" : "normal",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-green)", marginBottom: "16px" }}>
                $ achievements --list
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {achievements.map((a) => (
                  <div key={a.title} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span className="font-mono text-sm" style={{ color: "var(--accent-green)", flexShrink: 0 }}>▶</span>
                    <div>
                      <p className="font-mono text-sm" style={{ color: "var(--text-primary)", lineHeight: 1.4 }}>
                        {a.title}
                      </p>
                      <p className="font-mono text-xs" style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                        {a.org}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GDG */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-green)", marginBottom: "16px" }}>
                $ gdg --role
              </p>
              <p className="font-mono text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Tech Lead &amp; Founding Member
              </p>
              <p className="font-mono text-xs" style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                GDG On Campus — COMSATS Wah
              </p>
              <p
                className="font-mono text-xs"
                style={{ color: "var(--text-secondary)", marginTop: "10px", lineHeight: 1.7 }}
              >
                Organizing AI/ML and Data Science workshops, fostering a community of tech enthusiasts on campus.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
