"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { MILESTONES } from "@/lib/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Scroll-pinned journey: the section spans 5 viewport-heights; the inner
 * viewport stays sticky while a scrubbed GSAP timeline crossfades milestones.
 */
export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!container || items.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const idx = Math.min(
              MILESTONES.length - 1,
              Math.floor(self.progress * MILESTONES.length),
            );
            setStage((s) => (s === idx ? s : idx));
          },
        },
      });

      items.forEach((item, i) => {
        tl.fromTo(
          item,
          { autoAlpha: 0, y: 70, rotateX: 6 },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, ease: "power2.out" },
          i * 2,
        );
        if (i < items.length - 1) {
          tl.to(item, { autoAlpha: 0, y: -70, duration: 1, ease: "power2.in" }, i * 2 + 1.55);
        }
      });

      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: MILESTONES.length * 2, ease: "none" },
          0,
        );
      }
    }, container);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    // calm, unpinned fallback
    return (
      <section id="about" className="mx-auto max-w-5xl px-5 py-28 sm:px-8">
        <p className="mb-3 font-mono text-xs tracking-widest text-faint">
          <span className="text-accent">01</span> — ~/about
        </p>
        <h2 className="mb-12 text-4xl font-semibold tracking-tight">The journey so far</h2>
        <ol className="space-y-10 border-l border-line pl-8">
          {MILESTONES.map((m) => (
            <li key={m.index}>
              <p className="font-mono text-xs text-accent">{m.year} · {m.meta}</p>
              <h3 className="mt-1 text-2xl font-semibold">{m.title}</h3>
              <p className="mt-2 max-w-xl text-muted">{m.body}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section id="about" aria-label="About — the journey">
      <div ref={containerRef} className="relative h-[500vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            {/* left — section identity + stage meter */}
            <div>
              <p className="mb-4 font-mono text-xs tracking-widest text-faint">
                <span className="text-accent">01</span> — ~/about
              </p>
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                The journey
                <br />
                so far<span className="text-accent">.</span>
              </h2>
              <div className="mt-10 flex items-center gap-4 font-mono text-sm text-muted">
                <span className="text-3xl font-semibold text-accent tabular-nums">
                  {String(stage + 1).padStart(2, "0")}
                </span>
                <span className="text-faint">/</span>
                <span className="tabular-nums">{String(MILESTONES.length).padStart(2, "0")}</span>
                <span className="ml-2 hidden text-xs text-faint sm:inline">
                  {MILESTONES[stage].year}
                </span>
              </div>
              <p className="mt-6 hidden max-w-xs text-sm leading-relaxed text-faint lg:block">
                Keep scrolling — each stage of the story loads in place, like stepping through a
                debugger.
              </p>
            </div>

            {/* right — milestones stacked + progress rail */}
            <div className="relative flex min-h-[24rem] items-center pl-10 sm:pl-14" style={{ perspective: "900px" }}>
              <div aria-hidden="true" className="absolute bottom-6 left-2 top-6 w-px bg-line">
                <div
                  ref={lineRef}
                  className="h-full w-full origin-top bg-gradient-to-b from-accent via-sky to-violet"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>

              {MILESTONES.map((m, i) => (
                <div
                  key={m.index}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="absolute inset-x-10 opacity-0 sm:inset-x-14"
                >
                  <p className="font-mono text-xs text-accent">
                    [{m.year}] <span className="text-faint">· {m.meta}</span>
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
                    {m.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                    {m.body}
                  </p>
                  <p className="mt-6 font-mono text-[11px] text-faint">
                    {i < MILESTONES.length - 1 ? "▼ next stage" : "● journey continues below"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
