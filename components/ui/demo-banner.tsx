import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { SIMULATED } from "@/lib/data/source";

type DemoBannerProps = {
  /** Institution being signed as, e.g. "Northbridge University". */
  institution: string;
  hint?: boolean;
  className?: string;
};

export function DemoBanner({ institution, hint = true, className }: DemoBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "relative flex items-center gap-3 overflow-hidden rounded-md border border-warning/40 bg-warning-tint px-4 py-2.5",
        className
      )}
    >
      {/* hazard stripe on the left edge */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 bg-[repeating-linear-gradient(135deg,var(--warning)_0_6px,transparent_6px_12px)]"
      />
      <FlaskConical className="ml-1 size-4 shrink-0 text-warning" aria-hidden="true" />
      <div className="min-w-0">
        <p className="type-label text-warning">{copy.demo.banner(institution)}</p>
        {hint && (
          <p className="type-caption text-text-muted">
            {SIMULATED ? copy.demo.bannerHintSimulated : copy.demo.bannerHint}
          </p>
        )}
      </div>
    </div>
  );
}
