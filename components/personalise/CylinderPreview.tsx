"use client";

import { useEffect, useRef } from "react";

export type Box = { cx: number; cy: number; w: number; h: number };

type Props = {
  /** Base photograph (a cut-out with alpha, or a full photo). */
  src: string;
  width: number;
  height: number;
  /** Tint the object (multiply), keeping its shading; cut-outs only. */
  tint?: string;
  text: string;
  fontFamily: string;
  ink: string;
  /** Foil inks get a metallic gradient and a soft highlight. */
  foil?: boolean;
  /** The printable area, as fractions of the photo. */
  box: Box;
  /** How much the lettering bows with the cylinder (fraction of box height). */
  bow?: number;
  /** Glass: lettering is partly transparent. */
  opacity?: number;
  alt: string;
};

const cache = new Map<string, Promise<HTMLImageElement>>();
function load(src: string) {
  if (!cache.has(src)) {
    cache.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      }),
    );
  }
  return cache.get(src)!;
}

function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c((n >> 16) & 255)} ${c((n >> 8) & 255)} ${c(n & 255)})`;
}

/**
 * A photograph with a name wrapped onto a cylinder (a tumbler, a glass):
 * the lettering is drawn flat, then re-sampled column by column so it
 * compresses toward the edges and bows with the curve, and dims as it turns
 * away from the light, as a real decal would.
 */
export function CylinderPreview({
  src,
  width,
  height,
  tint,
  text,
  fontFamily,
  ink,
  foil,
  box,
  bow = 0.08,
  opacity = 1,
  alt,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [img] = await Promise.all([load(src), document.fonts.load(`80px ${fontFamily}`).catch(() => null)]);
      const canvas = ref.current;
      if (cancelled || !canvas) return;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      if (tint) {
        // Multiply the colour in, then keep only the object's own pixels.
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = tint;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(img, 0, 0, width, height);
        ctx.globalCompositeOperation = "source-over";
      }

      const value = text.trim();
      if (!value) return;
      const bw = box.w * width;
      const bh = box.h * height;

      // 1. Lettering, flat, fitted to the box.
      const flat = document.createElement("canvas");
      flat.width = Math.ceil(bw);
      flat.height = Math.ceil(bh);
      const f = flat.getContext("2d")!;
      let size = bh * 0.8;
      f.font = `${size}px ${fontFamily}`;
      const measured = f.measureText(value).width;
      if (measured > bw * 0.86) size *= (bw * 0.86) / measured;
      f.font = `${size}px ${fontFamily}`;
      f.textAlign = "center";
      f.textBaseline = "middle";
      if (foil) {
        const g = f.createLinearGradient(0, bh * 0.2, 0, bh * 0.8);
        g.addColorStop(0, shade(ink, 1.35));
        g.addColorStop(0.45, ink);
        g.addColorStop(0.55, shade(ink, 0.78));
        g.addColorStop(1, shade(ink, 1.15));
        f.fillStyle = g;
      } else f.fillStyle = ink;
      f.fillText(value, bw / 2, bh / 2);

      // 2. Wrap it around the cylinder, one column at a time.
      const x0 = box.cx * width - bw / 2;
      const y0 = box.cy * height - bh / 2;
      ctx.save();
      for (let dx = 0; dx < bw; dx++) {
        const t = (dx / bw) * 2 - 1; // -1..1 across the visible face
        const u = (Math.asin(Math.max(-1, Math.min(1, t))) / (Math.PI / 2) + 1) / 2; // where on the flat label
        const lift = bow * bh * (1 - Math.sqrt(1 - t * t)); // the curve bows the line downward at the edges
        ctx.globalAlpha = opacity * (0.55 + 0.45 * Math.cos(t * 1.25)); // turning away from the light
        ctx.drawImage(flat, u * (flat.width - 1), 0, 1, flat.height, x0 + dx, y0 + lift, 1.4, bh);
      }
      ctx.restore();
    })();
    return () => {
      cancelled = true;
    };
  }, [src, width, height, tint, text, fontFamily, ink, foil, box, bow, opacity]);

  return <canvas ref={ref} width={width} height={height} role="img" aria-label={alt} className="block size-full" />;
}
