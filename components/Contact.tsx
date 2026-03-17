"use client";

import profile from "@/data/profile.json";

const contactLinks = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: "✉",
    external: false,
  },
  {
    label: "GitHub",
    value: "AdeelAsghar11",
    href: profile.github,
    icon: "⌥",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "adeelasghar11",
    href: profile.linkedin,
    icon: "in",
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-12">
          <p className="font-mono text-sm text-[#00FF88] mb-2">// 05. contact</p>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white">
            Get In <span className="text-[#00FFFF]">Touch</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#00FFFF] mt-4 mx-auto" />
        </div>

        <p className="text-slate-400 font-mono text-sm max-w-xl mx-auto mb-12 leading-7">
          Open to internships, research collaborations, and interesting projects
          — especially in AI and cybersecurity. Drop me a message.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 px-6 py-4 rounded transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                minWidth: "200px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(0,255,255,0.35)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(0,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded font-mono text-sm text-[#00FFFF] flex-shrink-0 transition-colors group-hover:bg-[rgba(0,255,255,0.12)]"
                style={{ border: "1px solid rgba(0,255,255,0.3)" }}
              >
                {link.icon}
              </div>
              <div className="text-left">
                <p className="text-xs font-mono text-slate-500">{link.label}</p>
                <p className="text-sm font-mono text-slate-300 group-hover:text-[#00FFFF] transition-colors truncate max-w-[160px]">
                  {link.value}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
