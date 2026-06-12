"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (readoutRef.current)
        readoutRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      rafId = 0;
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-accent via-sky to-violet"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <div
        aria-hidden="true"
        className="fixed bottom-5 right-5 z-[60] hidden font-mono text-[11px] text-faint md:block"
      >
        scroll <span ref={readoutRef} className="text-accent">000</span>%
      </div>
    </>
  );
}
