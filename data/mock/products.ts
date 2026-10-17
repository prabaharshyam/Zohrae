import type { ImageAsset, Product, ProductSpecs, ProductType } from "@/lib/commerce/types";

/**
 * Placeholder catalogue, written in the house voice. Prices are tax-inclusive INR.
 *
 * Lamps use matched lamp-off / lamp-on photography (public/products/<handle>/):
 * a transparent cut-out pair for cards, a showroom "stage" pair for hero and
 * product pages, and a room scene. The light switch crossfades each pair.
 * The owner's original studio shots stay in the product gallery.
 *
 * Merchandising tags (the same tags drive Shopify later): "signature" is the
 * home hero lamp; "featured" lamps get a scrolling chapter on the home page.
 */

const inr = (amount: number) => ({ amount, currencyCode: "INR" as const });

const studio = (file: string, width: number, height: number, alt: string): ImageAsset => ({
  url: `/products/samples/${file}`,
  width,
  height,
  alt,
  onWhite: true,
});

/** Which photography exists for each lamp, beyond the cut-out pair every lamp has. */
const MEDIA: Record<string, { stage?: boolean; room?: string }> = {
  aurelia: { stage: true, room: "In the bedroom" },
  nuvola: { stage: true },
  rosalie: { stage: true, room: "In the bedroom" },
  colonna: { stage: true, room: "In the study" },
  sora: { room: "In the bedroom" },
  onda: {},
  ballerina: {},
  coquille: {},
};

/**
 * Where each lamp's own switch sits (fractions of the photo): low on the base,
 * centred, measured from the cut-out silhouettes and the stage photos.
 */
const SWITCH: Record<string, { cutout: [number, number]; stage?: [number, number] }> = {
  aurelia: { cutout: [0.502, 0.83], stage: [0.293, 0.8] },
  sora: { cutout: [0.492, 0.775] },
  nuvola: { cutout: [0.493, 0.82], stage: [0.775, 0.8] },
  onda: { cutout: [0.494, 0.805] },
  ballerina: { cutout: [0.5, 0.5] },
  rosalie: { cutout: [0.495, 0.815], stage: [0.47, 0.725] },
  colonna: { cutout: [0.494, 0.85], stage: [0.763, 0.8] },
  coquille: { cutout: [0.495, 0.805] },
};

function lampMedia(handle: string, title: string): Partial<Product> & { images: ImageAsset[] } {
  const media = MEDIA[handle];
  if (!media) return { images: [] };
  const src = (file: string) => `/products/${handle}/${file}`;
  const sw = SWITCH[handle];
  const cutoutOff: ImageAsset = {
    url: src("cutout-off.webp"),
    width: 768,
    height: 1024,
    alt: `${title}, switched off`,
    switchAt: sw?.cutout,
  };
  const cutoutOn = { url: src("cutout-on.webp"), width: 768, height: 1024, alt: `${title}, glowing` };
  return {
    images: [cutoutOff],
    imageOff: cutoutOff,
    imageOn: cutoutOn,
    stage: media.stage
      ? {
          off: {
            url: src("stage-off.webp"),
            width: 1264,
            height: 848,
            alt: `${title} on a stone plinth in a dark showroom`,
            switchAt: sw?.stage,
          },
          on: { url: src("stage-on.webp"), width: 1264, height: 848, alt: `${title} glowing on a stone plinth` },
        }
      : undefined,
    lifestyle: media.room
      ? { url: src("room.webp"), width: 928, height: 1152, alt: `${title} styled at home`, room: media.room }
      : undefined,
  };
}

type Seed = {
  handle: string;
  title: string;
  type: ProductType;
  tagline: string;
  description: string;
  story?: string;
  price: number;
  collections: string[];
  tags?: string[];
  /** The owner's original studio shot, shown in the product gallery. */
  photo?: ImageAsset;
  specs?: ProductSpecs;
  handcraftHours?: number;
  editionSize?: number;
  finishes?: { name: string; swatch: string }[];
  available?: boolean;
};

function withGallery(media: ReturnType<typeof lampMedia>, photo?: ImageAsset) {
  return { ...media, images: photo ? [...media.images, photo] : media.images };
}

/**
 * Placeholder imagery for everything that isn't a lamp (AI-generated, to be
 * replaced by the owner's photography): vessels get a transparent cut-out,
 * gifts and wedding pieces a styled photo.
 */
function placeholderMedia(seed: Seed): Partial<Product> & { images: ImageAsset[] } {
  const src = (file: string) => `/products/${seed.handle}/${file}`;
  if (seed.type === "Vase" || seed.type === "Planter") {
    const cutout = { url: src("cutout.webp"), width: 768, height: 1028, alt: `${seed.title}, ${seed.tagline}` };
    return { images: [cutout], imageOff: cutout };
  }
  const photo = {
    url: src("photo.webp"),
    width: 816,
    height: 1092,
    alt: `${seed.title}, ${seed.tagline}`,
    scene: true,
  };
  return { images: [photo], imageOff: photo };
}

function product(seed: Seed): Product {
  const finishes = seed.finishes ?? [{ name: "As shown", swatch: "#E8D3A8" }];
  const variants = finishes.map((f, i) => ({
    id: `gid://zohrae/ProductVariant/${seed.handle}-${i + 1}`,
    title: f.name,
    availableForSale: seed.available ?? true,
    price: inr(seed.price),
    selectedOptions: [{ name: "Finish", value: f.name }],
    swatch: f.swatch,
  }));
  return {
    id: `gid://zohrae/Product/${seed.handle}`,
    handle: seed.handle,
    title: seed.title,
    type: seed.type,
    tagline: seed.tagline,
    description: seed.description,
    story: seed.story,
    priceRange: { min: inr(seed.price), max: inr(seed.price) },
    variants,
    options: [{ name: "Finish", values: finishes.map((f) => f.name) }],
    availableForSale: seed.available ?? true,
    tags: seed.tags ?? [],
    collections: seed.collections,
    ...withGallery(seed.type === "Lamp" ? lampMedia(seed.handle, seed.title) : placeholderMedia(seed), seed.photo),
    specs: seed.specs ?? {},
    handcraftHours: seed.handcraftHours,
    editionSize: seed.editionSize,
  };
}

const lampSpecs = (dimensions: string, weight: string, finish: string): ProductSpecs => ({
  dimensions,
  weight,
  material: "PLA, a plant-based bioplastic",
  finish,
  bulbType: "E14 LED, 2700K warm white (included)",
  cableLength: "1.8 m fabric cable with inline switch",
});

const LAMPS: Seed[] = [
  {
    handle: "aurelia",
    title: "Aurelia",
    type: "Lamp",
    tagline: "A pleated crown of gold, set on a ribbed moon.",
    description:
      "A hundred fine pleats catch the day and hold it. Switch Aurelia on and every fold turns to honey — the kind of light that makes a room slow down.",
    story:
      "I wanted the warmth of an old silk shade without the fragility. The pleats are printed as one continuous line, so the light breathes evenly through every fold.",
    price: 4600,
    collections: ["lumiere"],
    tags: ["bestseller", "signature"],
    photo: studio("01-ochre-pleated-lamp.webp", 940, 1672, "Aurelia, an ochre pleated lamp on a ribbed globe base"),
    specs: lampSpecs("Ø 30 × H 38 cm", "1.1 kg", "Matte ochre, hand-sanded"),
    handcraftHours: 26,
    finishes: [
      { name: "Ochre", swatch: "#C9A24A" },
      { name: "Ivory", swatch: "#F1EADB" },
      { name: "Sage", swatch: "#8E9A7B" },
    ],
  },
  {
    handle: "sora",
    title: "Sora",
    type: "Lamp",
    tagline: "A ribbon of light, twisted by hand.",
    description:
      "By day, a sculpture. By night, the warmest room in your home. Sora's ridges spiral like wind across sand, and when it glows, the shadows spiral with them.",
    story:
      "Sora began as a single twisted line in my sketchbook. It took eleven prototypes to make the twist feel inevitable rather than designed.",
    price: 4200,
    collections: ["lumiere"],
    photo: studio("02-white-twist-vessel.webp", 1023, 1537, "Sora, a white twisted lamp with flowing ridges"),
    specs: lampSpecs("Ø 22 × H 30 cm", "0.8 kg", "Satin ivory"),
    handcraftHours: 22,
  },
  {
    handle: "nuvola",
    title: "Nuvola",
    type: "Lamp",
    tagline: "A cloud that decided to stay.",
    description:
      "Two soft, ribbed swells float above a column of saffron. Nuvola is playful in daylight and pure calm after dark — a glow you can almost hold.",
    story:
      "Nuvola means cloud. I wanted something that made people smile first and sigh later, once the light came on.",
    price: 3800,
    collections: ["lumiere"],
    tags: ["new", "featured"],
    photo: studio(
      "03-cloud-shade-orange-base.webp",
      1023,
      1537,
      "Nuvola, a white ribbed cloud shade on a saffron fluted base",
    ),
    specs: lampSpecs("Ø 26 × H 34 cm", "0.9 kg", "Ivory shade, saffron base"),
    handcraftHours: 20,
    finishes: [
      { name: "Saffron", swatch: "#F2A21B" },
      { name: "Blush", swatch: "#D99A9A" },
      { name: "Espresso", swatch: "#3A2A20" },
    ],
  },
  {
    handle: "onda",
    title: "Onda",
    type: "Lamp",
    tagline: "Silk in motion, poured into form.",
    description:
      "Onda's surface rolls like a slow tide, catching highlights the way satin does. Lit, it turns milky and luminous — moonlight resting on terracotta.",
    story:
      "I printed Onda in a pearl filament so the waves would read like fabric. The terracotta ring grounds it, the way a hand holds a lantern.",
    price: 4900,
    collections: ["lumiere", "limited-editions"],
    tags: ["limited"],
    photo: studio(
      "04-wave-shade-terracotta-base.webp",
      940,
      1672,
      "Onda, a pearl-white wave-form lamp on a terracotta ring base",
    ),
    specs: lampSpecs("Ø 22 × H 31 cm", "0.9 kg", "Pearl shade, terracotta base"),
    handcraftHours: 28,
    editionSize: 50,
  },
  {
    handle: "ballerina",
    title: "Ballerina",
    type: "Lamp",
    tagline: "Crystal ribs, poised on blush-pink legs.",
    description:
      "A translucent, finely ribbed shade balanced on three slender legs. When Ballerina glows, every rib becomes a filament of its own.",
    story:
      "The legs came first — I wanted a lamp that stands like a dancer on pointe. The clear shade lets the light do the choreography.",
    price: 4400,
    collections: ["lumiere"],
    photo: studio(
      "05-clear-ribbed-tripod.webp",
      941,
      1672,
      "Ballerina, a translucent ribbed lamp on three blush-pink legs",
    ),
    specs: lampSpecs("Ø 28 × H 40 cm", "1.0 kg", "Translucent shade, blush legs"),
    handcraftHours: 24,
    finishes: [
      { name: "Blush", swatch: "#D49A9F" },
      { name: "Sage", swatch: "#8E9A7B" },
      { name: "Noir", swatch: "#1C1714" },
    ],
  },
  {
    handle: "rosalie",
    title: "Rosalie",
    type: "Lamp",
    tagline: "A twist of porcelain light on a blush-pink foot.",
    description:
      "Deep spiral ridges wrap Rosalie like folded silk. Switched on, the thin walls turn to warm amber and every ridge holds its own line of light.",
    story:
      "I wanted the drama of a sculpture and the softness of a bedside lamp. The blush foot keeps it light on its feet, even when it glows.",
    price: 4800,
    collections: ["lumiere", "limited-editions"],
    tags: ["limited", "featured"],
    specs: lampSpecs("Ø 26 × H 32 cm", "0.9 kg", "Porcelain white, blush base"),
    handcraftHours: 26,
    editionSize: 30,
    finishes: [
      { name: "Blush", swatch: "#D9A3A0" },
      { name: "Noir", swatch: "#1C1714" },
    ],
  },
  {
    handle: "colonna",
    title: "Colonna",
    type: "Lamp",
    tagline: "A fluted column of light, cut clean as marble.",
    description:
      "Crisp vertical pleats on a deep olive column. Colonna is architecture for the desk or console: quiet by day, a lantern of warm stripes after dark.",
    price: 3900,
    collections: ["lumiere"],
    tags: ["featured"],
    specs: lampSpecs("Ø 16 × H 30 cm", "0.8 kg", "Ivory shade, olive column"),
    handcraftHours: 18,
    finishes: [
      { name: "Olive", swatch: "#3F4630" },
      { name: "Ivory", swatch: "#F1EADB" },
    ],
  },
  {
    handle: "coquille",
    title: "Coquille",
    type: "Lamp",
    tagline: "A seashell, held up to the light.",
    description:
      "Fluted like the inside of a shell, Coquille throws a scalloped halo of amber across the wall. A quiet show, every evening.",
    price: 3600,
    collections: ["lumiere"],
    tags: ["featured"],
    specs: lampSpecs("Ø 24 × H 28 cm", "0.8 kg", "Pearl white"),
    handcraftHours: 18,
  },
];

const VASES: Seed[] = [
  {
    handle: "vela",
    title: "Vela",
    type: "Vase",
    tagline: "A sail of ridges for a single stem.",
    description: "Tall, slender, unhurried. Vela gives one stem the attention it deserves.",
    price: 2200,
    collections: ["vases-vessels"],
    specs: { dimensions: "Ø 10 × H 28 cm", material: "PLA, a plant-based bioplastic", finish: "Ivory" },
  },
  {
    handle: "marea",
    title: "Marea",
    type: "Vase",
    tagline: "The tide, turned to stone-soft form.",
    description:
      "Marea's surface rolls in slow waves. Fill it with eucalyptus, or leave it empty and let it be the sculpture.",
    price: 2600,
    collections: ["vases-vessels"],
    specs: { dimensions: "Ø 16 × H 22 cm", material: "PLA, a plant-based bioplastic", finish: "Sea salt" },
  },
  {
    handle: "seta",
    title: "Seta",
    type: "Vase",
    tagline: "Folds of silk, frozen mid-fall.",
    description: "Seta drapes like fabric and catches light in every fold. Made for dried pampas and late afternoons.",
    price: 2400,
    collections: ["vases-vessels"],
    specs: { dimensions: "Ø 14 × H 24 cm", material: "PLA, a plant-based bioplastic", finish: "Champagne" },
  },
  {
    handle: "duna",
    title: "Duna",
    type: "Vase",
    tagline: "Desert curves for a bold bouquet.",
    description: "Wide-shouldered and generous, Duna holds an armful of flowers without losing its poise.",
    price: 2800,
    collections: ["vases-vessels"],
    specs: { dimensions: "Ø 20 × H 20 cm", material: "PLA, a plant-based bioplastic", finish: "Terracotta" },
  },
];

const PLANTERS: Seed[] = [
  {
    handle: "radice",
    title: "Radice",
    type: "Planter",
    tagline: "A fluted home for something green.",
    description: "Radice's fine ribs frame a plant like a column frames a doorway. Includes a hidden drainage tray.",
    price: 1900,
    collections: ["planters"],
    specs: { dimensions: "Ø 16 × H 15 cm", material: "PLA, a plant-based bioplastic", finish: "Sage" },
  },
  {
    handle: "giardino",
    title: "Giardino",
    type: "Planter",
    tagline: "A small garden on three slender legs.",
    description: "Lifted off the floor on tapered legs, Giardino turns a single fern into a moment.",
    price: 2300,
    collections: ["planters"],
    specs: { dimensions: "Ø 22 × H 38 cm", material: "PLA, a plant-based bioplastic", finish: "Ivory and blush" },
  },
];

const GIFTS: Seed[] = [
  {
    handle: "personalised-insulated-tumbler",
    title: "Personalised 40oz Insulated Tumbler",
    type: "Custom Gift",
    tagline: "Their name, in a script made for them.",
    description:
      "A double-walled tumbler finished with a hand-applied name decal. Choose the font, colour and placement.",
    price: 1499,
    collections: ["personalised-gifts", "gifts-under-2000"],
  },
  {
    handle: "festive-juice-tumbler",
    title: "Festive Juice Tumbler",
    type: "Custom Gift",
    tagline: "A little sparkle for the season's table.",
    description:
      "A glass tumbler with a festive motif and a name of your choice. Perfect for Christmas mornings and Diwali evenings.",
    price: 899,
    collections: ["personalised-gifts", "gifts-under-2000"],
  },
  {
    handle: "personalised-coaster-set",
    title: "Personalised Coaster Set",
    type: "Custom Gift",
    tagline: "Four coasters, one beautiful monogram.",
    description: "A set of four coasters finished with your initials or a short word. Wrapped and ready to give.",
    price: 1199,
    collections: ["personalised-gifts", "gifts-under-2000"],
  },
  {
    handle: "monogram-serving-tray",
    title: "Monogram Serving Tray",
    type: "Custom Gift",
    tagline: "For the host who has everything else.",
    description: "A serving tray finished with a monogram or family name, for chai, cocktails and everything between.",
    price: 1999,
    collections: ["personalised-gifts", "gifts-under-2000"],
  },
];

const WEDDING: Seed[] = [
  {
    handle: "couture-wedding-badge",
    title: "Couture Wedding Badge",
    type: "Wedding",
    tagline: "For the bride, the groom, and everyone who loves them.",
    description:
      "A luxury badge for each role in the wedding party — Bride, Groom, Bridesmaid, Groomsman, Cousin, Family — with names in gold.",
    price: 249,
    collections: ["wedding-atelier"],
  },
  {
    handle: "wedding-party-badge-set",
    title: "Wedding Party Badge Set",
    type: "Wedding",
    tagline: "The whole celebration, matched in one design.",
    description:
      "A coordinated set of role badges for the wedding party. Build it role by role and preview every badge.",
    price: 2999,
    collections: ["wedding-atelier"],
  },
  {
    handle: "wedding-photo-magnet",
    title: "Wedding Photo Fridge Magnet",
    type: "Wedding",
    tagline: "Your favourite frame, on the door you open every day.",
    description:
      "Upload a photo from your wedding and we'll craft it into a premium fridge magnet with a soft gold edge.",
    price: 349,
    collections: ["wedding-atelier"],
  },
  {
    handle: "return-gift-magnets",
    title: "Return-Gift Magnets",
    type: "Wedding",
    tagline: "A keepsake for every guest who came.",
    description:
      "Personalised fridge magnets for your guests, sold in sets of 25 with tiered pricing for larger weddings.",
    price: 4499,
    collections: ["wedding-atelier"],
  },
];

export const MOCK_PRODUCTS: Product[] = [...LAMPS, ...VASES, ...PLANTERS, ...GIFTS, ...WEDDING].map(product);
