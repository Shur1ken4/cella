import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * `data-preview="hover|focus|active"` forces a state so the /design style guide
 * can show every state side by side. Real usage never sets it.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-brand",
    "focus-ring data-[preview=focus]:outline-2 data-[preview=focus]:outline-offset-2 data-[preview=focus]:outline-cyan",
    "active:translate-y-px data-[preview=active]:translate-y-px",
    "disabled:cursor-not-allowed disabled:opacity-45 aria-busy:cursor-progress",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_.lucide-arrow-right]:transition-transform [&_.lucide-arrow-right]:duration-150 hover:[&_.lucide-arrow-right]:translate-x-0.5",
  ],
  {
    variants: {
      variant: {
        primary: [
          "border-green-deep bg-green-fill text-on-green",
          "hover:enabled:bg-green-hover hover:enabled:shadow-glow data-[preview=hover]:bg-green-hover data-[preview=hover]:shadow-glow",
          "active:enabled:brightness-95 data-[preview=active]:brightness-95",
        ],
        secondary: [
          "border-border-strong bg-surface-2 text-text",
          "hover:enabled:bg-surface-3 data-[preview=hover]:bg-surface-3",
          "active:enabled:border-cyan data-[preview=active]:border-cyan",
        ],
        ghost: [
          "border-transparent bg-transparent text-text-muted",
          "hover:enabled:bg-surface-2 hover:enabled:text-text data-[preview=hover]:bg-surface-2 data-[preview=hover]:text-text",
          "active:enabled:bg-surface-1 data-[preview=active]:bg-surface-1",
        ],
        danger: [
          "border-danger/40 bg-danger-tint text-danger",
          "hover:enabled:border-danger hover:enabled:bg-danger/20 data-[preview=hover]:border-danger data-[preview=hover]:bg-danger/20",
          "active:enabled:bg-danger/25 data-[preview=active]:bg-danger/25",
        ],
        link: "border-transparent px-0 text-cyan underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        md: "h-10 px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Shows a spinner, disables the button and sets aria-busy. */
    loading?: boolean;
  };

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          )}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonProps };
