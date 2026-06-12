"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, GraduationCap, ArrowDown, FileDown } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToId } from "@/lib/scroll";
import { PROFILE, ROTATING_ROLES } from "@/lib/profile";
import { EDITOR_DOCS } from "@/lib/highlight";
import { useBoot } from "@/components/system/BootGate";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import MagneticButton from "@/components/ui/MagneticButton";
import CodeEditor from "./CodeEditor";

const NetworkScene = dynamic(() => import("./NetworkScene"), { ssr: false });

const entrance = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const { booted } = useBoot();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);

  // rotate specialties
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROTATING_ROLES.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);

  // mount WebGL only after boot, never under reduced motion
  useEffect(() => {
    if (booted && !reduced) setSceneReady(true);
  }, [booted, reduced]);

  // pin the hero and drive editor tabs from scroll progress
  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "+=85%",
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const idx = Math.min(EDITOR_DOCS.length - 1, Math.floor(self.progress * EDITOR_DOCS.length));
        setTab((t) => (t === idx ? t : idx));
      },
    });
    return () => st.kill();
  }, [reduced]);

  // parallax the editor column slightly against scroll
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const el = editorRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { y: 0 },
      {
        y: -28,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "+=85%", scrub: 0.6 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} id="top" className="relative min-h-screen overflow-hidden">
      {/* layered background */}
      <div className="absolute inset-0 grid-bg" aria-hidden="true" />
      {sceneReady && (
        <div className="absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_75%_70%_at_60%_45%,black_30%,transparent_75%)]">
          <NetworkScene />
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent"
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-16 lg:pt-24">
        {/* left — identity */}
        <motion.div initial="hidden" animate={booted ? "show" : "hidden"}>
          <motion.p custom={0} variants={entrance} className="mb-6 font-mono text-xs text-muted sm:text-sm">
            <span className="text-accent">~/sakitha</span> $ whoami
          </motion.p>

          <motion.h1
            custom={1}
            variants={entrance}
            className="text-[clamp(2.8rem,8vw,5.4rem)] font-semibold leading-[0.98] tracking-tight text-ink"
          >
            Sakitha
            <br />
            Manamperi
            <span className="text-accent">.</span>
          </motion.h1>

          <motion.div custom={2} variants={entrance} className="mt-6 font-mono text-sm text-muted sm:text-base">
            <span className="text-faint">const focus = </span>
            <span className="relative inline-flex h-6 items-center overflow-hidden align-middle sm:h-7">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                  className="whitespace-nowrap text-accent"
                >
                  &quot;{ROTATING_ROLES[roleIndex]}&quot;
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-faint">;</span>
          </motion.div>

          <motion.p custom={3} variants={entrance} className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Software Engineering student building modern web applications, automation tools, cloud
            solutions and intelligent digital experiences.
          </motion.p>

          <motion.div custom={4} variants={entrance} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              onClick={() => scrollToId("projects")}
              className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-medium text-bg hover:bg-accent-deep"
            >
              open projects_
            </MagneticButton>
            <MagneticButton
              href={PROFILE.resume}
              target="_blank"
              className="rounded-full border border-line px-6 py-3 font-mono text-sm text-ink hover:border-accent/50 hover:text-accent"
            >
              <FileDown className="size-4" aria-hidden="true" />
              résumé.pdf
            </MagneticButton>
          </motion.div>

          <motion.div
            custom={5}
            variants={entrance}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted"
          >
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-accent" aria-hidden="true" /> Melbourne, VIC
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="size-3.5 text-accent" aria-hidden="true" /> RMIT · class of 2027
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent pulse-dot" aria-hidden="true" />
              open to internships
            </span>
          </motion.div>
        </motion.div>

        {/* right — live editor */}
        <motion.div
          ref={editorRef}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={booted ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl justify-self-center lg:justify-self-end"
        >
          <CodeEditor activeTab={tab} onTabClick={setTab} />
          <p className="mt-3 text-center font-mono text-[11px] text-faint">
            // keep scrolling — the editor follows your scroll
          </p>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollToId("about")}
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 font-mono text-[11px] text-faint transition-colors duration-200 hover:text-accent"
        aria-label="Scroll to about section"
      >
        scroll
        <ArrowDown className="size-3.5 animate-bounce" aria-hidden="true" />
      </motion.button>
    </section>
  );
}
