import { copy } from "@/lib/copy";
import { getExplorerUrl } from "@/lib/solana/explorer";
import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/components/bap/strand-timeline";
import { ASSET_SCHEMAS, SCHEMA_SIGNER } from "./schemas";
import { SIMULATED } from "./source";
import type { Attestation } from "./types";

/** One timeline row per asset schema, in lifecycle order: signed or pending. */
export function buildTimeline(attestations: Attestation[]): TimelineEvent[] {
  return ASSET_SCHEMAS.map((schema) => {
    const a = attestations.find((x) => x.schemaKey === schema);
    const signerRole = SCHEMA_SIGNER[schema];
    return a
      ? {
          id: schema,
          label: copy.schemas[schema],
          institution: a.attester.name,
          kind: a.attester.role,
          status: "attested" as const,
          date: formatDate(a.createdAt),
          // Simulated signatures don't exist on devnet, so don't link them.
          explorerUrl: SIMULATED ? undefined : getExplorerUrl(`/tx/${a.signature}`),
          note: a.note,
        }
      : {
          id: schema,
          label: copy.schemas[schema],
          institution: copy.institutions[signerRole].name,
          kind: signerRole,
          status: "pending" as const,
        };
  });
}
