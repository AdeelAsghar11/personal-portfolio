"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const mouse = { x: -1000, y: -1000, targetRadius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Generate balanced network nodes
    const nodeCount = Math.floor(Math.min(width, 1400) / 32);
    const nodes: Node[] = [];
    const isLightMode = () => document.documentElement.classList.contains("light");

    const colorsDark = [
      "rgba(0, 240, 255, 0.55)", // Cyan
      "rgba(0, 255, 136, 0.45)", // Green
      "rgba(139, 92, 246, 0.5)",  // Violet
    ];
    const colorsLight = [
      "rgba(2, 132, 199, 0.6)",  // Sky
      "rgba(5, 150, 105, 0.5)",  // Emerald
      "rgba(124, 58, 237, 0.55)", // Violet
    ];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.6 + 1.2,
        color: colorsDark[i % colorsDark.length],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = isLightMode();
      const lineBase = isLight ? "2, 132, 199" : "0, 240, 255";
      const activeColors = isLight ? colorsLight : colorsDark;

      // Render connecting edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = (1 - dist / 115) * (isLight ? 0.2 : 0.14);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineBase}, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Connect faint edge to cursor
        const mdx = nodes[i].x - mouse.x;
        const mdy = nodes[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.targetRadius) {
          const malpha = (1 - mdist / mouse.targetRadius) * (isLight ? 0.35 : 0.28);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineBase}, ${malpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Subtle attraction towards cursor
          if (!prefersReducedMotion) {
            nodes[i].x -= (mdx / mdist) * 0.35;
            nodes[i].y -= (mdy / mdist) * 0.35;
          }
        }

        // Update node position
        if (!prefersReducedMotion) {
          nodes[i].x += nodes[i].vx;
          nodes[i].y += nodes[i].vy;

          if (nodes[i].x < 0) nodes[i].x = width;
          if (nodes[i].x > width) nodes[i].x = 0;
          if (nodes[i].y < 0) nodes[i].y = height;
          if (nodes[i].y > height) nodes[i].y = 0;
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, Math.PI * 2);
        const nodeColor = activeColors[i % activeColors.length];
        ctx.fillStyle = nodeColor;
        ctx.shadowColor = isLight ? "transparent" : nodeColor;
        ctx.shadowBlur = isLight ? 0 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-700"
    />
  );
}
