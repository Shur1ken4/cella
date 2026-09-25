/**
 * Attestation adapter (ADR-003). The ONLY place the app talks to attestations.
 * Backed by the Solana Attestation Service, or by the fallback registry in the
 * passport program. The rest of the app must not care which one is used.
 * Implemented in Phase 6.
 */
export {};
