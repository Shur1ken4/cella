import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { Badge } from "@/components/ui/badge";
import { HexFrame } from "@/components/ui/hex-frame";

/** Greyed-out placeholder tile for assets that are not in the demo yet. */
export function ComingSoonCard({ name, area, className }: { name: string; area: string; className?: string }) {
  return (
    <div
      aria-disabled="true"
      className={cn(
        "flex flex-col gap-5 rounded-lg border border-dashed border-border-strong bg-bg p-5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <HexFrame className="size-11 shrink-0 text-border-strong" fillClassName="fill-bg">
          <Lock className="size-4 text-text-faint" aria-hidden="true" />
        </HexFrame>
        <div>
          <h3 className="font-heading text-lg leading-tight font-semibold text-text-muted">{name}</h3>
          <p className="type-caption text-text-faint">{area}</p>
        </div>
      </div>
      <div className="flex gap-1" aria-hidden="true">
        {copy.stages.map((s) => (
          <span key={s} className="h-1.5 flex-1 rounded-full bg-surface-2" />
        ))}
      </div>
      <Badge variant="pending" className="mt-auto">
        {copy.dashboard.comingSoon}
      </Badge>
    </div>
  );
}
