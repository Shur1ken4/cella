"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { copy } from "@/lib/copy";
import { useRole } from "@/lib/role";
import { useAssets } from "@/lib/data/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { HexFrame } from "@/components/ui/hex-frame";
import { RoleSwitcher } from "@/components/bap/role-switcher";
import { AssetCard } from "@/components/bap/asset-card";
import { ComingSoonCard } from "@/components/bap/coming-soon-card";
import { InstitutionIcon } from "@/components/bap/institution-icon";

export function DashboardView() {
  const { role } = useRole();
  const assets = useAssets();
  const hint = copy.dashboard.roleHints[role];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h1 className="type-h1 text-text">{copy.dashboard.title}</h1>
          <p className="type-body mt-2 text-text-muted">{copy.dashboard.subtitle}</p>
        </div>
        <RoleSwitcher />
      </div>

      {/* role-specific next step */}
      <div className="mt-8 flex flex-col gap-4 rounded-lg border border-border-strong surface-raised p-5 sm:flex-row sm:items-center">
        <HexFrame className="size-12 shrink-0 text-green" fillClassName="fill-green-tint">
          <InstitutionIcon kind={role} className="size-5" />
        </HexFrame>
        <div className="flex-1">
          <p className="font-heading text-base font-semibold text-text">{hint.title}</p>
          <p className="type-small text-text-muted">{hint.body}</p>
        </div>
        <Button asChild>
          <Link href={hint.href}>
            {hint.cta} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 flex items-center justify-between gap-4">
        <h2 className="type-h3 text-text">{copy.dashboard.assets}</h2>
        <Button asChild variant="secondary" size="sm">
          <Link href="/create">
            <Plus aria-hidden="true" /> {copy.nav.create}
          </Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.isPending &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)}
        {assets.isError && (
          <EmptyState className="sm:col-span-2 lg:col-span-3" title={assets.error.message} />
        )}
        {assets.data?.map((a) => <AssetCard key={a.id} asset={a} />)}
        {assets.data &&
          copy.dashboard.placeholders.map((p) => <ComingSoonCard key={p.name} name={p.name} area={p.area} />)}
      </div>
    </div>
  );
}
