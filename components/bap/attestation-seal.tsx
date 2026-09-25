"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy, type InstitutionKind } from "@/lib/copy";
import { InstitutionIcon } from "./institution-icon";

type SealSize = "sm" | "md" | "lg";

type AttestationSealProps = {
  kind: InstitutionKind;
  institution: string;
  /** Event label, e.g. "Phase I complete" (used for the accessible name). */
  label?: string;
  status?: "attested" | "pending";
  size?: SealSize;
  /** Pop in with scale + glow on mount. */
  animate?: boolean;
  delay?: number;
  className?: string;
};

const sizes: Record<SealSize, { box: string; icon: string; check: string }> = {
  sm: { box: "size-16", icon: "size-5", check: "size-5 [&_svg]:size-3" },
  md: { box: "size-24", icon: "size-7", check: "size-7 [&_svg]:size-4" },
  lg: { box: "size-32", icon: "size-9", check: "size-9 [&_svg]:size-5" },
};

const RING = 38; // radius of the text ring in the 120×120 viewBox

export function AttestationSeal({
  kind,
  institution,
  label,
  status = "attested",
  size = "md",
  animate = true,
  delay = 0,
  className,
}: AttestationSealProps) {
  const pathId = `seal-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const attested = status === "attested";
  const s = sizes[size];
  const ringText = `${institution} • ${attested ? copy.seal.attested : copy.seal.pending} • `.toUpperCase();

  return (
    <motion.div
      role="img"
      aria-label={`${institution}${label ? `: ${label}` : ""} — ${attested ? copy.seal.attested : copy.seal.pending}`}
      initial={animate && attested ? { scale: 0.3, opacity: 0, rotate: -40 } : false}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 14, delay }}
      className={cn("relative shrink-0 rounded-full", s.box, attested && "shadow-glow", className)}
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <path
            id={pathId}
            d={`M 60,60 m -${RING},0 a ${RING},${RING} 0 1,1 ${RING * 2},0 a ${RING},${RING} 0 1,1 -${RING * 2},0`}
          />
        </defs>
        {/* serrated outer edge */}
        <circle
          cx="60"
          cy="60"
          r="56"
          className={attested ? "fill-green-tint stroke-green" : "fill-none stroke-border-strong"}
          strokeWidth="4"
          strokeDasharray={attested ? "2 3" : "6 6"}
        />
        <circle
          cx="60"
          cy="60"
          r="48"
          className={attested ? "fill-bg-deep stroke-green-deep" : "fill-bg stroke-border"}
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="29"
          className={attested ? "fill-none stroke-green-deep" : "fill-none stroke-border"}
          strokeWidth="1"
        />
        {size !== "sm" && (
          <text
            className={cn("font-mono", attested ? "fill-green" : "fill-text-faint")}
            fontSize="7.5"
            letterSpacing="1"
          >
            <textPath href={`#${pathId}`} textLength={2 * Math.PI * RING * 0.98} lengthAdjust="spacing">
              {ringText}
            </textPath>
          </text>
        )}
      </svg>

      <span className="absolute inset-0 grid place-items-center">
        <InstitutionIcon
          kind={kind}
          className={cn(s.icon, attested ? "text-green" : "text-text-faint")}
        />
      </span>

      {attested && (
        <motion.span
          initial={animate ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18, delay: delay + 0.25 }}
          className={cn(
            "absolute -right-0.5 -bottom-0.5 grid place-items-center rounded-full border-2 border-bg-deep bg-green text-bg-deep",
            s.check
          )}
        >
          <Check strokeWidth={3} aria-hidden="true" />
        </motion.span>
      )}
    </motion.div>
  );
}
