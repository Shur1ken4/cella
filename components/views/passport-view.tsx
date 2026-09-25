"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileCheck2,
  FileSearch,
  Landmark,
  ShieldCheck,
  Users,
} from "lucide-react";
import { copy } from "@/lib/copy";
import { formatCompact } from "@/lib/format";
import { useAsset, useAttestations, useVault } from "@/lib/data/hooks";
import { ASSET_SCHEMAS } from "@/lib/data/schemas";
import { buildTimeline } from "@/lib/data/timeline";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { AddressChip } from "@/components/ui/address-chip";
import { PassportCard } from "@/components/bap/passport-card";
import { StageStepper } from "@/components/bap/stage-stepper";
import { StrandTimeline } from "@/components/bap/strand-timeline";
import { RightsMap } from "@/components/bap/rights-map";
import { DocumentRow } from "@/components/bap/document-row";
import { VaultSummaryCard } from "@/components/bap/vault-summary-card";
import { Reveal } from "@/components/motion/reveal";

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="type-small inline-flex items-center gap-1.5 rounded-sm text-text-muted hover:text-text focus-ring"
    >
      <ArrowLeft className="size-4" aria-hidden="true" /> {label}
    </Link>
  );
}

export function PassportView({ id }: { id: string }) {
  const asset = useAsset(id);
  const atts = useAttestations(asset.data?.passport.id);
  const vault = useVault(asset.data?.vaultId);

  if (asset.isPending) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <Skeleton className="aspect-[1.586] w-full max-w-[520px] rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!asset.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <BackLink href="/app" label={copy.assetPage.back} />
        <EmptyState
          className="mt-6"
          icon={FileSearch}
          title={copy.assetPage.notFoundTitle}
          description={copy.assetPage.notFoundBody}
        />
      </div>
    );
  }

  const p = asset.data.passport;
  const signed = (atts.data ?? []).filter(
    (a) => a.schemaKey !== "KYC_VERIFIED"
  );
  const s = copy.assetPage;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackLink href="/app" label={s.back} />
        <AddressChip value={p.address} label="Passport" />
      </div>

      {/* hero: passport + lifecycle + stats */}
      <section className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <PassportCard
          name={p.name}
          code={p.code}
          stage={copy.stages[p.stage]}
          owner={p.owner.name}
          modality={p.modality}
          area={p.area}
          attestationCount={atts.data ? signed.length : undefined}
          verified={signed.length > 0}
        />
        <div className="flex min-w-0 flex-col gap-4">
          <Card padding="sm">
            <h2 className="type-label text-text-faint">
              {s.sections.lifecycle}
            </h2>
            <StageStepper current={p.stage} className="-mx-1" />
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <StatTile
              label={s.stats.stage}
              value={copy.stages[p.stage]}
              icon={ShieldCheck}
              accent="green"
              className="[&_.nums]:font-heading [&_.nums]:text-xl"
            />
            <StatTile
              label={s.stats.rightsHolders}
              value={p.rightsHolders.length}
              icon={Users}
              accent="none"
            />
            <StatTile
              label={s.stats.signedEvents}
              value={
                atts.data ? `${signed.length}/${ASSET_SCHEMAS.length}` : "—"
              }
              loading={atts.isPending}
              icon={FileCheck2}
              accent="green"
            />
            <StatTile
              label={s.stats.raised}
              value={vault.data ? vault.data.totalDeposited : "—"}
              compact
              unit={
                vault.data
                  ? `${s.of} ${formatCompact(vault.data.target)}`
                  : undefined
              }
              loading={!!asset.data.vaultId && vault.isPending}
              icon={Landmark}
            />
          </div>
        </div>
      </section>

      {/* rights map + vault */}
      <Reveal>
        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>{s.sections.rightsMap}</CardTitle>
            </CardHeader>
            <RightsMap
              rightsHolders={p.rightsHolders}
              owner={p.owner}
              hasVault={!!asset.data.vaultId}
            />
          </Card>
          <VaultSummaryCard vaultId={asset.data.vaultId} />
        </section>
      </Reveal>

      {/* signed events + documents */}
      <Reveal>
        <section className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="type-h3 text-text">{s.sections.timeline}</h2>
            <div className="mt-5">
              {atts.isPending ? (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : atts.isError ? (
                <EmptyState title={atts.error.message} />
              ) : (
                <StrandTimeline events={buildTimeline(atts.data)} />
              )}
            </div>
          </div>
          <div>
            <h2 className="type-h3 text-text">{s.sections.documents}</h2>
            <p className="type-small mt-1 text-text-muted">
              {copy.documents.privacy}
            </p>
            {p.documents.length === 0 ? (
              <EmptyState
                className="mt-5"
                icon={FileSearch}
                title={copy.documents.empty}
              />
            ) : (
              <ul className="mt-5 flex flex-col gap-4">
                {p.documents.map((d) => (
                  <DocumentRow key={d.id} doc={d} />
                ))}
              </ul>
            )}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
