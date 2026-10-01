"use client";

import { useState } from "react";
import profile from "@/data/profile.json";
import SectionReveal from "./SectionReveal";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject || "Portfolio Inquiry"
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

    window.location.href = mailtoUrl;
    setStatus("sent");
    setTimeout(() => setStatus("idle"), 6000);
  };

  const contactLinks = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", value: "AdeelAsghar11", href: profile.github },
    { label: "LinkedIn", value: "adeelasghar11", href: profile.linkedin },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT: Info & Direct Links */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[var(--accent-green)]">// 08.</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Connect</span>
            </div>
            <h2
              className="font-display font-bold text-3xl sm:text-5xl text-[var(--text-primary)] tracking-tight leading-tight"
            >
              Let&apos;s Work<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[#38bdf8] to-[var(--accent-green)]">
                Together.
              </span>
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] my-6 rounded-full" />

            <p className="font-sans text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-md">
              Open to machine learning &amp; full-stack AI roles, client systems, and applied research collaborations.
              If you&apos;re solving a hard problem, let&apos;s talk.
            </p>

            <div className="space-y-3 max-w-md">
              {contactLinks.map((link) => (
                <div
                  key={link.label}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/80 hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--bg-elevated)]/50 transition-all duration-200 backdrop-blur-xl"
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") || link.href.startsWith("tel") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") || link.href.startsWith("tel") ? undefined : "noopener noreferrer"}
                    className="font-mono text-sm flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap flex-1"
                    style={{ textDecoration: "none", color: "var(--text-primary)" }}
                  >
                    <span className="text-[var(--accent-cyan)] flex-shrink-0">→</span>
                    <span className="text-[var(--text-secondary)] flex-shrink-0">{link.label}:</span>
                    <span className="text-[var(--text-primary)] font-medium overflow-hidden text-ellipsis">
                      {link.value}
                    </span>
                  </a>

                  {link.label === "Email" && (
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      className="font-mono text-xs ml-3 px-3 py-1 rounded-md transition-all duration-200 border cursor-pointer"
                      style={{
                        background: copiedEmail ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.05)",
                        borderColor: copiedEmail ? "var(--accent-green)" : "var(--border-color)",
                        color: copiedEmail ? "var(--accent-green)" : "var(--text-secondary)",
                      }}
                    >
                      {copiedEmail ? "✓ Copied" : "Copy"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Terminal Message Dispatcher */}
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                <span className="font-mono text-xs text-[var(--accent-cyan)]">$ send --message</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">terminal v2</span>
            </div>

            {status === "sent" && (
              <div className="font-mono text-xs p-3.5 rounded-lg mb-6 border border-[var(--accent-green)]/40 text-[var(--accent-green)] bg-[var(--accent-green)]/10">
                ✓ Opening default mail client with your message! Direct email: {profile.email}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: "name", label: "Name", type: "text", placeholder: "Ada Lovelace" },
                { id: "email", label: "Email", type: "email", placeholder: "ada@example.com" },
                { id: "subject", label: "Subject", type: "text", placeholder: "Project inquiry or collaboration" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} className="space-y-1.5">
                  <label htmlFor={id} className="font-mono text-xs text-[var(--accent-cyan)] block uppercase tracking-wider">
                    <span className="text-[var(--accent-green)] mr-1">&gt;</span>{label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    required
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg)]/70 font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)]/30 transition-all duration-200"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label htmlFor="message" className="font-mono text-xs text-[var(--accent-cyan)] block uppercase tracking-wider">
                  <span className="text-[var(--accent-green)] mr-1">&gt;</span>Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your product, hard problem, or timeline..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg)]/70 font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)]/30 transition-all duration-200 resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full font-mono text-sm font-semibold py-3 px-4 rounded-lg border border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-[#060913] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] mt-2"
              >
                ./send-message →
              </button>
            </form>
          </div>

        </div>
      </SectionReveal>
    </section>
  );
}
