"use client";

import { light } from "./store";

/**
 * Each lamp's own switch, on top of the room switch.
 *
 * A lamp follows the room (the floating switch) until someone touches its own
 * gold button; from then on it keeps its own state, until the room switch is
 * flipped again, which brings every lamp back in line. Lamps are keyed by
 * product handle, so the same lamp shown twice on a page lights together.
 */
type Cause = "touch" | "ignite" | "room";

const overrides = new Map<string, boolean>();
const listeners = new Set<() => void>();
let lastCause: Cause = "room";
let lastId: string | null = null;
let seq = 0;
let flips = -1;

function emit(cause: Cause, id: string | null) {
  lastCause = cause;
  lastId = id;
  seq++;
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  light.subscribe(() => {
    const f = light.get().flips;
    if (f === flips) return;
    flips = f;
    if (overrides.size) overrides.clear();
    emit("room", null);
  });
  flips = light.get().flips;
}

export const lamps = {
  /** Effective state: the lamp's own choice, or the room's. */
  isOn(id?: string) {
    return id && overrides.has(id) ? overrides.get(id)! : light.get().on;
  },
  touched(id: string) {
    return overrides.has(id);
  },
  set(id: string, on: boolean, cause: Cause = "touch") {
    overrides.set(id, on);
    emit(cause, id);
  },
  toggle(id: string) {
    lamps.set(id, !lamps.isOn(id));
  },
  /** Why the last change happened, and to which lamp (null: every lamp). */
  last() {
    return { cause: lastCause, id: lastId, seq };
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
