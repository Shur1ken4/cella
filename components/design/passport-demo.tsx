"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PassportCard } from "@/components/bap/passport-card";
import { copy } from "@/lib/copy";
import { DemoLabel } from "./section";

export function PassportDemo() {
  const [run, setRun] = useState(0);
  const a = copy.asset;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <DemoLabel>Verified</DemoLabel>
          <PassportCard
            key={`v${run}`}
            name={a.name}
            code={a.code}
            stage={copy.stages[3]}
            owner={copy.institutions.owner.name}
            modality={a.modality}
            area={a.area}
            attestationCount={2}
          />
        </div>
        <div>
          <DemoLabel>Pending (no signatures yet)</DemoLabel>
          <PassportCard
            key={`p${run}`}
            name="Candidate Y"
            code="BAP-002"
            stage={copy.stages[0]}
            owner={copy.institutions.owner.name}
            verified={false}
            attestationCount={0}
          />
        </div>
      </div>
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setRun((r) => r + 1)}>
        <RotateCcw aria-hidden="true" /> Replay animation
      </Button>
    </div>
  );
}
