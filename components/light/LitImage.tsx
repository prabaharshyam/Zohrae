"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/brand/Logo";
import { copy } from "@/copy/en";
import type { ImageAsset } from "@/lib/commerce/types";
import { lamps } from "@/lib/light/lamps";
import { playClick } from "@/lib/light/sound";
import { light } from "@/lib/light/store";
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
  /** The lamp's own switch: a gold button on its base (needs off.switchAt). Keyed by product handle. */
  lampId?: string;
  /** Light up by itself the first time it's seen (once per visit), unless already touched. */
  ignite?: boolean;
};

const ignited = new Set<string>();

/**
 * A matched pair of photographs, crossfaded by the light. The lit photo fades
 * in on a filament curve; the dimmer blends between the two photos. With a
 * lampId, a gold touch-switch sits on the lamp's base and lights this lamp alone.
 */
export function LitImage({
  title,
  off,
  on,
  fit = "contain",
  sizes,
  priority,
  frameClassName,
  className,
  lampId,
  ignite,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useLampLevel(ref, Boolean(on), lampId);
  const touchable = Boolean(lampId && on && off?.switchAt);
  // In a cover crop, keep the lamp in frame on narrow screens.
  const focus = off?.switchAt ? `${(off.switchAt[0] * 100).toFixed(1)}% 50%` : undefined;

  useEffect(() => {
    const el = ref.current;
    if (!ignite || !lampId || !on || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || ignited.has(lampId)) return;
        t = window.setTimeout(() => {
          if (ignited.has(lampId) || lamps.touched(lampId) || light.get().on) return;
          ignited.add(lampId);
          lamps.set(lampId, true, "ignite");
        }, 450);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [ignite, lampId, on]);

  const img = (asset: ImageAsset, cls?: string) => (
    <Image
      src={asset.url}
      alt={cls === "lit-on" ? "" : asset.alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority && cls !== "lit-on" ? "high" : undefined}
      style={fit === "cover" && focus ? { objectPosition: focus } : undefined}
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
          {touchable && <TouchSwitch asset={off} fit={fit} title={title} id={lampId!} />}
        </>
      ) : (
        <Placeholder title={title} />
      )}
    </div>
  );
}

/** Where a point of the photo lands in the frame (untransformed px), for object-fit contain/cover. */
function place(
  frame: { width: number; height: number },
  asset: ImageAsset,
  fit: "contain" | "cover",
  [fx, fy]: [number, number],
) {
  const s = (fit === "cover" ? Math.max : Math.min)(frame.width / asset.width, frame.height / asset.height);
  const w = asset.width * s;
  const h = asset.height * s;
  // object-position: x follows the focus (the switch itself), y is centred.
  const left = fit === "cover" ? (frame.width - w) * fx : (frame.width - w) / 2;
  const top = (frame.height - h) / 2;
  return { x: left + w * fx, y: top + h * fy };
}

function TouchSwitch({
  asset,
  fit,
  title,
  id,
}: {
  asset: ImageAsset;
  fit: "contain" | "cover";
  title: string;
  id: string;
}) {
  // Its own frame-sized layer to measure: the parent's ref isn't attached yet when this mounts.
  const frame = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const isOn = useSyncExternalStore(
    (cb) => {
      const a = lamps.subscribe(cb);
      const b = light.subscribe(cb);
      return () => {
        a();
        b();
      };
    },
    () => lamps.isOn(id),
    () => false,
  );

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el || !asset.switchAt) return;
    const measure = () =>
      setPos(place({ width: el.offsetWidth, height: el.offsetHeight }, asset, fit, asset.switchAt!));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [frame, asset, fit]);

  return (
    <span ref={frame} className="pointer-events-none absolute inset-0 z-20">
      {pos && (
        <button
          type="button"
          data-silent
          data-cursor={isOn ? copy.light.touchOff : copy.light.touchOn}
          aria-pressed={isOn}
          aria-label={`${isOn ? "Turn off" : "Turn on"} ${title}`}
          className="lamp-touch"
          style={{ left: pos.x, top: pos.y }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            lamps.toggle(id);
            if (light.get().sound) playClick(lamps.isOn(id));
          }}
        >
          <span aria-hidden className="lamp-touch-dot" />
        </button>
      )}
    </span>
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
