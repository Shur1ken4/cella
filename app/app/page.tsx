import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { DashboardView } from "@/components/views/dashboard-view";

export const metadata: Metadata = { title: `${copy.dashboard.title} · ${copy.site.name}` };

export default function DashboardPage() {
  return <DashboardView />;
}
