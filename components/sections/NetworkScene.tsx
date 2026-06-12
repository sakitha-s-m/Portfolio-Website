"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 44;
const FLOW_COUNT = 42;

/** Deterministic PRNG so the network looks identical on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Network() {
  const group = useRef<THREE.Group>(null);

  const { nodes, edges, lineGeo, pointGeo, flowGeo, flowMeta } = useMemo(() => {
    const rand = mulberry32(2027);
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = 5.5 + rand() * 4.5;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta) * 1.25,
          r * Math.cos(phi) * 0.55,
          r * Math.sin(phi) * Math.sin(theta) * 0.7,
        ),
      );
    }

    const edges: [number, number][] = [];
    nodes.forEach((n, i) => {
      const nearest = nodes
        .map((m, j) => ({ j, d: n.distanceTo(m) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j } of nearest) {
        if (!edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) {
          edges.push([i, j]);
        }
      }
    });

    const lpos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], e) => {
      nodes[a].toArray(lpos, e * 6);
      nodes[b].toArray(lpos, e * 6 + 3);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lpos, 3));

    const ppos = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => n.toArray(ppos, i * 3));
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(ppos, 3));

    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(FLOW_COUNT * 3), 3));
    const flowMeta = Array.from({ length: FLOW_COUNT }, () => ({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.12 + rand() * 0.3,
    }));

    return { nodes, edges, lineGeo, pointGeo, flowGeo, flowMeta };
  }, []);

  useEffect(() => {
    return () => {
      lineGeo.dispose();
      pointGeo.dispose();
      flowGeo.dispose();
    };
  }, [lineGeo, pointGeo, flowGeo]);

  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.05;
    // subtle mouse parallax
    g.rotation.x += (state.pointer.y * 0.14 - g.rotation.x) * 0.04;
    g.position.x += (state.pointer.x * 0.7 - g.position.x) * 0.03;

    const attr = flowGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < FLOW_COUNT; i++) {
      const m = flowMeta[i];
      m.t += delta * m.speed;
      if (m.t > 1) {
        m.t = 0;
        m.edge = Math.floor(Math.random() * edges.length);
      }
      const [a, b] = edges[m.edge];
      v.lerpVectors(nodes[a], nodes[b], m.t);
      attr.setXYZ(i, v.x, v.y, v.z);
    }
    attr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <points geometry={pointGeo}>
        <pointsMaterial size={0.13} color="#34d399" transparent opacity={0.85} sizeAttenuation />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.13} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points geometry={flowGeo}>
        <pointsMaterial size={0.07} color="#e6eaf2" transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  );
}

export default function NetworkScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 13], fov: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <Network />
    </Canvas>
  );
}
