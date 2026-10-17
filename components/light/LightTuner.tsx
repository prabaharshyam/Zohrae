"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { GlowConfig, LightColour, Product } from "@/lib/commerce/types";
import { alignPlacement, coverPlacement, toImage } from "@/lib/light/geometry";
import { lampGlow } from "@/lib/light/glow";
import { light } from "@/lib/light/store";
import { LampImage } from "./LampImage";

const FRAME_ASPECT = 3 / 4;
const COLOURS: LightColour[] = ["amber", "warm white", "rose"];
const DEFAULT_GLOW: GlowConfig = { origin: { x: 0.5, y: 0.4 }, radius: 0.5, intensity: 1, colour: "warm white" };

/** /dev/lights: tune each lamp's glow on its real photo and copy the metafield values. */
export function LightTuner({ products }: { products: Product[] }) {
  const [handle, setHandle] = useState(products[0]?.handle);
  const product = products.find((p) => p.handle === handle) ?? products[0];
  const [glows, setGlows] = useState<Record<string, GlowConfig>>(() =>
    Object.fromEntries(products.map((p) => [p.handle, p.glow ?? DEFAULT_GLOW])),
  );
  const [useAiShot, setUseAiShot] = useState(true);
  const [copied, setCopied] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const ids = { product: useId(), radius: useId(), intensity: useId(), colour: useId(), ai: useId(), out: useId() };

  useEffect(() => light.setOn(true), []);

  const cfg = glows[product.handle];
  const off = product.images[0];
  const offPlacement = off ? coverPlacement(off, FRAME_ASPECT) : undefined;
  const on = useAiShot && off ? product.imageOn : undefined;
  const onPlacement = on && off && offPlacement ? alignPlacement(on, off, offPlacement, FRAME_ASPECT) : undefined;
  const glow = useMemo(() => lampGlow(cfg, off, offPlacement, FRAME_ASPECT), [cfg, off, offPlacement]);
  const update = (patch: Partial<GlowConfig>) => setGlows((g) => ({ ...g, [product.handle]: { ...cfg, ...patch } }));

  const json = JSON.stringify(
    {
      glow_origin: { x: round(cfg.origin.x), y: round(cfg.origin.y) },
      glow_radius: round(cfg.radius),
      glow_intensity: round(cfg.intensity),
      light_colour: cfg.colour,
    },
    null,
    2,
  );

  const drag = (e: React.PointerEvent) => {
    if (!offPlacement || !frameRef.current || (e.type === "pointermove" && e.buttons !== 1)) return;
    const r = frameRef.current.getBoundingClientRect();
    const fx = ((e.clientX - r.left) / r.width) * 100;
    const fy = ((e.clientY - r.top) / r.height) * 100;
    const p = toImage(offPlacement, fx, fy);
    update({ origin: { x: clamp01(p.x), y: clamp01(p.y) } });
  };

  return (
    <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,420px)_1fr]">
      <div className="relative">
        <LampImage
          key={product.handle + String(useAiShot)}
          title={product.title}
          off={off}
          offPlacement={offPlacement}
          on={on}
          onPlacement={onPlacement}
          glow={glow}
          sizes="420px"
          priority
        />
        <div
          ref={frameRef}
          className="absolute inset-x-0 top-0 aspect-[3/4] cursor-crosshair touch-none"
          onPointerDown={drag}
          onPointerMove={drag}
          aria-label="Drag to place the bulb"
          role="presentation"
        >
          <span
            className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ochre bg-ochre/30"
            style={{ left: `${glow.x}%`, top: `${glow.y}%` }}
          />
        </div>
      </div>

      <div className="max-w-md space-y-6">
        <Field id={ids.product} label="Product">
          <select
            id={ids.product}
            value={product.handle}
            onChange={(e) => setHandle(e.target.value)}
            className="tuner-input"
          >
            {products.map((p) => (
              <option key={p.handle} value={p.handle}>
                {p.title}
                {p.imageOn ? " (AI lit shot)" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field id={ids.radius} label={`Radius ${cfg.radius.toFixed(2)}`}>
          <input
            id={ids.radius}
            type="range"
            min={0.15}
            max={0.9}
            step={0.01}
            value={cfg.radius}
            onChange={(e) => update({ radius: Number(e.target.value) })}
            className="light-range w-full"
          />
        </Field>
        <Field id={ids.intensity} label={`Intensity ${cfg.intensity.toFixed(2)}`}>
          <input
            id={ids.intensity}
            type="range"
            min={0.3}
            max={1.5}
            step={0.05}
            value={cfg.intensity}
            onChange={(e) => update({ intensity: Number(e.target.value) })}
            className="light-range w-full"
          />
        </Field>
        <Field id={ids.colour} label="Light colour">
          <select
            id={ids.colour}
            value={cfg.colour}
            onChange={(e) => update({ colour: e.target.value as LightColour })}
            className="tuner-input"
          >
            {COLOURS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        {product.imageOn && (
          <label htmlFor={ids.ai} className="flex items-center gap-3 text-sm">
            <input id={ids.ai} type="checkbox" checked={useAiShot} onChange={(e) => setUseAiShot(e.target.checked)} />
            Use the AI lit shot (untick to tune the procedural glow)
          </label>
        )}
        <Field id={ids.out} label="Metafield values">
          <textarea id={ids.out} readOnly value={json} rows={9} className="tuner-input font-mono text-xs" />
        </Field>
        <button
          type="button"
          className="label bg-ochre px-6 py-3 text-espresso"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(json);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              (document.getElementById(ids.out) as HTMLTextAreaElement | null)?.select();
            }
          }}
        >
          {copied ? "Copied" : "Copy values"}
        </button>
      </div>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block text-fg-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

const round = (v: number) => Math.round(v * 1000) / 1000;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
