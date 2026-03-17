"use client";

import skills from "@/data/skills.json";

const categoryColors: Record<string, string> = {
  Languages: "var(--accent-green)",
  "AI / Machine Learning": "var(--accent-cyan)",
  "Deep Learning": "var(--accent-cyan)",
  "Data Science": "#FFD700",
  "Web & Databases": "#C084FC",
  "MLOps / DevOps": "#FF6B6B",
  "Deployment & Tools": "#38BDF8",
};

function DotRating({ level }: { level: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px", alignItems: "center", marginLeft: "6px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            color: i < level ? "var(--accent-cyan)" : "var(--border-color)",
            fontSize: "8px",
            lineHeight: 1,
          }}
        >
          {i < level ? "●" : "○"}
        </span>
      ))}
    </span>
  );
}

export default function Skills() {
  return (
    <section id="skills">
      <div className="w-full px-12 py-20">
        <div style={{ marginBottom: "48px" }}>
          <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
            // 02. skills
          </p>
          <h2
            className="font-mono font-bold text-3xl md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Tech <span style={{ color: "var(--accent-cyan)" }}>Stack</span>
          </h2>
          <div style={{ width: "64px", height: "2px", background: "var(--accent-cyan)", marginTop: "16px" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {skills.map((category) => {
            const color = categoryColors[category.category] ?? "var(--accent-cyan)";
            return (
              <div
                key={category.category}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>{category.icon}</span>
                  <h3
                    className="font-mono font-bold text-xs uppercase"
                    style={{ color, letterSpacing: "1px" }}
                  >
                    {category.category}
                  </h3>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="font-mono text-sm"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "20px",
                        padding: "4px 14px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {skill.name}
                      <DotRating level={skill.level} />
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
