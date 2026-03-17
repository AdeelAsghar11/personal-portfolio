"use client";

import certifications from "@/data/certifications.json";

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-sm text-[#00FF88] mb-2">// 05. certifications</p>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white">
            Certifi<span className="text-[#00FFFF]">cations</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#00FFFF] mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="rounded p-5 flex flex-col gap-3 transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(0,255,255,0.25)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(0,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.02)";
              }}
            >
              {/* Icon + issuer */}
              <div className="flex items-center gap-2">
                <span className="text-[#00FFFF] text-xs font-mono">✦</span>
                <span className="text-[#00FF88] font-mono text-xs">{cert.issuer}</span>
              </div>

              {/* Title */}
              <p className="text-white font-mono text-sm font-bold leading-5">
                {cert.title}
              </p>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-auto pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="text-slate-500 font-mono text-xs">{cert.date}</span>
                {cert.credentialId && (
                  <span
                    className="font-mono text-[10px] text-slate-600 truncate max-w-[120px]"
                    title={cert.credentialId}
                  >
                    ID: {cert.credentialId}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
