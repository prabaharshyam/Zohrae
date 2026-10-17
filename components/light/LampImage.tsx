"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import type { ImageAsset } from "@/lib/commerce/types";
import { fadeOut, filament } from "@/lib/light/filament";
import type { Placement } from "@/lib/light/geometry";
import { placementStyle } from "@/lib/light/geometry";
import { light } from "@/lib/light/store";

/** Glow geometry, precomputed on the server in frame percentages (see ProductImage). */
export type LampGlow = {
  /** Bulb position in the frame, %. */
  x: number;
  y: number;
  /** Glow radius as % of frame width / height. */
  rx: number;
  ry: number;
  intensity: number;
  /** "r g b" tint from the product's light colour. */
  tint: string;
  /** Light pool on the surface beneath, frame %. */
  pool: { x: number; y: number; rx: number };
  /** Mask for the procedural lit layer, in the off image's own box. */
  litMask?: string;
  /** Inner bulb glow for the procedural layer (off image's box), clipped to the product. */
  core?: { background: string; mask: string };
};

type Props = {
  title: string;
  off?: ImageAsset;
  offPlacement?: Placement;
  on?: ImageAsset;
  onPlacement?: Placement;
  glow?: LampGlow;
  sizes: string;
  priority?: boolean;
  /** No frame background; edges feathered in day mode too (hero use). */
  bare?: boolean;
  className?: string;
};

/**
 * A product image that lives in both day and night. In day mode: the studio
 * shot. With the lights on: a darkened "room" version, plus (for lamps) the
 * lamp switching on with a filament warm-up, staggered outward from the switch.
 */
export function LampImage({
  title,
  off,
  offPlacement,
  on,
  onPlacement,
  glow,
  sizes,
  priority,
  bare,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useLampLevel(ref, Boolean(glow));

  const vars = glow
    ? ({
        "--ox": `${glow.x}%`,
        "--oy": `${glow.y}%`,
        "--orx": `${glow.rx}%`,
        "--ory": `${glow.ry}%`,
        "--intensity": glow.intensity,
        "--tint": glow.tint,
        "--px": `${glow.pool.x}%`,
        "--py": `${glow.pool.y}%`,
        "--prx": `${glow.pool.rx}%`,
        "--sx": `${(glow.x + 30) / 1.6}%`,
        "--sy": `${(glow.y + 30) / 1.6}%`,
      } as CSSProperties)
    : undefined;

  const img = (asset: ImageAsset, cls?: string) => (
    <Image
      src={asset.url}
      alt=""
      fill
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      className={clsx("object-fill", cls)}
    />
  );

  return (
    <div ref={ref} className={clsx("lamp relative", className)} style={vars}>
      <div
        className={clsx("lamp-frame relative aspect-[3/4] overflow-hidden", !bare && "bg-bg-raised")}
        role="img"
        aria-label={off?.alt ?? `${title} — photograph coming soon`}
      >
        {off && offPlacement ? (
          <>
            <div
              className={clsx("lamp-day absolute", bare && "feather", off.onWhite && "on-white")}
              style={placementStyle(offPlacement)}
            >
              {img(off)}
            </div>
            <div className="lamp-night absolute inset-0">
              <div className="lamp-dark absolute" style={placementStyle(offPlacement)}>
                {img(off)}
              </div>
              {glow && on && onPlacement && (
                <div className="lamp-on absolute" style={placementStyle(onPlacement)}>
                  {img(on)}
                </div>
              )}
              {glow && !on && (
                <div className="lamp-lit absolute" style={{ ...placementStyle(offPlacement), maskImage: glow.litMask }}>
                  {img(off)}
                </div>
              )}
              {glow && !on && glow.core && (
                <div
                  className="lamp-core absolute"
                  style={{
                    ...placementStyle(offPlacement),
                    background: glow.core.background,
                    maskImage: glow.core.mask,
                  }}
                />
              )}
              {glow && <div className={clsx("lamp-hotspot absolute inset-0", on && "lamp-hotspot--soft")} />}
              {glow && <div className="lamp-pool absolute inset-0" />}
            </div>
          </>
        ) : (
          <Placeholder title={title} />
        )}
      </div>
      {glow && <div className="lamp-spill" aria-hidden />}
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="lamp-placeholder absolute inset-0 grid place-items-center">
      <div className="relative z-10 flex flex-col items-center gap-5 text-accent-text">
        <Logo variant="monogram" title="" className="size-16 opacity-60" />
        <span className="font-display text-2xl italic text-fg-muted">{title}</span>
      </div>
    </div>
  );
}

/** Small stable hash so each lamp warms up at its own speed. */
function seed(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return (((Math.sin(r.left * 12.9898 + r.top * 78.233) * 43758.5453) % 1) + 1) % 1;
}

/**
 * Drives the lamp's --lamp variable (0–1). Page loads apply the saved state
 * instantly; switch flips animate: on = filament warm-up with one flicker,
 * delayed by distance from the switch; off = a short fade. Off-screen lamps
 * and reduced-motion visitors skip the animation.
 */
function useLampLevel(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let timer = 0;
    let level = light.get().on ? 1 : 0;
    let flips = light.get().flips;
    const write = (v: number) => {
      level = v;
      el.style.setProperty("--lamp", v.toFixed(3));
    };
    write(level);

    const unsubscribe = light.subscribe(() => {
      const s = light.get();
      if (s.flips === flips) return;
      flips = s.flips;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      const target = s.on ? 1 : 0;
      const rect = el.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!visible || reduced) return write(target);

      const run = (fn: (t: number) => number, duration: number) => {
        const t0 = performance.now();
        const step = (now: number) => {
          write(fn(now - t0));
          if (now - t0 < duration) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      };

      if (target === 1) {
        const c = light.switchCentre();
        const dist = Math.hypot(rect.left + rect.width / 2 - c.x, rect.top + rect.height / 2 - c.y);
        const delay = 140 + Math.min(650, dist * 0.45);
        const duration = 450 + seed(el) * 450;
        timer = window.setTimeout(() => run((t) => filament(t, duration), duration), delay);
      } else {
        const from = level;
        run((t) => from * fadeOut(t), 320);
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [ref, enabled]);
}
