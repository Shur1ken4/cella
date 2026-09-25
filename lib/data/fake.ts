/** Fake-but-realistic base58 values for mock mode. Never used onchain. */

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function base58(length: number, next: () => number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += BASE58[next() % 58];
  return out;
}

/** Deterministic 44-char address for a seed string (same seed → same address). */
export function fakeAddress(seed: string): string {
  let state = hashSeed(seed) || 1;
  return base58(44, () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  });
}

/** Random 88-char transaction signature. */
export function fakeSignature(): string {
  const bytes = new Uint32Array(88);
  crypto.getRandomValues(bytes);
  let i = 0;
  return base58(88, () => bytes[i++]);
}
