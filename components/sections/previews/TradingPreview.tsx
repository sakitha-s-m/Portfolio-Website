"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const N = 90;
const W = 560;
const H = 200;
const RSI_H = 44;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSeries() {
  const rand = mulberry32(7);
  const prices: number[] = [];
  let p = 64000;
  for (let i = 0; i < N; i++) {
    p += (rand() - 0.48) * 900 + Math.sin(i / 9) * 260;
    prices.push(p);
  }
  // simple RSI(14)
  const rsi: number[] = prices.map((_, i) => {
    if (i < 14) return 50;
    let gain = 0, loss = 0;
    for (let j = i - 13; j <= i; j++) {
      const d = prices[j] - prices[j - 1];
      if (d > 0) gain += d;
      else loss -= d;
    }
    return loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  });
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pts = prices.map((v, i) => ({
    x: (i / (N - 1)) * W,
    y: 14 + (1 - (v - min) / (max - min)) * (H - 28),
  }));
  const d = pts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
  const markers = rsi
    .map((v, i) => ({ v, i }))
    .filter(({ v }, idx, arr) => idx > 14 && ((v < 30 && (arr[idx - 1]?.v ?? 50) >= 30) || (v > 70 && (arr[idx - 1]?.v ?? 50) <= 70)))
    .map(({ v, i }) => ({ buy: v < 30, x: pts[i].x, y: pts[i].y }));
  return { prices, rsi, pts, d, markers };
}

/** Animated RSI strategy chart — the trading bot's view of the market. */
export default function TradingPreview() {
  const { prices, rsi, pts, d, markers } = useMemo(buildSeries, []);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(N - 1);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const path = pathRef.current;
    const dot = dotRef.current;
    const wrap = wrapRef.current;
    if (!path || !dot || !wrap) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    let rafId = 0;
    let running = false;
    let t = 0;

    const step = () => {
      if (!running) return;
      t = (t + 0.0028) % 1.12;
      const tt = Math.min(1, t);
      path.style.strokeDashoffset = `${len * (1 - tt)}`;
      const pt = path.getPointAtLength(len * tt);
      dot.setAttribute("cx", String(pt.x));
      dot.setAttribute("cy", String(pt.y));
      const idx = Math.min(N - 1, Math.floor(tt * (N - 1)));
      setTick((cur) => (cur === idx ? cur : idx));
      rafId = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          rafId = requestAnimationFrame(step);
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(wrap);
    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, []);

  const price = prices[tick];
  const r = rsi[tick];
  const zone = r < 30 ? "oversold → buy" : r > 70 ? "overbought → sell" : "holding";

  return (
    <div ref={wrapRef}>
      <div className="mb-3 flex items-center justify-between font-mono text-[11px]">
        <span className="text-muted">
          BTC/USDT <span className="text-faint">· 15m · testnet</span>
        </span>
        <span className="tabular-nums text-ink">
          ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          <span className={`ml-3 ${r < 30 ? "text-accent" : r > 70 ? "text-rose" : "text-faint"}`}>
            RSI {r.toFixed(0)} · {zone}
          </span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H + RSI_H + 14}`}
        className="w-full"
        role="img"
        aria-label="Animated price chart with RSI buy and sell signals from the trading bot"
      >
        <defs>
          <linearGradient id="priceStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#94a3b8" strokeOpacity="0.07" />
        ))}

        <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#priceFill)" stroke="none" />
        <path ref={pathRef} d={d} fill="none" stroke="url(#priceStroke)" strokeWidth="2" strokeLinecap="round" />
        <circle ref={dotRef} r="4" cx={pts[N - 1].x} cy={pts[N - 1].y} fill="#e6eaf2" stroke="#34d399" strokeWidth="2" />

        {markers.map((m, i) => (
          <g key={i} transform={`translate(${m.x}, ${m.y})`} opacity={pts[tick].x >= m.x ? 1 : 0} className="transition-opacity duration-300">
            {m.buy ? (
              <path d="M0,-10 L5,-2 L-5,-2 Z" fill="#34d399" transform="translate(0, 18)" />
            ) : (
              <path d="M0,10 L5,2 L-5,2 Z" fill="#f87171" transform="translate(0, -18)" />
            )}
          </g>
        ))}

        {/* RSI strip */}
        <g transform={`translate(0, ${H + 14})`}>
          <rect x="0" y="0" width={W} height={RSI_H} fill="#94a3b8" fillOpacity="0.04" rx="4" />
          <line x1="0" x2={W} y1={RSI_H * 0.3} y2={RSI_H * 0.3} stroke="#f87171" strokeOpacity="0.3" strokeDasharray="3 5" />
          <line x1="0" x2={W} y1={RSI_H * 0.7} y2={RSI_H * 0.7} stroke="#34d399" strokeOpacity="0.3" strokeDasharray="3 5" />
          {rsi.map((v, i) => (
            <rect
              key={i}
              x={(i / N) * W}
              y={RSI_H * (1 - v / 100)}
              width={W / N - 1.5}
              height={Math.max(1.5, RSI_H * (v / 100))}
              fill={v < 30 ? "#34d399" : v > 70 ? "#f87171" : "#475569"}
              fillOpacity={i <= tick ? 0.7 : 0.12}
            />
          ))}
        </g>
      </svg>
      <div className="mt-2 flex items-center justify-between font-mono text-[10.5px] text-faint">
        <span><span className="text-accent">▲</span> RSI &lt; 30 buy · <span className="text-[#f87171]">▼</span> RSI &gt; 70 sell</span>
        <span>daemon: <span className="text-accent">running</span></span>
      </div>
    </div>
  );
}
