import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-sm border border-border-strong bg-surface-2 px-3 py-2 text-base text-text transition-colors duration-150 ease-brand focus-ring placeholder:text-text-faint hover:border-cyan/60 focus-visible:border-cyan disabled:cursor-not-allowed disabled:opacity-45 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text aria-invalid:border-danger md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
