"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { formatAmount, formatCompact, formatPercent } from "@/lib/format";
import { easeBrand } from "@/lib/motion";

type VaultMeterProps = {
  raised: number;
  target: number;
  unit?: string;
  /** Pixel size of the ring. */
  size?: number;
  /** Fractions (0–1) where tick marks are drawn, e.g. tranche split points. */
  markers?: number[];
  label?: string;
  className?: string;
};

const STROKE = 12;

/** Animated, formatted number (no React re-renders per frame). */
function useCountUp(value: number, enabled: boolean) {
  const mv = useMotionValue(enabled ? 0 : value);
  useEffect(() => {
    if (!enabled) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.9, ease: easeBrand });
    return () => controls.stop();
  }, [value, enabled, mv]);
  return useTransform(mv, (v) => formatAmount(Math.round(v)));
}

export function VaultMeter({
  raised,
  target,
  unit = copy.units.token,
  size = 220,
  markers = [],
  label = copy.vault.raised,
  className,
}: VaultMeterProps) {
  const reduce = useReducedMotion() ?? false;
  const fraction = target > 0 ? Math.min(raised / target, 1) : 0;
  const complete = fraction >= 1;
  const shown = useCountUp(raised, !reduce);

  const compact = size < 200;
  const r = (size - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={raised}
      aria-valuetext={`${formatAmount(raised)} ${copy.vault.of} ${formatAmount(target)} ${unit}`}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("-rotate-90", complete && "drop-shadow-[0_0_14px_var(--green-glow)]")}
        aria-hidden="true"
      >
        <circle cx={center} cy={center} r={r} fill="none" strokeWidth={STROKE} className="stroke-surface-2" />
        <circle
          cx={center}
          cy={center}
          r={r + STROKE / 2 + 3}
          fill="none"
          strokeWidth="1"
          strokeDasharray="2 6"
          className="stroke-border-strong"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - fraction) }}
          transition={{ duration: reduce ? 0 : 0.9, ease: easeBrand }}
          className={complete ? "stroke-green" : "stroke-cyan"}
        />
        {markers.map((m) => {
          const a = m * 2 * Math.PI;
          const r1 = r - STROKE / 2 - 2;
          const r2 = r + STROKE / 2 + 2;
          return (
            <line
              key={m}
              x1={center + r1 * Math.cos(a)}
              y1={center + r1 * Math.sin(a)}
              x2={center + r2 * Math.cos(a)}
              y2={center + r2 * Math.sin(a)}
              strokeWidth="2"
              className="stroke-text-muted"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("type-label", complete ? "text-green" : "text-text-faint")}>
          {complete ? (compact ? copy.vault.fundedShort : copy.vault.funded) : label}
        </span>
        <motion.span
          className={cn("nums font-medium", compact ? "text-xl" : "text-3xl", complete ? "text-green" : "text-text")}
        >
          {shown}
        </motion.span>
        <span className="nums text-xs text-text-muted">
          {copy.vault.of} {compact ? formatCompact(target) : formatAmount(target)} {unit}
        </span>
        <span
          className={cn(
            "nums mt-2 rounded-sm px-2 py-0.5 text-xs",
            complete ? "bg-green-tint text-green" : "bg-cyan-tint text-cyan"
          )}
        >
          {formatPercent(fraction)}
        </span>
      </div>
    </div>
  );
}
