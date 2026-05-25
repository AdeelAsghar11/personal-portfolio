"use client";

import skills from "@/data/skills.json";

const categoryColors: Record<string, string> = {
  Languages: "var(--accent-green)",
  "AI / Machine Learning": "var(--accent-cyan)",
  "Deep Learning": "var(--accent-cyan)",
  "Data Science": "var(--accent-green)",
  "Web & Databases": "var(--accent-cyan)",
  "MLOps / DevOps": "var(--accent-green)",
  "Deployment & Tools": "var(--accent-cyan)",
};

export default function Skills() {
  return (
    <section id="skills">
      <div className="w-full px-12 py-20">
        <div style={{ marginBottom: "48px" }}>
          <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
            // 04. skills
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
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                {/* Category Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>{category.icon}</span>
                  <h3
                    className="font-mono font-bold text-xs uppercase"
                    style={{ color, letterSpacing: "1px" }}
                  >
                    {category.category}
                  </h3>
                </div>

                {/* Skill Pills Cloud */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="font-mono text-xs transition-all duration-200"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        color: "var(--text-secondary)",
                        cursor: "default",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = color;
                        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                        (e.currentTarget as HTMLElement).style.background = `color-mix(in srgb, ${color} 8%, transparent)`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                      }}
                    >
                      {skill.name}
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
