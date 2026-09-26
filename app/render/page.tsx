import { Suspense } from "react";
import type { Metadata } from "next";
import { RenderFrame } from "@/components/explainer/render-frame";

// Internal: frame source for scripts/render-video.mjs. Not linked, not indexed.
export const metadata: Metadata = { title: "Render", robots: { index: false, follow: false } };

export default function RenderPage() {
  return (
    <Suspense>
      <RenderFrame />
    </Suspense>
  );
}
