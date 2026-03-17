"use client";

import projects from "@/data/projects.json";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-sm text-[#00FF88] mb-2">// 03. projects</p>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white">
            Featured <span className="text-[#00FFFF]">Projects</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#00FFFF] mt-4" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.title}
              className="relative rounded p-6 flex flex-col transition-all duration-200 group"
              style={{
                border: project.featured
                  ? "1px solid rgba(0,255,255,0.25)"
                  : "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = project.featured
                  ? "rgba(0,255,255,0.5)"
                  : "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor = project.featured
                  ? "rgba(0,255,255,0.25)"
                  : "rgba(255,255,255,0.06)";
              }}
            >
              {"status" in project && project.status === "in-progress" && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-mono px-2 py-0.5 rounded"
                  style={{
                    color: "#F59E0B",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.35)",
                  }}
                >
                  🚧 In Progress
                </span>
              )}
              {"status" in project && project.status === "prototype" && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-mono px-2 py-0.5 rounded"
                  style={{
                    color: "#A855F7",
                    background: "rgba(168,85,247,0.1)",
                    border: "1px solid rgba(168,85,247,0.35)",
                  }}
                >
                  🧪 Prototype
                </span>
              )}

              <div className="mb-3">
                <span className="text-[#00FF88] font-mono text-xs">$ ./</span>
                <h3 className="text-white font-mono font-bold mt-1 text-sm group-hover:text-[#00FFFF] transition-colors">
                  {project.title}
                </h3>
              </div>

              <p className="text-slate-400 font-mono text-xs leading-5 mb-4">
                {project.description}
              </p>

              {"insight" in project && project.insight && (
                <div
                  className="mb-4 pt-3 flex-1"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="font-mono text-[10px] text-[#00FFFF] mb-1.5">
                    💡 Key Insight
                  </p>
                  <p className="font-mono text-[11px] text-slate-500 leading-5 italic">
                    {project.insight}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{
                      color: "rgba(0,255,136,0.8)",
                      border: "1px solid rgba(0,255,136,0.2)",
                      background: "rgba(0,255,136,0.05)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-auto">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-[#00FFFF] transition-colors"
                  >
                    <span>⌥ GitHub</span>
                    <span>→</span>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-[#00FF88] transition-colors"
                  >
                    <span>↗ Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
