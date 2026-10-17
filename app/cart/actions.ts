"use server";

import { usingMockData } from "@/lib/commerce";
import { createCheckout } from "@/lib/commerce/shopify";

type Line = { variantId: string; quantity: number; attributes?: { key: string; value: string }[] };

/**
 * Hand the bag to Shopify's hosted, secure checkout. While the store runs on
 * placeholder data there's nothing to pay for yet, so it says so honestly.
 */
export async function startCheckout(lines: Line[]): Promise<{ url: string } | { error: "preview" | "failed" }> {
  const clean = lines
    .filter((l) => typeof l.variantId === "string" && l.quantity > 0)
    .slice(0, 50)
    .map((l) => ({
      variantId: l.variantId,
      quantity: Math.min(20, Math.floor(l.quantity)),
      attributes: (l.attributes ?? [])
        .slice(0, 10)
        .map((a) => ({ key: String(a.key).slice(0, 60), value: String(a.value).slice(0, 500) })),
    }));
  if (!clean.length) return { error: "failed" };
  if (usingMockData) return { error: "preview" };
  try {
    return { url: await createCheckout(clean) };
  } catch (e) {
    console.error("Checkout failed", e);
    return { error: "failed" };
  }
}
