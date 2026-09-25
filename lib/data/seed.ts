/**
 * The Cancer Drug X demo story (CLAUDE.md §2) as initial mock state.
 * Two seed investors have already deposited 490,000 of the 500,000 target, so a
 * judge's 10,000 test deposit completes the raise and tranches can be released.
 */
import { copy } from "@/lib/copy";
import demoDocs from "./demo-docs.json";
import { fakeAddress, fakeSignature } from "./fake";
import type { Attestation, Institution, InstitutionRole, Passport, Vault } from "./types";

export const DEMO_WALLET = fakeAddress("demo-investor-wallet");
export const FAUCET_AMOUNT = 10_000;

export interface MockState {
  version: 1;
  institutions: Record<InstitutionRole, Institution>;
  passports: Record<string, Passport>;
  attestations: Attestation[];
  vaults: Record<string, Omit<Vault, "investorCount">>;
  positions: Record<string, Record<string, { deposited: number; claimed: number }>>;
  investors: Record<string, { tusdcBalance: number; kycVerified: boolean }>;
}

function institution(role: InstitutionRole): Institution {
  const i = copy.institutions[role];
  return { id: role, name: i.name, role, address: fakeAddress(`institution:${role}`) };
}

export function createSeedState(): MockState {
  const institutions: MockState["institutions"] = {
    university: institution("university"),
    owner: institution("owner"),
    lab: institution("lab"),
    pharma: institution("pharma"),
    kyc: institution("kyc"),
  };

  const passport: Passport = {
    id: copy.asset.code,
    address: fakeAddress("passport:BAP-001"),
    code: copy.asset.code,
    name: copy.asset.name,
    modality: copy.asset.modality,
    area: copy.asset.area,
    stage: 3, // Preclinical
    owner: institutions.owner,
    rightsHolders: [
      { institution: institutions.university, right: "Originator · licensor" },
      { institution: institutions.owner, right: "Exclusive licensee · asset owner" },
      { institution: institutions.pharma, right: "Pharma licensee" },
    ],
    documents: demoDocs.map((d, i) => ({
      id: `doc-${i}`,
      passportId: copy.asset.code,
      label: d.label,
      sha256: d.sha256,
      addedBy: institutions.owner.name,
      addedAt: ["2026-01-14", "2026-03-02", "2026-05-20"][i] ?? "2026-05-20",
      samplePath: d.path,
    })),
    createdAt: "2026-01-10T09:00:00Z",
  };

  const attestations: Attestation[] = [
    {
      id: fakeAddress("att:BAP-001:PATENT_FILED"),
      subject: passport.id,
      schemaKey: "PATENT_FILED",
      attester: institutions.university,
      docHash: demoDocs[0].sha256,
      note: "Provisional filing NBU-PRV-2026-0114",
      createdAt: "2026-01-14T10:00:00Z",
      signature: fakeSignature(),
    },
    {
      id: fakeAddress("att:BAP-001:LICENCE_GRANTED"),
      subject: passport.id,
      schemaKey: "LICENCE_GRANTED",
      attester: institutions.university,
      docHash: demoDocs[1].sha256,
      note: "Exclusive licence to Helix Oncology Ltd",
      createdAt: "2026-03-02T10:00:00Z",
      signature: fakeSignature(),
    },
  ];

  const seedA = fakeAddress("seed-investor-a");
  const seedB = fakeAddress("seed-investor-b");

  const vault: Omit<Vault, "investorCount"> = {
    id: passport.id,
    passportId: passport.id,
    address: fakeAddress("vault:BAP-001"),
    target: 500_000,
    totalDeposited: 490_000,
    balance: 490_000,
    depositsOpen: true,
    tranches: [
      { index: 0, amount: 250_000, requiredSchema: "IND_CLEARED", recipient: institutions.owner, released: false },
      { index: 1, amount: 250_000, requiredSchema: "PHASE1_COMPLETE", recipient: institutions.owner, released: false },
    ],
    payout: {
      payer: institutions.pharma,
      amount: 150_000,
      requiredSchema: "PHASE1_COMPLETE",
      funded: true,
      unlocked: false,
      totalClaimed: 0,
    },
  };

  return {
    version: 1,
    institutions,
    passports: { [passport.id]: passport },
    attestations,
    vaults: { [vault.id]: vault },
    positions: {
      [vault.id]: {
        [seedA]: { deposited: 300_000, claimed: 0 },
        [seedB]: { deposited: 190_000, claimed: 0 },
      },
    },
    investors: {
      [seedA]: { tusdcBalance: 0, kycVerified: true },
      [seedB]: { tusdcBalance: 0, kycVerified: true },
    },
  };
}
