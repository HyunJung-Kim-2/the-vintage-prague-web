"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf: number;
    let rx = -100, ry = -100; // ring position (lerped)
    let mx = -100, my = -100; // mouse position

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      dot!.style.transform = `translate(${mx}px, ${my}px)`;
    }

    function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring!.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    }

    function onEnterLink() { ring!.style.opacity = "0.4"; }
    function onLeaveLink() { ring!.style.opacity = "1"; }

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      {/* Small dot — snaps instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[99999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-offwhite" />
      </div>
      {/* Ring — lags slightly */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[99998] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      >
        <div className="w-8 h-8 rounded-full border border-offwhite/40" />
      </div>
    </>
  );
}
