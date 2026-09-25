"use client";

import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VaultMeter } from "@/components/bap/vault-meter";
import { DemoLabel } from "./section";

const TARGET = 500_000;

export function VaultMeterDemo() {
  const [raised, setRaised] = useState(150_000);

  return (
    <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-start gap-4">
        <DemoLabel>Interactive — tick marks at the tranche split (50%)</DemoLabel>
        <VaultMeter raised={raised} target={TARGET} markers={[0.5]} />
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setRaised((r) => Math.min(r + 50_000, TARGET))}>
            <Plus aria-hidden="true" /> Deposit 50,000
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setRaised(0)}>
            <RotateCcw aria-hidden="true" /> Reset
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-8">
        <div>
          <DemoLabel>Empty</DemoLabel>
          <VaultMeter raised={0} target={TARGET} size={160} />
        </div>
        <div>
          <DemoLabel>Target reached</DemoLabel>
          <VaultMeter raised={TARGET} target={TARGET} size={160} />
        </div>
      </div>
    </div>
  );
}
