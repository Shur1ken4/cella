import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { PassportView } from "@/components/views/passport-view";

export async function generateMetadata(props: PageProps<"/asset/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: `${decodeURIComponent(id)} · ${copy.passport.title}` };
}

export default async function AssetPage(props: PageProps<"/asset/[id]">) {
  const { id } = await props.params;
  return <PassportView id={decodeURIComponent(id)} />;
}
