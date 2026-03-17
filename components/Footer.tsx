"use client";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border-color)" }}>
      <div
        className="w-full px-12 font-mono text-xs"
        style={{
          paddingTop: "24px",
          paddingBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          color: "var(--text-secondary)",
        }}
      >
        <span>Adeel Asghar © {new Date().getFullYear()}</span>
        <span>Built with Next.js &amp; Claude Code</span>
      </div>
    </footer>
  );
}
