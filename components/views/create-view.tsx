"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText, Plus, Trash2 } from "lucide-react";
import { copy } from "@/lib/copy";
import { sha256Hex } from "@/lib/hash";
import { dataSource, useTxAction } from "@/lib/data/hooks";
import type { CreatePassportInput, InstitutionRole } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDrop } from "@/components/ui/file-drop";
import { HashChip } from "@/components/ui/hash-chip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PassportCard } from "@/components/bap/passport-card";
import { StepPills } from "@/components/bap/step-pills";

type HolderRole = Exclude<InstitutionRole, "kyc">;
type Holder = { name: string; role: HolderRole; right: string };
type Doc = { label: string; sha256: string; file: string };

const c = copy.create;
const CODE_RE = /^[A-Za-z0-9-]{1,16}$/;

function Field({ id, label, children, error }: { id: string; label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="type-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function CreateView() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [basics, setBasics] = useState({ name: "", code: "", modality: "", area: "", stage: 0 });
  const [holders, setHolders] = useState<Holder[]>([{ name: "", role: "owner", right: "" }]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const create = useTxAction((input: CreatePassportInput) => dataSource().createPassport(input), copy.txLabels.create);

  const errors = {
    name: basics.name.trim() ? undefined : c.errors.nameRequired,
    code: CODE_RE.test(basics.code.trim()) ? undefined : c.errors.codeFormat,
    holders: holders.some((h) => h.name.trim()) ? undefined : c.errors.holderRequired,
  };
  const stepValid = [!errors.name && !errors.code, !errors.holders, true, true][step];

  const next = () => {
    if (!stepValid) return setShowErrors(true);
    setShowErrors(false);
    setStep((s) => Math.min(s + 1, 3));
  };

  const submit = () =>
    create.mutate(
      {
        ...basics,
        rightsHolders: holders.filter((h) => h.name.trim()),
        documents: docs.map(({ label, sha256 }) => ({ label, sha256 })),
      },
      { onSuccess: (res) => router.push(`/asset/${res.passportId}`) }
    );

  const addFiles = async (files: File[]) => {
    const hashed = await Promise.all(
      files.map(async (f) => ({ file: f.name, label: f.name.replace(/\.[^.]+$/, ""), sha256: await sha256Hex(f) }))
    );
    setDocs((d) => [...d, ...hashed]);
  };

  const setHolder = (i: number, patch: Partial<Holder>) =>
    setHolders((hs) => hs.map((h, j) => (j === i ? { ...h, ...patch } : h)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="type-h1 text-text">{c.title}</h1>
      <p className="type-body mt-2 text-text-muted">{c.subtitle}</p>
      <StepPills className="mt-6" steps={c.steps} done={c.steps.map((_, i) => i < step)} />

      <Card className="mt-8" variant="raised">
        <h2 className="type-h3 text-text">{c.steps[step]}</h2>

        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label={c.fields.name} error={showErrors ? errors.name : undefined}>
              <Input
                id="name"
                value={basics.name}
                placeholder={c.fields.namePlaceholder}
                aria-invalid={showErrors && !!errors.name}
                aria-describedby={showErrors && errors.name ? "name-error" : undefined}
                onChange={(e) => setBasics({ ...basics, name: e.target.value })}
              />
            </Field>
            <Field id="code" label={c.fields.code} error={showErrors ? errors.code : undefined}>
              <Input
                id="code"
                className="nums uppercase"
                value={basics.code}
                maxLength={16}
                placeholder={c.fields.codePlaceholder}
                aria-invalid={showErrors && !!errors.code}
                aria-describedby={showErrors && errors.code ? "code-error" : undefined}
                onChange={(e) => setBasics({ ...basics, code: e.target.value })}
              />
            </Field>
            <Field id="modality" label={c.fields.modality}>
              <Input
                id="modality"
                value={basics.modality}
                placeholder={c.fields.modalityPlaceholder}
                onChange={(e) => setBasics({ ...basics, modality: e.target.value })}
              />
            </Field>
            <Field id="area" label={c.fields.area}>
              <Input
                id="area"
                value={basics.area}
                placeholder={c.fields.areaPlaceholder}
                onChange={(e) => setBasics({ ...basics, area: e.target.value })}
              />
            </Field>
            <Field id="stage" label={c.fields.stage}>
              <Select value={String(basics.stage)} onValueChange={(v) => setBasics({ ...basics, stage: Number(v) })}>
                <SelectTrigger id="stage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {copy.stages.map((s, i) => (
                    <SelectItem key={s} value={String(i)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            {holders.map((h, i) => (
              <fieldset key={i} className="grid gap-3 rounded-md border border-border bg-surface-1 p-4 sm:grid-cols-[1.4fr_1fr_1.4fr_auto] sm:items-end">
                <legend className="sr-only">{`${c.steps[1]} ${i + 1}`}</legend>
                <Field id={`holder-name-${i}`} label={c.fields.holderName}>
                  <Input id={`holder-name-${i}`} value={h.name} onChange={(e) => setHolder(i, { name: e.target.value })} />
                </Field>
                <Field id={`holder-role-${i}`} label={c.fields.holderRole}>
                  <Select value={h.role} onValueChange={(v) => setHolder(i, { role: v as HolderRole })}>
                    <SelectTrigger id={`holder-role-${i}`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(c.roleOptions) as HolderRole[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {c.roleOptions[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id={`holder-right-${i}`} label={c.fields.holderRight}>
                  <Input
                    id={`holder-right-${i}`}
                    value={h.right}
                    placeholder={c.fields.holderRightPlaceholder}
                    onChange={(e) => setHolder(i, { right: e.target.value })}
                  />
                </Field>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${c.remove} ${h.name || i + 1}`}
                  disabled={holders.length === 1}
                  onClick={() => setHolders((hs) => hs.filter((_, j) => j !== i))}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </fieldset>
            ))}
            {showErrors && errors.holders && <p className="type-caption text-danger">{errors.holders}</p>}
            <Button variant="secondary" className="self-start" onClick={() => setHolders((hs) => [...hs, { name: "", role: "university", right: "" }])}>
              <Plus aria-hidden="true" /> {c.addHolder}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <FileDrop multiple onFiles={addFiles} label={c.docsDrop} hint={c.docsHint} />
            <ul className="flex flex-col gap-3">
              {docs.map((d, i) => (
                <li key={`${d.sha256}-${i}`} className="flex flex-col gap-3 rounded-md border border-border bg-surface-1 p-3 sm:flex-row sm:items-center">
                  <FileText className="hidden size-5 shrink-0 text-text-faint sm:block" aria-hidden="true" />
                  <Input
                    aria-label={`${c.docLabel}: ${d.file}`}
                    value={d.label}
                    onChange={(e) => setDocs((ds) => ds.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                    className="sm:max-w-64"
                  />
                  <HashChip hash={d.sha256} />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="sm:ml-auto"
                    aria-label={`${c.remove} ${d.label}`}
                    onClick={() => setDocs((ds) => ds.filter((_, j) => j !== i))}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <PassportCard
              name={basics.name}
              code={basics.code.toUpperCase()}
              stage={copy.stages[basics.stage]}
              owner={holders.find((h) => h.role === "owner")?.name || holders[0]?.name || "—"}
              modality={basics.modality || undefined}
              area={basics.area || undefined}
              attestationCount={0}
              verified={false}
            />
            <dl className="flex flex-col gap-4 text-sm">
              <div>
                <dt className="type-label text-text-faint">{c.review.holders}</dt>
                <dd className="mt-1 text-text">
                  {holders
                    .filter((h) => h.name.trim())
                    .map((h) => `${h.name} (${c.roleOptions[h.role]}${h.right ? ` · ${h.right}` : ""})`)
                    .join(", ")}
                </dd>
              </div>
              <div>
                <dt className="type-label text-text-faint">{c.review.documents}</dt>
                <dd className="mt-1 text-text">{docs.length ? docs.map((d) => d.label).join(", ") : c.review.none}</dd>
              </div>
              <p className="type-caption text-text-muted">{c.mockNote}</p>
            </dl>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft aria-hidden="true" /> {c.back}
          </Button>
          {step < 3 ? (
            <Button onClick={next}>
              {c.next} <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button size="lg" loading={create.isPending} onClick={submit}>
              {c.create}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
