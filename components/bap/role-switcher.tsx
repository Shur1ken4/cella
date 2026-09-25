"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { ROLES, useRole } from "@/lib/role";
import type { Role } from "@/lib/data/types";
import { institutionIcons } from "./institution-icon";

const roleIcon: Record<Role, (typeof institutionIcons)[keyof typeof institutionIcons]> = {
  university: institutionIcons.university,
  lab: institutionIcons.lab,
  pharma: institutionIcons.pharma,
  investor: institutionIcons.investor,
};

/** Segmented control (radiogroup) for the role the visitor is viewing the demo as. */
export function RoleSwitcher({
  className,
  roles = ROLES,
}: {
  className?: string;
  roles?: Role[];
}) {
  const { role, setRole } = useRole();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + roles.length) % roles.length;
    setRole(roles[next]);
    refs.current[next]?.focus();
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span id="role-switcher-label" className="type-label text-text-faint">
        {copy.roles.label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="role-switcher-label"
        className="grid grid-cols-2 gap-1 rounded-md border border-border bg-surface-1 p-1 sm:inline-grid sm:grid-flow-col sm:grid-cols-none"
      >
        {roles.map((r, i) => {
          const Icon = roleIcon[r];
          const active = r === role;
          return (
            <button
              key={r}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active || (!roles.includes(role) && i === 0) ? 0 : -1}
              onClick={() => setRole(r)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-brand focus-ring",
                active
                  ? "border border-green-deep bg-green-tint text-green"
                  : "border border-transparent text-text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {copy.roles[r]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
