"use client";

import { useEffect, useRef } from "react";
import { colourGroups } from "@/lib/design/tokens";
import { DemoLabel } from "./section";

/** Shows the live value of a CSS variable, so this page never duplicates hex codes. */
function TokenValue({ name }: { name: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${name}`)
        .trim();
    }
  }, [name]);
  return (
    <p ref={ref} className="nums text-xs text-cyan">
      …
    </p>
  );
}

export function SwatchGrid() {
  return (
    <div className="flex flex-col gap-8">
      {colourGroups.map((group) => (
        <div key={group.title}>
          <DemoLabel>{group.title}</DemoLabel>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.tokens.map((t) => (
              <li key={t.name} className="overflow-hidden rounded-md border border-border bg-surface-1">
                <div
                  className="h-16 border-b border-border"
                  style={{ background: `var(--${t.name})` }}
                  aria-hidden="true"
                />
                <div className="p-3">
                  <p className="nums text-sm text-text">--{t.name}</p>
                  <TokenValue name={t.name} />
                  <p className="type-caption mt-1 text-text-muted">{t.use}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
