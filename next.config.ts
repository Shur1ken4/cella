import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep our CLAUDE.md rulebook untouched (next dev appends agent notes otherwise).
  agentRules: false,
  serverExternalPackages: ["ws"],
  // @solana/kit-plugin-payer's browser bundle has a spurious `import 'fs'`
  // from the payerFromFile export. Stub it out for the client bundle.
  turbopack: {
    // A stray package-lock.json in the home folder confuses root detection.
    root: path.join(__dirname),
    resolveAlias: {
      fs: { browser: "./empty-module.js" },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
};

export default nextConfig;
