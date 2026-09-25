import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { VaultView } from "@/components/views/vault-view";

export async function generateMetadata(props: PageProps<"/vault/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: `${decodeURIComponent(id)} ${copy.vaultPage.title} · ${copy.site.name}` };
}

export default async function VaultPage(props: PageProps<"/vault/[id]">) {
  const { id } = await props.params;
  return <VaultView id={decodeURIComponent(id)} />;
}
