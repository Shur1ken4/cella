"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type Point = { x: number; y: number }; // percentages of the container (0–100)

type CoinFlowProps = {
  from: Point;
  to: Point;
  count?: number;
  /** Seconds each coin takes to travel. */
  duration?: number;
  /** Seconds between coins. */
  stagger?: number;
  /** Upward bow of the path at its midpoint, in % of container height. */
  arc?: number;
  loop?: boolean;
  /** Set false to pause (and reset) the self-running animation. */
  playing?: boolean;
  /**
   * Controlled mode: drive the whole flow with a 0→1 value (e.g. from an
   * explainer scene or Remotion). Pure and deterministic; ignores playing/loop.
   */
  progress?: number;
  showPath?: boolean;
  onComplete?: () => void;
  className?: string;
};

function bezier(t: number, a: Point, c: Point, b: Point): Point {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

function Coin({
  p,
  index,
  total,
  duration,
  stagger,
  from,
  ctrl,
  to,
}: {
  p: MotionValue<number>;
  index: number;
  total: number;
  duration: number;
  stagger: number;
  from: Point;
  ctrl: Point;
  to: Point;
}) {
  // This coin's own 0→1 travel, derived from the shared flow progress.
  const t = useTransform(p, (v) =>
    Math.min(Math.max((v * total - index * stagger) / duration, 0), 1)
  );
  const left = useTransform(t, (v) => `${bezier(v, from, ctrl, to).x}%`);
  const top = useTransform(t, (v) => `${bezier(v, from, ctrl, to).y}%`);
  const opacity = useTransform(t, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(t, [0, 0.5, 1], [0.7, 1.1, 0.8]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ left, top, opacity, scale }}
      className="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan bg-cyan-tint text-xs font-bold text-cyan shadow-glow-cyan backdrop-blur-sm"
    >
      $
    </motion.span>
  );
}

export function CoinFlow({
  from,
  to,
  count = 5,
  duration = 1.4,
  stagger = 0.22,
  arc = 18,
  loop = true,
  playing = true,
  progress,
  showPath = true,
  onComplete,
  className,
}: CoinFlowProps) {
  const reduce = useReducedMotion() ?? false;
  const controlled = progress !== undefined;
  const total = duration + (count - 1) * stagger;
  const ctrl: Point = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - arc };

  const p = useMotionValue(controlled ? progress : 0);
  if (controlled && p.get() !== progress) p.set(progress);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (controlled || reduce) return;
    if (!playing) {
      p.set(0);
      return;
    }
    p.set(0);
    const controls = animate(p, 1, {
      duration: total,
      ease: "linear",
      repeat: loop ? Infinity : 0,
      repeatDelay: loop ? 0.6 : 0,
      onComplete: () => onCompleteRef.current?.(),
    });
    return () => controls.stop();
  }, [controlled, reduce, playing, loop, total, p]);

  const path = `M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`;
  const staticCoin = bezier(0.5, from, ctrl, to);

  return (
    <div className={cn("pointer-events-none relative", className)} aria-hidden="true">
      {showPath && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <path
            d={path}
            fill="none"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            vectorEffect="non-scaling-stroke"
            className="stroke-cyan/40"
          />
        </svg>
      )}

      {reduce && !controlled ? (
        <span
          style={{ left: `${staticCoin.x}%`, top: `${staticCoin.y}%` }}
          className="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan bg-cyan-tint text-xs font-bold text-cyan"
        >
          $
        </span>
      ) : (
        Array.from({ length: count }).map((_, i) => (
          <Coin
            key={i}
            p={p}
            index={i}
            total={total}
            duration={duration}
            stagger={stagger}
            from={from}
            ctrl={ctrl}
            to={to}
          />
        ))
      )}
    </div>
  );
}
