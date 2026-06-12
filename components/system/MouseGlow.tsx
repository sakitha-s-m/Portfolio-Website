"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/useReducedMotion";

export default function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    const el = ref.current;
    if (!el) return;

    let x = innerWidth / 2,
      y = innerHeight * 0.3,
      cx = x,
      cy = y,
      rafId = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.06;
      cy += (y - cy) * 0.06;
      el.style.background = `radial-gradient(640px circle at ${cx}px ${cy}px, rgba(52, 211, 153, 0.06), rgba(56, 189, 248, 0.04) 40%, transparent 70%)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
    };
  }, [fine, reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
    />
  );
}
