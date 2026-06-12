"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { COMMITS } from "@/lib/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/Reveal";

export default function Experience() {
  const railRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // the main branch line grows as you scroll through the log
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rail = railRef.current;
    const list = listRef.current;
    if (!rail || !list) return;
    const tween = gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: list,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.5,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="experience" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-36">
      <SectionHeading
        index="04"
        slug="experience"
        title="git log --story"
        sub="Every chapter committed to main. One leadership branch, merged back into everything since."
      />

      <div className="mx-auto max-w-3xl">
        <p className="mb-8 font-mono text-xs text-faint">
          <span className="text-accent">$</span> git log --oneline --graph --all
        </p>

        <ol ref={listRef} className="relative">
          {/* main branch rail */}
          <div aria-hidden="true" className="absolute bottom-8 left-[11px] top-2 w-px bg-line">
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-gradient-to-b from-accent via-sky to-violet"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {COMMITS.map((c) => (
            <FadeUp key={c.hash + c.year} className="relative pb-12 pl-12 last:pb-0" y={28}>
              <li className="list-none">
                {/* node */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1 flex size-[23px] items-center justify-center rounded-full border-2 bg-bg ${
                    c.future
                      ? "border-dashed border-faint"
                      : c.head
                        ? "border-accent shadow-[0_0_16px_-2px_var(--color-accent)]"
                        : c.branch
                          ? "border-amber"
                          : "border-sky"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      c.future ? "bg-faint" : c.head ? "bg-accent pulse-dot" : c.branch ? "bg-amber" : "bg-sky"
                    }`}
                  />
                </span>

                {/* branch curve for the leadership commit */}
                {c.branch && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 60 90"
                    className="absolute -top-5 left-[11px] h-[90px] w-[60px] text-amber/60"
                  >
                    <path
                      d="M0,0 C0,28 44,18 44,45 C44,72 0,62 0,90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  </svg>
                )}

                <div className={c.branch ? "pl-10" : ""}>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                    <span className={c.future ? "text-faint" : "text-amber"}>{c.hash}</span>
                    <span className="text-faint">·</span>
                    <span className="text-muted">{c.year}</span>
                    {c.head && (
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                        HEAD → main
                      </span>
                    )}
                    {c.branch && (
                      <span className="rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 text-[10px] text-amber">
                        branch: {c.branch}
                      </span>
                    )}
                    {c.future && (
                      <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-faint">
                        scheduled
                      </span>
                    )}
                  </p>
                  <h3 className={`mt-2 font-mono text-base sm:text-lg ${c.future ? "text-muted" : "text-ink"}`}>
                    {c.message}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
              </li>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}
