"use client";

import { motion } from "framer-motion";
import { easeBrand } from "@/lib/motion";

/** Page transition: every route fades + slides in (250ms). Disabled by reduced motion. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: easeBrand }}
    >
      {children}
    </motion.div>
  );
}
