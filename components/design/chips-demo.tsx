"use client";

import { useState } from "react";
import { AddressChip } from "@/components/ui/address-chip";
import { HashChip, type HashStatus } from "@/components/ui/hash-chip";
import { MOCK_ADDRESS, MOCK_HASH, MOCK_SIGNATURE } from "@/lib/design/mock";
import { DemoLabel } from "./section";

const cycle: HashStatus[] = ["idle", "match", "mismatch"];

export function ChipsDemo() {
  const [status, setStatus] = useState<HashStatus>("idle");

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <DemoLabel>AddressChip</DemoLabel>
        <AddressChip value={MOCK_ADDRESS} />
        <AddressChip value={MOCK_ADDRESS} label="Vault" chars={6} />
        <AddressChip value={MOCK_SIGNATURE} kind="tx" label="Tx" />
      </div>
      <div className="flex flex-col gap-3">
        <DemoLabel>HashChip — idle · match · mismatch</DemoLabel>
        <HashChip hash={MOCK_HASH} />
        <HashChip hash={MOCK_HASH} status="match" />
        <HashChip hash={MOCK_HASH} status="mismatch" />
        <DemoLabel>Interactive (click the shield to cycle)</DemoLabel>
        <HashChip
          hash={MOCK_HASH}
          status={status}
          onVerify={() => setStatus(cycle[(cycle.indexOf(status) + 1) % cycle.length])}
        />
      </div>
    </div>
  );
}
