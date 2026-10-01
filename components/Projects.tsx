"use client";

import { useState } from "react";
import projectsData from "@/data/projects.json";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string | null;
  demo: string | null;
  featured: boolean;
  insight?: string;
  status?: string;
  category: string;
}

const projects = projectsData as Project[];

function StatusBadge({ status }: { status?: string }) {
  if (status === "in-progress") {
    return (
      <span
        className="font-mono text-xs"
        style={{
          padding: "3px 10px",
          borderRadius: "4px",
          border: "1px solid #F59E0B",
          color: "#F59E0B",
          background: "rgba(245,158,11,0.08)",
        }}
      >
        🚧 In Progress
      </span>
    );
  }
  if (status === "prototype") {
    return (
      <span
        className="font-mono text-xs"
        style={{
          padding: "3px 10px",
          borderRadius: "4px",
          border: "1px solid #A855F7",
          color: "#A855F7",
          background: "rgba(168,85,247,0.08)",
        }}
      >
        🧪 Prototype
      </span>
    );
  }
  if (status === "hackathon") {
    return (
      <span
        className="font-mono text-xs"
        style={{
          padding: "3px 10px",
          borderRadius: "4px",
          border: "1px solid #F59E0B",
          color: "#F59E0B",
          background: "rgba(245,158,11,0.08)",
        }}
      >
        🏆 Hackathon Winner
      </span>
    );
  }
  return null;
}

function ProjectLinks({ github, demo }: { github: string | null; demo: string | null }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-sm"
          style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-cyan)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
        >
          ⌥ GitHub →
        </a>
      )}
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-sm"
          style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-green)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
        >
          ↗ Live Demo →
        </a>
      )}
    </div>
  );
}

function TagList({ tags, small }: { tags: string[]; small?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="font-mono"
          style={{
            fontSize: small ? "10px" : "12px",
            padding: small ? "2px 8px" : "3px 10px",
            borderRadius: "4px",
            border: "1px solid var(--border-color)",
            color: "var(--accent-green)",
            background: "rgba(0,255,136,0.05)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const targetUrl = project.github || project.demo;

  const handleCardClick = () => {
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
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
      style={{
        background: "var(--bg-secondary)",
        border: `1px solid ${isHovered ? "var(--accent-cyan)" : "var(--border-color)"}`,
        borderRadius: "8px",
        padding: "28px",
        cursor: targetUrl ? "pointer" : "default",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 10px 30px -10px rgba(0, 255, 255, 0.15)" : "none",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">
        {/* Left */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "12px",
            }}
          >
            <span className="font-mono text-xs" style={{ color: "var(--accent-green)" }}>$ ./</span>
            <h3
              className="font-mono font-bold"
              style={{
                color: isHovered ? "var(--accent-cyan)" : "var(--text-primary)",
                fontSize: "16px",
                transition: "color 0.25s ease",
              }}
            >
              {project.title}
            </h3>
            <StatusBadge status={project.status} />
          </div>

          <p
            className="font-mono text-sm"
            style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}
          >
            {project.description}
          </p>

          {project.insight && (
            <div
              style={{
                borderTop: "1px solid var(--border-color)",
                paddingTop: "12px",
                marginTop: "12px",
              }}
            >
              <p className="font-mono text-xs" style={{ color: "var(--accent-cyan)", marginBottom: "6px" }}>
                💡 Key Insight
              </p>
              <p
                className="font-mono text-xs"
                style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic" }}
              >
                {project.insight}
              </p>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TagList tags={project.tags} />
          <ProjectLinks github={project.github} demo={project.demo} />
        </div>
      </div>
    </div>
  );
}

function SmallCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const targetUrl = project.github || project.demo;

  const handleCardClick = () => {
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
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
      style={{
        background: "var(--bg-secondary)",
        border: `1px solid ${isHovered ? "var(--accent-cyan)" : "var(--border-color)"}`,
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: targetUrl ? "pointer" : "default",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 10px 30px -10px rgba(0, 255, 255, 0.15)" : "none",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span className="font-mono text-xs" style={{ color: "var(--accent-green)" }}>$ ./</span>
        <h3
          className="font-mono font-bold text-sm"
          style={{
            color: isHovered ? "var(--accent-cyan)" : "var(--text-primary)",
            transition: "color 0.25s ease",
          }}
        >
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="font-mono text-xs" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        {project.description}
      </p>

      <TagList tags={project.tags} small />

      <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-xs"
            style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-cyan)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
          >
            ⌥ GitHub →
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-xs"
            style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-green)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
          >
            ↗ Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <section id="projects">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-20">
        <div style={{ marginBottom: "48px" }}>
          <p className="font-mono text-sm" style={{ color: "var(--accent-green)", marginBottom: "8px" }}>
            // 05. projects
          </p>
          <h2
            className="font-mono font-bold text-3xl md:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Featured <span style={{ color: "var(--accent-cyan)" }}>Projects</span>
          </h2>
          <div style={{ width: "64px", height: "2px", background: "var(--accent-cyan)", marginTop: "16px" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" }}>
          {featured.map((project) => (
            <FeaturedCard key={project.title} project={project} />
          ))}
        </div>

        {other.length > 0 && (
          <>
            <p className="font-mono text-xs" style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              // other projects
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: "20px",
              }}
            >
              {other.map((project) => (
                <SmallCard key={project.title} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
