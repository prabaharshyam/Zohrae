import type { Collection, Commerce, ImageAsset, Product, ProductType } from "../types";
import { storefront } from "./client";

/**
 * Shopify Storefront adapter: maps Storefront GraphQL onto the shared types.
 * Product extras live in `zohrae.*` metafields (see SHOPIFY-SETUP.md):
 * tagline, story, image_off / image_on / stage_off / stage_on (file
 * references), switch_at and stage_switch_at (JSON [x, y]), handcraft_hours,
 * edition_size; collections use zohrae.eyebrow and zohrae.hidden.
 */

const PRODUCT_METAFIELDS = [
  "tagline",
  "story",
  "image_off",
  "image_on",
  "stage_off",
  "stage_on",
  "switch_at",
  "stage_switch_at",
  "handcraft_hours",
  "edition_size",
  "dimensions",
  "weight",
  "material",
  "finish",
  "bulb_type",
  "cable_length",
];

const IMAGE = `url width height altText`;
const PRODUCT_FIELDS = `
  id handle title productType description tags availableForSale
  collections(first: 20) { nodes { handle } }
  priceRange { minVariantPrice { amount } maxVariantPrice { amount } }
  options { name optionValues { name swatch { color } } }
  images(first: 12) { nodes { ${IMAGE} } }
  variants(first: 100) {
    nodes {
      id title availableForSale
      price { amount } compareAtPrice { amount }
      selectedOptions { name value }
    }
  }
  metafields(identifiers: [${PRODUCT_METAFIELDS.map((k) => `{ namespace: "zohrae", key: "${k}" }`).join(", ")}]) {
    key value
    reference { ... on MediaImage { image { ${IMAGE} } } }
  }
`;

type ShopImage = { url: string; width: number; height: number; altText: string | null };
type ShopProduct = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  description: string;
  tags: string[];
  availableForSale: boolean;
  collections: { nodes: { handle: string }[] };
  priceRange: { minVariantPrice: { amount: string }; maxVariantPrice: { amount: string } };
  options: { name: string; optionValues: { name: string; swatch: { color: string | null } | null }[] }[];
  images: { nodes: ShopImage[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string };
      compareAtPrice: { amount: string } | null;
      selectedOptions: { name: string; value: string }[];
    }[];
  };
  metafields: ({ key: string; value: string; reference: { image?: ShopImage } | null } | null)[];
};

const money = (amount: string) => ({ amount: Number(amount), currencyCode: "INR" as const });
const TYPES: ProductType[] = ["Lamp", "Vase", "Planter", "Art Frame", "Decor", "Custom Gift", "Wedding"];

function toImage(img: ShopImage, alt: string, extra: Partial<ImageAsset> = {}): ImageAsset {
  return { url: img.url, width: img.width, height: img.height, alt: img.altText || alt, ...extra };
}

function parsePoint(v?: string): [number, number] | undefined {
  try {
    const p = v ? JSON.parse(v) : undefined;
    return Array.isArray(p) && p.length === 2 ? [Number(p[0]), Number(p[1])] : undefined;
  } catch {
    return undefined;
  }
}

function toProduct(p: ShopProduct): Product {
  const meta = Object.fromEntries(p.metafields.filter(Boolean).map((m) => [m!.key, m!]));
  const text = (k: string) => meta[k]?.value || undefined;
  const img = (k: string, alt: string, extra?: Partial<ImageAsset>) => {
    const i = meta[k]?.reference?.image;
    return i ? toImage(i, alt, extra) : undefined;
  };
  const swatches = new Map(p.options.flatMap((o) => o.optionValues.map((v) => [v.name, v.swatch?.color ?? undefined])));
  const imageOff = img("image_off", `${p.title}, switched off`, { switchAt: parsePoint(text("switch_at")) });
  const stageOff = img("stage_off", `${p.title} in the showroom`, { switchAt: parsePoint(text("stage_switch_at")) });
  const gallery = p.images.nodes.map((i) => toImage(i, p.title));
  const type = (TYPES as string[]).includes(p.productType) ? (p.productType as ProductType) : "Decor";

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    type,
    tagline: text("tagline") ?? "",
    description: p.description,
    story: text("story"),
    priceRange: { min: money(p.priceRange.minVariantPrice.amount), max: money(p.priceRange.maxVariantPrice.amount) },
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: money(v.price.amount),
      compareAtPrice: v.compareAtPrice ? money(v.compareAtPrice.amount) : undefined,
      selectedOptions: v.selectedOptions,
      swatch: v.selectedOptions.map((o) => swatches.get(o.value)).find(Boolean),
    })),
    options: p.options.map((o) => ({ name: o.name, values: o.optionValues.map((v) => v.name) })),
    availableForSale: p.availableForSale,
    tags: p.tags,
    collections: p.collections.nodes.map((c) => c.handle),
    images: imageOff ? [imageOff, ...gallery] : gallery,
    imageOff:
      imageOff ?? (gallery[0] && type !== "Vase" && type !== "Planter" ? { ...gallery[0], scene: true } : gallery[0]),
    imageOn: img("image_on", ""),
    stage: stageOff ? { off: stageOff, on: img("stage_on", "") } : undefined,
    specs: {
      dimensions: text("dimensions"),
      weight: text("weight"),
      material: text("material"),
      finish: text("finish"),
      bulbType: text("bulb_type"),
      cableLength: text("cable_length"),
    },
    handcraftHours: text("handcraft_hours") ? Number(text("handcraft_hours")) : undefined,
    editionSize: text("edition_size") ? Number(text("edition_size")) : undefined,
  };
}

type ShopCollection = {
  handle: string;
  title: string;
  description: string;
  eyebrow: { value: string } | null;
  hidden: { value: string } | null;
};
const COLLECTION_FIELDS = `handle title description
  eyebrow: metafield(namespace: "zohrae", key: "eyebrow") { value }
  hidden: metafield(namespace: "zohrae", key: "hidden") { value }`;
const toCollection = (c: ShopCollection): Collection => ({
  handle: c.handle,
  title: c.title,
  description: c.description,
  eyebrow: c.eyebrow?.value ?? "",
  hidden: c.hidden?.value === "true",
});

export const shopifyCommerce: Commerce = {
  async getCollections() {
    const d = await storefront<{ collections: { nodes: ShopCollection[] } }>(
      `query { collections(first: 50, sortKey: TITLE) { nodes { ${COLLECTION_FIELDS} } } }`,
    );
    return d.collections.nodes.map(toCollection);
  },
  async getCollection(handle) {
    const d = await storefront<{ collection: ShopCollection | null }>(
      `query($handle: String!) { collection(handle: $handle) { ${COLLECTION_FIELDS} } }`,
      { handle },
    );
    return d.collection ? toCollection(d.collection) : undefined;
  },
  async getProducts({ collection, type, limit } = {}) {
    const first = Math.min(limit ?? 100, 250);
    let nodes: ShopProduct[];
    if (collection) {
      const d = await storefront<{ collection: { products: { nodes: ShopProduct[] } } | null }>(
        `query($handle: String!, $first: Int!) { collection(handle: $handle) { products(first: $first, sortKey: COLLECTION_DEFAULT) { nodes { ${PRODUCT_FIELDS} } } } }`,
        { handle: collection, first },
      );
      nodes = d.collection?.products.nodes ?? [];
    } else {
      const d = await storefront<{ products: { nodes: ShopProduct[] } }>(
        `query($first: Int!, $query: String) { products(first: $first, query: $query) { nodes { ${PRODUCT_FIELDS} } } }`,
        { first, query: type ? `product_type:'${type}'` : null },
      );
      nodes = d.products.nodes;
    }
    return nodes.map(toProduct).filter((p) => !type || p.type === type);
  },
  async getProduct(handle) {
    const d = await storefront<{ product: ShopProduct | null }>(
      `query($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
      { handle },
    );
    return d.product ? toProduct(d.product) : undefined;
  },
};

/** Create a Shopify cart from the bag and return its hosted checkout URL. */
export async function createCheckout(
  lines: { variantId: string; quantity: number; attributes?: { key: string; value: string }[] }[],
) {
  const d = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(`mutation($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }`, {
    input: {
      lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity, attributes: l.attributes ?? [] })),
    },
  });
  if (!d.cartCreate.cart) throw new Error(d.cartCreate.userErrors.map((e) => e.message).join("; ") || "No cart");
  return d.cartCreate.cart.checkoutUrl;
}
