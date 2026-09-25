"use client";

import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import { useVault } from "@/lib/data/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { VaultMeter } from "./vault-meter";

export function VaultSummaryCard({ vaultId }: { vaultId?: string }) {
  const vault = useVault(vaultId);

  if (!vaultId) {
    return <EmptyState icon={Landmark} title={copy.vaultCard.none} description={copy.vaultCard.noneBody} />;
  }

  const v = vault.data;
  const released = v?.tranches.filter((t) => t.released).length ?? 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{copy.assetPage.sections.vault}</CardTitle>
        {v && (
          <Badge variant={v.payout.unlocked ? "verified" : "neutral"}>
            {v.payout.unlocked ? copy.vaultPage.payoutStatus.unlocked : copy.vaultPage.payoutStatus.locked}
          </Badge>
        )}
      </CardHeader>
      {!v ? (
        <Skeleton className="mx-auto size-40 rounded-full" />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <VaultMeter raised={v.totalDeposited} target={v.target} size={168} markers={[0.5]} />
          <dl className="grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-md bg-surface-2 p-2">
              <dt className="type-caption text-text-faint">{copy.vaultCard.tranchesReleased}</dt>
              <dd className="nums text-sm text-text">
                {released}/{v.tranches.length}
              </dd>
            </div>
            <div className="rounded-md bg-surface-2 p-2">
              <dt className="type-caption text-text-faint">{copy.vaultPage.payout}</dt>
              <dd className="nums text-sm text-text">{formatAmount(v.payout.amount)}</dd>
            </div>
          </dl>
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/vault/${vaultId}`}>
              {copy.vaultCard.open} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
