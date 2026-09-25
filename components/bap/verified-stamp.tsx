"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Hourglass } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";

type VerifiedStampProps = {
  verified?: boolean;
  /** Play the stamp-down animation on mount. */
  animate?: boolean;
  delay?: number;
  className?: string;
};

/** Rubber-stamp style "VERIFIED ONCHAIN" mark used on the passport card. */
export function VerifiedStamp({
  verified = true,
  animate = true,
  delay = 0.4,
  className,
}: VerifiedStampProps) {
  const Icon = verified ? BadgeCheck : Hourglass;

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 1.8, rotate: -28 } : false}
      animate={{ opacity: 1, scale: 1, rotate: -10 }}
      transition={{ type: "spring", stiffness: 420, damping: 22, delay }}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border-2 px-3 py-1.5",
        verified
          ? "border-green bg-bg-deep/60 text-green shadow-glow"
          : "border-dashed border-border-strong bg-bg-deep/60 text-text-muted",
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="type-label">
        {verified ? copy.passport.verifiedStamp : copy.passport.pendingStamp}
      </span>
    </motion.div>
  );
}
