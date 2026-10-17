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
    descriptor: "ATELIER · INDIA",
    categories: ["Decor", "Lamps", "Vases", "Planters"],
    origin: "Designed and hand-finished in India",
  },

  contact: {
    /** WhatsApp concierge, international format without "+" (from the previous site). */
    whatsapp: "919606221205",
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
    intro: "Shine Beyond!",
    skipIntro: "Skip intro",
    enterSound: "Enter with sound",
    enterSilent: "Enter in silence",
    enterHint: "Best with sound: a quiet click, a soft glow.",
    heroEyebrow: "Lumière · Fatto a mano in India",
    heroLines: ["Light,", "sculpted."],
    heroTagline: "Shine Beyond!",
    heroSub:
      "Sculptural lamps and vessels, printed layer by layer and finished by hand. By day, an object you can't stop looking at. By night, the warmest room you own.",
    heroPrimaryCta: "Explore Lumière",
    heroGhostCta: "Find your light",
    scrollCue: "Pull to begin",

    gallery: {
      eyebrow: "I · The Lumière Collection",
      title: "Eight ways to hold the light",
      body: "Each piece is printed as one continuous line, then sanded and finished by hand. Flip the switch to see them glow.",
      cta: "See every lamp",
    },

    why: {
      eyebrow: "II · Why light is the ultimate luxury",
      beats: [
        {
          title: "The most beautiful homes aren't lit. They're layered.",
          body: "Ambient light to settle the room, task light to live in it, accent light to make you look twice. One overhead bulb can't do all three.",
        },
        {
          title: "Warm light makes a room feel twice as expensive.",
          body: "At 2700K, light turns golden. Shadows soften, textures deepen, and wood, linen and stone look the way they did in the showroom.",
        },
        {
          title: "A lamp is jewellery for a room.",
          body: "A sculpture by day. Atmosphere by night. It's the one object people notice first and remember longest.",
        },
      ],
      cta: "Light your room",
    },

    atelier: {
      eyebrow: "III · L'Atelier",
      title: "From thread to treasure",
      steps: [
        {
          title: "Drawn by hand",
          body: "Every piece starts as a pencil line in a sketchbook in India, refined until the form feels inevitable.",
        },
        {
          title: "Printed layer by layer",
          body: "A single thread of plant-based PLA, laid down for up to thirty hours. You can see every layer when the light hits it.",
        },
        {
          title: "Finished by hand",
          body: "Sanded, smoothed and inspected by one pair of hands. No two finishes are quite the same.",
        },
        {
          title: "Tested in the dark",
          body: "Each lamp is switched on in a dark room and checked for an even, honey-warm glow before it leaves.",
        },
        {
          title: "Wrapped to be remembered",
          body: "Tissue, a rigid keepsake box and a handwritten card. Opening it should feel like a small ceremony.",
        },
      ],
      stats: [
        { value: 26, suffix: "", label: "hours of making in a single lamp, on average" },
        { value: 1, suffix: "", label: "pair of hands finishes every piece" },
        { value: 0, suffix: "", label: "warehouses: everything is made to order" },
      ],
      cta: "Inside the atelier",
    },

    vessels: {
      eyebrow: "IV · Vases & Vessels",
      title: "Quiet forms for living things",
      body: "Vases and planters from the same printer and the same hands: made to hold one stem, a whole armful, or nothing at all.",
      cta: "Explore vessels",
    },

    conscious: {
      eyebrow: "V · Conscious luxury",
      title: "Made from plants, made to last",
      stages: ["Grown", "Spun", "Sculpted"],
      points: [
        "Printed in PLA, a plant-based bioplastic made from renewable sources like corn starch or sugarcane, rather than petroleum.",
        "Made to order in small batches, so there's no warehouse of unsold stock.",
        "Designed to last for years, not seasons.",
      ],
      note: "PLA is a bioplastic. It breaks down only in industrial composting, so we design every piece to be kept.",
      cta: "How we make it",
    },

    teasers: [
      {
        eyebrow: "Fatto per te",
        title: "Personalised gifts",
        body: "Names, monograms and messages on tumblers, coasters and trays. Type it, see it, we finish it by hand.",
        cta: "Make it theirs",
        href: "/personalised",
      },
      {
        eyebrow: "Matrimonio",
        title: "Wedding Atelier",
        body: "Couture badges for the whole wedding party, photo magnets, and keepsakes for every guest.",
        cta: "Plan the details",
        href: "/wedding",
      },
    ],

    room: {
      eyebrow: "VI · Shop the room",
      title: "See it where it lives",
      hotspot: (name: string) => `See ${name}`,
      viewPiece: "View the piece",
      close: "Close",
    },

    values: [
      "Handcrafted in India",
      "Plant-based PLA",
      "Made to order",
      "Premium keepsake packaging",
      "Shipped across India",
      "Secure UPI & card payments",
    ],

    circle: {
      eyebrow: "VII · The Zohraé Circle",
      title: "Be first to see new pieces",
      body: "Members get early access to limited editions, and a private welcome gift.",
      placeholder: "Your email",
      cta: "Join the Circle",
      sending: "Joining…",
      welcome: "Welcome to the Circle.",
      codeIntro: "Your private code",
      soon: "Thank you. The Circle opens with our launch, and you'll hear from us first.",
      invalid: "Please enter a valid email address.",
      error: "Something went wrong. Please try again.",
    },
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

  light: {
    label: "Lights",
    on: "On",
    off: "Off",
    switchLabel: "Lights: switch every lamp on the page on or off",
    settings: "Light settings",
    closeSettings: "Close light settings",
    dimmer: "Dimmer",
    warmth: "Warmth",
    warmthStops: ["Candle", "Warm", "Soft white"],
    goldenHour: "Golden hour",
    reset: "Reset",
    nudge: "It’s evening. Want to see them glow?",
    nudgeCta: "Switch them on",
    nudgeDismiss: "Not now",
    gridOff: "Lights off",
    gridOn: "Lights on",
    touchOn: "Light it",
    touchOff: "Dim it",
    touchHint: "Touch the light · the gold button on its base",
    soundOn: "Sound on",
    soundOff: "Sound off",
    longPressHint: "Press and hold for dimmer and warmth",
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
