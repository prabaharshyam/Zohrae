import type { Commerce } from "../types";

/**
 * Shopify Storefront API adapter — implemented in Phase 4.
 * It will map Storefront GraphQL responses (incl. `zohrae.*` metafields)
 * onto the shared types in ../types.ts.
 */
function notYet(): never {
  throw new Error("The Shopify adapter arrives in Phase 4. Set USE_MOCK_DATA=true until then.");
}

export const shopifyCommerce: Commerce = {
  getCollections: notYet,
  getCollection: notYet,
  getProducts: notYet,
  getProduct: notYet,
};
