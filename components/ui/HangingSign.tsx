"use client";

import { useRef } from "react";

export default function HangingSign() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseEnter() {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("swing-sign");
    void el.offsetHeight; // force reflow so animation restarts
    el.classList.add("swing-sign");
  }

  return (
    <div
      className="absolute right-8 top-full z-40 pointer-events-auto"
      style={{ perspective: "500px" }}
    >
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        style={{ transformOrigin: "top center" }}
        className="cursor-default select-none"
      >
        {/* Mounting bar + chains */}
        <svg
          width="96"
          height="22"
          viewBox="0 0 96 22"
          className="block w-full"
          aria-hidden
        >
          {/* Horizontal bar fixed to header */}
          <line x1="18" y1="1" x2="78" y2="1" stroke="#4F1220" strokeWidth="2" />
          <circle cx="18" cy="1" r="3" fill="#4F1220" />
          <circle cx="78" cy="1" r="3" fill="#4F1220" />
          {/* Left chain */}
          <line x1="18" y1="1" x2="18" y2="22" stroke="#4F1220" strokeWidth="2" strokeDasharray="4,3" />
          {/* Right chain */}
          <line x1="78" y1="1" x2="78" y2="22" stroke="#4F1220" strokeWidth="2" strokeDasharray="4,3" />
        </svg>

        {/* Sign body */}
        <div
          className="bg-burgundy rounded-[3px] px-6 py-4"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(240,237,232,0.18), inset 0 0 0 4px #6D1A2A, inset 0 0 0 5px rgba(240,237,232,0.1), 0 10px 32px rgba(0,0,0,0.6)",
          }}
        >
          <p className="font-serif text-offwhite text-[10px] tracking-[0.35em] text-center uppercase leading-none mb-2">
            The Vintage
          </p>
          <p className="font-serif text-offwhite text-[14px] tracking-[0.4em] text-center uppercase leading-none">
            Prague
          </p>
        </div>
      </div>
    </div>
  );
}
