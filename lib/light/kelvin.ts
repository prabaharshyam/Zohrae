/**
 * Colour temperature → RGB (Tanner Helland's approximation), clamped to the
 * range the warmth slider offers: candle (2200K) to soft white (3500K).
 */
export const KELVIN = { candle: 2200, warm: 2700, soft: 3500, min: 2200, max: 3500 } as const;

export function kelvinToRgb(kelvin: number): [number, number, number] {
  const t = kelvin / 100;
  const r = 255;
  const g = Math.min(255, Math.max(0, 99.4708025861 * Math.log(t) - 161.1195681661));
  const b = t <= 19 ? 0 : Math.min(255, Math.max(0, 138.5177312231 * Math.log(t - 10) - 305.0447927307));
  return [r, Math.round(g), Math.round(b)];
}

/** "255 167 87" — for use as rgb(var(--glow-rgb) / alpha). */
export const kelvinToCssRgb = (kelvin: number) => kelvinToRgb(kelvin).join(" ");
