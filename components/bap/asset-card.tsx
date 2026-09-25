"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileCheck2, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { formatCompact, formatPercent } from "@/lib/format";
import { useAttestations, useVault } from "@/lib/data/hooks";
import { ASSET_SCHEMAS } from "@/lib/data/schemas";
import type { Asset } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HexFrame } from "@/components/ui/hex-frame";
import { HexPattern } from "./hex-pattern";
import { InstitutionIcon } from "./institution-icon";

/** Dashboard tile for one asset: a mini passport with lifecycle + funding at a glance. */
export function AssetCard({
  asset,
  className,
}: {
  asset: Asset;
  className?: string;
}) {
  const p = asset.passport;
  const atts = useAttestations(p.id);
  const vault = useVault(asset.vaultId);
  const signed = atts.data?.filter(
    (a) => a.schemaKey !== "KYC_VERIFIED"
  ).length;
  const v = vault.data;

  return (
    <Link
      href={`/asset/${p.id}`}
      className={cn(
        "group relative isolate flex flex-col gap-5 overflow-hidden rounded-lg border border-border surface-card p-5 shadow-card hover-lift hover:border-green-deep focus-ring",
        className
      )}
    >
      <HexPattern className="-z-10" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <HexFrame
            className="size-11 shrink-0 text-green"
            fillClassName="fill-green-tint"
          >
            <InstitutionIcon kind="owner" className="size-5" />
          </HexFrame>
          <div>
            <h3 className="font-heading text-lg leading-tight font-semibold text-text">
              {p.name}
            </h3>
            <p className="nums text-xs tracking-[0.15em] text-cyan">{p.code}</p>
          </div>
        </div>
        <ArrowUpRight
          className="size-5 text-text-faint transition-transform duration-150 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-green"
          aria-hidden="true"
        />
      </div>

      {/* lifecycle bar: one segment per stage */}
      <div>
        <div className="flex gap-1" aria-hidden="true">
          {copy.stages.map((s, i) => (
            <span
              key={s}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3"
            >
              {i <= p.stage && (
                <motion.span
                  className={cn(
                    "block h-full origin-left rounded-full",
                    i < p.stage ? "bg-green-deep" : "bg-green-fill shadow-glow"
                  )}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
                />
              )}
            </span>
          ))}
        </div>
        <p className="type-caption mt-2 text-text-muted">
          <span className="sr-only">{copy.assetPage.stats.stage}: </span>
          {copy.stages[p.stage]} · {p.area}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {signed === undefined ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <Badge variant="verified" icon={FileCheck2}>
            <span className="nums">
              {signed}/{ASSET_SCHEMAS.length}
            </span>{" "}
            {copy.dashboard.signedEvents}
          </Badge>
        )}
        {asset.vaultId &&
          (v ? (
            <Badge variant="info" icon={Landmark}>
              <span className="nums">
                {formatCompact(v.totalDeposited)} / {formatCompact(v.target)}
              </span>{" "}
              · {formatPercent(v.totalDeposited / v.target)}{" "}
              {copy.dashboard.raised}
            </Badge>
          ) : (
            <Skeleton className="h-6 w-32" />
          ))}
      </div>
      <span className="sr-only">{copy.dashboard.openPassport}</span>
    </Link>
  );
}
