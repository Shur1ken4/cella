"use client";

import { motion } from "framer-motion";
import { Dna } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { HexFrame } from "@/components/ui/hex-frame";
import { HexPattern } from "./hex-pattern";
import { VerifiedStamp } from "./verified-stamp";

export type PassportCardProps = {
  name: string;
  code: string;
  stage: string;
  owner: string;
  modality?: string;
  area?: string;
  attestationCount?: number;
  verified?: boolean;
  /** Animate the card and stamp in on mount. */
  animate?: boolean;
  className?: string;
};

/** Machine-readable-zone style line, like the bottom of a real passport. */
function mrz(code: string, name: string) {
  const clean = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "<");
  return `P<${clean(code)}<<${clean(name)}`.padEnd(44, "<").slice(0, 44);
}

export function PassportCard({
  name,
  code,
  stage,
  owner,
  modality,
  area,
  attestationCount,
  verified = true,
  animate = true,
  className,
}: PassportCardProps) {
  const fields: [string, string | undefined][] = [
    [copy.passport.fields.stage, stage],
    [copy.passport.fields.owner, owner],
    [copy.passport.fields.modality, modality],
    [copy.passport.fields.area, area],
  ];

  return (
    // Container query: keep the ID-card ratio only when there is room for the content.
    <div data-theme="dark" className={cn("@container w-full max-w-[520px] text-text", className)}>
      <motion.article
        initial={animate ? { opacity: 0, y: 16, rotateX: 8 } : false}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        aria-label={`${copy.passport.title}: ${name} (${code})`}
        className={cn(
          "group/passport relative isolate w-full overflow-hidden rounded-xl border bg-surface-1 p-5 shadow-pop @[440px]:aspect-[1.586] @[440px]:p-6",
          verified ? "border-green-deep/70" : "border-border-strong"
        )}
      >
        {/* layered background: gradient, honeycomb, holographic sheen */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_0%_0%,var(--surface-3)_0%,transparent_55%),radial-gradient(90%_80%_at_100%_100%,var(--green-tint)_0%,transparent_60%)]"
        />
        <HexPattern className="-z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-(image:--holo-sheen) bg-size-[250%_100%] opacity-70 mix-blend-screen motion-safe:animate-shimmer"
        />

        <div className="flex h-full flex-col gap-4">
          {/* header */}
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <HexFrame
                className="size-9 text-green"
                fillClassName="fill-green-tint"
              >
                <Dna className="size-4" aria-hidden="true" />
              </HexFrame>
              <div className="leading-tight">
                <p className="type-label text-text-muted">
                  {copy.passport.title}
                </p>
                <p className="type-caption text-text-faint">Solana · devnet</p>
              </div>
            </div>
            {/* the "chip" of an ID card */}
            <div
              aria-hidden="true"
              className="grid h-8 w-11 grid-cols-3 gap-px overflow-hidden rounded-sm border border-green-deep/60 bg-green-deep/30 p-px"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="bg-surface-2/80" />
              ))}
            </div>
          </header>

          {/* identity */}
          <div>
            <h3 className="type-h2 text-text">{name}</h3>
            <p className="nums mt-0.5 text-sm tracking-[0.2em] text-cyan">
              {code}
            </p>
          </div>

          {/* fields */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {fields
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="type-label text-text-faint">{label}</dt>
                  <dd className="truncate text-sm text-text">{value}</dd>
                </div>
              ))}
          </dl>

          {/* footer: MRZ + stamp */}
          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="min-w-0">
              {attestationCount !== undefined && (
                <p className="type-caption mb-1 text-text-muted">
                  <span className="nums text-text">{attestationCount}</span>{" "}
                  {copy.passport.fields.attestations.toLowerCase()}
                </p>
              )}
              <p
                aria-hidden="true"
                className="nums truncate text-xs tracking-[0.18em] text-text-faint"
              >
                {mrz(code, name)}
              </p>
            </div>
            <VerifiedStamp
              verified={verified}
              animate={animate}
              className="shrink-0"
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}
