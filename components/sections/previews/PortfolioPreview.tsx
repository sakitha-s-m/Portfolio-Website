"use client";

/** Recursive mini-mockup of this very site inside a browser frame. */
export default function PortfolioPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-black/30 px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        <div className="mx-auto flex h-6 w-3/5 items-center justify-center rounded-md bg-white/5 font-mono text-[10px] text-faint">
          <span className="text-accent">https://</span>sakitha.dev
        </div>
      </div>
      {/* mini hero */}
      <div className="relative p-5">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="relative grid grid-cols-[1.2fr_1fr] gap-4">
          <div className="space-y-2.5 pt-2">
            <div className="h-2 w-16 rounded bg-accent/40" />
            <div className="h-4 w-32 rounded bg-white/25" />
            <div className="h-4 w-24 rounded bg-white/25" />
            <div className="h-2 w-36 rounded bg-white/10" />
            <div className="h-2 w-28 rounded bg-white/10" />
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-16 rounded-full bg-accent/70" />
              <div className="h-5 w-16 rounded-full border border-line" />
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-line bg-black/40 p-2.5 font-mono text-[8px] leading-relaxed">
            <div className="mb-1.5 flex gap-1">
              <span className="size-1.5 rounded-full bg-[#ff5f57]" />
              <span className="size-1.5 rounded-full bg-[#febc2e]" />
              <span className="size-1.5 rounded-full bg-[#28c840]" />
            </div>
            <p><span className="text-violet">export const</span> <span className="text-sky">site</span> = {"{"}</p>
            <p className="pl-2">engine: <span className="text-accent">&quot;next.js 15&quot;</span>,</p>
            <p className="pl-2">motion: <span className="text-accent">&quot;gsap + lenis&quot;</span>,</p>
            <p className="pl-2">scene: <span className="text-accent">&quot;three.js&quot;</span>,</p>
            <p className="pl-2">fps: <span className="text-amber">60</span>,</p>
            <p>{"}"};<span className="caret-blink text-accent">▍</span></p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between rounded-md border border-line bg-black/30 px-3 py-2 font-mono text-[9px] text-faint">
          <span><span className="text-accent">&gt;</span> you are here — it&apos;s mockups all the way down</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8px] text-ink">⌘K</span>
        </div>
      </div>
    </div>
  );
}
