"use client";

import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoBanner } from "@/components/ui/demo-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { withTxToast } from "@/components/ui/tx-toast";
import { copy } from "@/lib/copy";
import { MOCK_SIGNATURE } from "@/lib/design/mock";
import { DemoLabel } from "./section";

const fakeTx = (ok: boolean) => () =>
  new Promise<string>((resolve, reject) =>
    setTimeout(
      () => (ok ? resolve(MOCK_SIGNATURE) : reject(new Error("This milestone hasn't been confirmed yet."))),
      1200
    )
  );

export function FeedbackDemo() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <DemoLabel>Badges</DemoLabel>
          <div className="flex flex-wrap gap-2">
            <Badge variant="verified">Verified</Badge>
            <Badge variant="pending">Pending</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>
        </div>
        <div>
          <DemoLabel>TxToast (pending → confirmed / failed)</DemoLabel>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => withTxToast(fakeTx(true), { confirmed: "Attestation signed" }).catch(() => {})}
            >
              Simulate success
            </Button>
            <Button
              variant="secondary"
              onClick={() => withTxToast(fakeTx(false)).catch(() => {})}
            >
              Simulate failure
            </Button>
          </div>
        </div>
      </div>

      <div>
        <DemoLabel>DemoBanner</DemoLabel>
        <DemoBanner institution={copy.institutions.university.name} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <DemoLabel>EmptyState</DemoLabel>
          <EmptyState
            icon={FileSearch}
            title="No documents yet"
            description="Drop a PDF to fingerprint it locally. Only the hash goes onchain."
            action={<Button size="sm">Add document</Button>}
          />
        </div>
        <div>
          <DemoLabel>Skeleton (loading)</DemoLabel>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-1 p-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
