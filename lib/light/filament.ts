/**
 * Brightness of a filament bulb t ms after the switch, 0–1: a fast rise that
 * settles slowly, with one small flicker at ~120ms.
 */
export function filament(t: number, duration: number, flicker = true) {
  if (t <= 0) return 0;
  if (t >= duration) return 1;
  const x = t / duration;
  const rise = 1 - Math.pow(1 - x, 3.2);
  const dip = flicker && t > 105 && t < 160 ? 0.55 : 1;
  return rise * dip;
}

/** Switching off: quick, slightly ember-like fade. */
export function fadeOut(t: number, duration = 320) {
  if (t >= duration) return 0;
  const x = t / duration;
  return Math.pow(1 - x, 1.8);
}

/**
 * Touching a lamp's own switch: it catches, blinks off for a beat, then
 * holds and settles (about 650ms), like a bulb finding its contact.
 */
export function ignition(t: number) {
  if (t <= 0) return 0;
  if (t < 60) return t / 60;
  if (t < 160) return 0.06;
  if (t < 240) return 0.06 + ((t - 160) / 80) * 0.9;
  if (t < 650) return 0.96 + 0.04 * ((t - 240) / 410);
  return 1;
}
export const IGNITION_MS = 650;

/** Idle life: a short bzz-bzz-bzz from a lamp that stays on (480ms). */
export function bzz(t: number) {
  if (t <= 0 || t >= 480) return 1;
  const phase = (t % 160) / 160;
  return phase < 0.35 ? 0.35 + 0.3 * Math.sin(phase * 40) : 1;
}
export const BZZ_MS = 480;
