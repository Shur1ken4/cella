/**
 * Data layer (ADR-009). All reads and writes go through this single interface.
 * Phase 2: mock implementation (lib/data/mock.ts). Phase 8: onchain.
 * UI components use the hooks in lib/data/hooks.ts, never Solana libraries.
 */
import type {
  Asset,
  Attestation,
  CreatePassportInput,
  InvestorStatus,
  Position,
  SchemaKey,
  TxResult,
  Vault,
} from "./types";
import { createMockDataSource } from "./mock";
import { DATA_SOURCE } from "./source";

export interface DataSource {
  readonly kind: "mock" | "onchain";

  // reads
  getAsset(id: string): Promise<Asset | null>;
  listAssets(): Promise<Asset[]>;
  getAttestations(passportId: string): Promise<Attestation[]>;
  getVault(vaultId: string): Promise<Vault | null>;
  getPosition(vaultId: string, wallet: string): Promise<Position>;
  getInvestor(wallet: string): Promise<InvestorStatus>;

  // writes (each is one transaction)
  createPassport(input: CreatePassportInput): Promise<TxResult & { passportId: string }>;
  addDocumentHash(passportId: string, sha256: string, label: string): Promise<TxResult>;
  signAttestation(
    passportId: string,
    schemaKey: SchemaKey,
    docHash?: string,
    note?: string
  ): Promise<TxResult>;
  issueDemoKyc(wallet: string): Promise<TxResult>;
  faucetTusdc(wallet: string): Promise<TxResult>;
  deposit(vaultId: string, wallet: string, amount: number): Promise<TxResult>;
  releaseTranche(vaultId: string, index: number): Promise<TxResult>;
  unlockPayout(vaultId: string): Promise<TxResult>;
  claim(vaultId: string, wallet: string): Promise<TxResult>;

  /** Mock only: restore the initial demo story. */
  reset?(): Promise<void>;
}

export { DATA_SOURCE, SIMULATED, type DataSourceKind } from "./source";

let instance: DataSource | null = null;

export function getDataSource(): DataSource {
  if (!instance) {
    if (DATA_SOURCE === "onchain") {
      // Phase 8 swaps in lib/data/onchain.ts here.
      throw new Error("Onchain data source is not implemented yet (Phase 8). Use NEXT_PUBLIC_DATA_SOURCE=mock.");
    }
    instance = createMockDataSource();
  }
  return instance;
}

export * from "./types";
