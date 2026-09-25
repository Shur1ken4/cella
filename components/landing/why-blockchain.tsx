import { BadgeCheck, Fingerprint, Network, Zap } from "lucide-react";
import { copy } from "@/lib/copy";
import { HexFrame } from "@/components/ui/hex-frame";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const ICONS = [Network, BadgeCheck, Zap, Fingerprint];

export function WhyBlockchain() {
  const w = copy.home.whyChain;
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <Reveal>
        <h2 className="type-h2 text-text">{w.title}</h2>
        <p className="type-body mt-5 border-l-2 border-green-fill pl-5 text-text-muted">{w.body}</p>
      </Reveal>
      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {w.rows.map((r, i) => {
          const Icon = ICONS[i];
          return (
            <StaggerItem key={r.title} className="flex items-start gap-4 rounded-lg border border-border bg-surface-1 p-4 shadow-card">
              <HexFrame className="size-11 shrink-0 text-green" fillClassName="fill-green-tint">
                <Icon className="size-5" aria-hidden="true" />
              </HexFrame>
              <div>
                <p className="font-heading font-semibold text-text">{r.title}</p>
                <p className="type-small text-text-muted">{r.body}</p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
