"use client";

import { motion } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy, type InstitutionKind } from "@/lib/copy";
import { Badge } from "@/components/ui/badge";
import { InstitutionIcon } from "./institution-icon";

export type TimelineEvent = {
  id: string;
  label: string;
  institution: string;
  kind: InstitutionKind;
  status: "attested" | "pending";
  /** Human-readable date, e.g. "12 Mar 2026". */
  date?: string;
  explorerUrl?: string;
  note?: string;
};

// Two sine strands, phase-shifted by π, in a 48×100 box that stretches with the row.
const CX = 24;
const AMP = 10;
function strand(phase: number) {
  const pts: string[] = [];
  for (let y = 0; y <= 100; y += 4) {
    const x = CX + AMP * Math.sin((y / 100) * 2 * Math.PI + phase);
    pts.push(`${x.toFixed(2)},${y}`);
  }
  return `M${pts.join("L")}`;
}
const STRAND_A = strand(0);
const STRAND_B = strand(Math.PI);
const RUNGS = [12.5, 37.5, 62.5, 87.5].map((y) => {
  const dx = AMP * Math.sin((y / 100) * 2 * Math.PI);
  return { y, x1: CX - Math.abs(dx), x2: CX + Math.abs(dx) };
});

function StrandSegment({ attested, last, delay }: { attested: boolean; last: boolean; delay: number }) {
  return (
    <motion.svg
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      viewBox="0 0 48 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("absolute inset-x-0 top-0 h-full w-full", last && "h-8")}
    >
      {RUNGS.map((r) => (
        <line
          key={r.y}
          x1={r.x1}
          x2={r.x2}
          y1={r.y}
          y2={r.y}
          vectorEffect="non-scaling-stroke"
          className={attested ? "stroke-green-deep" : "stroke-border"}
          strokeWidth="1"
        />
      ))}
      {[STRAND_A, STRAND_B].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          vectorEffect="non-scaling-stroke"
          className={attested ? "stroke-green" : "stroke-border-strong"}
          strokeWidth="1.25"
          strokeOpacity={attested ? 0.8 : 1}
        />
      ))}
    </motion.svg>
  );
}

type StrandTimelineProps = {
  events: TimelineEvent[];
  animate?: boolean;
  className?: string;
};

export function StrandTimeline({ events, animate = true, className }: StrandTimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)} aria-label={copy.timeline.title}>
      {events.map((e, i) => {
        const attested = e.status === "attested";
        const last = i === events.length - 1;
        return (
          <motion.li
            key={e.id}
            initial={animate ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animate ? i * 0.08 : 0 }}
            className="grid grid-cols-[48px_1fr] gap-3 sm:gap-4"
          >
            {/* strand + node */}
            <div className="relative">
              <StrandSegment attested={attested} last={last} delay={animate ? i * 0.12 : 0} />
              <span className="absolute top-4 left-1/2 -translate-x-1/2">
                {attested ? (
                  <motion.span
                    initial={animate ? { scale: 0 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20, delay: animate ? i * 0.08 + 0.15 : 0 }}
                    className="grid size-6 place-items-center rounded-full border-2 border-bg-deep bg-green-fill text-on-green shadow-glow"
                  >
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </motion.span>
                ) : (
                  <span className="block size-6 rounded-full border-2 border-dashed border-border-strong bg-bg" />
                )}
              </span>
            </div>

            {/* event card */}
            <div className={cn("pb-4", last && "pb-0")}>
              <div
                className={cn(
                  "surface-card rounded-lg border p-4",
                  attested ? "border-green-deep/50" : "border-border"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p
                    className={cn(
                      "font-heading text-base font-semibold",
                      attested ? "text-text" : "text-text-muted"
                    )}
                  >
                    {e.label}
                  </p>
                  <Badge variant={attested ? "verified" : "pending"}>
                    {attested ? copy.timeline.attested : copy.timeline.pending}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-text-muted">
                    <InstitutionIcon kind={e.kind} className="size-4" />
                    {e.institution}
                  </span>
                  <span className="nums text-xs text-text-faint">
                    {e.date ?? copy.timeline.notYetSigned}
                  </span>
                  {e.explorerUrl && (
                    <a
                      href={e.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cyan underline-offset-2 hover:underline focus-ring"
                    >
                      {copy.timeline.viewTx}
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  )}
                </div>

                {e.note && <p className="type-small mt-2 text-text-muted">{e.note}</p>}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
