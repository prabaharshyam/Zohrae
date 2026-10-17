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
