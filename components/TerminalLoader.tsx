"use client";

import { useEffect, useState } from "react";

const GREETINGS = [
  "Hi",
  "Hello",
  "Bonjour",
  "Hola",
  "Ciao",
  "Namaste",
  "Welcome"
];

export default function TerminalLoader() {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Lock scrolling on body during load
    document.body.style.overflow = "hidden";

    // 2. Multilingual rotation interval
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === GREETINGS.length - 1) {
          clearInterval(interval);
          // Trigger exit animations
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              setIsVisible(false);
              document.body.style.overflow = "";
            }, 600); // Wait for fadeout animation to complete
          }, 200);
          return prev;
        }
        return prev + 1;
      });
    }, 180); // Fast, snappy, high-velocity translation changes

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] transition-all duration-[600ms] select-none ${
        isFading ? "opacity-0 translate-y-[-100vh]" : "opacity-100 translate-y-0"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)"
      }}
    >
      {/* Soft central ambient background glow */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none filter blur-[100px] opacity-40 transition-all duration-700" 
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.12) 0%, rgba(0,255,255,0.06) 50%, transparent 100%)",
        }}
      />

      {/* Greeting container */}
      <div className="text-center z-10 flex flex-col items-center gap-4">
        {/* Multilingual Text */}
        <h1 
          className="font-sans text-5xl md:text-7xl font-bold tracking-tight text-white flex items-center gap-3 transition-all duration-150 transform scale-[0.98]"
          style={{
            letterSpacing: "-0.03em"
          }}
        >
          {/* Central dot prefix */}
          <span 
            className="w-3 h-3 rounded-full inline-block transition-all duration-300"
            style={{
              background: index % 2 === 0 ? "var(--accent-green)" : "var(--accent-cyan)",
              boxShadow: index % 2 === 0 ? "0 0 15px var(--accent-green)" : "0 0 15px var(--accent-cyan)"
            }}
          />
          {GREETINGS[index]}
        </h1>
        
        {/* Minimal load bar indicator */}
        <div className="w-24 h-[1px] bg-neutral-900 overflow-hidden relative rounded-full mt-2">
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-200"
            style={{
              background: "linear-gradient(90deg, var(--accent-green), var(--accent-cyan))",
              width: `${((index + 1) / GREETINGS.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}
