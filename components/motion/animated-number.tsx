"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { formatAmount, formatCompact } from "@/lib/format";
import { easeBrand } from "@/lib/motion";

/**
 * Number that counts up when it first scrolls into view, and animates from
 * the old value to the new one whenever it changes.
 */
export function AnimatedNumber({
  value,
  compact = false,
  duration = 0.9,
  className,
}: {
  value: number;
  compact?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion() ?? false;
  const mv = useMotionValue(reduce ? value : 0);
  const text = useTransform(mv, (v) => (compact ? formatCompact(v) : formatAmount(Math.round(v))));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: easeBrand });
    return () => controls.stop();
  }, [value, inView, reduce, duration, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
