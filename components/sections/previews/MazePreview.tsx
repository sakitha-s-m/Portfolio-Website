"use client";

import { useEffect, useRef } from "react";

const COLS = 25;
const ROWS = 15;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { x: number; y: number };

function generateMaze(rand: () => number) {
  // grid of walls; odd cells are rooms
  const walls = Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(true));
  const stack: Cell[] = [{ x: 1, y: 1 }];
  walls[1][1] = false;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const dirs = [
      { dx: 2, dy: 0 },
      { dx: -2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: 0, dy: -2 },
    ]
      .map((d) => ({ ...d, r: rand() }))
      .sort((a, b) => a.r - b.r);
    let moved = false;
    for (const d of dirs) {
      const nx = cur.x + d.dx;
      const ny = cur.y + d.dy;
      if (nx > 0 && ny > 0 && nx < COLS - 1 && ny < ROWS - 1 && walls[ny][nx]) {
        walls[ny][nx] = false;
        walls[cur.y + d.dy / 2][cur.x + d.dx / 2] = false;
        stack.push({ x: nx, y: ny });
        moved = true;
        break;
      }
    }
    if (!moved) stack.pop();
  }
  walls[1][0] = false; // entrance
  walls[ROWS - 2][COLS - 1] = false; // exit
  return walls;
}

function solve(walls: boolean[][]) {
  const start: Cell = { x: 0, y: 1 };
  const goal: Cell = { x: COLS - 1, y: ROWS - 2 };
  const key = (c: Cell) => `${c.x},${c.y}`;
  const parent = new Map<string, string>();
  const visitedOrder: Cell[] = [];
  const seen = new Set([key(start)]);
  const queue: Cell[] = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    visitedOrder.push(cur);
    if (cur.x === goal.x && cur.y === goal.y) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const n = { x: cur.x + dx, y: cur.y + dy };
      if (
        n.x >= 0 && n.y >= 0 && n.x < COLS && n.y < ROWS &&
        !walls[n.y][n.x] && !seen.has(key(n))
      ) {
        seen.add(key(n));
        parent.set(key(n), key(cur));
        queue.push(n);
      }
    }
  }
  const path: Cell[] = [];
  let cur = key(goal);
  while (cur) {
    const [x, y] = cur.split(",").map(Number);
    path.unshift({ x, y });
    cur = parent.get(cur) ?? "";
  }
  return { visitedOrder, path };
}

/** Live BFS solve of a real generated maze — the MazeRunner pipeline in miniature. */
export default function MazePreview() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const walls = generateMaze(mulberry32(42));
    const { visitedOrder, path } = solve(walls);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    const cell = 18 * dpr;
    canvas.width = COLS * cell;
    canvas.height = ROWS * cell;

    const draw = (visited: number, pathLen: number) => {
      ctx.fillStyle = "#0a0e15";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (walls[y][x]) {
            ctx.fillStyle = "#1c2331";
            ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
          }
        }
      }
      for (let i = 0; i < visited; i++) {
        const c = visitedOrder[i];
        ctx.fillStyle = "rgba(167, 139, 250, 0.22)";
        ctx.fillRect(c.x * cell + 2, c.y * cell + 2, cell - 4, cell - 4);
      }
      for (let i = 0; i < pathLen; i++) {
        const c = path[i];
        ctx.fillStyle = "#a78bfa";
        ctx.fillRect(c.x * cell + 4, c.y * cell + 4, cell - 8, cell - 8);
      }
      // entrance / exit markers
      ctx.fillStyle = "#34d399";
      ctx.fillRect(0 + 4, 1 * cell + 4, cell - 8, cell - 8);
      ctx.fillRect((COLS - 1) * cell + 4, (ROWS - 2) * cell + 4, cell - 8, cell - 8);
    };

    if (reduced) {
      draw(visitedOrder.length, path.length);
      return;
    }

    let rafId = 0;
    let running = false;

    const animate = () => {
      let v = 0;
      let p = 0;
      let pause = 0;
      const step = () => {
        if (!running) return;
        if (v < visitedOrder.length) {
          v = Math.min(visitedOrder.length, v + 6);
        } else if (p < path.length) {
          p = Math.min(path.length, p + 2);
        } else if (pause < 110) {
          pause++;
        } else {
          v = 0; p = 0; pause = 0;
        }
        draw(v, p);
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    draw(0, 0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          animate();
        } else if (!entry.isIntersecting) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, []);

  return (
    <div>
      <canvas
        ref={ref}
        className="w-full rounded-lg"
        role="img"
        aria-label="Animated visualisation of a breadth-first search solving a generated maze"
      />
      <div className="mt-3 flex items-center justify-between font-mono text-[10.5px] text-faint">
        <span><span className="text-accent">■</span> entrance/exit · <span className="text-violet">■</span> BFS frontier → shortest path</span>
        <span>live solve</span>
      </div>
    </div>
  );
}
