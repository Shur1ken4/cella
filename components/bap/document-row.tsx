"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { copy } from "@/lib/copy";
import { formatDate } from "@/lib/format";
import { sha256Hex } from "@/lib/hash";
import type { Document } from "@/lib/data/types";
import { FileDrop } from "@/components/ui/file-drop";
import { HashChip, type HashStatus } from "@/components/ui/hash-chip";

/**
 * One document on a passport: its onchain fingerprint, plus a drop zone that
 * hashes a local file in the browser and compares it (ADR-007).
 */
export function DocumentRow({ doc }: { doc: Document }) {
  const [status, setStatus] = useState<HashStatus>("idle");
  const [checking, setChecking] = useState(false);

  const verify = async (files: File[]) => {
    setChecking(true);
    try {
      const [hash] = await Promise.all([
        sha256Hex(files[0]),
        new Promise((r) => setTimeout(r, 700)),
      ]);
      setStatus(hash === doc.sha256 ? "match" : "mismatch");
    } finally {
      setChecking(false);
    }
  };

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border surface-card p-4">
      <div className="flex items-start gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-sm bg-surface-2 text-text-muted"
          aria-hidden="true"
        >
          <FileText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text">{doc.label}</p>
          <p className="type-caption text-text-faint">
            {copy.documents.addedBy} {doc.addedBy} ·{" "}
            <span className="nums">{formatDate(doc.addedAt)}</span>
          </p>
        </div>
        {doc.samplePath && (
          <a
            href={doc.samplePath}
            download
            className="type-caption inline-flex shrink-0 items-center gap-1 rounded-sm text-cyan hover:underline focus-ring"
          >
            <Download className="size-3.5" aria-hidden="true" />
            {copy.documents.sample}
          </a>
        )}
      </div>

      <div className="relative w-fit">
        <motion.div
          key={status}
          initial={status === "idle" ? false : { scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
        >
          <HashChip hash={doc.sha256} status={status} />
        </motion.div>
        <AnimatePresence>
          {checking && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-10 rounded-sm bg-linear-to-r from-transparent via-cyan/40 to-transparent"
              initial={{ left: "-10%", opacity: 0 }}
              animate={{ left: "100%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            />
          )}
        </AnimatePresence>
      </div>

      <FileDrop
        compact
        onFiles={verify}
        label={checking ? copy.documents.checking : copy.documents.dropHint}
        hint={copy.documents.choose}
      />
    </li>
  );
}
