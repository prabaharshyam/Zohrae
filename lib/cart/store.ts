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
  /** Sold by the piece with a minimum (wedding magnets: 25). */
  minQuantity?: number;
  attributes?: CartAttribute[];
};
export type Gift = { on: boolean; message: string };
type CartState = { lines: CartLine[]; open: boolean; ready: boolean; gift: Gift };

const KEY = "zohrae:cart";
const MAX = 999;
const GIFT_KEY = "zohrae:gift";
const EMPTY: CartState = { lines: [], open: false, ready: false, gift: { on: false, message: "" } };
let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const gift = JSON.parse(localStorage.getItem(GIFT_KEY) ?? "null");
    state = {
      lines: Array.isArray(saved) ? saved : [],
      open: false,
      ready: true,
      gift:
        gift && typeof gift === "object" ? { on: Boolean(gift.on), message: String(gift.message ?? "") } : EMPTY.gift,
    };
  } catch {
    state = { ...EMPTY, ready: true };
  }
}

function set(patch: Partial<CartState>) {
  load();
  state = { ...state, ...patch };
  if (patch.lines || patch.gift) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.lines));
      localStorage.setItem(GIFT_KEY, JSON.stringify(state.gift));
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
        ? lines.map((l) => (l.id === id ? { ...l, quantity: Math.min(MAX, l.quantity + quantity) } : l))
        : [...lines, { ...line, id, quantity }],
    });
  },
  setQuantity(id: string, quantity: number) {
    const lines = cart.get().lines;
    set({
      lines:
        quantity <= 0
          ? lines.filter((l) => l.id !== id)
          : lines.map((l) =>
              l.id === id
                ? quantity < (l.minQuantity ?? 1)
                  ? l // below the minimum: "Remove" takes it out instead
                  : { ...l, quantity: Math.min(MAX, quantity) }
                : l,
            ),
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
  setGift(gift: Partial<Gift>) {
    set({ gift: { ...cart.get().gift, ...gift } });
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
