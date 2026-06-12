"use client";

import { useEffect, useRef, useState } from "react";
import { Command } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

const LINKS = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "experience", label: "experience" },
  { id: "contact", label: "contact" },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = scrollY;
      setHidden(y > 140 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-4 top-4 z-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        hidden ? "-translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <nav
        aria-label="Primary"
        className="glass mx-auto flex h-12 max-w-5xl items-center justify-between rounded-full px-4 sm:px-5"
      >
        <button
          onClick={() => scrollToId("top")}
          className="cursor-pointer font-mono text-[13px] text-ink transition-colors duration-200 hover:text-accent"
          aria-label="Scroll to top"
        >
          <span className="text-accent">sakitha</span>@dev<span className="text-faint">:~</span>
          <span className="caret-blink text-accent">▍</span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => scrollToId(l.id)}
                className="cursor-pointer rounded-full px-3 py-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:bg-white/5 hover:text-ink"
              >
                ./{l.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => window.dispatchEvent(new Event("palette:open"))}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent/40 hover:text-ink"
          aria-label="Open command palette"
        >
          <Command className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">cmd</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-ink">⌘K</kbd>
        </button>
      </nav>
    </header>
  );
}
