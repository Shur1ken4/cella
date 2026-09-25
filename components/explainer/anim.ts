/**
 * Pure timing helpers for explainer scenes. A scene is a function of
 * `progress` (0 → 1) only, so it renders identically in the browser player
 * and in Remotion (Phase 9).
 */

export const clamp = (v: number, min = 0, max = 1) => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
/** Overshoot then settle — for "pop" entrances. */
export const easeBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};

/** 0 → 1 across the [start, end] window of progress, eased. */
export function seg(p: number, start: number, end: number, ease: (t: number) => number = easeOut) {
  return ease(clamp((p - start) / (end - start)));
}

/** Piecewise-linear keyframes: kf(p, [[0, 10], [0.5, 40], [1, 40]]). Eased per segment. */
export function kf(p: number, frames: [number, number][], ease: (t: number) => number = easeInOut) {
  if (p <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i];
    const [t0, v0] = frames[i - 1];
    if (p <= t1) return lerp(v0, v1, ease((p - t0) / (t1 - t0 || 1)));
  }
  return frames[frames.length - 1][1];
}

/** Gentle deterministic float (−1 → 1) for idle motion. */
export const wave = (p: number, cycles = 1, phase = 0) => Math.sin((p * cycles + phase) * Math.PI * 2);

/** Whether a click happens around `at` (for ripples / pressed states). */
export const clickAmount = (p: number, at: number, span = 0.08) => seg(p, at, at + span, (t) => t);
