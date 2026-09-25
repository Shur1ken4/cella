import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { copy } from "@/lib/copy";
import demoDocs from "./demo-docs.json";
import { MockDataSource } from "./mock";
import { canSign, proRataClaimable } from "./schemas";
import { DEMO_WALLET, FAUCET_AMOUNT } from "./seed";

const ID = "BAP-001";
const E = copy.errors;
let ds: MockDataSource;

beforeEach(() => {
  ds = new MockDataSource({ txDelayMs: 0, readDelayMs: 0, persist: false });
});

async function verifiedInvestorWithFunds(wallet = DEMO_WALLET) {
  await ds.faucetTusdc(wallet);
  await ds.issueDemoKyc(wallet);
}

describe("seed story", () => {
  it("starts at Preclinical with patent + licence signed and 490k raised", async () => {
    const asset = await ds.getAsset(ID);
    expect(asset?.passport.stage).toBe(3);
    const atts = await ds.getAttestations(ID);
    expect(atts.map((a) => a.schemaKey)).toEqual(["PATENT_FILED", "LICENCE_GRANTED"]);
    const vault = await ds.getVault(ID);
    expect(vault).toMatchObject({ target: 500_000, totalDeposited: 490_000, balance: 490_000, investorCount: 2 });
    expect(vault?.payout).toMatchObject({ amount: 150_000, funded: true, unlocked: false });
  });

  it("demo document hashes match the shipped sample PDFs", () => {
    for (const d of demoDocs) {
      const bytes = readFileSync(join(process.cwd(), "public", d.path));
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(d.sha256);
    }
  });
});

describe("full demo flow (Phase 2 'done when')", () => {
  it("sign IND → release T1 → deposit → sign Phase I → release T2 → unlock → claim", async () => {
    await ds.signAttestation(ID, "IND_CLEARED");
    expect((await ds.getAsset(ID))?.passport.stage).toBe(4);

    await ds.releaseTranche(ID, 0);
    let vault = await ds.getVault(ID);
    expect(vault?.tranches[0].released).toBe(true);
    expect(vault?.balance).toBe(240_000);

    await verifiedInvestorWithFunds();
    await ds.deposit(ID, DEMO_WALLET, 10_000);
    vault = await ds.getVault(ID);
    expect(vault).toMatchObject({ totalDeposited: 500_000, balance: 250_000, depositsOpen: false });

    await ds.signAttestation(ID, "PHASE1_COMPLETE");
    expect((await ds.getAsset(ID))?.passport.stage).toBe(5);
    await ds.releaseTranche(ID, 1);
    await ds.unlockPayout(ID);

    const before = await ds.getPosition(ID, DEMO_WALLET);
    expect(before.claimable).toBe(3_000); // 150k × 10k / 500k
    expect(before.share).toBeCloseTo(0.02);

    await ds.claim(ID, DEMO_WALLET);
    const after = await ds.getPosition(ID, DEMO_WALLET);
    expect(after).toMatchObject({ claimed: 3_000, claimable: 0 });
    expect((await ds.getInvestor(DEMO_WALLET)).tusdcBalance).toBe(3_000);
    expect((await ds.getVault(ID))?.payout.totalClaimed).toBe(3_000);
  });
});

describe("rules", () => {
  it("rejects release before the milestone is signed", async () => {
    await expect(ds.releaseTranche(ID, 0)).rejects.toThrow(E.notAttested);
  });

  it("rejects releasing the same tranche twice", async () => {
    await ds.signAttestation(ID, "IND_CLEARED");
    await ds.releaseTranche(ID, 0);
    await expect(ds.releaseTranche(ID, 0)).rejects.toThrow(E.alreadyReleased);
  });

  it("rejects a tranche the vault cannot cover", async () => {
    await ds.signAttestation(ID, "IND_CLEARED");
    await ds.signAttestation(ID, "PHASE1_COMPLETE");
    await ds.releaseTranche(ID, 0); // 490k → 240k
    await expect(ds.releaseTranche(ID, 1)).rejects.toThrow(E.vaultShort);
  });

  it("rejects signing the same event twice", async () => {
    await expect(ds.signAttestation(ID, "PATENT_FILED")).rejects.toThrow(E.alreadySigned);
  });

  it("requires KYC, balance, and respects the raise target", async () => {
    await ds.faucetTusdc(DEMO_WALLET);
    await expect(ds.deposit(ID, DEMO_WALLET, 1_000)).rejects.toThrow(E.notVerified);
    await ds.issueDemoKyc(DEMO_WALLET);
    await expect(ds.deposit(ID, DEMO_WALLET, 0)).rejects.toThrow(E.invalidAmount);
    await expect(ds.deposit(ID, DEMO_WALLET, FAUCET_AMOUNT + 1)).rejects.toThrow(E.insufficientBalance);
    await ds.faucetTusdc(DEMO_WALLET);
    await expect(ds.deposit(ID, DEMO_WALLET, 10_001)).rejects.toThrow(/exceed the raise target/);
    await ds.deposit(ID, DEMO_WALLET, 10_000);
    await expect(ds.deposit(ID, DEMO_WALLET, 1)).rejects.toThrow(E.depositsClosed);
  });

  it("rejects claiming before unlock, and claiming twice", async () => {
    await verifiedInvestorWithFunds();
    await ds.deposit(ID, DEMO_WALLET, 10_000);
    await expect(ds.claim(ID, DEMO_WALLET)).rejects.toThrow(E.payoutLocked);
    await expect(ds.unlockPayout(ID)).rejects.toThrow(E.notAttested);
    await ds.signAttestation(ID, "PHASE1_COMPLETE");
    await ds.unlockPayout(ID);
    await expect(ds.unlockPayout(ID)).rejects.toThrow(E.alreadyUnlocked);
    await ds.claim(ID, DEMO_WALLET);
    await expect(ds.claim(ID, DEMO_WALLET)).rejects.toThrow(E.nothingToClaim);
  });

  it("does not allow KYC twice", async () => {
    await ds.issueDemoKyc(DEMO_WALLET);
    await expect(ds.issueDemoKyc(DEMO_WALLET)).rejects.toThrow(E.alreadyVerified);
  });

  it("creates a passport and rejects a duplicate code", async () => {
    const input = {
      name: "Candidate Y",
      code: "bap-002",
      modality: "Antibody",
      area: "Immunology",
      stage: 0,
      rightsHolders: [{ name: "Helix Oncology Ltd", role: "owner" as const, right: "Owner" }],
      documents: [{ label: "Term sheet", sha256: "a".repeat(64) }],
    };
    const res = await ds.createPassport(input);
    expect(res.passportId).toBe("BAP-002");
    const asset = await ds.getAsset("BAP-002");
    expect(asset?.passport.documents).toHaveLength(1);
    expect(asset?.vaultId).toBeUndefined();
    await expect(ds.createPassport(input)).rejects.toThrow(E.codeTaken);
  });
});

describe("pro-rata payout math", () => {
  it("splits 150k between 300k and 200k deposits as 90k and 60k", () => {
    expect(proRataClaimable(150_000, 300_000, 500_000, 0)).toBe(90_000);
    expect(proRataClaimable(150_000, 200_000, 500_000, 0)).toBe(60_000);
  });

  it("rounds down and never goes negative", () => {
    expect(proRataClaimable(100, 1, 3, 0)).toBe(33.333333);
    expect(proRataClaimable(100, 1, 3, 40)).toBe(0);
    expect(proRataClaimable(100, 0, 0, 0)).toBe(0);
  });
});

describe("signing permissions", () => {
  it("only the right institution can sign each schema", () => {
    expect(canSign("university", "PATENT_FILED")).toBe(true);
    expect(canSign("lab", "PATENT_FILED")).toBe(false);
    expect(canSign("lab", "PHASE1_COMPLETE")).toBe(true);
    expect(canSign("pharma", "PHARMA_LICENCE")).toBe(true);
    expect(canSign("investor", "IND_CLEARED")).toBe(false);
  });
});
