/**
 * Domain types shared by the mock (Phase 2) and onchain (Phase 8) data sources.
 * Amounts are whole tUSDC as JS numbers (6 decimals fit safely); the onchain
 * adapter converts to/from u64 base units.
 */

export type SchemaKey =
  | "PATENT_FILED"
  | "LICENCE_GRANTED"
  | "IND_CLEARED"
  | "PHASE1_COMPLETE"
  | "PHARMA_LICENCE"
  | "KYC_VERIFIED";

/** Schemas that describe events on an asset (everything except KYC). */
export type AssetSchemaKey = Exclude<SchemaKey, "KYC_VERIFIED">;

/** Who can hold rights in an asset or sign claims. */
export type InstitutionRole = "university" | "owner" | "lab" | "pharma" | "kyc";

/** Roles a visitor can switch between in the app. */
export type Role = "university" | "lab" | "pharma" | "investor";

/** Index into the lifecycle (copy.stages): 0 Discovery … 8 Approved. */
export type Stage = number;

export interface Institution {
  id: string;
  name: string;
  role: InstitutionRole;
  /** Signing wallet (base58). */
  address: string;
}

export interface RightsHolder {
  institution: Institution;
  /** Short description, e.g. "Exclusive licence (licensor)". */
  right: string;
}

export interface Document {
  id: string;
  passportId: string;
  label: string;
  /** SHA-256 of the file, 64-char hex. Only the hash is stored — never the file. */
  sha256: string;
  addedBy: string;
  addedAt: string; // ISO date
  /** Sample file shipped with the demo (optional). */
  samplePath?: string;
}

export interface Passport {
  id: string; // asset code, e.g. "BAP-001"
  address: string; // passport account (PDA)
  code: string;
  name: string;
  modality: string;
  area: string;
  stage: Stage;
  owner: Institution;
  rightsHolders: RightsHolder[];
  documents: Document[];
  createdAt: string;
}

export interface Asset {
  id: string;
  passport: Passport;
  /** Vault id if the asset is raising money. */
  vaultId?: string;
}

export interface Attestation {
  id: string; // attestation account address
  /** Passport id for asset events, investor wallet for KYC. */
  subject: string;
  schemaKey: SchemaKey;
  attester: Institution;
  docHash?: string;
  note?: string;
  createdAt: string;
  signature: string;
}

export interface Tranche {
  index: number;
  amount: number;
  requiredSchema: AssetSchemaKey;
  recipient: Institution;
  released: boolean;
  releasedAt?: string;
}

export interface MilestonePayout {
  payer: Institution;
  amount: number;
  requiredSchema: AssetSchemaKey;
  funded: boolean;
  unlocked: boolean;
  totalClaimed: number;
}

export interface Vault {
  id: string;
  passportId: string;
  address: string;
  target: number;
  totalDeposited: number;
  /** tUSDC currently held by the vault (deposits − released tranches). */
  balance: number;
  depositsOpen: boolean;
  tranches: Tranche[];
  payout: MilestonePayout;
  investorCount: number;
}

export interface Position {
  vaultId: string;
  wallet: string;
  deposited: number;
  claimed: number;
  /** Payout the investor can claim right now. */
  claimable: number;
  /** deposited / vault.totalDeposited (0–1). */
  share: number;
}

/** Investor-side wallet status (tUSDC balance and KYC). */
export interface InvestorStatus {
  wallet: string;
  tusdcBalance: number;
  kycVerified: boolean;
}

export interface TxResult {
  signature: string;
  explorerUrl: string;
}

export interface CreatePassportInput {
  name: string;
  code: string;
  modality: string;
  area: string;
  stage: Stage;
  rightsHolders: { name: string; role: InstitutionRole; right: string }[];
  documents: { label: string; sha256: string }[];
}
