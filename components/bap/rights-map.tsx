"use client";

import { motion } from "framer-motion";
import { ArrowRight, Landmark, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import type { Institution, RightsHolder } from "@/lib/data/types";
import { HexFrame } from "@/components/ui/hex-frame";
import { InstitutionIcon } from "./institution-icon";

type P = { x: number; y: number };
/** `t` = where along the line (0–1) the label sits. */
type Edge = { from: P; to: P; label: string; kind: "rights" | "money"; t?: number };

const POS = {
  licensor: { x: 15, y: 24 },
  owner: { x: 50, y: 24 },
  licensee: { x: 85, y: 24 },
  investors: { x: 15, y: 76 },
  vault: { x: 50, y: 76 },
} satisfies Record<string, P>;

const pop = (i: number) => ({
  initial: { opacity: 0, scale: 0.4 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 320, damping: 18, delay: 0.1 + i * 0.12 },
});

function Node({
  at,
  i,
  label,
  sub,
  children,
  tone,
}: {
  at: P;
  i: number;
  label: string;
  sub: string;
  children: React.ReactNode;
  tone: "green" | "cyan";
}) {
  return (
    <div
      className="absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center sm:w-32"
      style={{ left: `${at.x}%`, top: `${at.y}%` }}
    >
      <motion.div {...pop(i)}>
        <HexFrame
          className={cn("size-11 sm:size-14", tone === "green" ? "text-green" : "text-cyan")}
          fillClassName={tone === "green" ? "fill-green-tint" : "fill-cyan-tint"}
        >
          {children}
        </HexFrame>
      </motion.div>
      <span className="text-xs leading-tight font-medium text-text">{label}</span>
      <span className="type-caption hidden leading-tight text-text-faint sm:block">{sub}</span>
    </div>
  );
}

/**
 * Who holds rights in the asset, and how money moves between them.
 * Built from the passport's rights holders; nodes that don't exist are omitted.
 */
export function RightsMap({
  rightsHolders,
  owner,
  hasVault,
  className,
}: {
  rightsHolders: RightsHolder[];
  owner: Institution;
  hasVault: boolean;
  className?: string;
}) {
  const licensor = rightsHolders.find((h) => h.institution.role === "university")?.institution;
  const licensee = rightsHolders.find((h) => h.institution.role === "pharma")?.institution;
  const r = copy.rightsMap;

  const edges: Edge[] = [
    ...(licensor ? [{ from: POS.licensor, to: POS.owner, label: r.exclusiveLicence, kind: "rights" as const }] : []),
    ...(licensee ? [{ from: POS.owner, to: POS.licensee, label: r.licence, kind: "rights" as const }] : []),
    ...(hasVault
      ? [
          { from: POS.investors, to: POS.vault, label: r.deposits, kind: "money" as const },
          { from: POS.vault, to: POS.owner, label: r.funds, kind: "money" as const },
          ...(licensee ? [{ from: POS.licensee, to: POS.vault, label: r.escrow, kind: "money" as const, t: 0.28 }] : []),
        ]
      : []),
  ];
  const edgeDelay = (i: number) => 0.7 + i * 0.12;

  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className={cn("relative w-full", hasVault ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[3/1]")} aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          {edges.map((e, i) => (
            <motion.line
              key={e.label}
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              vectorEffect="non-scaling-stroke"
              strokeWidth="1.5"
              strokeDasharray={e.kind === "money" ? "5 5" : "0"}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: edgeDelay(i), duration: 0.4 }}
              className={cn(
                e.kind === "rights" ? "stroke-green-deep" : "stroke-cyan/60",
                e.kind === "money" && "motion-safe:animate-[dash-flow_1.2s_linear_infinite]"
              )}
            />
          ))}
        </svg>

        {edges.map((e, i) => (
          <motion.span
            key={`label-${e.label}`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: edgeDelay(i) + 0.15, duration: 0.3 }}
            className={cn(
              "absolute z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-sm border bg-bg-deep px-1.5 py-0.5 text-xs whitespace-nowrap",
              e.kind === "rights" ? "border-green-deep/60 text-green" : "border-cyan/40 text-cyan"
            )}
            style={{
              left: `${e.from.x + (e.to.x - e.from.x) * (e.t ?? 0.5)}%`,
              top: `${e.from.y + (e.to.y - e.from.y) * (e.t ?? 0.5)}%`,
            }}
          >
            <span className="hidden sm:inline">{e.label}</span>
            <ArrowRight className="size-3" />
          </motion.span>
        ))}

        {licensor && (
          <Node at={POS.licensor} i={0} label={licensor.name} sub={copy.institutions.university.role} tone="green">
            <InstitutionIcon kind="university" className="size-4 sm:size-5" />
          </Node>
        )}
        <Node at={POS.owner} i={1} label={owner.name} sub={copy.institutions.owner.role} tone="green">
          <InstitutionIcon kind="owner" className="size-4 sm:size-5" />
        </Node>
        {licensee && (
          <Node at={POS.licensee} i={2} label={licensee.name} sub={copy.institutions.pharma.role} tone="green">
            <InstitutionIcon kind="pharma" className="size-4 sm:size-5" />
          </Node>
        )}
        {hasVault && (
          <>
            <Node at={POS.investors} i={3} label={r.investors} sub="tUSDC" tone="cyan">
              <Users className="size-4 sm:size-5" />
            </Node>
            <Node at={POS.vault} i={4} label={r.vault} sub={copy.units.testMoney} tone="cyan">
              <Landmark className="size-4 sm:size-5" />
            </Node>
          </>
        )}
      </div>
      {licensor && licensee && hasVault ? (
        <figcaption className="type-small text-text-muted">{r.description}</figcaption>
      ) : (
        <figcaption className="sr-only">
          {rightsHolders.map((h) => `${h.institution.name}: ${h.right}`).join(". ")}
        </figcaption>
      )}
    </figure>
  );
}
