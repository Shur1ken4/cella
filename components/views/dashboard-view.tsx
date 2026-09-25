"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
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
          <p className="type-body mt-2 text-text-muted">
            {copy.dashboard.subtitle}
          </p>
        </div>
        <RoleSwitcher />
      </div>

      {/* role-specific next step */}
      <div className="mt-8 overflow-hidden rounded-lg border border-border-strong surface-raised shadow-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={role}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
          >
            <motion.span
              initial={{ rotate: -30, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <HexFrame
                className="size-12 shrink-0 text-green"
                fillClassName="fill-green-tint"
              >
                <InstitutionIcon kind={role} className="size-5" />
              </HexFrame>
            </motion.span>
            <div className="flex-1">
              <p className="font-heading text-base font-semibold text-text">
                {hint.title}
              </p>
              <p className="type-small text-text-muted">{hint.body}</p>
            </div>
            <Button asChild>
              <Link href={hint.href}>
                {hint.cta} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center justify-between gap-4">
        <h2 className="type-h3 text-text">{copy.dashboard.assets}</h2>
        <Button asChild variant="secondary" size="sm">
          <Link href="/create">
            <Plus aria-hidden="true" /> {copy.nav.create}
          </Link>
        </Button>
      </div>

      {assets.isPending && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      )}
      {assets.isError && (
        <EmptyState className="mt-5" title={assets.error.message} />
      )}
      {assets.data && (
        <Stagger className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.data.map((a) => (
            <StaggerItem key={a.id} className="flex">
              <AssetCard asset={a} className="w-full" />
            </StaggerItem>
          ))}
          {copy.dashboard.placeholders.map((p) => (
            <StaggerItem key={p.name} className="flex">
              <ComingSoonCard name={p.name} area={p.area} className="w-full" />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
