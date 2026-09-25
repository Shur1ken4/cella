import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  note,
  children,
  className,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-border pt-10", className)}>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="type-h2 text-text">{title}</h2>
        {note && <p className="type-caption max-w-md text-text-faint">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** Small caption label above a demo row. */
export function DemoLabel({ children }: { children: React.ReactNode }) {
  return <p className="type-label mb-3 text-text-faint">{children}</p>;
}
