/**
 * Storefront domain types. Both the mock layer and the Shopify adapter
 * return exactly these shapes, so components never know which is active.
 * Field names mirror the `zohrae.*` metafields described in SHOPIFY-SETUP.md.
 */

export type CurrencyCode = "INR";

export type Money = {
  /** Major units, tax-inclusive (₹4,200 → 4200). */
  amount: number;
  currencyCode: CurrencyCode;
};

export type ImageAsset = {
  url: string;
  width: number;
  height: number;
  alt: string;
  /** Shot on a white studio backdrop: blend into the page in day mode. */
  onWhite?: boolean;
  /** Where the product sits in the image, as fractions (from scripts/analyze-products.mjs). */
  subject?: { left: number; right: number; top: number; bottom: number };
  /** Soft alpha mask of the product (white = product), same framing as the image. */
  mask?: string;
};

export type ProductType = "Lamp" | "Vase" | "Planter" | "Decor" | "Custom Gift" | "Wedding";

export type LightColour = "amber" | "warm white" | "rose";

/** Procedural glow settings (metafields `glow_origin`, `light_colour`, …). Tuned at /dev/lights. */
export type GlowConfig = {
  /** Bulb/shade centre as a fraction of the image box (0–1). */
  origin: { x: number; y: number };
  /** Glow radius as a fraction of image width. */
  radius: number;
  /** 0–1.5; translucent shades go higher. */
  intensity: number;
  colour: LightColour;
  /** Optional mask PNG for the shade region. */
  maskUrl?: string;
};

export type ProductSpecs = {
  dimensions?: string;
  weight?: string;
  material?: string;
  finish?: string;
  bulbType?: string;
  cableLength?: string;
};

export type SelectedOption = { name: string; value: string };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money;
  selectedOptions: SelectedOption[];
  /** Swatch colour for visual variant selectors. */
  swatch?: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  type: ProductType;
  /** One seductive line under the name. */
  tagline: string;
  description: string;
  /** Designer's note (metafield `story`). */
  story?: string;
  priceRange: { min: Money; max: Money };
  variants: ProductVariant[];
  options: { name: string; values: string[] }[];
  availableForSale: boolean;
  tags: string[];
  collections: string[];

  /** Gallery images; the first is the hero shot. Empty → elegant placeholder. */
  images: ImageAsset[];
  imageOff?: ImageAsset;
  imageOn?: ImageAsset;
  lifestyle?: ImageAsset & { room?: string };
  lifestyleOn?: ImageAsset & { room?: string };
  modelGlb?: string;
  modelUsdz?: string;

  glow?: GlowConfig;
  specs: ProductSpecs;
  handcraftHours?: number;
  editionSize?: number;
};

export type Collection = {
  handle: string;
  title: string;
  /** Short French/Italian flourish or Roman numeral line shown above the title. */
  eyebrow: string;
  description: string;
  /** Hidden collections exist for merchandising but aren't in the main menu. */
  hidden?: boolean;
};

export type ProductQuery = {
  collection?: string;
  type?: ProductType;
  limit?: number;
};

export interface Commerce {
  getCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | undefined>;
  getProducts(query?: ProductQuery): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | undefined>;
}
