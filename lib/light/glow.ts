import type { LampGlow } from "@/components/light/LampImage";
import type { GlowConfig, ImageAsset, LightColour } from "@/lib/commerce/types";
import type { Placement } from "./geometry";
import { toFrame } from "./geometry";

const TINTS: Record<LightColour, string> = {
  amber: "255 170 92",
  "warm white": "255 214 168",
  rose: "255 178 168",
};

/** Turns a product's glow settings (image fractions) into frame geometry for <LampImage>. */
export function lampGlow(
  cfg: GlowConfig,
  off: ImageAsset | undefined,
  p: Placement | undefined,
  frameAspect: number,
): LampGlow {
  if (!off || !p) {
    // Placeholder: glow behind the monogram.
    return {
      x: 50,
      y: 40,
      rx: 42,
      ry: 42 * frameAspect,
      intensity: 0.7,
      tint: TINTS[cfg.colour],
      pool: { x: 50, y: 88, rx: 30 },
    };
  }
  const o = toFrame(p, cfg.origin.x, cfg.origin.y);
  const rx = cfg.radius * p.width;
  const s = off.subject;
  const base = s ? toFrame(p, (s.left + s.right) / 2, s.bottom) : { x: 50, y: 90 };
  const imgAspect = off.width / off.height;
  // Lit layer mask, in the off image's own box: product silhouette ∩ a soft disc around the bulb.
  const rxImg = cfg.radius * 100;
  const ryImg = cfg.radius * imgAspect * 100;
  const at = `at ${cfg.origin.x * 100}% ${cfg.origin.y * 100}%`;
  const disc = `radial-gradient(ellipse ${rxImg * 1.1}% ${ryImg * 1.1}% ${at}, #000 35%, transparent 100%)`;
  // The bulb's light inside the shade, clipped to the product's silhouette.
  const core = off.mask
    ? {
        background: `radial-gradient(ellipse ${rxImg * 0.7}% ${ryImg * 0.7}% ${at}, rgb(255 236 206 / 0.48) 0%, rgb(${TINTS[cfg.colour]} / 0.28) 40%, transparent 80%)`,
        mask: `url(${off.mask})`,
      }
    : undefined;
  return {
    x: o.x,
    y: o.y,
    rx: Math.round(rx * 100) / 100,
    ry: Math.round(rx * frameAspect * 100) / 100,
    intensity: cfg.intensity,
    tint: TINTS[cfg.colour],
    pool: { x: base.x, y: base.y, rx: s ? Math.round((s.right - s.left) * p.width * 0.9 * 100) / 100 : 30 },
    litMask: off.mask ? `url(${off.mask}), ${disc}` : disc,
    core,
  };
}
