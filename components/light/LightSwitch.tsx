"use client";

import clsx from "clsx";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { copy } from "@/copy/en";
import { KELVIN } from "@/lib/light/kelvin";
import { playClick } from "@/lib/light/sound";
import { light, useLight } from "@/lib/light/store";

const NUDGE_KEY = "zohrae:light-nudge";

/**
 * The floating "Lumière" rocker switch. Tap to flip every lamp on the page;
 * press and hold (or use ⋯) for the dimmer, warmth and Golden hour.
 */
export function LightSwitch() {
  const state = useLight();
  const [panelOpen, setPanelOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const panelId = useId();
  const plateRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef(0);
  const held = useRef(false);

  useEffect(() => {
    light.registerSwitch(plateRef.current);
    return () => light.registerSwitch(null);
  }, []);

  // Evening nudge: once per session, after 7pm, when the lights are off.
  useEffect(() => {
    const hour = new Date().getHours();
    if (light.get().on || (hour < 19 && hour >= 5)) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(NUDGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const t = window.setTimeout(() => setNudge(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const dismissNudge = useCallback(() => {
    setNudge(false);
    try {
      sessionStorage.setItem(NUDGE_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const flip = useCallback(() => {
    const next = !light.get().on;
    light.toggle();
    if (light.get().sound) playClick(next);
    navigator.vibrate?.(10);
    dismissNudge();
  }, [dismissNudge]);

  // Escape / outside click closes the panel.
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanelOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [panelOpen]);

  const startHold = () => {
    held.current = false;
    holdTimer.current = window.setTimeout(() => {
      held.current = true;
      setPanelOpen(true);
      navigator.vibrate?.(15);
    }, 520);
  };
  const endHold = () => clearTimeout(holdTimer.current);

  return (
    <div
      ref={wrapRef}
      className="light-switch fixed z-40 flex flex-col items-center"
      style={{
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {nudge && !state.on && (
        <div
          role="status"
          className="absolute bottom-full mb-4 w-[min(300px,calc(100vw-32px))] border border-line bg-bg-raised p-4 text-sm shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)] right-0"
        >
          <p className="font-display text-lg italic leading-snug">{copy.light.nudge}</p>
          <div className="mt-3 flex gap-4">
            <button type="button" className="label text-accent-text" onClick={flip}>
              {copy.light.nudgeCta}
            </button>
            <button type="button" className="label text-fg-muted" onClick={dismissNudge}>
              {copy.light.nudgeDismiss}
            </button>
          </div>
        </div>
      )}

      {panelOpen && <LightPanel id={panelId} onClose={() => setPanelOpen(false)} />}

      <div className="flex items-end gap-2">
        <button
          ref={plateRef}
          type="button"
          role="switch"
          aria-checked={state.on}
          aria-label={copy.light.switchLabel}
          aria-describedby={`${panelId}-hint`}
          className={clsx("switch-plate", state.on && "is-on", nudge && !state.on && "is-nudging")}
          onClick={() => {
            if (held.current) {
              held.current = false;
              return;
            }
            flip();
          }}
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="switch-screw" aria-hidden />
          <span className="switch-rocker" aria-hidden>
            <span className="switch-pilot" />
          </span>
          <span className="switch-screw" aria-hidden />
        </button>
        <button
          type="button"
          className="switch-more grid size-9 place-items-center rounded-full border border-line bg-bg-raised text-fg-muted"
          aria-label={panelOpen ? copy.light.closeSettings : copy.light.settings}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          onClick={() => setPanelOpen((v) => !v)}
        >
          <svg viewBox="0 0 20 20" width={16} height={16} fill="currentColor" aria-hidden>
            <circle cx="4" cy="10" r="1.4" />
            <circle cx="10" cy="10" r="1.4" />
            <circle cx="16" cy="10" r="1.4" />
          </svg>
        </button>
      </div>
      <p className="label mt-2 text-[9px] text-fg-muted" aria-hidden>
        {copy.light.label} · {state.on ? copy.light.on : copy.light.off}
      </p>
      <p id={`${panelId}-hint`} className="sr-only">
        {copy.light.longPressHint}
      </p>
    </div>
  );
}

function LightPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const { dim, kelvin } = useLight();
  const dimId = useId();
  const warmId = useId();

  return (
    <div
      id={id}
      role="dialog"
      aria-label={copy.light.settings}
      className="absolute bottom-full mb-4 w-[min(300px,calc(100vw-32px))] border border-line bg-bg-raised p-5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)] right-0"
    >
      <div className="flex items-center justify-between">
        <p className="label text-fg-muted">{copy.light.settings}</p>
        <button type="button" className="label text-fg-muted" onClick={onClose} aria-label={copy.light.closeSettings}>
          ✕
        </button>
      </div>

      <label htmlFor={dimId} className="label mt-5 flex justify-between">
        <span>{copy.light.dimmer}</span>
        <span className="tabular-nums text-fg-muted">{Math.round(dim * 100)}%</span>
      </label>
      <input
        id={dimId}
        type="range"
        min={10}
        max={100}
        value={Math.round(dim * 100)}
        onChange={(e) => {
          light.setOn(true);
          light.setDim(Number(e.target.value) / 100);
        }}
        className="light-range mt-2 w-full"
      />

      <label htmlFor={warmId} className="label mt-5 flex justify-between">
        <span>{copy.light.warmth}</span>
        <span className="tabular-nums text-fg-muted">{kelvin}K</span>
      </label>
      <input
        id={warmId}
        type="range"
        min={KELVIN.min}
        max={KELVIN.max}
        step={50}
        value={kelvin}
        onChange={(e) => {
          light.setOn(true);
          light.setKelvin(Number(e.target.value));
        }}
        className="light-range light-range--warmth mt-2 w-full"
      />
      <div className="mt-1 flex justify-between text-[10px] text-fg-muted" aria-hidden>
        {copy.light.warmthStops.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="label flex-1 bg-ochre px-3 py-3 text-espresso"
          onClick={() => light.goldenHour()}
        >
          {copy.light.goldenHour}
        </button>
        <button
          type="button"
          className="label border border-line px-3 py-3"
          onClick={() => {
            light.setDim(1);
            light.setKelvin(KELVIN.warm);
          }}
        >
          {copy.light.reset}
        </button>
      </div>
    </div>
  );
}
