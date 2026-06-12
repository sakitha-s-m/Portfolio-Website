"use client";

import { ArrowUp } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 font-mono text-[11px] text-faint sm:flex-row sm:px-8">
        <p>
          <span className="text-accent">$</span> echo &quot;designed &amp; engineered by Sakitha
          Manamperi · © {new Date().getFullYear()}&quot;
        </p>
        <div className="flex items-center gap-6">
          <p className="hidden md:block">
            next.js · gsap · three.js · <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted">⌘K</kbd> for commands
          </p>
          <button
            onClick={() => scrollToId("top")}
            className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-accent"
            aria-label="Back to top"
          >
            <ArrowUp className="size-3.5" aria-hidden="true" /> reboot
          </button>
        </div>
      </div>
    </footer>
  );
}
