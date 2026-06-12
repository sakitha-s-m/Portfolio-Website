"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBoot } from "./BootGate";

const LINES = [
  { text: "sakitha.os v3.1.0 — melbourne build", status: "" },
  { text: "INITIALIZING SYSTEM", status: "ok" },
  { text: "LOADING PROFILE — sakitha manamperi", status: "ok" },
  { text: "LOADING PROJECTS — mazerunner · trading-bot", status: "ok" },
  { text: "MOUNTING /skills /experience /contact", status: "ok" },
  { text: "READY — welcome.", status: "" },
];

const STEP = 320;

export default function BootSequence() {
  const { booted, setBooted } = useBoot();
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("sakitha-booted");
    if (reduced || seen) {
      finish(0);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setCount(i + 1), 160 + i * STEP));
    });
    timers.push(setTimeout(() => finish(420), 160 + LINES.length * STEP + 380));

    const skip = () => finish(120);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(delay: number) {
    if (finished.current) return;
    finished.current = true;
    sessionStorage.setItem("sakitha-booted", "1");
    setCount(LINES.length);
    setTimeout(() => {
      setVisible(false);
      setBooted(true);
    }, delay);
  }

  if (booted && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          aria-hidden="true"
        >
          <div className="w-[min(560px,86vw)] font-mono text-[13px] leading-7">
            <div className="mb-6 flex items-center gap-2 text-faint">
              <span className="inline-block size-2 rounded-full bg-accent pulse-dot" />
              boot sequence
            </div>
            <div className="min-h-[12rem]">
              {LINES.slice(0, count).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-baseline justify-between gap-4"
                >
                  <span className={i === LINES.length - 1 ? "text-accent" : "text-muted"}>
                    {line.text}
                    {i === count - 1 && i < LINES.length - 1 && (
                      <span className="caret-blink text-accent">▍</span>
                    )}
                  </span>
                  {line.status && <span className="text-accent/70">[ ok ]</span>}
                </motion.div>
              ))}
            </div>
            <div className="mt-6 h-px w-full overflow-hidden bg-line">
              <motion.div
                className="h-full bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: count / LINES.length }}
                style={{ transformOrigin: "left" }}
                transition={{ ease: "easeOut", duration: 0.35 }}
              />
            </div>
            <p className="mt-4 text-[11px] text-faint">press any key to skip</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
