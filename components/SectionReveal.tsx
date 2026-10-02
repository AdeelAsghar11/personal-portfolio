"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionReveal({
  children,
  className = "",
  delay = 0,
}: SectionRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // If already in viewport on mount, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "80px" }
    );

    observer.observe(el);

    // Guaranteed fallback: reveal after 800ms regardless
    const timer = setTimeout(() => setRevealed(true), 800);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // During SSR or before client mount: 100% visible (no opacity:0 baked into HTML)
  // After mount: if not revealed yet, animate into view
  const isHidden = mounted && !revealed;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isHidden
          ? "opacity-0 translate-y-6"
          : "opacity-100 translate-y-0"
      } ${className}`}
      style={{
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
