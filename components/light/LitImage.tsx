"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import type { ImageAsset } from "@/lib/commerce/types";
import { useLampLevel } from "./useLampLevel";

type Props = {
  title: string;
  /** Lamp switched off. */
  off?: ImageAsset;
  /** The same shot, lamp switched on: identical framing, so the crossfade is all light. */
  on?: ImageAsset;
  /** "contain" for cut-outs on a card, "cover" for full scenes. */
  fit?: "contain" | "cover";
  sizes: string;
  priority?: boolean;
  /** Frame classes, e.g. aspect ratio and background. */
  frameClassName?: string;
  className?: string;
};

/**
 * A matched pair of photographs, crossfaded by the light switch. The lit
 * photo fades in on a filament curve (fast rise, tiny flicker, slow settle);
 * the dimmer blends between the two photos.
 */
export function LitImage({ title, off, on, fit = "contain", sizes, priority, frameClassName, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useLampLevel(ref, Boolean(on));

  const img = (asset: ImageAsset, cls?: string) => (
    <Image
      src={asset.url}
      alt={cls === "lit-on" ? "" : asset.alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      className={clsx(
        fit === "cover" || asset.scene ? "object-cover" : "object-contain",
        asset.onWhite && "on-white",
        cls,
      )}
    />
  );

  return (
    <div ref={ref} className={clsx("lit relative overflow-hidden", frameClassName, className)}>
      {off ? (
        <>
          {fit === "contain" && on && <div className="lit-halo absolute inset-0" aria-hidden />}
          {img(off)}
          {on && img(on, "lit-on")}
        </>
      ) : (
        <Placeholder title={title} />
      )}
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div
      role="img"
      aria-label={`${title}, photograph coming soon`}
      className="lit-placeholder absolute inset-0 grid place-items-center"
    >
      <div className="flex flex-col items-center gap-5 text-accent-text">
        <Logo variant="monogram" title="" className="size-16 opacity-60" />
        <span className="font-display text-2xl italic text-fg-muted">{title}</span>
      </div>
    </div>
  );
}
