"use client";

import { useSyncExternalStore } from "react";
import { KELVIN, kelvinToCssRgb } from "./kelvin";

/**
 * Global light state: one tiny external store, read with useLight().
 * Writing it updates <html data-lights> and the CSS variables the whole
 * site is styled from, and remembers the choice in localStorage.
 * The inline script in app/layout.tsx applies the saved state before first paint.
 */
export type LightState = {
  on: boolean;
  /** 0.1–1 */
  dim: number;
  /** 2200–3500 */
  kelvin: number;
  sound: boolean;
  /** Increments on every switch flip so lamps can tell a flip from a page load. */
  flips: number;
};

export const STORAGE_KEY = "zohrae:light";
const DEFAULTS: LightState = { on: false, dim: 1, kelvin: KELVIN.warm, sound: false, flips: 0 };

let state: LightState = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();
let switchEl: HTMLElement | null = null;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && typeof saved === "object") {
      state = {
        ...DEFAULTS,
        on: Boolean(saved.on),
        dim: clamp(Number(saved.dim) || 1, 0.1, 1),
        kelvin: clamp(Number(saved.kelvin) || KELVIN.warm, KELVIN.min, KELVIN.max),
        sound: Boolean(saved.sound),
      };
    }
  } catch {
    // Private mode or blocked storage: start with the defaults.
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function apply() {
  const root = document.documentElement;
  root.dataset.lights = state.on ? "on" : "off";
  root.style.setProperty("--dim", String(state.dim));
  root.style.setProperty("--glow-rgb", kelvinToCssRgb(state.kelvin));
  root.style.setProperty("--candle", ((KELVIN.max - state.kelvin) / (KELVIN.max - KELVIN.min)).toFixed(3));
}

function set(patch: Partial<LightState>) {
  load();
  state = { ...state, ...patch };
  apply();
  try {
    const { on, dim, kelvin, sound } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ on, dim, kelvin, sound }));
  } catch {
    // Not persisted; the page still works.
  }
  listeners.forEach((l) => l());
}

export const light = {
  get(): LightState {
    load();
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  toggle() {
    set({ on: !state.on, flips: state.flips + 1 });
  },
  setOn(on: boolean) {
    if (on !== state.on) set({ on, flips: state.flips + 1 });
  },
  setDim: (dim: number) => set({ dim: clamp(dim, 0.1, 1) }),
  setKelvin: (kelvin: number) => set({ kelvin: clamp(kelvin, KELVIN.min, KELVIN.max) }),
  setSound: (sound: boolean) => set({ sound }),
  goldenHour() {
    set({ on: true, dim: 0.7, kelvin: KELVIN.candle, flips: state.on ? state.flips : state.flips + 1 });
  },
  /** The floating switch registers itself so light can "travel" outward from it. */
  registerSwitch(el: HTMLElement | null) {
    switchEl = el;
  },
  switchCentre(): { x: number; y: number } {
    if (!switchEl) return { x: window.innerWidth - 60, y: window.innerHeight - 60 };
    const r = switchEl.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  },
};

const serverSnapshot = () => DEFAULTS;

export function useLight() {
  return useSyncExternalStore(light.subscribe, light.get, serverSnapshot);
}

/** Inline, pre-hydration version of load()+apply(); keep in sync with STORAGE_KEY and apply(). */
export const LIGHT_BOOT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("${STORAGE_KEY}")||"null");if(s&&s.on){document.documentElement.dataset.lights="on"}if(s&&s.dim){document.documentElement.style.setProperty("--dim",String(Math.min(1,Math.max(.1,+s.dim))))}}catch(e){}`;
