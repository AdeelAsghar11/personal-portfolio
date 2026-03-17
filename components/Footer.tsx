export default function Footer() {
  return (
    <footer
      className="py-8 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-xs text-slate-600">
          <span className="text-[#00FFFF]">&gt;</span> Built by{" "}
          <span className="text-[#00FF88]">Adeel Asghar</span> — Next.js +
          Tailwind CSS
        </p>
        <p className="font-mono text-xs text-slate-700">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </footer>
  );
}
