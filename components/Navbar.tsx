"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              background: "rgba(6, 9, 19, 0.82)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid var(--border-color)",
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
            }
          : { background: "transparent" }
      }
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="font-mono text-base sm:text-lg font-bold flex items-center gap-1.5 group">
          <span className="text-[var(--accent-cyan)] group-hover:-translate-x-0.5 transition-transform duration-200">
            &gt;
          </span>
          <span className="text-[var(--text-primary)]">adeelasghar</span>
          <span className="text-[var(--accent-green)]">.dev</span>
        </a>

        {/* Desktop Links + Theme toggle */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors duration-200 relative py-1"
            >
              {link.label}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-sm hover:border-[var(--accent-cyan)]/40 transition-colors cursor-pointer"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Mobile / Tablet: theme toggle + hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-sm cursor-pointer"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            className="font-mono text-xl text-[var(--accent-cyan)] p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="lg:hidden px-6 sm:px-8 py-5 flex flex-col gap-3.5 border-t border-[var(--border-color)]"
          style={{
            background: "rgba(6, 9, 19, 0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors py-1 flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-[var(--accent-green)] text-xs">→</span>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
