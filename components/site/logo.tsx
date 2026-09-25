import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";

/** Logo mark: a hexagon holding a passport booklet with a check — green on navy. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-8", className)} aria-hidden="true">
      <polygon
        points="20,2.5 35.2,11.25 35.2,28.75 20,37.5 4.8,28.75 4.8,11.25"
        className="fill-green-tint stroke-green"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* passport booklet */}
      <rect x="13" y="11" width="14" height="18" rx="2" className="fill-bg-deep stroke-green" strokeWidth="1.5" />
      <line x1="16" y1="14.5" x2="24" y2="14.5" className="stroke-green-deep" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M16.4 21.2l2.4 2.4 4.8-5"
        fill="none"
        className="stroke-green"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="font-heading text-base leading-tight font-semibold text-text">
          Biotech Asset <span className="text-green">Passport</span>
          <span className="sr-only"> — {copy.site.tagline}</span>
        </span>
      )}
    </span>
  );
}
