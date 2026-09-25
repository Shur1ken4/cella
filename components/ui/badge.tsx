import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import {
  CircleCheck,
  Clock,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-sm border px-2 text-xs font-medium whitespace-nowrap focus-ring [&>svg]:size-3.5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        verified: "border-green-deep/60 bg-green-tint text-green",
        pending: "border-dashed border-border-strong bg-surface-2 text-text-muted",
        warning: "border-warning/40 bg-warning-tint text-warning",
        info: "border-cyan/40 bg-cyan-tint text-cyan",
        neutral: "border-border bg-surface-2 text-text-muted",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const defaultIcons: Partial<Record<BadgeVariant, LucideIcon>> = {
  verified: CircleCheck,
  pending: Clock,
  warning: TriangleAlert,
  info: Info,
};

function Badge({
  className,
  variant = "neutral",
  asChild = false,
  icon,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    /** Override the default icon, or pass `false` to hide it. */
    icon?: LucideIcon | false;
  }) {
  const Comp = asChild ? Slot.Root : "span";
  const Icon = icon === false ? null : (icon ?? defaultIcons[variant ?? "neutral"]);

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {Icon && <Icon aria-hidden="true" />}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Badge, badgeVariants, type BadgeVariant };
