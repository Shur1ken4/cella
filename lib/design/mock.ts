/** Mock props for the /design style guide only. Real demo data arrives in Phase 2 (lib/data). */
import { copy } from "@/lib/copy";
import { getExplorerUrl } from "@/lib/solana/explorer";
import type { TimelineEvent } from "@/components/bap/strand-timeline";

export const MOCK_SIGNATURE =
  "5VfYkFq2kz7uD4bL1mR8xN3cPq9wTj6hS2aE7gYv4Zt1nKd8BfR3oW5mLxC9uHs2QeJ6pA4yNr7TgVb1kMz8Dw";
export const MOCK_ADDRESS = "BUvCnxe5aVdxbme7pPArwrQ8XR7T5x9m4tbQY2ume1yb";
export const MOCK_HASH =
  "9f2c4e1ab7d35c08e6f41a2b9c7d0e3f5a18b62c4d97e0f13a5b6c8d2e4f7a91";

const inst = copy.institutions;

export const mockTimeline: TimelineEvent[] = [
  {
    id: "patent",
    label: copy.schemas.PATENT_FILED,
    institution: inst.university.name,
    kind: "university",
    status: "attested",
    date: "14 Jan 2026",
    explorerUrl: getExplorerUrl(`/tx/${MOCK_SIGNATURE}`),
  },
  {
    id: "licence",
    label: copy.schemas.LICENCE_GRANTED,
    institution: inst.university.name,
    kind: "university",
    status: "attested",
    date: "02 Mar 2026",
    explorerUrl: getExplorerUrl(`/tx/${MOCK_SIGNATURE}`),
  },
  {
    id: "ind",
    label: copy.schemas.IND_CLEARED,
    institution: inst.lab.name,
    kind: "lab",
    status: "pending",
  },
  {
    id: "phase1",
    label: copy.schemas.PHASE1_COMPLETE,
    institution: inst.lab.name,
    kind: "lab",
    status: "pending",
  },
  {
    id: "pharma",
    label: copy.schemas.PHARMA_LICENCE,
    institution: inst.pharma.name,
    kind: "pharma",
    status: "pending",
  },
];
