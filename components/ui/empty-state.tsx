import * as React from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { HexFrame } from "@/components/ui/hex-frame";

type EmptyStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon = Inbox,
  title = copy.empty.defaultTitle,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "@container rounded-lg border border-dashed border-border-strong bg-bg p-6",
        className
      )}
    >
      <div className="flex flex-col items-start gap-4 @lg:flex-row @lg:items-center">
        <HexFrame className="size-14 shrink-0 text-text-faint">
          <Icon className="size-6" aria-hidden="true" />
        </HexFrame>
        <div className="flex-1">
          <p className="font-heading text-base font-semibold text-text">
            {title}
          </p>
          {description && (
            <p className="type-small mt-1 text-text-muted">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
