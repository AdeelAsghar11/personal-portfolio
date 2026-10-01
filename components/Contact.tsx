"use client";

import { useState } from "react";
import profile from "@/data/profile.json";

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
    <section id="contact">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* LEFT */}
          <div>
            <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
              // 08. contact
            </p>
            <h2
              className="font-mono font-bold text-3xl md:text-4xl"
              style={{ color: "var(--text-primary)", lineHeight: 1.15 }}
            >
              Let&apos;s Work<br />
              <span style={{ color: "var(--accent-cyan)" }}>Together.</span>
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
              style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "40px" }}
            >
              Open to freelance AI/ML projects, remote roles, and research collaborations.
              If you&apos;re working on a hard problem, I&apos;d like to hear about it.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {contactLinks.map((link) => (
                <div
                  key={link.label}
                  className="flex items-center justify-between"
                  style={{
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    padding: "12px 20px",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                  }}
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") || link.href.startsWith("tel") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") || link.href.startsWith("tel") ? undefined : "noopener noreferrer"}
                    className="font-mono text-sm flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ textDecoration: "none", color: "var(--text-primary)", flex: 1 }}
                  >
                    <span style={{ color: "var(--accent-cyan)", flexShrink: 0 }}>→</span>
                    <span style={{ color: "var(--text-secondary)", flexShrink: 0 }}>{link.label}:</span>
                    <span style={{ color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis" }}>{link.value}</span>
                  </a>

                  {link.label === "Email" && (
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      className="font-mono text-xs ml-2 px-2 py-1 rounded transition-colors"
                      style={{
                        background: copiedEmail ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${copiedEmail ? "var(--accent-green)" : "var(--border-color)"}`,
                        color: copiedEmail ? "var(--accent-green)" : "var(--text-secondary)",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {copiedEmail ? "✓ Copied" : "Copy"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Contact form */}
          <div>
            <form
              onSubmit={handleSubmit}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "32px",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-xs" style={{ color: "var(--accent-cyan)", margin: 0 }}>
                  $ send --message
                </p>
                <span className="font-mono text-[10px] text-[var(--text-secondary)]">interactive mail client</span>
              </div>

              {status === "sent" && (
                <div
                  className="font-mono text-xs p-3 rounded mb-5"
                  style={{
                    border: "1px solid var(--accent-green)",
                    color: "var(--accent-green)",
                    background: "rgba(0,255,136,0.08)",
                  }}
                >
                  ✓ Mail client prepared! You can also email directly: {profile.email}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                  { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                  { id: "subject", label: "Subject", type: "text", placeholder: "What's this about?" },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                      htmlFor={id}
                      className="font-mono text-xs uppercase"
                      style={{ color: "var(--accent-cyan)", letterSpacing: "1px" }}
                    >
                      <span style={{ color: "var(--accent-green)" }}>&gt; </span>{label}
                    </label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      required
                      placeholder={placeholder}
                      style={{
                        background: "var(--bg)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        color: "var(--text-primary)",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        padding: "10px 14px",
                        outline: "none",
                        width: "100%",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent-cyan)";
                        e.currentTarget.style.boxShadow = "0 0 8px rgba(0,255,255,0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-color)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                ))}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    htmlFor="message"
                    className="font-mono text-xs uppercase"
                    style={{ color: "var(--accent-cyan)", letterSpacing: "1px" }}
                  >
                    <span style={{ color: "var(--accent-green)" }}>&gt; </span>Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Your message..."
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "4px",
                      color: "var(--text-primary)",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      padding: "10px 14px",
                      outline: "none",
                      width: "100%",
                      resize: "vertical",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-cyan)";
                      e.currentTarget.style.boxShadow = "0 0 8px rgba(0,255,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="font-mono font-bold"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--accent-green)",
                    borderRadius: "4px",
                    color: "var(--accent-green)",
                    fontSize: "14px",
                    padding: "12px",
                    cursor: "pointer",
                    width: "100%",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-green)";
                    e.currentTarget.style.color = "var(--bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--accent-green)";
                  }}
                >
                  ./send-message →
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
