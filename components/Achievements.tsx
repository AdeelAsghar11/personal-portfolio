"use client";

import achievements from "@/data/achievements.json";

export default function Achievements() {
  return (
    <section id="achievements">
      <div className="w-full px-12 py-20">
        <div style={{ marginBottom: "48px" }}>
          <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
            // 03. achievements
          </p>
          <h2
            className="font-mono font-bold text-3xl md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Honors & <span style={{ color: "var(--accent-cyan)" }}>Achievements</span>
          </h2>
          <div style={{ width: "64px", height: "2px", background: "var(--accent-cyan)", marginTop: "16px" }} />
        </div>

        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            gap: "20px" 
          }}
        >
          {achievements.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "24px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 255, 136, 0.25)";
                (e.currentTarget as HTMLElement).style.background = "rgba(0, 255, 136, 0.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
              }}
            >
              <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }} role="img" aria-label="trophy">
                🏆
              </span>
              <div>
                <h3 
                  className="font-mono font-bold text-sm" 
                  style={{ color: "var(--text-primary)", lineHeight: 1.5 }}
                >
                  {item.title}
                </h3>
                <p 
                  className="font-mono text-xs font-semibold" 
                  style={{ color: "var(--accent-cyan)", marginTop: "4px" }}
                >
                  {item.org}
                </p>
                {item.desc && (
                  <p 
                    className="font-mono text-xs" 
                    style={{ color: "var(--text-secondary)", marginTop: "10px", lineHeight: 1.6 }}
                  >
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
