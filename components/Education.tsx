"use client";

import profile from "@/data/profile.json";

export default function Education() {
  return (
    <section id="education">
      <div className="w-full px-12 py-20">
        <div style={{ marginBottom: "48px" }}>
          <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
            // 02. education
          </p>
          <h2
            className="font-mono font-bold text-3xl md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Academic <span style={{ color: "var(--accent-cyan)" }}>Journey</span>
          </h2>
          <div style={{ width: "64px", height: "2px", background: "var(--accent-cyan)", marginTop: "16px" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-16 items-stretch">
          {/* LEFT: School & Program Details */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div className="flex gap-4 items-start mb-6">
              <span style={{ fontSize: "24px", marginTop: "2px" }}>🎓</span>
              <div>
                <h3 className="font-mono font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                  {profile.degree}
                </h3>
                <p className="font-mono text-sm" style={{ color: "var(--accent-cyan)", marginTop: "4px" }}>
                  {profile.university}
                </p>
              </div>
            </div>

            <div 
              className="border-t font-mono text-sm" 
              style={{ borderColor: "var(--border-color)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Semester:</span>
                <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{profile.semester}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Expected Graduation:</span>
                <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{profile.expectedGrad}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Status:</span>
                <span style={{ color: "var(--accent-green)", fontWeight: "bold" }}>Active Undergraduate</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Standout CGPA Metric Card */}
          <div
            style={{
              background: "radial-gradient(circle at top right, rgba(0, 255, 136, 0.05), transparent 70%), var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <span className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
              Cumulative GPA
            </span>
            <div 
              className="font-mono font-bold" 
              style={{ 
                fontSize: "56px", 
                lineHeight: 1, 
                color: "var(--accent-green)",
                textShadow: "0 0 30px rgba(0, 255, 136, 0.15)",
                margin: "12px 0"
              }}
            >
              3.83
            </div>
            <div className="w-16 h-[1px] bg-neutral-800 my-2" />
            <span className="font-mono text-sm" style={{ color: "var(--text-primary)", fontWeight: "bold" }}>
              Scale: 4.00
            </span>
            <div 
              style={{
                marginTop: "20px",
                padding: "8px 16px",
                background: "rgba(0, 255, 255, 0.05)",
                border: "1px solid rgba(0, 255, 255, 0.15)",
                borderRadius: "4px"
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-cyan)", fontWeight: "bold" }}>
                🏆 Academic Excellence Scholar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
