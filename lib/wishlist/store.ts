"use client";

import { useSyncExternalStore } from "react";

/** The Dream Room: product handles the visitor has saved, kept in localStorage. */
const KEY = "zohrae:dream-room";
const EMPTY: string[] = [];
let saved: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    saved = Array.isArray(v) ? v.filter((h) => typeof h === "string") : [];
  } catch {
    saved = [];
  }
}

export const wishlist = {
  get() {
    load();
    return saved;
  },
  has(handle: string) {
    return wishlist.get().includes(handle);
  },
  toggle(handle: string) {
    const list = wishlist.get();
    saved = list.includes(handle) ? list.filter((h) => h !== handle) : [...list, handle];
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      // Not persisted.
    }
    listeners.forEach((l) => l());
    return saved.includes(handle);
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useWishlist() {
  return useSyncExternalStore(wishlist.subscribe, wishlist.get, () => EMPTY);
}
