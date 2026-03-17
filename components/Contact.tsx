"use client";

import profile from "@/data/profile.json";

const contactLinks = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: "+92 322 9672161", href: "tel:+923229672161" },
  { label: "GitHub", value: "AdeelAsghar11", href: profile.github },
  { label: "LinkedIn", value: "adeelasghar11", href: profile.linkedin },
];

export default function Contact() {
  return (
    <section id="contact">
      <div className="w-full px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* LEFT */}
          <div>
            <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
              // 06. contact
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
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") || link.href.startsWith("tel") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") || link.href.startsWith("tel") ? undefined : "noopener noreferrer"}
                  className="font-mono text-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 20px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    background: "var(--bg-secondary)",
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
                  <span style={{ color: "var(--accent-cyan)", flexShrink: 0 }}>→</span>
                  <span style={{ color: "var(--text-secondary)", flexShrink: 0 }}>{link.label}:</span>
                  <span style={{ color: "var(--text-primary)" }}>{link.value}</span>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — Contact form */}
          <div>
            <form
              action={`mailto:${profile.email}`}
              method="POST"
              encType="text/plain"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "32px",
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-cyan)", marginBottom: "24px" }}>
                $ send --message
              </p>

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
