"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide custom cursor on touch screens
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          "a, button, input, select, textarea, [role='button'], [onClick], .clickable"
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let currentX = -100;
    let currentY = -100;

    const loop = () => {
      setPos((latestPos) => {
        currentX += (latestPos.x - currentX) * 0.18;
        currentY += (latestPos.y - currentY) * 0.18;
        setTrailPos({ x: currentX, y: currentY });
        return latestPos;
      });
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Background Ambient Mouse Glow Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${pos.x}px ${pos.y}px, rgba(0, 255, 255, 0.045), transparent 80%)`,
        }}
      />

      {/* Outer Animated Ring */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full border"
        style={{
          width: "36px",
          height: "36px",
          transform: `translate3d(${trailPos.x - 18}px, ${trailPos.y - 18}px, 0) scale(${
            isClicked ? 0.7 : isHovered ? 1.5 : 1
          })`,
          borderColor: isHovered ? "var(--accent-cyan)" : "var(--border-hover)",
          backgroundColor: isHovered ? "var(--border-color)" : "transparent",
          boxShadow: isHovered
            ? "0 0 16px var(--border-hover)"
            : "none",
          transition: "transform 0.15s ease-out, border-color 0.2s, background-color 0.2s, box-shadow 0.2s",
        }}
      />

      {/* Core Cursor Dot */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full"
        style={{
          width: "6px",
          height: "6px",
          backgroundColor: "var(--accent-cyan)",
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0) scale(${
            isHovered ? 0.5 : 1
          })`,
          boxShadow: "0 0 8px var(--accent-cyan)",
        }}
      />
    </>
  );
}
