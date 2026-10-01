"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import projectsData from "@/data/projects.json";
import SectionReveal from "./SectionReveal";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string | null;
  demo: string | null;
  featured: boolean;
  insight?: string | null;
  status?: string | null;
  category: string;
}

const projects = projectsData as Project[];

function StatusBadge({ status }: { status?: string | null }) {
  if (status === "in-progress") {
    return (
      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40 text-amber-400 bg-amber-500/10 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        In Progress
      </span>
    );
  }
  if (status === "prototype") {
    return (
      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-purple-500/40 text-purple-400 bg-purple-500/10 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        Prototype
      </span>
    );
  }
  if (status === "hackathon") {
    return (
      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-[var(--accent-green)]/40 text-[var(--accent-green)] bg-[var(--accent-green)]/10 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
        Hackathon Winner
      </span>
    );
  }
  return null;
}

function ProjectLinks({ github, demo }: { github: string | null; demo: string | null }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-xs px-3.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)]/70 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]/40 transition-all duration-200 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>GitHub →</span>
        </a>
      )}
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-xs px-3.5 py-1.5 rounded-lg border border-[var(--accent-green)]/40 bg-[var(--accent-green)]/10 text-[var(--accent-green)] hover:bg-[var(--accent-green)]/20 transition-all duration-200 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Live Demo</span>
        </a>
      )}
    </div>
  );
}

function TagList({ tags, small }: { tags: string[]; small?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`font-mono ${
            small ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
          } rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--bg-tertiary)]/60`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const targetUrl = project.github || project.demo;

  const handleCardClick = () => {
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (targetUrl && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={targetUrl ? 0 : undefined}
      role={targetUrl ? "link" : undefined}
      aria-label={targetUrl ? `View ${project.title}` : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl border p-7 sm:p-8 transition-all duration-300 backdrop-blur-xl ${
        targetUrl ? "cursor-pointer" : "cursor-default"
      }`}
      style={{
        background:
          "linear-gradient(135deg, rgba(11, 17, 34, 0.88), rgba(16, 25, 50, 0.72))",
        borderColor: isHovered ? "var(--accent-cyan)" : "var(--border-color)",
        boxShadow: isHovered
          ? "0 14px 40px -10px rgba(0, 240, 255, 0.2)"
          : "0 4px 20px -5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8">
        {/* Left Column: Details */}
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="font-mono text-xs text-[var(--accent-green)]">$ ./</span>
            <h3
              className="font-display font-bold text-lg sm:text-xl transition-colors duration-200"
              style={{
                color: isHovered ? "var(--accent-cyan)" : "var(--text-primary)",
              }}
            >
              {project.title}
            </h3>
            <StatusBadge status={project.status} />
          </div>

          <p className="font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
            {project.description}
          </p>

          {project.insight && (
            <div className="rounded-lg p-3.5 border border-[var(--border-color)] bg-[var(--bg)]/40 mt-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[var(--accent-cyan)] text-xs">✦</span>
                <span className="font-mono text-xs font-semibold text-[var(--accent-cyan)]">Key Architecture Insight</span>
              </div>
              <p className="font-sans text-xs text-[var(--text-secondary)] italic leading-relaxed">
                &ldquo;{project.insight}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Tags & CTAs */}
        <div className="flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-6 lg:pt-0 lg:pl-8">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] block mb-3">
              Stack &amp; Technologies
            </span>
            <TagList tags={project.tags} />
          </div>

          <ProjectLinks github={project.github} demo={project.demo} />
        </div>
      </div>
    </motion.div>
  );
}

function SmallCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const targetUrl = project.github || project.demo;

  const handleCardClick = () => {
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (targetUrl && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={targetUrl ? 0 : undefined}
      role={targetUrl ? "link" : undefined}
      aria-label={targetUrl ? `View ${project.title}` : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
        targetUrl ? "cursor-pointer" : "cursor-default"
      }`}
      style={{
        background: "var(--bg-secondary)",
        borderColor: isHovered ? "var(--accent-cyan)" : "var(--border-color)",
        boxShadow: isHovered ? "0 8px 30px -10px rgba(0, 240, 255, 0.15)" : "none",
      }}
    >
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2.5">
          <span className="font-mono text-xs text-[var(--accent-green)]">$</span>
          <h3
            className="font-display font-bold text-sm sm:text-base transition-colors duration-200"
            style={{
              color: isHovered ? "var(--accent-cyan)" : "var(--text-primary)",
            }}
          >
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
        <TagList tags={project.tags} small />
        <ProjectLinks github={project.github} demo={project.demo} />
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <SectionReveal className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[var(--accent-green)]">// 05.</span>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">Portfolio</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-cyan)] via-[#38bdf8] to-[var(--accent-green)]">
              Projects &amp; Systems
            </span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)] mt-4 rounded-full" />
        </div>

        {/* Featured Projects Stack */}
        <div className="space-y-6 mb-16">
          {featured.map((project) => (
            <FeaturedCard key={project.title} project={project} />
          ))}
        </div>

        {/* Other Projects Grid */}
        {other.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-xs text-[var(--accent-cyan)]">//</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                Other Engineering Work &amp; Prototypes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {other.map((project) => (
                <SmallCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        )}
      </SectionReveal>
    </section>
  );
}
