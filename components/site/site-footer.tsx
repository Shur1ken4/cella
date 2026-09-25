"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FlaskConical, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { copy } from "@/lib/copy";
import { DATA_SOURCE, getDataSource } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "./logo";

export function SiteFooter() {
  const queryClient = useQueryClient();

  const reset = async () => {
    await getDataSource().reset?.();
    await queryClient.invalidateQueries();
    toast.success(copy.footer.resetDone);
  };

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <LogoMark className="size-6" />
          <p className="type-small text-text-muted">
            <FlaskConical className="mr-1.5 inline size-4 -translate-y-px text-warning" aria-hidden="true" />
            {copy.network.devnetOnly}
          </p>
        </div>
        {DATA_SOURCE === "mock" && (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="info" title={copy.footer.mockDataHint}>
              {copy.footer.mockData}
            </Badge>
            <button
              type="button"
              onClick={reset}
              className="type-small inline-flex items-center gap-1.5 rounded-sm text-text-muted hover:text-text focus-ring"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              {copy.footer.resetDemo}
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
