/** All user-facing copy lives here so it can be edited in one place. */

export const copy = {
  site: {
    name: "Biotech Asset Passport",
    shortName: "BAP",
    pitch: "Verified biotech assets, financeable on Solana.",
    tagline: "Verified. Funded. Paid.",
  },

  wallet: {
    connect: "Connect wallet",
    chooseWallet: "Choose a wallet",
    connecting: "Connecting…",
    noWallets: "No Solana wallet found. Install Phantom and switch it to Devnet.",
    balance: "Balance",
    copyAddress: "Copy address",
    copied: "Copied!",
    explorer: "Explorer",
    disconnect: "Disconnect",
  },

  network: {
    devnetOnly: "Devnet demo — test money only",
  },

  /** Lifecycle stages, in order (CLAUDE.md §2). */
  stages: [
    "Discovery",
    "Patent filed",
    "Licence granted",
    "Preclinical",
    "IND cleared",
    "Phase I complete",
    "Phase II",
    "Phase III",
    "Approved",
  ],

  /** Event schemas: label shown in the UI. */
  schemas: {
    PATENT_FILED: "Patent filed",
    LICENCE_GRANTED: "Licence granted",
    IND_CLEARED: "IND cleared",
    PHASE1_COMPLETE: "Phase I complete",
    PHARMA_LICENCE: "Licensed to pharma",
    KYC_VERIFIED: "Investor verified",
  },

  institutions: {
    university: { name: "Northbridge University", role: "University" },
    owner: { name: "Helix Oncology Ltd", role: "Asset owner" },
    lab: { name: "Meridian Clinical Research", role: "Lab / CRO" },
    pharma: { name: "Aurora Pharma", role: "Pharma licensee" },
    kyc: { name: "Demo KYC Provider", role: "KYC issuer" },
    investor: { name: "Investor", role: "Investor" },
  },

  asset: {
    name: "Cancer Drug X",
    code: "BAP-001",
    modality: "Small molecule",
    area: "Oncology",
  },

  passport: {
    title: "Biotech Asset Passport",
    verifiedStamp: "Verified onchain",
    pendingStamp: "Awaiting signatures",
    fields: {
      stage: "Stage",
      owner: "Owner",
      modality: "Modality",
      area: "Area",
      attestations: "Signed events",
    },
  },

  seal: {
    attested: "Attested",
    pending: "Awaiting signature",
  },

  timeline: {
    title: "Signed events",
    attested: "Signed",
    pending: "Pending",
    viewTx: "View transaction",
    notYetSigned: "Not yet signed",
  },

  stepper: {
    label: "Lifecycle stage",
    current: "current stage",
    completed: "completed",
    upcoming: "upcoming",
  },

  vault: {
    raised: "Raised",
    of: "of",
    funded: "Target reached",
    fundedShort: "Funded",
  },

  chips: {
    copy: "Copy",
    copied: "Copied",
    copyAddress: "Copy address",
    copyHash: "Copy fingerprint",
    viewOnExplorer: "View on Solana Explorer (devnet)",
    verify: "Verify file",
    hashMatch: "Matches onchain fingerprint",
    hashMismatch: "Does not match",
  },

  tx: {
    pending: "Sending transaction…",
    confirmed: "Transaction confirmed",
    failed: "Transaction failed",
    viewOnExplorer: "View on Explorer",
  },

  demo: {
    banner: (institution: string) =>
      `DEMO MODE — signing as ${institution} (devnet)`,
    bannerHint: "Institution signatures use devnet demo keys held by the server.",
  },

  empty: {
    defaultTitle: "Nothing here yet",
  },

  units: {
    token: "tUSDC",
    testMoney: "test money",
  },

  design: {
    title: "Design system",
    intro:
      "Living style guide for Biotech Asset Passport. Every token, component and state on one page.",
    sections: {
      colours: "Colour tokens",
      type: "Typography",
      buttons: "Buttons",
      badges: "Badges",
      cards: "Cards & stats",
      chips: "Address & hash chips",
      feedback: "Feedback",
      passport: "Passport card",
      seals: "Attestation seals",
      timeline: "Strand timeline",
      stepper: "Stage stepper",
      vault: "Vault meter",
      coins: "Coin flow",
      primitives: "Form & overlay primitives",
    },
  },
} as const;

export type StageLabel = (typeof copy.stages)[number];
export type SchemaKey = keyof typeof copy.schemas;
export type InstitutionKind = keyof typeof copy.institutions;
