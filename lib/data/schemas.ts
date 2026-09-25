/** Business rules shared by the UI and every data source (CLAUDE.md §2). */
import type { AssetSchemaKey, InstitutionRole, Role, SchemaKey, Stage } from "./types";

/** Asset events in lifecycle order. */
export const ASSET_SCHEMAS: AssetSchemaKey[] = [
  "PATENT_FILED",
  "LICENCE_GRANTED",
  "IND_CLEARED",
  "PHASE1_COMPLETE",
  "PHARMA_LICENCE",
];

/** Who may sign each schema. */
export const SCHEMA_SIGNER: Record<SchemaKey, InstitutionRole> = {
  PATENT_FILED: "university",
  LICENCE_GRANTED: "university",
  IND_CLEARED: "lab",
  PHASE1_COMPLETE: "lab",
  PHARMA_LICENCE: "pharma",
  KYC_VERIFIED: "kyc",
};

/** Lifecycle stage an attested event moves the passport to (forward only). */
export const SCHEMA_STAGE: Partial<Record<SchemaKey, Stage>> = {
  PATENT_FILED: 1,
  LICENCE_GRANTED: 2,
  IND_CLEARED: 4,
  PHASE1_COMPLETE: 5,
};

/** App role → institution it signs as. Investors do not sign asset events. */
export const ROLE_INSTITUTION: Record<Exclude<Role, "investor">, InstitutionRole> = {
  university: "university",
  lab: "lab",
  pharma: "pharma",
};

export function canSign(role: Role, schema: SchemaKey): boolean {
  return role !== "investor" && SCHEMA_SIGNER[schema] === ROLE_INSTITUTION[role];
}

/** Pro-rata payout share, rounded DOWN to 6 decimals (mirrors the vault program). */
export function proRataClaimable(
  payoutAmount: number,
  deposited: number,
  totalDeposited: number,
  alreadyClaimed: number
): number {
  if (totalDeposited <= 0 || deposited <= 0) return 0;
  const MICRO = 1_000_000n;
  const entitled =
    (BigInt(Math.round(payoutAmount * 1e6)) * BigInt(Math.round(deposited * 1e6))) /
    BigInt(Math.round(totalDeposited * 1e6));
  const remaining = entitled - BigInt(Math.round(alreadyClaimed * 1e6));
  return remaining > 0n ? Number(remaining) / Number(MICRO) : 0;
}
