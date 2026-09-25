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

  nav: {
    howItWorks: "How it works",
    app: "App",
    create: "Create passport",
    menu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    home: "Biotech Asset Passport home",
  },

  footer: {
    mockData: "Mock data",
    mockDataHint: "Phase 2 preview: actions are simulated in your browser.",
    resetDemo: "Reset demo",
    resetDone: "Demo data reset",
  },

  roles: {
    label: "View as",
    university: "University",
    lab: "Lab / CRO",
    pharma: "Pharma",
    investor: "Investor",
  },

  dashboard: {
    title: "Dashboard",
    subtitle: "Every asset here carries a passport signed by the institutions that hold rights in it.",
    assets: "Assets",
    comingSoon: "Coming soon",
    placeholders: [
      { name: "Gene Therapy Y", area: "Rare disease" },
      { name: "Antibody Z", area: "Immunology" },
    ],
    openPassport: "Open passport",
    signedEvents: "signed",
    raised: "raised",
    roleHints: {
      university: {
        title: "Sign as Northbridge University",
        body: "Confirm the patent and licence events you own.",
        cta: "Open signing console",
        href: "/sign",
      },
      lab: {
        title: "Sign as Meridian Clinical Research",
        body: "Confirm trial milestones: IND cleared and Phase I complete.",
        cta: "Open signing console",
        href: "/sign",
      },
      pharma: {
        title: "Sign as Aurora Pharma",
        body: "Confirm your licence and fund the milestone payout.",
        cta: "Open signing console",
        href: "/sign",
      },
      investor: {
        title: "Fund a verified asset",
        body: "Get test money, get verified, deposit, and claim when the milestone is signed.",
        cta: "Open vault",
        href: "/vault/BAP-001",
      },
    },
  },

  assetPage: {
    back: "Dashboard",
    notFoundTitle: "Passport not found",
    notFoundBody: "There is no asset with this code.",
    stats: {
      stage: "Stage",
      rightsHolders: "Rights holders",
      signedEvents: "Signed events",
      raised: "Vault raised",
    },
    sections: {
      lifecycle: "Lifecycle",
      rightsMap: "Rights map",
      timeline: "Signed events",
      documents: "Documents",
      vault: "Vault",
    },
    of: "of",
  },

  rightsMap: {
    exclusiveLicence: "Exclusive licence",
    licence: "Licence",
    funds: "Funds tranches",
    deposits: "Deposits",
    escrow: "Milestone escrow",
    investors: "Investors",
    vault: "Vault",
    description:
      "Northbridge University licenses the asset to Helix Oncology, which licenses it to Aurora Pharma. Investors fund Helix through the vault; Aurora escrows the milestone payout in the same vault.",
  },

  documents: {
    dropHint: "Drop the file here to verify",
    choose: "or choose a file",
    checking: "Checking fingerprint…",
    sample: "Sample file",
    privacy: "Files are fingerprinted in your browser and never uploaded. Only the SHA-256 hash is onchain.",
    empty: "No documents yet",
    addedBy: "Added by",
  },

  vaultCard: {
    open: "Open vault",
    none: "No vault for this asset yet",
    noneBody: "A vault is opened once the asset owner sets raise terms.",
    tranchesReleased: "Tranches released",
  },

  sign: {
    title: "Institution console",
    subtitle: "Sign a claim about an asset. The signature is permanent and public on devnet.",
    signingAs: "Signing as",
    steps: {
      asset: "Pick asset",
      event: "Pick event",
      evidence: "Attach evidence",
      sign: "Sign",
    },
    optional: "optional",
    lockedTooltip: (who: string) => `Only the ${who} can sign this`,
    alreadySigned: "Already signed",
    noteLabel: "Note",
    notePlaceholder: "e.g. FDA IND #123456 cleared on 12 Sep 2026",
    dropLabel: "Drop a supporting document",
    dropHint: "It is fingerprinted here and never uploaded.",
    signButton: "Sign attestation",
    pickEventFirst: "Pick an event to sign",
    successTitle: "Attestation signed",
    viewPassport: "View on passport",
    signAnother: "Sign another",
    investorHint: "Investors don’t sign asset events. Pick an institution to sign as.",
    preview: "Preview",
  },

  vaultPage: {
    title: "Vault",
    back: "Passport",
    notFoundTitle: "Vault not found",
    notFoundBody: "This asset has no vault.",
    tranches: "Tranches",
    tranche: (n: number) => `Tranche ${n}`,
    releasesTo: "Releases to",
    requires: "Requires",
    status: {
      locked: "Locked",
      ready: "Ready to release",
      released: "Released",
    },
    release: "Release",
    releaseHint: "Anyone can trigger a release. It only succeeds if the event is signed.",
    payout: "Milestone payout",
    escrowedBy: "Escrowed by",
    unlocksWhen: "Unlocks when",
    payoutStatus: {
      notFunded: "Not funded",
      locked: "Escrowed · locked",
      ready: "Ready to unlock",
      unlocked: "Unlocked",
    },
    unlock: "Unlock payout",
    claimedSoFar: "claimed so far",
    investor: {
      title: "Your position",
      steps: ["Get test money", "Get verified", "Deposit", "Claim"],
      faucet: "Get 10,000 tUSDC (test)",
      kyc: "Get verified (demo KYC)",
      verified: "Verified",
      amount: "Deposit amount",
      deposit: "Deposit",
      max: "Max",
      claim: "Claim payout",
      walletBalance: "Wallet balance",
      deposited: "Deposited",
      share: "Share",
      claimable: "Claimable",
      claimed: "Claimed",
      demoWallet: "Using a demo wallet. Connect Phantom to use your own address.",
      depositsClosed: "Target reached. Deposits are closed.",
      remaining: "left to raise",
    },
    flowYou: "You",
  },

  create: {
    title: "Create a passport",
    subtitle: "Register an asset, its rights holders and document fingerprints.",
    steps: ["Basics", "Rights holders", "Documents", "Review"],
    fields: {
      name: "Asset name",
      namePlaceholder: "e.g. Candidate Y",
      code: "Asset code",
      codePlaceholder: "e.g. BAP-002",
      modality: "Modality",
      modalityPlaceholder: "e.g. Small molecule",
      area: "Therapeutic area",
      areaPlaceholder: "e.g. Oncology",
      stage: "Current stage",
      holderName: "Institution name",
      holderRole: "Role",
      holderRight: "Right held",
      holderRightPlaceholder: "e.g. Exclusive licence",
    },
    roleOptions: {
      university: "University",
      owner: "Asset owner",
      lab: "Lab / CRO",
      pharma: "Pharma",
    },
    addHolder: "Add rights holder",
    remove: "Remove",
    docsDrop: "Drop documents here",
    docsHint: "Each file is fingerprinted in your browser and never uploaded.",
    docLabel: "Label",
    back: "Back",
    next: "Next",
    create: "Create passport",
    mockNote: "Mock mode: the passport is created in this browser session only.",
    review: {
      basics: "Basics",
      holders: "Rights holders",
      documents: "Documents",
      none: "None",
    },
    errors: {
      nameRequired: "Enter an asset name.",
      codeFormat: "Use letters, numbers and dashes (max 16).",
      holderRequired: "Add at least one rights holder with a name.",
    },
  },

  errors: {
    assetNotFound: "Asset not found.",
    vaultNotFound: "Vault not found.",
    alreadySigned: "This event has already been signed for this asset.",
    notAttested: "This milestone hasn’t been confirmed yet.",
    alreadyReleased: "This tranche has already been released.",
    vaultShort: "The vault doesn’t hold enough tUSDC for this tranche yet.",
    notVerified: "Get verified before depositing.",
    alreadyVerified: "This wallet is already verified.",
    insufficientBalance: "Not enough tUSDC in your wallet. Use the test faucet first.",
    exceedsTarget: (left: string) => `That would exceed the raise target. Only ${left} tUSDC left to raise.`,
    depositsClosed: "Deposits are closed for this vault.",
    invalidAmount: "Enter an amount greater than zero.",
    payoutNotFunded: "The milestone payout hasn’t been funded yet.",
    payoutLocked: "The payout hasn’t been unlocked yet.",
    alreadyUnlocked: "The payout is already unlocked.",
    nothingToClaim: "Nothing to claim yet.",
    codeTaken: "An asset with this code already exists.",
  },

  txLabels: {
    sign: { pending: "Signing attestation…", confirmed: "Attestation signed" },
    kyc: { pending: "Issuing demo KYC…", confirmed: "Wallet verified" },
    faucet: { pending: "Minting 10,000 test tUSDC…", confirmed: "10,000 tUSDC received" },
    deposit: { pending: "Depositing…", confirmed: "Deposit confirmed" },
    release: { pending: "Releasing tranche…", confirmed: "Tranche released" },
    unlock: { pending: "Unlocking payout…", confirmed: "Payout unlocked" },
    claim: { pending: "Claiming payout…", confirmed: "Payout claimed" },
    create: { pending: "Creating passport…", confirmed: "Passport created" },
    addDoc: { pending: "Adding document fingerprint…", confirmed: "Document added" },
  },

  howItWorks: {
    title: "How it works",
    comingSoon: "The explainer video arrives in the next build phase.",
    cta: "Try the demo",
  },

  home: {
    cta: "Try the demo",
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
export type InstitutionKind = keyof typeof copy.institutions;
