/**
 * Every customer-facing string on the site lives here, so the copy can be
 * edited in one place. Product copy lives with the product data
 * (data/mock/products.ts now, Shopify later).
 *
 * Voice: seductive, sensory, confident. Short lines, present tense,
 * second person. One exclamation mark on the whole site: the tagline.
 */
export const copy = {
  brand: {
    name: "Zohraé",
    tagline: "Shine Beyond!",
    descriptor: "LUXURY HOME DECOR STUDIO",
    categories: ["Decor", "Lamps", "Vases", "Planters"],
    origin: "Designed and hand-finished in India",
  },

  nav: {
    primary: [
      { label: "Collections", href: "/collections/lumiere" },
      { label: "Atelier", href: "/atelier" },
      { label: "Wedding", href: "/wedding" },
      { label: "Gifts", href: "/personalised" },
    ],
    collectionsMenuTitle: "The collections",
    search: "Search",
    wishlist: "Dream Room",
    account: "Account",
    cart: "Your Collection",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    home: "Zohraé, home",
  },

  home: {
    heroEyebrow: "Lumière · Fatto a mano in India",
    heroLines: ["Light,", "sculpted."],
    heroTagline: "Shine Beyond!",
    heroSub:
      "Sculptural lamps and vessels, printed layer by layer and finished by hand. By day, an object you can't stop looking at. By night, the warmest room you own.",
    heroPrimaryCta: "Explore Lumière",
    heroGhostCta: "Find your light",
    featuredEyebrow: "I · The Lumière Collection",
    featuredTitle: "Pieces that hold the light",
    featuredCta: "See every lamp",
    vesselsEyebrow: "II · Vases & Vessels",
    vesselsTitle: "Quiet forms for living things",
    vesselsCta: "Explore vessels",
    phaseNote: "The full cinematic story arrives in Phase 3.",
  },

  product: {
    addToCart: "Add to Collection",
    buyNow: "Buy now",
    added: "Beautiful choice.",
    soldOut: "Being crafted — join the waitlist",
    handcrafted: "Handcrafted",
    limited: "Limited",
    edition: (n: number, of: number) => `No. ${String(n).padStart(2, "0")} of ${of}`,
    priceNote: "Inclusive of GST",
    from: "From",
    seeInRoom: "See in a room",
    quickAdd: "Quick add",
    storyTitle: "The story of this piece",
    specsTitle: "Specifications",
  },

  cart: {
    title: "Your Collection",
    empty: "Your collection awaits its first light.",
    checkout: "Proceed to secure checkout",
    count: (n: number) => (n === 1 ? "1 piece" : `${n} pieces`),
  },

  trust: {
    items: ["Handcrafted", "Secure payments", "Easy returns", "Premium packaging"],
    payments: ["UPI", "GPay", "Cards", "Netbanking"],
    shipping: "Handcrafted in India · Shipped across India",
    prepaidOnly: "Prepaid orders only",
  },

  footer: {
    circleTitle: "The Zohraé Circle",
    circleBody: "Be first to see new pieces. Members get early access to limited editions.",
    circlePlaceholder: "Your email",
    circleCta: "Join",
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Lumière — Lamps", href: "/collections/lumiere" },
          { label: "Vases & Vessels", href: "/collections/vases-vessels" },
          { label: "Planters", href: "/collections/planters" },
          { label: "Personalised Gifts", href: "/personalised" },
          { label: "Wedding Atelier", href: "/wedding" },
          { label: "Find your light", href: "/light-finder" },
        ],
      },
      {
        title: "Studio",
        links: [
          { label: "L'Atelier", href: "/atelier" },
          { label: "About", href: "/about" },
          { label: "Journal", href: "/journal" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Care",
        links: [
          { label: "Shipping", href: "/shipping" },
          { label: "Returns", href: "/returns" },
          { label: "Caring for your piece", href: "/care" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
    concierge: "WhatsApp concierge",
    conciergeMessage: "Hello Zohraé, I'd love help choosing a lamp.",
    social: [{ label: "Instagram", href: "https://instagram.com/" }],
    rights: (year: number) => `© ${year} Zohraé. All rights reserved.`,
  },

  stub: {
    comingIn: (phase: number) => `Arriving in Phase ${phase}`,
    backHome: "Return home",
  },

  notFound: {
    title: "This page has gone dark",
    body: "Let us light your way.",
  },
} as const;
