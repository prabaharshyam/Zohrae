import { MOCK_COLLECTIONS } from "@/data/mock/collections";
import { MOCK_PRODUCTS } from "@/data/mock/products";
import type { Commerce } from "../types";

export const mockCommerce: Commerce = {
  async getCollections() {
    return MOCK_COLLECTIONS;
  },
  async getCollection(handle) {
    return MOCK_COLLECTIONS.find((c) => c.handle === handle);
  },
  async getProducts({ collection, type, limit } = {}) {
    const items = MOCK_PRODUCTS.filter(
      (p) => (!collection || p.collections.includes(collection)) && (!type || p.type === type),
    );
    return limit ? items.slice(0, limit) : items;
  },
  async getProduct(handle) {
    return MOCK_PRODUCTS.find((p) => p.handle === handle);
  },
};
