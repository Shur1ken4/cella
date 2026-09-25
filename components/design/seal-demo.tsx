"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttestationSeal } from "@/components/bap/attestation-seal";
import { copy, type InstitutionKind } from "@/lib/copy";
import { DemoLabel } from "./section";

const kinds: InstitutionKind[] = ["university", "lab", "pharma", "kyc"];

export function SealDemo() {
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <DemoLabel>Attested — one per signer</DemoLabel>
        <div className="flex flex-wrap items-center gap-8">
          {kinds.map((k, i) => (
            <AttestationSeal
              key={`${k}-${run}`}
              kind={k}
              institution={copy.institutions[k].name}
              size="lg"
              delay={i * 0.12}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <DemoLabel>Pending</DemoLabel>
          <AttestationSeal kind="lab" institution={copy.institutions.lab.name} status="pending" size="lg" />
        </div>
        <div>
          <DemoLabel>Sizes — sm · md · lg</DemoLabel>
          <div className="flex items-center gap-6">
            {(["sm", "md", "lg"] as const).map((s) => (
              <AttestationSeal key={`${s}-${run}`} kind="lab" institution={copy.institutions.lab.name} size={s} />
            ))}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setRun((r) => r + 1)}>
        <RotateCcw aria-hidden="true" /> Replay pop-in
      </Button>
    </div>
  );
}
