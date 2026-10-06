/**
 * Which data source this build uses. Kept in its own file (no imports) so UI
 * components can check it without pulling in the mock implementation.
 */
export type DataSourceKind = "mock" | "onchain";

export const DATA_SOURCE: DataSourceKind =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "onchain" ? "onchain" : "mock";

/** True while transactions are simulated in the browser (no real devnet signatures). */
export const SIMULATED = DATA_SOURCE === "mock";
