"use client";

import experience from "@/data/experience.json";

const stats = [
  { value: "100+", label: "Students Mentored" },
  { value: "2+", label: "Years Building" },
];

export default function Experience() {
  return (
    <section id="experience">
      <div className="w-full px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* LEFT */}
          <div>
            <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
              // 04. experience
            </p>
            <h2
              className="font-mono font-bold text-3xl md:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Work <span style={{ color: "var(--accent-cyan)" }}>Experience</span>
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
              style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "40px" }}
            >
              My professional journey building AI systems and leading technical communities.
            </p>

            <div style={{ display: "flex", gap: "40px" }}>
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="font-mono font-bold"
                    style={{ fontSize: "36px", color: "var(--accent-cyan)", lineHeight: 1 }}
                  >
                    {value}
                  </p>
                  <p
                    className="font-mono text-sm"
                    style={{ color: "var(--text-secondary)", marginTop: "6px" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "8px",
                bottom: "0",
                width: "2px",
                background: "var(--border-color)",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "28px", paddingLeft: "52px" }}>
              {experience.map((item, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-41px",
                      top: "10px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: item.current ? "transparent" : "var(--accent-cyan)",
                      border: `2px solid ${item.current ? "var(--accent-cyan)" : "var(--bg)"}`,
                    }}
                  />

                  {/* Card */}
                  <div
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "4px",
                      }}
                    >
                      <h3
                        className="font-mono font-bold text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.role}
                      </h3>
                      {item.current && (
                        <span
                          className="font-mono text-xs"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: "rgba(0,255,255,0.08)",
                            border: "1px solid rgba(0,255,255,0.3)",
                            color: "var(--accent-cyan)",
                          }}
                        >
                          CURRENT
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "4px" }}>
                      {item.company}
                    </p>

                    <p
                      className="font-mono text-xs uppercase"
                      style={{ color: "var(--text-secondary)", marginBottom: "14px", letterSpacing: "0.5px" }}
                    >
                      {item.period} &middot; {item.type}
                    </p>

                    <ul style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {item.bullets.map((b, i) => (
                        <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span
                            className="font-mono text-xs"
                            style={{ color: "var(--accent-green)", flexShrink: 0, marginTop: "1px" }}
                          >
                            ▸
                          </span>
                          <span
                            className="font-mono text-xs"
                            style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
