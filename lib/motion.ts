/** Motion tokens (CLAUDE.md §4) for Framer Motion. Mirrors --motion-* in globals.css. */

export const duration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

export const easeBrand = [0.2, 0.8, 0.2, 1] as const;

export const transition = {
  fast: { duration: duration.fast, ease: easeBrand },
  base: { duration: duration.base, ease: easeBrand },
  slow: { duration: duration.slow, ease: easeBrand },
} as const;
