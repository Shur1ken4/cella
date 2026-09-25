import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Deterministic pseudo-random points so server and client render the same SVG. */
function points(seed: number, n: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => ({ x: rnd() * 100, y: rnd() * 100, r: 2 + rnd() * 3 }));
}

function Layer({ seed, n, style, className }: { seed: number; n: number; style: CSSProperties; className: string }) {
  const pts = points(seed, n);
  const links: [number, number][] = [];
  pts.forEach((a, i) =>
    pts.forEach((b, j) => {
      if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 22) links.push([i, j]);
    })
  );
  return (
    <g className={cn("motion-safe:animate-[drift_ease-in-out_infinite]", className)} style={{ transformBox: "fill-box", transformOrigin: "center", ...style }}>
      {links.map(([i, j]) => (
        <line key={`${i}-${j}`} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} className="stroke-cyan" strokeWidth={0.12} />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r / 10} className={i % 4 === 0 ? "fill-green" : "fill-cyan"} />
      ))}
    </g>
  );
}

/** Very subtle slow-drifting molecule network behind the hero. */
export function MoleculeBackground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full opacity-[0.14]", className)}
    >
      <Layer seed={7} n={26} className="" style={{ animationDuration: "26s", ["--dx" as string]: "2px", ["--dy" as string]: "-1.5px", ["--rot" as string]: "2deg" }} />
      <Layer seed={42} n={18} className="opacity-70" style={{ animationDuration: "34s", ["--dx" as string]: "-2.5px", ["--dy" as string]: "1.5px", ["--rot" as string]: "-3deg" }} />
    </svg>
  );
}
