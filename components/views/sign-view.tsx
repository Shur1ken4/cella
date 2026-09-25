"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, PenLine, RotateCcw, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { useRole } from "@/lib/role";
import { sha256Hex } from "@/lib/hash";
import {
  dataSource,
  useAssets,
  useAttestations,
  useTxAction,
} from "@/lib/data/hooks";
import {
  ASSET_SCHEMAS,
  ROLE_INSTITUTION,
  SCHEMA_SIGNER,
  canSign,
} from "@/lib/data/schemas";
import type { AssetSchemaKey } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DemoBanner } from "@/components/ui/demo-banner";
import { FileDrop } from "@/components/ui/file-drop";
import { HashChip } from "@/components/ui/hash-chip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StepSection } from "@/components/ui/step-section";
import { AttestationSeal } from "@/components/bap/attestation-seal";
import { EventPicker } from "@/components/bap/event-picker";
import { RoleSwitcher } from "@/components/bap/role-switcher";
import { HexFrame } from "@/components/ui/hex-frame";
import { InstitutionIcon } from "@/components/bap/institution-icon";

const isAssetSchema = (s: string | null): s is AssetSchemaKey =>
  !!s && (ASSET_SCHEMAS as string[]).includes(s);

export function SignView() {
  const params = useSearchParams();
  const { role } = useRole();
  const assets = useAssets();

  const [assetId, setAssetId] = useState<string>(
    params.get("asset") ?? "BAP-001"
  );
  const eventParam = params.get("event");
  const [schema, setSchema] = useState<AssetSchemaKey | null>(
    isAssetSchema(eventParam) ? eventParam : null
  );
  const [doc, setDoc] = useState<{ name: string; hash: string } | null>(null);
  const [note, setNote] = useState("");
  const [signedNow, setSignedNow] = useState<AssetSchemaKey | null>(null);

  const atts = useAttestations(assetId);
  const signed = useMemo(
    () => new Set((atts.data ?? []).map((a) => a.schemaKey as string)),
    [atts.data]
  );

  const sign = useTxAction(
    (a: {
      assetId: string;
      schema: AssetSchemaKey;
      docHash?: string;
      note?: string;
    }) => dataSource().signAttestation(a.assetId, a.schema, a.docHash, a.note),
    copy.txLabels.sign
  );

  const institutionRole = role === "investor" ? null : ROLE_INSTITUTION[role];
  const institution = institutionRole
    ? copy.institutions[institutionRole]
    : null;
  const canSignSelected =
    !!schema && canSign(role, schema) && !signed.has(schema);
  const previewSchema = signedNow ?? schema;

  const submit = () => {
    if (!schema || !canSignSelected) return;
    sign.mutate(
      { assetId, schema, docHash: doc?.hash, note },
      {
        onSuccess: () => {
          setSignedNow(schema);
          setDoc(null);
          setNote("");
        },
      }
    );
  };

  const resetFlow = () => {
    setSignedNow(null);
    setSchema(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h1 className="type-h1 text-text">{copy.sign.title}</h1>
          <p className="type-body mt-2 text-text-muted">{copy.sign.subtitle}</p>
        </div>
        <RoleSwitcher roles={["university", "lab", "pharma"]} />
      </div>

      {institution ? (
        <DemoBanner institution={institution.name} className="mt-8" />
      ) : (
        <p className="type-small mt-8 rounded-md border border-warning/40 bg-warning-tint px-4 py-3 text-warning">
          {copy.sign.investorHint}
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-10">
          <StepSection n={1} title={copy.sign.steps.asset} done={!!assetId}>
            {assets.isPending ? (
              <Skeleton className="h-16" />
            ) : (
              <div
                role="radiogroup"
                aria-label={copy.sign.steps.asset}
                className="grid gap-2 sm:grid-cols-2"
              >
                {assets.data?.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={a.id === assetId}
                    onClick={() => {
                      setAssetId(a.id);
                      setSchema(null);
                      setSignedNow(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-md border p-3 text-left focus-ring",
                      a.id === assetId
                        ? "border-green-deep bg-green-tint"
                        : "border-border-strong bg-surface-2 hover:bg-surface-3"
                    )}
                  >
                    <HexFrame
                      className="size-9 shrink-0 text-green"
                      fillClassName="fill-bg"
                    >
                      <InstitutionIcon kind="owner" className="size-4" />
                    </HexFrame>
                    <span>
                      <span className="block text-sm font-medium text-text">
                        {a.passport.name}
                      </span>
                      <span className="nums block text-xs text-cyan">
                        {a.passport.code}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </StepSection>

          <StepSection n={2} title={copy.sign.steps.event} done={!!schema}>
            {atts.isPending ? (
              <Skeleton className="h-40" />
            ) : (
              <EventPicker
                role={role}
                signed={signed}
                value={schema}
                onChange={(s) => {
                  setSchema(s);
                  setSignedNow(null);
                }}
              />
            )}
          </StepSection>

          <StepSection
            n={3}
            title={copy.sign.steps.evidence}
            aside={
              <span className="type-caption text-text-faint">
                ({copy.sign.optional})
              </span>
            }
            done={!!doc}
          >
            <div className="flex flex-col gap-4">
              {doc ? (
                <div className="flex flex-wrap items-center gap-3">
                  <HashChip hash={doc.hash} />
                  <span className="type-caption truncate text-text-muted">
                    {doc.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={copy.create.remove}
                    onClick={() => setDoc(null)}
                  >
                    <X aria-hidden="true" />
                  </Button>
                </div>
              ) : (
                <FileDrop
                  onFiles={async ([f]) =>
                    setDoc({ name: f.name, hash: await sha256Hex(f) })
                  }
                  label={copy.sign.dropLabel}
                  hint={copy.sign.dropHint}
                />
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="note">
                  {copy.sign.noteLabel}{" "}
                  <span className="text-text-faint">
                    ({copy.sign.optional})
                  </span>
                </Label>
                <Input
                  id="note"
                  value={note}
                  maxLength={120}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={copy.sign.notePlaceholder}
                />
              </div>
            </div>
          </StepSection>

          <StepSection n={4} title={copy.sign.steps.sign} done={!!signedNow}>
            <Button
              size="lg"
              className="w-full sm:w-auto"
              disabled={!canSignSelected}
              loading={sign.isPending}
              onClick={submit}
            >
              <PenLine aria-hidden="true" />
              {canSignSelected || sign.isPending
                ? copy.sign.signButton
                : copy.sign.pickEventFirst}
            </Button>
          </StepSection>
        </div>

        {/* live preview */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card
            variant={signedNow ? "verified" : "raised"}
            className="items-center text-center"
          >
            <p className="type-label self-start text-text-faint">
              {copy.sign.preview}
            </p>
            <div className="relative grid place-items-center">
              {signedNow &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={`${signedNow}-ring-${i}`}
                    aria-hidden="true"
                    className="absolute size-32 rounded-full border-2 border-green-fill"
                    initial={{ scale: 0.7, opacity: 0.7 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{
                      duration: 1.1,
                      delay: 0.25 + i * 0.18,
                      ease: "easeOut",
                    }}
                  />
                ))}
              {previewSchema ? (
                <AttestationSeal
                  key={`${previewSchema}-${signedNow ? "done" : "pending"}`}
                  kind={SCHEMA_SIGNER[previewSchema]}
                  institution={
                    copy.institutions[SCHEMA_SIGNER[previewSchema]].name
                  }
                  label={copy.schemas[previewSchema]}
                  status={signedNow ? "attested" : "pending"}
                  size="lg"
                />
              ) : (
                <AttestationSeal
                  kind={institutionRole ?? "lab"}
                  institution={institution?.name ?? copy.institutions.lab.name}
                  status="pending"
                  size="lg"
                />
              )}
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-text">
                {signedNow
                  ? copy.sign.successTitle
                  : previewSchema
                    ? copy.schemas[previewSchema]
                    : copy.sign.pickEventFirst}
              </p>
              <p className="nums text-xs text-cyan">{assetId}</p>
            </div>
            {signedNow && (
              <div className="flex w-full flex-col gap-2">
                <Button asChild>
                  <Link href={`/asset/${assetId}`}>
                    {copy.sign.viewPassport} <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="ghost" onClick={resetFlow}>
                  <RotateCcw aria-hidden="true" /> {copy.sign.signAnother}
                </Button>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
