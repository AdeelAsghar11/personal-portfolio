"use client";

import profile from "@/data/profile.json";
import achievements from "@/data/achievements.json";

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="font-mono text-sm text-[#00FF88] mb-2">// 01. about</p>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white">
            About <span className="text-[#00FFFF]">Me</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#00FFFF] mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — Bio + Education */}
          <div>
            <p className="text-slate-400 font-mono text-sm leading-7 mb-6">
              {profile.bio}
            </p>

            <div
              className="rounded p-5 mb-8"
              style={{
                border: "1px solid rgba(0,255,255,0.15)",
                background: "rgba(0,255,255,0.03)",
              }}
            >
              <p className="font-mono text-xs text-[#00FF88] mb-4">
                $ research --interests
              </p>
              <div className="space-y-2">
                {profile.researchInterests.map((interest) => (
                  <div key={interest} className="flex items-start gap-2">
                    <span className="text-[#00FFFF] text-xs mt-0.5 flex-shrink-0">→</span>
                    <span className="text-slate-300 font-mono text-xs leading-5">{interest}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded p-5"
              style={{
                border: "1px solid rgba(0,255,255,0.2)",
                background: "rgba(0,255,255,0.04)",
              }}
            >
              <p className="font-mono text-xs text-[#00FF88] mb-4">
                $ education --details
              </p>
              <div className="space-y-3">
                {[
                  { label: "Degree", value: profile.degree },
                  { label: "University", value: profile.university },
                  { label: "Semester", value: profile.semester },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="text-[#00FFFF] font-mono text-xs w-24 flex-shrink-0">
                      {label}:
                    </span>
                    <span className="text-slate-300 font-mono text-xs">{value}</span>
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="text-[#00FFFF] font-mono text-xs w-24 flex-shrink-0">
                    CGPA:
                  </span>
                  <span className="text-[#00FF88] font-mono text-xs font-bold">
                    {profile.cgpa}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Achievements + GDG */}
          <div className="space-y-8">
            <div>
              <p className="font-mono text-xs text-[#00FF88] mb-4">
                $ achievements --list
              </p>
              <div className="space-y-3">
                {achievements.map((a) => (
                  <div key={a.title} className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 leading-5" role="img" aria-label="trophy">🏆</span>
                    <div>
                      <p className="text-slate-200 font-mono text-xs leading-5">{a.title}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{a.org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded p-5"
              style={{
                border: "1px solid rgba(0,255,136,0.2)",
                background: "rgba(0,255,136,0.04)",
              }}
            >
              <p className="font-mono text-xs text-[#00FF88] mb-4">$ gdg --role</p>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-mono font-bold text-[#00FF88]"
                  style={{ border: "1px solid rgba(0,255,136,0.4)" }}
                >
                  GDG
                </div>
                <div>
                  <p className="text-white font-mono text-sm font-bold">
                    Tech Lead &amp; Founding Member
                  </p>
                  <p className="text-slate-400 font-mono text-xs mt-1">
                    GDG On Campus — COMSATS Wah
                  </p>
                  <p className="text-slate-500 font-mono text-xs mt-2 leading-5">
                    Organizing AI/ML and Data Science workshops, fostering a
                    community of tech enthusiasts on campus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
