import { ExternalLink } from "lucide-react";
import { copy } from "@/lib/copy";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

/** Three cited statistics about drug development. */
export function ProblemStats() {
  const pr = copy.home.problem;
  return (
    <Stagger className="grid gap-4 md:grid-cols-3">
      {pr.stats.map((s) => (
        <StaggerItem key={s.value} className="flex flex-col gap-3 rounded-lg border border-border bg-surface-1 p-6 shadow-card">
          <p className="nums text-5xl leading-none font-medium tracking-tight whitespace-nowrap text-text lg:text-6xl">{s.value}</p>
          <p className="type-body text-text-muted">{s.label}</p>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="type-caption mt-auto inline-flex items-center gap-1 text-cyan hover:underline focus-ring"
          >
            {pr.sourceLabel}: {s.source}
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
