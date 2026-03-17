"use client";

import achievements from "@/data/achievements.json";

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-sm text-[#00FF88] mb-2">// 06. achievements</p>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white">
            Achieve<span className="text-[#00FFFF]">ments</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#00FFFF] mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded p-5 transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(0,255,136,0.25)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(0,255,136,0.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.02)";
              }}
            >
              <span
                className="text-lg flex-shrink-0 mt-0.5"
                role="img"
                aria-label="trophy"
              >
                🏆
              </span>
              <div>
                <p className="text-white font-mono text-sm font-bold leading-5">
                  {item.title}
                </p>
                <p className="text-slate-500 font-mono text-xs mt-1">{item.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
