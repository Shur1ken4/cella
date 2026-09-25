"use client";

import { useState } from "react";
import { BadgeCheck, Coins, HandCoins, Info, UserCheck } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatAmount, formatPercent } from "@/lib/format";
import type { InvestorStatus, Position, Vault } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressChip } from "@/components/ui/address-chip";
import { StepPills } from "./step-pills";
import { AnimatedNumber } from "@/components/motion/animated-number";

type InvestorPanelProps = {
  vault: Vault;
  wallet: string;
  isDemoWallet: boolean;
  investor?: InvestorStatus;
  position?: Position;
  pending: { faucet: boolean; kyc: boolean; deposit: boolean; claim: boolean };
  onFaucet: () => void;
  onKyc: () => void;
  onDeposit: (amount: number) => void;
  onClaim: () => void;
};

export function InvestorPanel({
  vault,
  wallet,
  isDemoWallet,
  investor,
  position,
  pending,
  onFaucet,
  onKyc,
  onDeposit,
  onClaim,
}: InvestorPanelProps) {
  const t = copy.vaultPage.investor;
  const [amount, setAmount] = useState("");
  const loading = !investor || !position;

  const balance = investor?.tusdcBalance ?? 0;
  const left = vault.target - vault.totalDeposited;
  const maxDeposit = Math.max(0, Math.min(balance, left));
  const parsed = Number(amount.replace(/,/g, ""));
  const canDeposit =
    !!investor?.kycVerified && vault.depositsOpen && parsed > 0;

  const done = [
    balance > 0 || (position?.deposited ?? 0) > 0,
    !!investor?.kycVerified,
    (position?.deposited ?? 0) > 0,
    (position?.claimed ?? 0) > 0,
  ];

  return (
    <Card variant="raised" className="h-full">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        {!isDemoWallet && <AddressChip value={wallet} />}
      </CardHeader>

      {isDemoWallet && (
        <p className="type-caption -mt-2 inline-flex items-center gap-1.5 text-text-muted">
          <Info className="size-3.5 shrink-0 text-cyan" aria-hidden="true" />
          {t.demoWallet}
        </p>
      )}

      <StepPills steps={t.steps} done={done} />

      {/* position */}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            [
              t.walletBalance,
              loading ? null : <AnimatedNumber value={balance} />,
            ],
            [
              t.deposited,
              loading ? null : <AnimatedNumber value={position!.deposited} />,
            ],
            [t.share, loading ? null : formatPercent(position!.share, 1)],
            [
              t.claimable,
              loading ? null : <AnimatedNumber value={position!.claimable} />,
            ],
          ] as [string, React.ReactNode][]
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-border bg-surface-1 p-3"
          >
            <dt className="type-caption text-text-faint">{label}</dt>
            <dd className="nums mt-0.5 text-lg text-text">
              {value ?? <Skeleton className="h-6 w-16" />}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" loading={pending.faucet} onClick={onFaucet}>
          <Coins aria-hidden="true" /> {t.faucet}
        </Button>
        {investor?.kycVerified ? (
          <span className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-green-deep/60 bg-green-tint text-sm font-medium text-green">
            <BadgeCheck className="size-4" aria-hidden="true" /> {t.verified}
          </span>
        ) : (
          <Button
            variant="secondary"
            loading={pending.kyc}
            disabled={loading}
            onClick={onKyc}
          >
            <UserCheck aria-hidden="true" /> {t.kyc}
          </Button>
        )}
      </div>

      {/* deposit */}
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (canDeposit) onDeposit(parsed);
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="deposit-amount">{t.amount}</Label>
          <span className="type-caption text-text-faint">
            <span className="nums text-text-muted">{formatAmount(left)}</span>{" "}
            {t.remaining}
          </span>
        </div>
        {vault.depositsOpen ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="deposit-amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder={maxDeposit > 0 ? formatAmount(maxDeposit) : "0"}
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                }
                className="nums pr-16"
              />
              <button
                type="button"
                onClick={() => setAmount(String(maxDeposit))}
                disabled={maxDeposit <= 0}
                className="type-label absolute top-1/2 right-2 -translate-y-1/2 rounded-sm px-2 py-1 text-cyan hover:bg-surface-3 disabled:text-text-faint focus-ring"
              >
                {t.max}
              </button>
            </div>
            <Button
              type="submit"
              disabled={!canDeposit}
              loading={pending.deposit}
            >
              {t.deposit}
            </Button>
          </div>
        ) : (
          <Badge variant="verified">{t.depositsClosed}</Badge>
        )}
      </form>

      <Button
        size="lg"
        disabled={!position || position.claimable <= 0}
        loading={pending.claim}
        onClick={onClaim}
        className="mt-auto"
      >
        <HandCoins aria-hidden="true" />
        {t.claim}
        {position && position.claimable > 0 && (
          <span className="nums">
            · {formatAmount(position.claimable)} {copy.units.token}
          </span>
        )}
      </Button>
      {position && position.claimed > 0 && (
        <p className="type-caption -mt-2 text-center text-text-muted">
          {t.claimed}:{" "}
          <span className="nums text-green">
            {formatAmount(position.claimed)} {copy.units.token}
          </span>
        </p>
      )}
    </Card>
  );
}
