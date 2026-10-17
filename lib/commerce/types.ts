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
  /** A full styled photograph (not a cut-out): fill the frame. */
  scene?: boolean;
};

export type ProductType = "Lamp" | "Vase" | "Planter" | "Decor" | "Custom Gift" | "Wedding";

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

  /** Gallery images; the first is the card shot (for lamps: the switched-off cut-out). Empty → placeholder. */
  images: ImageAsset[];
  /** Matched pair, identical framing: what the light switch crossfades between (metafields `image_off`, `image_on`). */
  imageOff?: ImageAsset;
  imageOn?: ImageAsset;
  /** Showroom scene pair (metafields `stage_off`, `stage_on`), same framing. */
  stage?: { off: ImageAsset; on?: ImageAsset };
  lifestyle?: ImageAsset & { room?: string };
  lifestyleOn?: ImageAsset & { room?: string };
  modelGlb?: string;
  modelUsdz?: string;

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
