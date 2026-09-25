import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { CreateView } from "@/components/views/create-view";

export const metadata: Metadata = { title: `${copy.create.title} · ${copy.site.name}` };

export default function CreatePage() {
  return <CreateView />;
}
