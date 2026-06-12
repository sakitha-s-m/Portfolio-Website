"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Github, Wrench, GitPullRequestArrow } from "lucide-react";
import { gsap } from "@/lib/gsap";
import type { Project } from "@/lib/profile";
import MagneticButton from "@/components/ui/MagneticButton";
import MazePreview from "./previews/MazePreview";
import TradingPreview from "./previews/TradingPreview";
import PortfolioPreview from "./previews/PortfolioPreview";

const PREVIEWS = {
  maze: MazePreview,
  trading: TradingPreview,
  portfolio: PortfolioPreview,
} as const;

type Phase = "idle" | "typing" | "loading" | "open";

export default function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);
  const Preview = PREVIEWS[project.preview];
  const flip = index % 2 === 1;

  // start the command sequence once the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(project.command.length);
      setPhase("open");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase((p) => (p === "idle" ? "typing" : p));
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -32% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [project.command.length]);

  // type the command, then "load", then open
  useEffect(() => {
    if (phase !== "typing") return;
    if (typed >= project.command.length) {
      const t = setTimeout(() => setPhase("loading"), 180);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((c) => c + 1), 26 + Math.random() * 30);
    return () => clearTimeout(t);
  }, [phase, typed, project.command.length]);

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => setPhase("open"), 520);
    return () => clearTimeout(t);
  }, [phase]);

  // expand the showcase panel like a window opening
  useEffect(() => {
    if (phase !== "open") return;
    const panel = panelRef.current;
    if (!panel) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panel, { clearProps: "all", opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        panel,
        { opacity: 0, y: 44, scale: 0.975, clipPath: "inset(4% 3% 30% 3% round 16px)" },
        { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 0.9 },
      ).fromTo(
        panel.querySelectorAll("[data-stagger]"),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 },
        "-=0.45",
      );
    }, panel);
    return () => ctx.revert();
  }, [phase]);

  return (
    <article ref={sectionRef} className="relative py-14 md:py-20" aria-label={project.name}>
      {/* terminal command line */}
      <div className="mx-auto mb-6 max-w-6xl font-mono text-sm sm:text-base">
        <p className="text-muted">
          <span className="text-accent">sakitha@dev</span>
          <span className="text-faint">:~/projects$</span>{" "}
          <span className="text-ink">{project.command.slice(0, typed)}</span>
          {phase === "typing" && <span className="caret-blink text-accent">▍</span>}
        </p>
        {(phase === "loading" || phase === "open") && (
          <p className="mt-1.5 text-xs text-faint">
            {phase === "loading" ? (
              <>resolving modules<span className="caret-blink">…</span></>
            ) : (
              <span className="text-accent/80">✓ {project.name.toLowerCase()} ready in 0.4{index + 2}s</span>
            )}
          </p>
        )}
      </div>

      {/* expanded showcase */}
      <div
        ref={panelRef}
        className="glass panel-glow mx-auto max-w-6xl rounded-2xl"
        style={{ opacity: phase === "open" ? undefined : 0 }}
        aria-hidden={phase !== "open"}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-7">
          <div className="flex items-center gap-3 font-mono text-xs text-faint">
            <span className="size-2 rounded-full" style={{ background: project.accent }} aria-hidden="true" />
            {project.slug}.app
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{project.kicker}</span>
        </div>

        <div className={`grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-9 ${flip ? "lg:[direction:rtl]" : ""}`}>
          <div className={`min-w-0 space-y-6 ${flip ? "lg:[direction:ltr]" : ""}`}>
            <div data-stagger>
              <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                {project.name}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{project.description}</p>
            </div>

            <ul data-stagger className="space-y-2.5">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <ChevronRight className="mt-0.5 size-4 shrink-0" style={{ color: project.accent }} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            <div data-stagger className="rounded-lg border border-line bg-black/20 px-4 py-3 font-mono text-[11px] leading-relaxed text-muted sm:text-xs">
              <p className="mb-1 text-faint">// architecture</p>
              {project.architecture.map((step, i) => (
                <span key={step}>
                  <span className="text-ink/90">{step}</span>
                  {i < project.architecture.length - 1 && <span className="text-accent"> → </span>}
                </span>
              ))}
            </div>

            <div data-stagger className="space-y-2">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-faint">
                <Wrench className="size-3.5" aria-hidden="true" /> challenges solved
              </p>
              {project.challenges.map((c) => (
                <p key={c} className="flex gap-2.5 text-sm text-muted">
                  <GitPullRequestArrow className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden="true" />
                  {c}
                </p>
              ))}
            </div>

            <div data-stagger className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div data-stagger className="flex flex-wrap items-center gap-4 pt-1">
              <MagneticButton
                href={project.github}
                target="_blank"
                className="rounded-full border border-line px-5 py-2.5 font-mono text-xs text-ink hover:border-accent/50 hover:text-accent"
              >
                <Github className="size-4" aria-hidden="true" /> view source
              </MagneticButton>
              {project.live && (
                <MagneticButton
                  href={project.live}
                  target="_blank"
                  className="rounded-full bg-accent px-5 py-2.5 font-mono text-xs font-medium text-bg hover:bg-accent-deep"
                >
                  live demo ↗
                </MagneticButton>
              )}
            </div>
          </div>

          <div className={`min-w-0 ${flip ? "lg:[direction:ltr]" : ""}`}>
            <div data-stagger className="rounded-xl border border-line bg-black/25 p-4 sm:p-5">
              <Preview />
            </div>
            <dl data-stagger className="mt-5 grid grid-cols-3 gap-3">
              {project.impact.map((s) => (
                <div key={s.label} className="rounded-lg border border-line bg-white/[0.02] px-3 py-3 text-center">
                  <dt className="order-2 mt-1 block font-mono text-[10px] leading-tight text-faint">{s.label}</dt>
                  <dd className="text-lg font-semibold tabular-nums" style={{ color: project.accent }}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
