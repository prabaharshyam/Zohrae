import type { ImageAsset } from "@/lib/commerce/types";

/**
 * Where an image sits inside a fixed-aspect frame, in percentages of the
 * frame, so the "off" photo, the AI "on" photo and the glow can be stacked
 * in exactly the same place on the server, with no layout measuring.
 */
export type Placement = { left: number; top: number; width: number; height: number };

const r = (v: number) => Math.round(v * 100) / 100;

/** object-fit: cover, anchored at focusY (0 top – 1 bottom). frameAspect = width / height. */
export function coverPlacement(
  img: Pick<ImageAsset, "width" | "height">,
  frameAspect: number,
  focusY = 0.68,
): Placement {
  const imgAspect = img.width / img.height;
  if (imgAspect < frameAspect) {
    const height = (frameAspect / imgAspect) * 100;
    return { left: 0, width: 100, height: r(height), top: r((100 - height) * focusY) };
  }
  const width = (imgAspect / frameAspect) * 100;
  return { top: 0, height: 100, width: r(width), left: r((100 - width) / 2) };
}

/**
 * Places `img` so its subject (the lamp) lands exactly on `target`'s subject.
 * Falls back to the target's own placement when either image lacks a subject box.
 */
export function alignPlacement(
  img: ImageAsset,
  target: ImageAsset,
  targetPlacement: Placement,
  frameAspect: number,
): Placement {
  const a = target.subject;
  const b = img.subject;
  if (!a || !b) return coverPlacement(img, frameAspect);
  const subjTop = targetPlacement.top + a.top * targetPlacement.height;
  const subjHeight = (a.bottom - a.top) * targetPlacement.height;
  const centreX = targetPlacement.left + ((a.left + a.right) / 2) * targetPlacement.width;
  const height = subjHeight / (b.bottom - b.top);
  const width = (height * (img.width / img.height)) / frameAspect;
  return {
    height: r(height),
    width: r(width),
    top: r(subjTop - b.top * height),
    left: r(centreX - ((b.left + b.right) / 2) * width),
  };
}

/** A point given in image fractions → frame percentages. */
export function toFrame(p: Placement, x: number, y: number) {
  return { x: r(p.left + x * p.width), y: r(p.top + y * p.height) };
}

/** A point in frame percentages → image fractions (used by the /dev/lights tuner). */
export function toImage(p: Placement, x: number, y: number) {
  return { x: (x - p.left) / p.width, y: (y - p.top) / p.height };
}

export const placementStyle = (p: Placement) => ({
  left: `${p.left}%`,
  top: `${p.top}%`,
  width: `${p.width}%`,
  height: `${p.height}%`,
});
