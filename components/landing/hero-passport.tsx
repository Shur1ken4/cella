"use client";

import { motion } from "framer-motion";
import { copy, type InstitutionKind } from "@/lib/copy";
import { PassportCard } from "@/components/bap/passport-card";
import { AttestationSeal } from "@/components/bap/attestation-seal";

const SEALS: { kind: InstitutionKind; className: string; delay: number }[] = [
  { kind: "university", className: "-top-8 -left-6", delay: 0.9 },
  { kind: "lab", className: "right-0 top-1/3", delay: 1.25 },
  { kind: "pharma", className: "-bottom-8 left-1/4", delay: 1.6 },
];

/** Hero visual: the passport card floating, with institution seals popping in around it. */
export function HeroPassport() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] px-6 py-10">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <PassportCard
          name={copy.asset.name}
          code={copy.asset.code}
          stage={copy.stages[3]}
          owner={copy.institutions.owner.name}
          modality={copy.asset.modality}
          area={copy.asset.area}
          attestationCount={3}
        />
      </motion.div>
      {SEALS.map((s) => (
        <div key={s.kind} className={`absolute ${s.className}`}>
          <AttestationSeal kind={s.kind} institution={copy.institutions[s.kind].name} size="md" delay={s.delay} />
        </div>
      ))}
    </div>
  );
}
