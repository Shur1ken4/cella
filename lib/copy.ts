/** All user-facing copy lives here so it can be edited in one place. */

export const copy = {
  site: {
    name: "Cella",
    shortName: "Cella",
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
    title: "Cella Passport",
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
    home: "Cella home",
  },

  footer: {
    mockData: "Mock data",
    mockDataHint: "Phase 2 preview: actions are simulated in your browser.",
    resetDemo: "Reset demo",
    resetDone: "Demo data reset",
    darkTheme: "Dark theme",
    lightTheme: "Light theme",
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
    intro: "Two short animated tracks: the idea in 50 seconds, and a walkthrough of the demo you can click through yourself.",
    faqTitle: "Questions",
    cta: "Try the demo",
    faq: [
      {
        q: "Why use a blockchain?",
        a: "No single company owns a drug’s story, so none of them should control the official record. The same record also holds investors’ money and pays it out automatically when a milestone is confirmed.",
      },
      {
        q: "Is this real money?",
        a: "No. This demo runs on Solana devnet with tUSDC, a test token with no value. You can get 10,000 for free with one click.",
      },
      {
        q: "Where are my documents stored?",
        a: "Nowhere but your own device. Your browser computes a SHA-256 fingerprint and only that fingerprint goes onchain, so anyone can later check a file matches.",
      },
      {
        q: "Who can sign?",
        a: "Only approved institutions, and only the claims they own: the university signs patents and licences, the lab signs trial milestones, the pharma licensee signs its licence.",
      },
      {
        q: "What happens if a claim is wrong?",
        a: "The institution that signed it can revoke it. The correction is public and permanent, and the vault only releases money against claims that are still valid.",
      },
    ],
  },

  home: {
    cta: "Try the demo",
    watch: "Watch how it works",
    heroTitle: "Verified biotech assets, financeable on Solana.",
    heroSub: "Verified. Funded. Paid.",
    heroBody: "A digital passport for a drug candidate, signed by the institutions that hold rights in it, with a vault that pays investors when a milestone is confirmed.",
    explainerTitle: "How it works in 50 seconds",
    steps: {
      title: "Three building blocks",
      items: [
        { title: "Passport", body: "One onchain record of the asset: rights holders, stage and document fingerprints." },
        { title: "Attestations", body: "The university, lab and pharma each sign the facts they own. Nobody can fake or quietly change them." },
        { title: "Vault", body: "Investors fund the asset in USDC. Signed milestones release money and pay investors automatically." },
      ],
    },
    problem: {
      title: "Why early drugs struggle to get funded",
      stats: [
        {
          value: "7.9%",
          label: "of drugs entering Phase I trials reach approval",
          source: "BIO / Informa / QLS, 2011–2020",
          href: "https://www.bio.org/clinical-development-success-rates-and-contributing-factors-2011-2020",
        },
        {
          value: "$2.6B",
          label: "average cost to bring one new drug to market",
          source: "Tufts CSDD, DiMasi et al. 2016",
          href: "https://www.globenewswire.com/news-release/2016/03/10/1187518/0/en/Tufts-Center-for-the-Study-of-Drug-Development-Assessment-of-Cost-to-Develop-and-Win-Marketing-Approval-for-a-New-Drug-Now-Published.html",
        },
        {
          value: "10–15 yrs",
          label: "from discovery to an approved medicine",
          source: "PhRMA",
          href: "https://phrma.org/policy-issues/research-development",
        },
      ],
      sourceLabel: "Source",
    },
    whyChain: {
      title: "Why blockchain?",
      body: "No single company owns a drug’s story. The university, startup, investors and pharma all have rights in the same asset, so none of them should control the official record. The same record also holds investors’ money and pays it out automatically when a milestone is confirmed. A normal database would need one company in the middle holding everyone’s money and deciding what is true.",
      rows: [
        { title: "No single owner", body: "The record is shared, not held by one company." },
        { title: "Signed by the right people", body: "Each fact is signed by the institution that owns it." },
        { title: "Money moves automatically", body: "Code releases funds when a milestone is signed." },
        { title: "Documents stay private", body: "Only fingerprints go onchain, never the files." },
      ],
    },
    builtOn: {
      title: "Built on Solana",
      items: ["Solana", "Solana Attestation Service", "USDC (test token)", "Anchor"],
    },
    finalCta: {
      title: "See it working in two minutes",
      body: "Sign a milestone, fund the vault, claim your payout. All on devnet, with test money.",
      button: "Try the demo on devnet",
    },
  },

  explainer: {
    label: "Explainer video",
    tracks: { idea: "The idea", howTo: "How to use it" },
    play: "Play",
    pause: "Pause",
    replay: "Replay",
    prev: "Previous scene",
    next: "Next scene",
    goTo: (n: number) => `Go to scene ${n}`,
    sceneOf: (n: number, total: number) => `Scene ${n} of ${total}`,
    tryItNow: "Try it now",
    reducedMotion: "Reduced motion is on: showing each scene's final frame. Use the arrows to step through.",
    idea: [
      {
        title: "A new drug’s history is scattered",
        caption: "Its patents, contracts, emails and trial results sit in different offices. Nobody has the full picture.",
      },
      {
        title: "So investors can’t trust it",
        caption: "Checking it all takes lawyers months. Too slow and expensive, so most early drugs never get funded.",
      },
      {
        title: "One digital passport for the drug",
        caption: "We gather the key facts into one record, like a car’s service history that follows it from owner to owner.",
      },
      {
        title: "The right people confirm each fact",
        caption:
          "The university confirms the patent, the lab confirms the trial. Each uses a digital signature nobody can fake or quietly change.",
      },
      {
        title: "Now investors can fund it",
        caption: "Because the facts are trustworthy, investors put test USDC into a shared vault for this drug.",
      },
      {
        title: "Milestone confirmed, everyone gets paid",
        caption: "When the lab signs ‘Phase I complete’, the vault pays investors automatically. No middleman.",
      },
      {
        title: "Verified. Funded. Paid.",
        caption: "Trustworthy facts make a drug fundable, and code makes sure everyone gets paid. On Solana.",
      },
    ],
    howTo: [
      {
        title: "Open the passport",
        caption: "On the dashboard, click Cancer Drug X to open its passport: stage, signed events, documents and vault.",
        href: "/asset/BAP-001",
      },
      {
        title: "Sign as an institution",
        caption: "In the signing console, act as the lab: pick ‘Phase I complete’ and click Sign. The seal stamps onto the passport.",
        href: "/sign?asset=BAP-001&event=PHASE1_COMPLETE",
      },
      {
        title: "Get test money and verify",
        caption: "In the vault, click ‘Get 10,000 tUSDC’ for free test money, then ‘Get verified’ for demo KYC.",
        href: "/vault/BAP-001",
      },
      {
        title: "Deposit into the vault",
        caption: "Type an amount and click Deposit. Your test USDC moves into the vault and your share appears.",
        href: "/vault/BAP-001",
      },
      {
        title: "Claim your payout",
        caption: "Once ‘Phase I complete’ is signed and the payout unlocked, click Claim. Your share flows back to you.",
        href: "/vault/BAP-001",
      },
    ],
    labels: {
      docs: ["Patents", "Licences", "Emails", "Funding", "Trials", "Contracts"],
      investor: "Investor",
      investors: "Investors",
      drug: "Drug X",
      vault: "Vault",
      rows: ["Patent filed", "Phase I complete", "Licensed to pharma"],
      trio: ["Verified", "Funded", "Paid"],
      onSolana: "On Solana",
      phase1: "Phase I complete",
      balance: "Balance",
      dashboard: "Dashboard",
      signBtn: "Sign attestation",
      faucetBtn: "Get 10,000 tUSDC",
      kycBtn: "Get verified",
      depositBtn: "Deposit",
      claimBtn: "Claim payout",
      claimed: "+3,000 tUSDC claimed",
      paid: "+ paid",
      ofTarget: "of 500,000 tUSDC",
    },
  },

  design: {
    title: "Design system",
    intro:
      "Living style guide for Cella. Every token, component and state on one page.",
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
