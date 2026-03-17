"use client";

import certifications from "@/data/certifications.json";

function getIssuerGroups() {
  const groups: Record<string, number> = {};
  for (const cert of certifications) {
    const issuer = cert.issuer.replace(" (Andrew Ng)", "");
    groups[issuer] = (groups[issuer] ?? 0) + 1;
  }
  return Object.entries(groups);
}

export default function Certifications() {
  const issuerGroups = getIssuerGroups();

  return (
    <section id="certifications">
      <div className="w-full px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* LEFT */}
          <div>
            <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
              // 05. certifications
            </p>
            <h2
              className="font-mono font-bold text-3xl md:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Certifi<span style={{ color: "var(--accent-cyan)" }}>cations</span>
            </h2>
            <div
              style={{
                width: "64px",
                height: "2px",
                background: "var(--accent-cyan)",
                marginTop: "16px",
                marginBottom: "32px",
              }}
            />

            <p
              className="font-mono text-sm"
              style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "32px" }}
            >
              Verified credentials from world-class institutions.
            </p>

            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-green)", marginBottom: "16px" }}>
                $ issuers --summary
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {issuerGroups.map(([issuer, count]) => (
                  <div
                    key={issuer}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
                      {issuer}
                    </span>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: "var(--accent-green)", flexShrink: 0 }}
                    >
                      {count} {count === 1 ? "certificate" : "certificates"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — cert cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <p className="font-mono text-xs" style={{ color: "var(--accent-cyan)" }}>
                  {cert.issuer.replace(" (Andrew Ng)", "")}
                </p>
                <p
                  className="font-mono text-sm font-bold"
                  style={{ color: "var(--text-primary)", lineHeight: 1.4 }}
                >
                  {cert.title}
                </p>
                <p
                  className="font-mono text-xs uppercase"
                  style={{ color: "var(--text-secondary)", marginTop: "auto", paddingTop: "6px", letterSpacing: "0.5px" }}
                >
                  {cert.date}
                </p>
                {cert.credentialId && (
                  <p
                    className="font-mono text-xs"
                    style={{
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
