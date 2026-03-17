"use client";

import skills from "@/data/skills.json";

const categoryColors: Record<string, string> = {
  Languages: "#00FF88",
  "AI / Machine Learning": "#00FFFF",
  "Deep Learning": "#00FFFF",
  "Data Science": "#FFD700",
  "Web & Databases": "#C084FC",
  "MLOps / DevOps": "#FF6B6B",
  "Deployment & Tools": "#38BDF8",
};

function DotRating({ level }: { level: number }) {
  return (
    <span className="flex gap-0.5 items-center ml-1.5 flex-shrink-0">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            color: i < level ? "#00FFFF" : "rgba(255,255,255,0.12)",
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
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-sm text-[#00FF88] mb-2">// 02. skills</p>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white">
            Tech <span className="text-[#00FFFF]">Stack</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#00FFFF] mt-4" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((category) => {
            const color = categoryColors[category.category] ?? "#00FFFF";
            return (
              <div
                key={category.category}
                className="rounded p-5 transition-colors"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}35`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.06)";
                }}
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base leading-none">{category.icon}</span>
                  <h3
                    className="font-mono text-xs font-bold tracking-wide uppercase"
                    style={{ color }}
                  >
                    {category.category}
                  </h3>
                </div>

                {/* Skill pills with dot rating */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-mono rounded text-slate-300 hover:text-white transition-colors cursor-default"
                      style={{
                        border: `1px solid ${color}22`,
                        background: `${color}07`,
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
