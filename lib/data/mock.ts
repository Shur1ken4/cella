/**
 * Mock DataSource (ADR-009, Phase 2). Simulates the passport + vault programs in
 * memory so the whole demo story can be clicked through without a chain.
 * Rules mirror the planned onchain checks; state persists for the browser session.
 */
import { copy } from "@/lib/copy";
import { formatAmount } from "@/lib/format";
import { getExplorerUrl } from "@/lib/solana/explorer";
import type { DataSource } from "./index";
import { fakeAddress, fakeSignature } from "./fake";
import { SCHEMA_SIGNER, SCHEMA_STAGE, proRataClaimable } from "./schemas";
import { createSeedState, FAUCET_AMOUNT, type MockState } from "./seed";
import type {
  Asset,
  Attestation,
  CreatePassportInput,
  Institution,
  InvestorStatus,
  Position,
  SchemaKey,
  TxResult,
  Vault,
} from "./types";

const STORAGE_KEY = "bap-mock-state-v1";
const TX_DELAY_MS = 1200;
const READ_DELAY_MS = 120;

const E = copy.errors;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const clone = <T>(v: T): T => structuredClone(v);

type Options = { txDelayMs?: number; readDelayMs?: number; persist?: boolean };

export class MockDataSource implements DataSource {
  readonly kind = "mock" as const;
  private state: MockState;
  private readonly txDelay: number;
  private readonly readDelay: number;
  private readonly persist: boolean;

  constructor(opts: Options = {}) {
    this.txDelay = opts.txDelayMs ?? TX_DELAY_MS;
    this.readDelay = opts.readDelayMs ?? READ_DELAY_MS;
    this.persist = opts.persist ?? typeof window !== "undefined";
    this.state = this.load() ?? createSeedState();
  }

  // ---------- persistence ----------

  private load(): MockState | null {
    if (!this.persist) return null;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as MockState) : null;
      return parsed?.version === 1 ? parsed : null;
    } catch {
      return null;
    }
  }

  private save() {
    if (!this.persist) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      /* storage full or unavailable: keep in memory only */
    }
  }

  /** Simulates a transaction: wait, run the checks + state change, return a fake signature. */
  private async tx(apply: () => void): Promise<TxResult> {
    await sleep(this.txDelay);
    apply();
    this.save();
    const signature = fakeSignature();
    return { signature, explorerUrl: getExplorerUrl(`/tx/${signature}`) };
  }

  // ---------- helpers ----------

  private passportOrThrow(id: string) {
    const p = this.state.passports[id];
    if (!p) throw new Error(E.assetNotFound);
    return p;
  }

  private vaultOrThrow(id: string) {
    const v = this.state.vaults[id];
    if (!v) throw new Error(E.vaultNotFound);
    return v;
  }

  private findAttestation(subject: string, schema: SchemaKey) {
    return this.state.attestations.find((a) => a.subject === subject && a.schemaKey === schema);
  }

  private investor(wallet: string) {
    return (this.state.investors[wallet] ??= { tusdcBalance: 0, kycVerified: false });
  }

  private position(vaultId: string, wallet: string) {
    const byWallet = (this.state.positions[vaultId] ??= {});
    return (byWallet[wallet] ??= { deposited: 0, claimed: 0 });
  }

  private withInvestorCount(v: Omit<Vault, "investorCount">): Vault {
    const positions = Object.values(this.state.positions[v.id] ?? {});
    return { ...clone(v), investorCount: positions.filter((p) => p.deposited > 0).length };
  }

  // ---------- reads ----------

  async listAssets(): Promise<Asset[]> {
    await sleep(this.readDelay);
    return Object.values(this.state.passports).map((p) => ({
      id: p.id,
      passport: clone(p),
      vaultId: this.state.vaults[p.id] ? p.id : undefined,
    }));
  }

  async getAsset(id: string): Promise<Asset | null> {
    await sleep(this.readDelay);
    const p = this.state.passports[id];
    if (!p) return null;
    return { id, passport: clone(p), vaultId: this.state.vaults[id] ? id : undefined };
  }

  async getAttestations(passportId: string): Promise<Attestation[]> {
    await sleep(this.readDelay);
    return clone(
      this.state.attestations
        .filter((a) => a.subject === passportId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    );
  }

  async getVault(vaultId: string): Promise<Vault | null> {
    await sleep(this.readDelay);
    const v = this.state.vaults[vaultId];
    return v ? this.withInvestorCount(v) : null;
  }

  async getPosition(vaultId: string, wallet: string): Promise<Position> {
    await sleep(this.readDelay);
    const v = this.vaultOrThrow(vaultId);
    const p = this.state.positions[vaultId]?.[wallet] ?? { deposited: 0, claimed: 0 };
    return {
      vaultId,
      wallet,
      deposited: p.deposited,
      claimed: p.claimed,
      claimable: v.payout.unlocked
        ? proRataClaimable(v.payout.amount, p.deposited, v.totalDeposited, p.claimed)
        : 0,
      share: v.totalDeposited > 0 ? p.deposited / v.totalDeposited : 0,
    };
  }

  async getInvestor(wallet: string): Promise<InvestorStatus> {
    await sleep(this.readDelay);
    const i = this.state.investors[wallet] ?? { tusdcBalance: 0, kycVerified: false };
    return { wallet, ...i };
  }

  // ---------- writes ----------

  async createPassport(input: CreatePassportInput) {
    const code = input.code.trim().toUpperCase();
    let passportId = code;
    const result = await this.tx(() => {
      if (this.state.passports[code]) throw new Error(E.codeTaken);
      const holders = input.rightsHolders.map((h, i) => {
        const inst: Institution = {
          id: `${code}-holder-${i}`,
          name: h.name.trim(),
          role: h.role,
          address: fakeAddress(`holder:${code}:${h.name}`),
        };
        return { institution: inst, right: h.right.trim() };
      });
      const owner =
        holders.find((h) => h.institution.role === "owner")?.institution ?? holders[0].institution;
      const now = new Date().toISOString();
      passportId = code;
      this.state.passports[code] = {
        id: code,
        address: fakeAddress(`passport:${code}`),
        code,
        name: input.name.trim(),
        modality: input.modality.trim(),
        area: input.area.trim(),
        stage: input.stage,
        owner,
        rightsHolders: holders,
        documents: input.documents.map((d, i) => ({
          id: `doc-${i}`,
          passportId: code,
          label: d.label.trim(),
          sha256: d.sha256,
          addedBy: owner.name,
          addedAt: now.slice(0, 10),
        })),
        createdAt: now,
      };
    });
    return { ...result, passportId };
  }

  async addDocumentHash(passportId: string, sha256: string, label: string) {
    return this.tx(() => {
      const p = this.passportOrThrow(passportId);
      p.documents.push({
        id: `doc-${p.documents.length}`,
        passportId,
        label,
        sha256,
        addedBy: p.owner.name,
        addedAt: new Date().toISOString().slice(0, 10),
      });
    });
  }

  async signAttestation(passportId: string, schemaKey: SchemaKey, docHash?: string, note?: string) {
    const signature = fakeSignature();
    await sleep(this.txDelay);
    const p = this.passportOrThrow(passportId);
    if (this.findAttestation(passportId, schemaKey)) throw new Error(E.alreadySigned);
    this.state.attestations.push({
      id: fakeAddress(`att:${passportId}:${schemaKey}`),
      subject: passportId,
      schemaKey,
      attester: this.state.institutions[SCHEMA_SIGNER[schemaKey]],
      docHash,
      note: note?.trim() || undefined,
      createdAt: new Date().toISOString(),
      signature,
    });
    const nextStage = SCHEMA_STAGE[schemaKey];
    if (nextStage !== undefined && nextStage > p.stage) p.stage = nextStage;
    this.save();
    return { signature, explorerUrl: getExplorerUrl(`/tx/${signature}`) };
  }

  async issueDemoKyc(wallet: string) {
    return this.tx(() => {
      const inv = this.investor(wallet);
      if (inv.kycVerified) throw new Error(E.alreadyVerified);
      inv.kycVerified = true;
      this.state.attestations.push({
        id: fakeAddress(`att:${wallet}:KYC_VERIFIED`),
        subject: wallet,
        schemaKey: "KYC_VERIFIED",
        attester: this.state.institutions.kyc,
        note: "Demo KYC · level basic",
        createdAt: new Date().toISOString(),
        signature: fakeSignature(),
      });
    });
  }

  async faucetTusdc(wallet: string) {
    return this.tx(() => {
      this.investor(wallet).tusdcBalance += FAUCET_AMOUNT;
    });
  }

  async deposit(vaultId: string, wallet: string, amount: number) {
    return this.tx(() => {
      const v = this.vaultOrThrow(vaultId);
      const inv = this.investor(wallet);
      if (!(amount > 0)) throw new Error(E.invalidAmount);
      if (!v.depositsOpen) throw new Error(E.depositsClosed);
      if (!inv.kycVerified) throw new Error(E.notVerified);
      if (inv.tusdcBalance < amount) throw new Error(E.insufficientBalance);
      const left = v.target - v.totalDeposited;
      if (amount > left) throw new Error(E.exceedsTarget(formatAmount(left)));

      inv.tusdcBalance -= amount;
      this.position(vaultId, wallet).deposited += amount;
      v.totalDeposited += amount;
      v.balance += amount;
      if (v.totalDeposited >= v.target) v.depositsOpen = false;
    });
  }

  async releaseTranche(vaultId: string, index: number) {
    return this.tx(() => {
      const v = this.vaultOrThrow(vaultId);
      const t = v.tranches[index];
      if (!t) throw new Error(E.vaultNotFound);
      if (t.released) throw new Error(E.alreadyReleased);
      if (!this.findAttestation(v.passportId, t.requiredSchema)) throw new Error(E.notAttested);
      if (v.balance < t.amount) throw new Error(E.vaultShort);
      v.balance -= t.amount;
      t.released = true;
      t.releasedAt = new Date().toISOString();
    });
  }

  async unlockPayout(vaultId: string) {
    return this.tx(() => {
      const v = this.vaultOrThrow(vaultId);
      if (!v.payout.funded) throw new Error(E.payoutNotFunded);
      if (v.payout.unlocked) throw new Error(E.alreadyUnlocked);
      if (!this.findAttestation(v.passportId, v.payout.requiredSchema)) throw new Error(E.notAttested);
      v.payout.unlocked = true;
    });
  }

  async claim(vaultId: string, wallet: string) {
    return this.tx(() => {
      const v = this.vaultOrThrow(vaultId);
      if (!v.payout.unlocked) throw new Error(E.payoutLocked);
      const pos = this.position(vaultId, wallet);
      const amount = proRataClaimable(v.payout.amount, pos.deposited, v.totalDeposited, pos.claimed);
      if (amount <= 0) throw new Error(E.nothingToClaim);
      if (v.payout.totalClaimed + amount > v.payout.amount) throw new Error(E.nothingToClaim);
      pos.claimed += amount;
      v.payout.totalClaimed += amount;
      this.investor(wallet).tusdcBalance += amount;
    });
  }

  async reset() {
    this.state = createSeedState();
    this.save();
  }
}

export function createMockDataSource(opts?: Options): DataSource {
  return new MockDataSource(opts);
}
