"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GitBranch, Check } from "lucide-react";
import { EDITOR_DOCS, tokenize, type Token } from "@/lib/highlight";

const TYPE_SPEED = 3; // chars per frame

export default function CodeEditor({
  activeTab,
  onTabClick,
}: {
  activeTab: number;
  onTabClick: (i: number) => void;
}) {
  const docs = useMemo(
    () =>
      EDITOR_DOCS.map((d) => {
        const lines = tokenize(d.code, d.lang);
        const total = d.code.length;
        return { ...d, lines, total };
      }),
    [],
  );

  const doc = docs[activeTab];
  const [chars, setChars] = useState(doc.total);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setChars(doc.total);
      return;
    }
    let c = 0;
    setChars(0);
    const step = () => {
      c = Math.min(doc.total, c + TYPE_SPEED);
      setChars(c);
      if (c < doc.total) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeTab, doc.total]);

  // Render lines, truncated to `chars` characters (newline counts as 1).
  const rendered: { tokens: Token[]; cursor: boolean }[] = [];
  let budget = chars;
  for (const line of doc.lines) {
    if (budget <= 0) break;
    const out: Token[] = [];
    let lineDone = true;
    for (const tok of line) {
      if (budget <= 0) {
        lineDone = false;
        break;
      }
      if (tok.text.length <= budget) {
        out.push(tok);
        budget -= tok.text.length;
      } else {
        out.push({ ...tok, text: tok.text.slice(0, budget) });
        budget = 0;
        lineDone = false;
      }
    }
    budget -= 1; // newline
    rendered.push({ tokens: out, cursor: !lineDone || budget <= 0 });
  }
  const typing = chars < doc.total;

  return (
    <div className="glass panel-glow overflow-hidden rounded-xl font-mono text-[12.5px] leading-6 sm:text-[13px]">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-3 truncate text-xs text-faint">
          sakitha — ~/dev/{doc.file}
        </span>
      </div>

      {/* tabs */}
      <div className="flex overflow-x-auto border-b border-line bg-black/20" role="tablist" aria-label="Code files">
        {docs.map((d, i) => (
          <button
            key={d.file}
            role="tab"
            aria-selected={i === activeTab}
            onClick={() => onTabClick(i)}
            className={`cursor-pointer whitespace-nowrap border-r border-line px-4 py-2 text-xs transition-colors duration-200 ${
              i === activeTab
                ? "bg-surface text-ink shadow-[inset_0_-2px_0_var(--color-accent)]"
                : "text-faint hover:text-muted"
            }`}
          >
            {d.file}
          </button>
        ))}
      </div>

      {/* code */}
      <div className="relative min-h-[340px] overflow-hidden px-0 py-4 sm:min-h-[380px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent/[0.03] to-transparent"
          style={{ animation: "scan 7s linear infinite" }}
        />
        <pre className="overflow-x-auto" aria-label={`Code sample: ${doc.file}`}>
          {rendered.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-10 shrink-0 select-none pr-4 text-right text-faint/60">
                {i + 1}
              </span>
              <code className="whitespace-pre">
                {line.tokens.map((t, j) => (
                  <span key={j} className={t.cls}>
                    {t.text}
                  </span>
                ))}
                {typing && i === rendered.length - 1 && (
                  <span className="caret-blink -mb-0.5 inline-block h-4 w-[7px] bg-accent align-middle" />
                )}
              </code>
            </div>
          ))}
        </pre>
      </div>

      {/* status bar */}
      <div className="flex items-center justify-between border-t border-line bg-black/30 px-4 py-1.5 text-[10.5px] text-faint">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-accent/80">
            <GitBranch className="size-3" aria-hidden="true" /> main
          </span>
          <span className="hidden sm:inline">UTF-8</span>
          <span>{doc.badge}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Ln {rendered.length}, Col {(rendered[rendered.length - 1]?.tokens.reduce((n, t) => n + t.text.length, 0) ?? 0) + 1}
          </span>
          <span className="flex items-center gap-1">
            <Check className="size-3 text-accent/80" aria-hidden="true" /> prettier
          </span>
        </div>
      </div>
    </div>
  );
}
