"use client";

import { Lock, Unlock, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { formatAmount, formatDate } from "@/lib/format";
import type { Tranche } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InstitutionIcon } from "./institution-icon";

type TrancheCardProps = {
  tranche: Tranche;
  /** Whether the required event has been signed. */
  attested: boolean;
  releasing?: boolean;
  onRelease: () => void;
};

export function TrancheCard({ tranche, attested, releasing, onRelease }: TrancheCardProps) {
  const t = copy.vaultPage;
  const status = tranche.released ? "released" : attested ? "ready" : "locked";

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-lg border p-5 surface-card",
        status === "released" && "border-green-deep/60",
        status === "ready" && "border-cyan/50 shadow-glow-cyan",
        status === "locked" && "border-border"
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="type-label text-text-faint">{t.tranche(tranche.index + 1)}</p>
          <p className="nums mt-1 text-2xl font-medium text-text">
            {formatAmount(tranche.amount)} <span className="text-sm text-text-muted">{copy.units.token}</span>
          </p>
        </div>
        <Badge
          variant={status === "released" ? "verified" : status === "ready" ? "info" : "pending"}
          icon={status === "released" ? CircleCheck : status === "ready" ? Unlock : Lock}
        >
          {t.status[status]}
        </Badge>
      </header>

      <dl className="grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-faint">{t.requires}</dt>
          <dd className={cn("font-medium", attested ? "text-green" : "text-text-muted")}>
            {copy.schemas[tranche.requiredSchema]}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-faint">{t.releasesTo}</dt>
          <dd className="inline-flex items-center gap-1.5 text-text">
            <InstitutionIcon kind={tranche.recipient.role} className="size-4 text-text-muted" />
            {tranche.recipient.name}
          </dd>
        </div>
      </dl>

      {tranche.released ? (
        <p className="type-caption text-text-muted">
          {t.status.released} · <span className="nums">{tranche.releasedAt ? formatDate(tranche.releasedAt) : ""}</span>
        </p>
      ) : (
        <Button
          variant={attested ? "primary" : "secondary"}
          disabled={!attested}
          loading={releasing}
          onClick={onRelease}
          className="mt-auto"
        >
          {t.release}
        </Button>
      )}
    </article>
  );
}
