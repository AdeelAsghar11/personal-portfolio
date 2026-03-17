"use client";

import experience from "@/data/experience.json";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-sm text-[#00FF88] mb-2">// 04. experience</p>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white">
            Work <span className="text-[#00FFFF]">Experience</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#00FFFF] mt-4" />
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-4 top-2 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, #00FFFF, #00FF88, transparent)",
            }}
          />

          <div className="space-y-10 pl-14">
            {experience.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-10 top-2 w-3 h-3 rounded-full"
                  style={{
                    background: item.current ? "#00FFFF" : "#00FF88",
                    border: "2px solid #0a0a0a",
                    boxShadow: item.current
                      ? "0 0 8px rgba(0,255,255,0.6)"
                      : "0 0 8px rgba(0,255,136,0.4)",
                  }}
                />

                {/* Card */}
                <div
                  className="rounded p-6 transition-colors"
                  style={{
                    border: item.current
                      ? "1px solid rgba(0,255,255,0.2)"
                      : "1px solid rgba(255,255,255,0.07)",
                    background: item.current
                      ? "rgba(0,255,255,0.03)"
                      : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <h3 className="text-white font-mono font-bold text-sm">
                      {item.role}
                    </h3>
                    <span className="hidden sm:block text-slate-600 font-mono text-xs">
                      @
                    </span>
                    <span className="text-[#00FF88] font-mono text-sm">
                      {item.company}
                    </span>
                    {item.current && (
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded self-start sm:self-auto"
                        style={{
                          background: "rgba(0,255,255,0.08)",
                          border: "1px solid rgba(0,255,255,0.3)",
                          color: "#00FFFF",
                        }}
                      >
                        CURRENT
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 font-mono text-xs mb-4">
                    {item.period} &middot; {item.type}
                  </p>

                  <ul className="space-y-2">
                    {item.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#00FF88] text-xs mt-0.5 flex-shrink-0">
                          →
                        </span>
                        <span className="text-slate-400 font-mono text-xs leading-5">
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
    </section>
  );
}
