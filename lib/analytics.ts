"use client";

/**
 * Analytics events, sent to GA4 and Meta only when the visitor has accepted
 * analytics (the scripts aren't loaded otherwise, so these are no-ops).
 */
type Params = Record<string, unknown>;
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  generate_lead: "Lead",
};

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  if (META[event]) window.fbq?.("track", META[event], params);
}

export const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID);
