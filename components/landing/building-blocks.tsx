"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Dna, FileText, Landmark, Wallet } from "lucide-react";
import { copy } from "@/lib/copy";
import { HexFrame } from "@/components/ui/hex-frame";
import { AttestationSeal } from "@/components/bap/attestation-seal";
import { CoinFlow } from "@/components/bap/coin-flow";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

/** Documents orbit into a passport hexagon. */
function PassportMini() {
  return (
    <div className="relative grid size-36 place-items-center">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {[0, 120, 240].map((deg) => (
          <span
            key={deg}
            className="absolute top-1/2 left-1/2 grid size-8 place-items-center rounded-sm border border-border-strong bg-surface-1 text-cyan shadow-card"
            style={{ transform: `rotate(${deg}deg) translate(60px) rotate(-${deg}deg) translate(-50%, -50%)` }}
          >
            <FileText className="size-4" />
          </span>
        ))}
      </motion.div>
      <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>
        <HexFrame className="size-20 text-green" fillClassName="fill-green-tint">
          <Dna className="size-8" />
        </HexFrame>
      </motion.div>
    </div>
  );
}

/** A seal that stamps down again every few seconds. */
function SealMini() {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setRun((r) => r + 1), 3600);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <div className="grid size-36 place-items-center">
      <AttestationSeal key={run} kind="lab" institution={copy.institutions.lab.name} size="lg" />
    </div>
  );
}

/** Coins flowing from a wallet into the vault. */
function VaultMini() {
  return (
    <div className="relative h-36 w-full max-w-60">
      <CoinFlow from={{ x: 14, y: 55 }} to={{ x: 86, y: 55 }} count={4} arc={24} className="absolute inset-0" />
      {[
        { x: 14, Icon: Wallet },
        { x: 86, Icon: Landmark },
      ].map(({ x, Icon }) => (
        <span key={x} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: "55%" }}>
          <HexFrame className="size-14 text-cyan" fillClassName="fill-cyan-tint">
            <Icon className="size-5" />
          </HexFrame>
        </span>
      ))}
    </div>
  );
}

const visuals = [PassportMini, SealMini, VaultMini];

export function BuildingBlocks() {
  const items = copy.home.steps.items;
  return (
    <Stagger className="grid gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
      {items.map((item, i) => {
        const Visual = visuals[i];
        return [
          <StaggerItem key={item.title} className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface-1 p-6 text-center shadow-card hover-lift">
            <Visual />
            <div>
              <p className="type-label text-text-faint">0{i + 1}</p>
              <h3 className="type-h3 text-text">{item.title}</h3>
              <p className="type-small mt-2 text-text-muted">{item.body}</p>
            </div>
          </StaggerItem>,
          i < items.length - 1 && (
            <StaggerItem key={`arrow-${i}`} className="hidden items-center md:flex" aria-hidden="true">
              <ArrowRight className="size-6 text-green" />
            </StaggerItem>
          ),
        ];
      })}
    </Stagger>
  );
}
