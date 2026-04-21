"use client";

import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

export default function FadeIn({ children, delay = 0, className = "", y = 24 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Start as visible — SSR renders content visible, no flash of invisible content
  const [state, setState] = useState<"visible" | "hidden" | "animating">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // After mount: check if already in viewport
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - 60;

    if (inView) {
      // Already visible on load — skip the animation entirely
      return;
    }

    // Below fold: set hidden and wait for scroll
    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("animating");
          observer.disconnect();
        }
      },
      { rootMargin: "-60px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        state === "hidden"
          ? { opacity: 0, transform: `translateY(${y}px)` }
          : state === "animating"
          ? {
              opacity: 1,
              transform: "translateY(0)",
              transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
            }
          : {} // visible: no inline style, content renders normally
      }
    >
      {children}
    </div>
  );
}
