import "server-only";
import { cacheLife } from "next/cache";
import { mockCommerce } from "./mock";
import { shopifyCommerce } from "./shopify";
import type { ProductQuery } from "./types";

export type * from "./types";

/** Mock data unless explicitly disabled AND Shopify credentials exist. */
export const usingMockData =
  process.env.USE_MOCK_DATA !== "false" || !process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_TOKEN;

const backend = usingMockData ? mockCommerce : shopifyCommerce;

export async function getCollections() {
  "use cache";
  cacheLife("hours");
  return backend.getCollections();
}

export async function getCollection(handle: string) {
  "use cache";
  cacheLife("hours");
  return backend.getCollection(handle);
}

export async function getProducts(query: ProductQuery = {}) {
  "use cache";
  cacheLife("hours");
  return backend.getProducts(query);
}

export async function getProduct(handle: string) {
  "use cache";
  cacheLife("hours");
  return backend.getProduct(handle);
}
