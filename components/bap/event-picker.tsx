"use client";

import { useRef, type KeyboardEvent } from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { ASSET_SCHEMAS, SCHEMA_SIGNER, canSign } from "@/lib/data/schemas";
import type { AssetSchemaKey, Role } from "@/lib/data/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InstitutionIcon } from "./institution-icon";

type EventPickerProps = {
  role: Role;
  signed: Set<string>;
  value: AssetSchemaKey | null;
  onChange: (schema: AssetSchemaKey) => void;
};

function signerLabel(schema: AssetSchemaKey) {
  const r = SCHEMA_SIGNER[schema];
  return r === "university" || r === "lab" || r === "pharma" ? copy.roles[r] : copy.institutions[r].role;
}

/**
 * Radio list of asset events. Only events the current institution may sign are
 * selectable; others are locked with a tooltip explaining who can sign them.
 */
export function EventPicker({ role, signed, value, onChange }: EventPickerProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectable = (s: AssetSchemaKey) => canSign(role, s) && !signed.has(s);

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    for (let step = 1; step <= ASSET_SCHEMAS.length; step++) {
      const j = (i + dir * step + ASSET_SCHEMAS.length) % ASSET_SCHEMAS.length;
      if (selectable(ASSET_SCHEMAS[j])) {
        onChange(ASSET_SCHEMAS[j]);
        refs.current[j]?.focus();
        return;
      }
    }
  };

  const firstSelectable = ASSET_SCHEMAS.findIndex(selectable);

  return (
    <div role="radiogroup" aria-label={copy.sign.steps.event} className="grid gap-2 sm:grid-cols-2">
      {ASSET_SCHEMAS.map((schema, i) => {
        const allowed = canSign(role, schema);
        const already = signed.has(schema);
        const active = value === schema;
        const tabbable = active || (value === null && i === firstSelectable);
        const option = (
          <button
            key={schema}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={!selectable(schema) || undefined}
            tabIndex={tabbable ? 0 : -1}
            onClick={() => selectable(schema) && onChange(schema)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors duration-150 ease-brand focus-ring",
              active && "border-green-deep bg-green-tint",
              !active && selectable(schema) && "border-border-strong bg-surface-2 hover:bg-surface-3",
              !selectable(schema) && "cursor-not-allowed border-border bg-bg"
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-sm",
                already ? "bg-green-tint text-green" : allowed ? "bg-surface-3 text-text" : "bg-surface-1 text-text-faint"
              )}
              aria-hidden="true"
            >
              {already ? (
                <Check className="size-4" />
              ) : allowed ? (
                <InstitutionIcon kind={SCHEMA_SIGNER[schema]} className="size-4" />
              ) : (
                <Lock className="size-4" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block text-sm font-medium", selectable(schema) || active ? "text-text" : "text-text-muted")}>
                {copy.schemas[schema]}
              </span>
              <span className="type-caption block text-text-faint">
                {already ? copy.sign.alreadySigned : signerLabel(schema)}
              </span>
            </span>
            {active && <span className="size-2.5 shrink-0 rounded-full bg-green-fill shadow-glow" aria-hidden="true" />}
          </button>
        );

        return !allowed && !already ? (
          <Tooltip key={schema}>
            <TooltipTrigger asChild>{option}</TooltipTrigger>
            <TooltipContent>{copy.sign.lockedTooltip(signerLabel(schema))}</TooltipContent>
          </Tooltip>
        ) : (
          option
        );
      })}
    </div>
  );
}
