"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Landmark, Users } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import {
  dataSource,
  useAsset,
  useAttestations,
  useInvestor,
  useInvestorWallet,
  usePosition,
  useTxAction,
  useVault,
} from "@/lib/data/hooks";
import { AddressChip } from "@/components/ui/address-chip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { VaultMeter } from "@/components/bap/vault-meter";
import { TrancheCard } from "@/components/bap/tranche-card";
import { PayoutCard } from "@/components/bap/payout-card";
import { InvestorPanel } from "@/components/bap/investor-panel";
import { FlowStrip, type FlowEvent } from "@/components/bap/flow-strip";

export function VaultView({ id }: { id: string }) {
  const t = copy.vaultPage;
  const vault = useVault(id);
  const asset = useAsset(vault.data?.passportId ?? id);
  const atts = useAttestations(vault.data?.passportId);
  const { wallet, isDemo } = useInvestorWallet();
  const investor = useInvestor(wallet);
  const position = usePosition(id, wallet);
  const [flow, setFlow] = useState<FlowEvent | null>(null);

  const ds = dataSource;
  const faucet = useTxAction((w: string) => ds().faucetTusdc(w), copy.txLabels.faucet);
  const kyc = useTxAction((w: string) => ds().issueDemoKyc(w), copy.txLabels.kyc);
  const deposit = useTxAction((a: { w: string; amount: number }) => ds().deposit(id, a.w, a.amount), copy.txLabels.deposit);
  const claim = useTxAction((w: string) => ds().claim(id, w), copy.txLabels.claim);
  const release = useTxAction((index: number) => ds().releaseTranche(id, index), copy.txLabels.release);
  const unlock = useTxAction(() => ds().unlockPayout(id), copy.txLabels.unlock);

  if (vault.isPending) {
    return (
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!vault.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState icon={Landmark} title={t.notFoundTitle} description={t.notFoundBody} />
      </div>
    );
  }

  const v = vault.data;
  const signed = new Set((atts.data ?? []).map((a) => a.schemaKey));
  const releasingIndex = release.isPending ? release.variables : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/asset/${v.passportId}`}
          className="type-small inline-flex items-center gap-1.5 rounded-sm text-text-muted hover:text-text focus-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> {t.back}
        </Link>
        <AddressChip value={v.address} label={t.title} />
      </div>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="nums text-sm tracking-[0.15em] text-cyan">{v.passportId}</p>
          <h1 className="type-h1 text-text">
            {asset.data?.passport.name ?? v.passportId} · {t.title}
          </h1>
        </div>
        <Badge variant="warning">{copy.network.devnetOnly}</Badge>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="items-center">
          <VaultMeter raised={v.totalDeposited} target={v.target} markers={[0.5]} size={240} />
          <dl className="grid w-full grid-cols-3 gap-3 text-center">
            <div>
              <dt className="type-caption text-text-faint">
                <Users className="mr-1 inline size-3.5" aria-hidden="true" />
                {copy.rightsMap.investors}
              </dt>
              <dd className="nums text-lg text-text">{v.investorCount}</dd>
            </div>
            <div>
              <dt className="type-caption text-text-faint">{copy.vaultCard.tranchesReleased}</dt>
              <dd className="nums text-lg text-text">
                {v.tranches.filter((x) => x.released).length}/{v.tranches.length}
              </dd>
            </div>
            <div>
              <dt className="type-caption text-text-faint">{t.investor.remaining}</dt>
              <dd className="nums text-lg text-text">{formatAmount(v.target - v.totalDeposited)}</dd>
            </div>
          </dl>
          <div className="w-full">
            <FlowStrip event={flow} />
          </div>
        </Card>

        {wallet ? (
          <InvestorPanel
            vault={v}
            wallet={wallet}
            isDemoWallet={isDemo}
            investor={investor.data}
            position={position.data}
            pending={{ faucet: faucet.isPending, kyc: kyc.isPending, deposit: deposit.isPending, claim: claim.isPending }}
            onFaucet={() => faucet.mutate(wallet)}
            onKyc={() => kyc.mutate(wallet)}
            onDeposit={(amount) =>
              deposit.mutate({ w: wallet, amount }, { onSuccess: () => setFlow({ id: Date.now(), direction: "in" }) })
            }
            onClaim={() => claim.mutate(wallet, { onSuccess: () => setFlow({ id: Date.now(), direction: "out" }) })}
          />
        ) : (
          <EmptyState title={copy.wallet.connect} />
        )}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="type-h3 text-text">
            {t.tranches} & {t.payout.toLowerCase()}
          </h2>
          <p className="type-caption text-text-faint">{t.releaseHint}</p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {v.tranches.map((tr) => (
            <TrancheCard
              key={tr.index}
              tranche={tr}
              attested={signed.has(tr.requiredSchema)}
              releasing={releasingIndex === tr.index}
              onRelease={() => release.mutate(tr.index)}
            />
          ))}
          <PayoutCard
            payout={v.payout}
            attested={signed.has(v.payout.requiredSchema)}
            unlocking={unlock.isPending}
            onUnlock={() => unlock.mutate(undefined)}
          />
        </div>
      </section>
    </div>
  );
}
