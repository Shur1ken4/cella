import { cn } from "@/lib/utils";
import { radiusScale, spacingScale, typeScale } from "@/lib/design/tokens";
import { DemoLabel } from "./section";

export function TypeSpecimen() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col divide-y divide-border">
        {typeScale.map((t) => (
          <div key={t.cls} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6">
            <div>
              <p className="nums text-sm text-cyan">.{t.cls}</p>
              <p className="type-caption text-text-faint">{t.spec}</p>
            </div>
            <p className={cn(t.cls, "break-words text-text")}>
              {t.name === "Display" ? "Verified. Funded. Paid." : "Verified biotech assets, financeable on Solana."}
            </p>
          </div>
        ))}
        <div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6">
          <div>
            <p className="nums text-sm text-cyan">.nums</p>
            <p className="type-caption text-text-faint">JetBrains Mono · tabular</p>
          </div>
          <p className="nums text-3xl text-text">
            500,000.00 <span className="text-base text-text-muted">tUSDC</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <DemoLabel>Spacing (px)</DemoLabel>
          <ul className="flex flex-col gap-2">
            {spacingScale.map((s) => (
              <li key={s} className="flex items-center gap-3">
                <span className="nums w-8 text-right text-xs text-text-muted">{s}</span>
                <span className="h-2 rounded-full bg-cyan/60" style={{ width: s }} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <DemoLabel>Radius</DemoLabel>
          <ul className="grid grid-cols-2 gap-3">
            {radiusScale.map((r) => (
              <li key={r.cls} className="flex flex-col gap-2">
                <span className={cn("h-14 border border-border-strong bg-surface-2", r.cls)} />
                <span className="nums text-xs text-text">{r.name}</span>
                <span className="type-caption text-text-faint">{r.use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
