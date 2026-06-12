"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SKILL_NODES, SKILL_EDGES, SKILL_GROUPS, type SkillNode } from "@/lib/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionHeading from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/Reveal";

const VB_W = 1000;
const VB_H = 620;

export default function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const byId = useMemo(() => new Map(SKILL_NODES.map((n) => [n.id, n])), []);
  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>();
    SKILL_NODES.forEach((n) => m.set(n.id, new Set([n.id])));
    SKILL_EDGES.forEach(([a, b]) => {
      m.get(a)?.add(b);
      m.get(b)?.add(a);
    });
    return m;
  }, []);

  // gentle floating drift on every node
  useEffect(() => {
    if (reduced) return;
    const map = mapRef.current;
    if (!map) return;
    const ctx = gsap.context(() => {
      map.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, {
          y: `+=${6 + (i % 4) * 2.5}`,
          duration: 2.6 + (i % 5) * 0.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: (i % 7) * 0.25,
        });
      });
    }, map);
    return () => ctx.revert();
  }, [reduced]);

  const activeNode = active ? byId.get(active) : null;
  const activeSet = active ? neighbors.get(active) : null;

  const isLit = (id: string) => !active || activeSet?.has(id);
  const edgeLit = ([a, b]: [string, string]) => active && (a === active || b === active);

  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-36">
      <SectionHeading
        index="02"
        slug="skills"
        title="A living system map."
        sub="Not a list of logos — an ecosystem. Hover or tap any node to see what it links against."
      />

      <FadeUp>
        <div className="overflow-x-auto pb-4 [scrollbar-width:none]">
          <div
            ref={mapRef}
            className="relative mx-auto min-w-[760px] max-w-5xl"
            style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
            onMouseLeave={() => setActive(null)}
          >
            {/* connection lines */}
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {SKILL_EDGES.map(([a, b]) => {
                const na = byId.get(a)!;
                const nb = byId.get(b)!;
                const lit = edgeLit([a, b]);
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke={lit ? SKILL_GROUPS[(byId.get(active!) ?? na).group].dot : "#38bdf8"}
                    strokeOpacity={lit ? 0.65 : active ? 0.05 : 0.14}
                    strokeWidth={lit ? 1.6 : 1}
                    strokeDasharray={lit ? "none" : "2 5"}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* nodes */}
            {SKILL_NODES.map((n) => (
              <Node
                key={n.id}
                node={n}
                lit={!!isLit(n.id)}
                isActive={active === n.id}
                onActivate={() => setActive(n.id)}
                onDeactivate={() => setActive((a) => (a === n.id ? null : a))}
              />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* readout + legend */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_auto]">
        <div className="glass min-h-[72px] rounded-xl px-5 py-4 font-mono text-sm">
          {activeNode ? (
            <>
              <span style={{ color: SKILL_GROUPS[activeNode.group].dot }}>
                {activeNode.label}
              </span>
              <span className="text-faint"> :: {SKILL_GROUPS[activeNode.group].label}</span>
              <p className="mt-1 text-muted">{activeNode.blurb}</p>
            </>
          ) : (
            <p className="text-faint">
              <span className="text-accent">$</span> inspect --node{" "}
              <span className="caret-blink text-accent">▍</span>
              <span className="mt-1 block">hover a technology to trace its connections</span>
            </p>
          )}
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted lg:pt-4">
          {Object.entries(SKILL_GROUPS).map(([key, g]) => (
            <li key={key} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: g.dot }} aria-hidden="true" />
              {g.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Node({
  node,
  lit,
  isActive,
  onActivate,
  onDeactivate,
}: {
  node: SkillNode;
  lit: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const g = SKILL_GROUPS[node.group];
  const core = node.group === "core";
  return (
    <div
      data-float
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(node.x / VB_W) * 100}%`, top: `${(node.y / VB_H) * 100}%` }}
    >
      <button
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onBlur={onDeactivate}
        onClick={onActivate}
        aria-label={`${node.label} — ${g.label}: ${node.blurb}`}
        className={`glass flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full font-mono transition-all duration-300 ${
          core ? "px-5 py-3 text-sm font-semibold" : "px-3.5 py-2 text-xs"
        } ${lit ? "opacity-100" : "opacity-25"} ${
          isActive ? "scale-110 border-white/30" : "hover:scale-105"
        }`}
        style={
          isActive
            ? { boxShadow: `0 0 32px -6px ${g.dot}66, inset 0 0 0 1px ${g.dot}55` }
            : undefined
        }
      >
        <span
          className={`rounded-full ${core ? "size-2.5 pulse-dot" : "size-2"}`}
          style={{ background: g.dot }}
          aria-hidden="true"
        />
        <span className={core ? "text-ink" : "text-ink/90"}>{node.label}</span>
      </button>
    </div>
  );
}
