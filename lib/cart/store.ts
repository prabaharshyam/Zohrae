"use client";

import { useSyncExternalStore } from "react";

/**
 * The bag: a tiny external store, kept in localStorage so it survives
 * reloads. Checkout hands the lines to Shopify (app/cart/actions.ts), which
 * owns the real cart, prices and payment.
 */
export type CartAttribute = { key: string; value: string };
export type CartLine = {
  /** Variant + attributes: the same lamp with a different engraving is a separate line. */
  id: string;
  variantId: string;
  handle: string;
  title: string;
  variantTitle: string;
  /** Unit price, INR major units. */
  price: number;
  image?: { url: string; alt: string };
  quantity: number;
  attributes?: CartAttribute[];
};
type CartState = { lines: CartLine[]; open: boolean; ready: boolean };

const KEY = "zohrae:cart";
const EMPTY: CartState = { lines: [], open: false, ready: false };
let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    state = { lines: Array.isArray(saved) ? saved : [], open: false, ready: true };
  } catch {
    state = { ...EMPTY, ready: true };
  }
}

function set(patch: Partial<CartState>) {
  load();
  state = { ...state, ...patch };
  if (patch.lines) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.lines));
    } catch {
      // Not persisted; the bag still works for this visit.
    }
  }
  listeners.forEach((l) => l());
}

const lineId = (variantId: string, attributes?: CartAttribute[]) =>
  variantId + (attributes?.length ? "|" + attributes.map((a) => `${a.key}=${a.value}`).join("&") : "");

export const cart = {
  get(): CartState {
    load();
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  add(line: Omit<CartLine, "id" | "quantity"> & { quantity?: number }) {
    const id = lineId(line.variantId, line.attributes);
    const lines = cart.get().lines;
    const existing = lines.find((l) => l.id === id);
    const quantity = line.quantity ?? 1;
    set({
      lines: existing
        ? lines.map((l) => (l.id === id ? { ...l, quantity: Math.min(20, l.quantity + quantity) } : l))
        : [...lines, { ...line, id, quantity }],
    });
  },
  setQuantity(id: string, quantity: number) {
    const lines = cart.get().lines;
    set({
      lines:
        quantity <= 0
          ? lines.filter((l) => l.id !== id)
          : lines.map((l) => (l.id === id ? { ...l, quantity: Math.min(20, quantity) } : l)),
    });
  },
  remove(id: string) {
    cart.setQuantity(id, 0);
  },
  clear() {
    set({ lines: [] });
  },
  open() {
    set({ open: true });
  },
  close() {
    set({ open: false });
  },
};

export const cartCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const cartSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity * l.price, 0);

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.get, () => EMPTY);
}
