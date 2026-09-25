# Biotech Asset Passport — Project Rulebook

## 1. What we are building
A Colosseum (Solana) hackathon demo. A biotech asset (drug candidate) gets a PASSPORT on Solana. Institutions that hold rights in the asset (University, Lab/CRO, Pharma licensee) SIGN key events as attestations. Investors fund the asset through a VAULT in USDC, and are paid automatically when an attested milestone is reached.

One-line pitch: "Verified biotech assets, financeable on Solana."

Tagline for the site: "Verified. Funded. Paid."

Why blockchain (use this wording on the site): No single company owns a drug's story. The university, startup, investors and pharma all have rights in the same asset, so none of them should control the official record. The same record also holds investors' money and pays it out automatically when a milestone is confirmed. A normal database would need one company in the middle holding everyone's money and deciding what is true.

## 2. Demo story (all demo data uses this)
Asset: "Cancer Drug X" (code name BAP-001), a small-molecule oncology candidate.
- Originated at: "Northbridge University" (demo institution, fictional)
- Spin-out / asset owner: "Helix Oncology Ltd" (fictional)
- Lab / CRO: "Meridian Clinical Research" (fictional)
- Pharma licensee: "Aurora Pharma" (fictional)
- Demo KYC issuer: "Demo KYC Provider"

Lifecycle stages (in order): Discovery → Patent filed → Licence granted → Preclinical → IND cleared → Phase I complete → Phase II → Phase III → Approved.

Event schemas (each is a type of signed claim):
| Schema key | Label | Who may sign |
|---|---|---|
| PATENT_FILED | Patent filed | University |
| LICENCE_GRANTED | Licence granted | University |
| IND_CLEARED | IND cleared | Lab/CRO |
| PHASE1_COMPLETE | Phase I complete | Lab/CRO |
| PHARMA_LICENCE | Licensed to pharma | Pharma |
| KYC_VERIFIED | Investor verified | Demo KYC Provider |

Vault for BAP-001:
- Raise target: 500,000 tUSDC
- Tranche 1: 250,000 tUSDC released to Helix Oncology when IND_CLEARED is attested
- Tranche 2: 250,000 tUSDC released when PHASE1_COMPLETE is attested
- Milestone payout: Aurora Pharma escrows 150,000 tUSDC, unlocked to investors (pro rata) when PHASE1_COMPLETE is attested

## 3. Architecture decisions (ADR summary)

ADR-001 Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion. Start from `create-solana-dapp` (Next.js + Tailwind + Anchor template). Reason: standard Solana hackathon stack, fast to build, deploys free on Vercel.

ADR-002 Onchain: ONE Anchor workspace containing TWO programs: `passport` and `vault`. Reason: clean separation; vault never needs to CPI into passport, it only reads accounts.

ADR-003 Attestations: Use the Solana Attestation Service (SAS) for credentials (approved signers), schemas (event types) and attestations (signed events). Time-box the SAS integration spike to ONE working session. FALLBACK if SAS cannot be made to work in time: implement a minimal attestation registry inside the `passport` program (Attester PDAs approved by an admin + Attestation PDAs with the same fields). The frontend must talk to attestations through ONE adapter file (`lib/attestations.ts`) so the rest of the app does not care which option is used.

ADR-004 Money: Use our OWN devnet test token "tUSDC" (6 decimals) with a faucet button in the app, instead of Circle devnet USDC. Reason: judges can get test money instantly; no faucet rate limits. Label it clearly as test money everywhere.

ADR-005 Investor positions: Per-investor Position PDA (amount deposited, amount claimed) instead of a share token. Reason: simpler and safer for a hackathon. Token-2022 share tokens are listed as "future work".

ADR-006 Payouts are PULL-based: investors click "Claim". Release/unlock instructions are permissionless (anyone can call them) but only succeed if the correct attestation exists. Reason: no loops over investors, no push-payment failures.

ADR-007 Documents: Documents are NEVER uploaded onchain or to a server. The browser computes a SHA-256 fingerprint locally and only the hash is stored onchain. Demo sample PDFs live in /public/demo-docs. Users can drag a file onto a document row to verify its fingerprint matches.

ADR-008 Demo mode: So judges can click through without special wallets, a server API route `/api/demo-sign` signs institution attestations using devnet-only keypairs stored in Vercel environment variables (never in the client bundle, never committed). The UI shows a clear "DEMO MODE — signing as Northbridge University (devnet)" banner. Investors use their own Phantom wallet.

ADR-009 Data layer: All reads/writes go through `lib/data/` with a single interface. Phase 2 implements it with MOCK data; Phase 7 swaps in real onchain data. UI components never import Solana libraries directly.

ADR-010 No database. Everything is either onchain (devnet) or static in the repo.

## 4. Design system

Mood: "clinical lab meets onchain finance". Deep navy space, bright bio-green signal, precise thin lines, molecule/hexagon motifs, glowing data. Highly visual; minimal text; every concept has an icon or animation.

AVOID (looks like AI template): purple gradients, everything centered, identical rounded corners everywhere, Inter font, stock emoji as icons, walls of text.

### Theme update (2026-09-25)
The default theme is now LIGHT (white background). The dark navy palette below is kept as the alternate theme (`<html data-theme="dark">`, toggle in the footer) and is still used for the Passport Card and the explainer video stage. Token NAMES are the same in both themes; light values live in `app/globals.css`. In light mode `--green` is a deeper green (#067442) for text/icons so it passes AA on white, and the bright bio-green is `--green-fill` (buttons, filled shapes) with `--on-green` text on top. `--text-faint` in dark mode is #7C93B8 (the original #5F7AA6 failed AA).

### Colour tokens (define as CSS variables in globals.css and map in tailwind.config)
Backgrounds
- --bg-deep: #050B18 (page background)
- --bg: #081427 (main background)
- --surface-1: #0C1D38 (cards)
- --surface-2: #12284D (raised cards, inputs)
- --surface-3: #1A3566 (hover states)
- --border: #1E3A6B
- --border-strong: #2C5494

Text
- --text: #EAF2FF (primary)
- --text-muted: #9DB2D6 (secondary)
- --text-faint: #5F7AA6 (labels, captions)

Brand
- --green: #2EF28C (primary, bio-green)
- --green-hover: #6BFFB0
- --green-deep: #12B866 (pressed, borders on green elements)
- --green-glow: rgba(46, 242, 140, 0.35) (box-shadow glows)
- --green-tint: rgba(46, 242, 140, 0.10) (subtle fills, badges)
- --cyan: #3CD6FF (secondary accent: data, links, onchain/explorer)
- --cyan-tint: rgba(60, 214, 255, 0.10)

Status
- --success: #2EF28C (same as green)
- --warning: #FFC24D
- --danger: #FF5C7A
- --info: #3CD6FF

Rules
- Primary buttons: green background, --bg-deep text (dark text on green), never white text on green.
- Green is for actions and "verified/confirmed" states only. Cyan is for data, links, wallet addresses and explorer links.
- Never put --text-faint on --surface-3 (too low contrast).
- All text must meet WCAG AA contrast.

### Typography
- Headings: "Space Grotesk" (600/700), via next/font/google
- Body: "IBM Plex Sans" (400/500)
- Mono (hashes, addresses, numbers): "JetBrains Mono" (400/500)
- Scale: display 56/60, h1 40/48, h2 30/38, h3 22/30, body 16/26, small 14/22, caption 12/18
- Numbers in stats and balances always use mono with tabular figures.

### Spacing, radius, elevation, motion
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 px
- Radius: sm 6px (badges, inputs), md 10px (buttons), lg 16px (cards), xl 24px (hero panels). Mix them deliberately.
- Elevation: cards use 1px --border + subtle inner gradient; "verified" elements get a green glow: 0 0 24px var(--green-glow).
- Motion: fast 150ms, base 250ms, slow 450ms; easing cubic-bezier(0.2, 0.8, 0.2, 1). Respect prefers-reduced-motion (disable non-essential animation).

### Signature visual elements
1. Passport Card: looks like a holographic ID card. Navy card, thin green border, hexagon-pattern background at 6% opacity, asset code in mono, a "VERIFIED ONCHAIN" stamp that animates in.
2. Attestation Seal: circular stamp with the institution's icon and a green check; pops in with a scale + glow animation.
3. Strand Timeline: vertical timeline drawn as a DNA-like strand (two thin lines with connecting rungs); each event is a node that glows green when attested, grey when pending.
4. Molecule background: slow-drifting SVG nodes and lines on the landing hero (very subtle).
5. Coin Flow: animated tUSDC coins moving between vault and investors.

### Core components (build in components/ui and components/bap)
Button (primary | secondary | ghost | danger; sm | md | lg; loading state with spinner; disabled), Card, Badge (verified | pending | warning | info), StatTile, AddressChip (shortened address + copy + explorer link), HashChip (shortened hash + copy + verify), PassportCard, AttestationSeal, StrandTimeline, StageStepper, VaultMeter (progress ring), CoinFlow, RoleSwitcher, DemoBanner, TxToast (pending → confirmed with explorer link), EmptyState, ExplainerPlayer.

Every interactive component needs: visible focus ring (2px --cyan), keyboard support, aria-labels on icon-only buttons.

## 5. Coding rules
- TypeScript strict. No `any` unless commented why.
- Keep files small; one component per file.
- All user-facing copy in `lib/copy.ts` so it can be edited in one place.
- Every Solana transaction shows a TxToast with a Solana Explorer devnet link.
- Network is hard-coded to devnet. Add a guard that throws if the RPC is not devnet.
- Never commit private keys. `.env.local` is gitignored. Provide `.env.example`.
- After each phase: run lint, typecheck, and tests; fix all errors; then summarise what changed and list anything I must do manually.
- Do not start the next phase until I paste it.
