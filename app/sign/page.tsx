import { Suspense } from "react";
import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { SignView } from "@/components/views/sign-view";

export const metadata: Metadata = { title: `${copy.sign.title} · ${copy.site.name}` };

// Suspense: SignView reads ?asset=&event= deep-link params.
export default function SignPage() {
  return (
    <Suspense>
      <SignView />
    </Suspense>
  );
}
