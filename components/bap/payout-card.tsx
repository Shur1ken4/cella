"use client";

import { CircleCheck, Lock, TriangleAlert, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import type { MilestonePayout } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InstitutionIcon } from "./institution-icon";

type PayoutCardProps = {
  payout: MilestonePayout;
  attested: boolean;
  unlocking?: boolean;
  onUnlock: () => void;
};

export function PayoutCard({ payout, attested, unlocking, onUnlock }: PayoutCardProps) {
  const t = copy.vaultPage;
  const status = !payout.funded ? "notFunded" : payout.unlocked ? "unlocked" : attested ? "ready" : "locked";
  const icon = { notFunded: TriangleAlert, locked: Lock, ready: Unlock, unlocked: CircleCheck }[status];
  const variant = ({ notFunded: "warning", locked: "pending", ready: "info", unlocked: "verified" } as const)[status];

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-lg border p-5 surface-card",
        status === "unlocked" && "border-green-deep shadow-glow",
        status === "ready" && "border-cyan/50 shadow-glow-cyan",
        (status === "locked" || status === "notFunded") && "border-border"
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="type-label text-text-faint">{t.payout}</p>
          <p className="nums mt-1 text-2xl font-medium text-text">
            {formatAmount(payout.amount)} <span className="text-sm text-text-muted">{copy.units.token}</span>
          </p>
        </div>
        <Badge variant={variant} icon={icon}>
          {t.payoutStatus[status]}
        </Badge>
      </header>

      <dl className="grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-faint">{t.escrowedBy}</dt>
          <dd className="inline-flex items-center gap-1.5 text-text">
            <InstitutionIcon kind={payout.payer.role} className="size-4 text-text-muted" />
            {payout.payer.name}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-faint">{t.unlocksWhen}</dt>
          <dd className={cn("font-medium", attested ? "text-green" : "text-text-muted")}>
            {copy.schemas[payout.requiredSchema]}
          </dd>
        </div>
      </dl>

      {payout.unlocked ? (
        <div className="flex flex-col gap-2">
          <Progress value={(payout.totalClaimed / payout.amount) * 100} aria-label={t.claimedSoFar} />
          <p className="type-caption text-text-muted">
            <span className="nums text-text">{formatAmount(payout.totalClaimed)}</span> {t.claimedSoFar}
          </p>
        </div>
      ) : (
        <Button
          variant={status === "ready" ? "primary" : "secondary"}
          disabled={status !== "ready"}
          loading={unlocking}
          onClick={onUnlock}
          className="mt-auto"
        >
          {t.unlock}
        </Button>
      )}
    </article>
  );
}
