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
    easterEgg: "Shine Beyond! ✦ You found the secret switch.",
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
      eyebrow: "I · In the spotlight",
      title: "Lamps in the spotlight",
      body: "Each piece is printed as one continuous line, then sanded and finished by hand. Flip the switch to see them glow.",
      cta: "See every lamp",
    },

    collection: {
      eyebrow: "II · The Lumière Collection",
      title: "Every lamp, one room",
      body: "The whole collection, side by side. Touch the gold button on any base to light it, or light them all at once.",
      cta: (n: number) => `Explore all ${n} lamps`,
    },

    why: {
      eyebrow: "III · Why light is the ultimate luxury",
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
      eyebrow: "IV · L'Atelier",
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
      eyebrow: "V · Vases & Vessels",
      title: "Quiet forms for living things",
      body: "Vases and planters from the same printer and the same hands: made to hold one stem, a whole armful, or nothing at all.",
      cta: "Explore vessels",
    },

    artWall: {
      eyebrow: "VI · Galleria",
      title: "Art for the walls around the light",
      body: "Framed prints in solid wood with a hand-cut mount, in three sizes. Choose one of ours, or send us yours: a photograph, a painting, a first drawing.",
      cta: "Explore the frames",
      custom: "Frame your own art",
      sizesTitle: "Three sizes, drawn to scale",
      sizes: [
        { name: "A3", cm: "29.7 × 42 cm", use: "Shelves, desks and gallery walls" },
        { name: "A2", cm: "42 × 59.4 cm", use: "Above a console or a bedside" },
        { name: "A1", cm: "59.4 × 84.1 cm", use: "A statement over the sofa or bed" },
      ],
    },

    conscious: {
      eyebrow: "VII · Conscious luxury",
      title: "Made from plants, made to last",
      stages: ["Grown", "Spun", "Sculpted", "Kept"],
      points: [
        "Printed in PLA, a plant-based bioplastic made from renewable sources like corn starch or sugarcane, rather than petroleum.",
        "Made to order in small batches, so there's no warehouse of unsold stock.",
        "Designed to last for years, not seasons.",
        "Packed by hand in a keepsake box that's made to be kept, too.",
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
      eyebrow: "VIII · Shop the room",
      title: "See it where it lives",
      body: "Real rooms, real evenings. Choose a room, then tap the glowing point on the lamp.",
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
      eyebrow: "IX · The Zohraé Circle",
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
    quantity: "Quantity",
    perPieceNote: (min: number) => `${min > 1 ? `From ${min} pieces. ` : ""}Based on the quantity, the price may vary.`,
    contactUs: "Contact us for more information",
    totalFor: (n: number) => `${n} pieces:`,
    related: "Pieces that keep it company",
    shipsIn: "Made to order · ships in 5–7 days",
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
    winks: [
      "Easy there. Every lamp is finished by one pair of hands.",
      "It likes you too.",
      "Disco mode isn't on the menu. Yet.",
      "You've found the lamp whisperer setting.",
    ],
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
    emptyCta: "Discover the lamps",
    checkout: "Proceed to secure checkout",
    count: (n: number) => (n === 1 ? "1 piece" : `${n} pieces`),
    subtotal: "Subtotal",
    shippingNote: "Shipping and GST shown at checkout · Prepaid orders only",
    remove: "Remove",
    close: "Close",
    increase: "One more",
    decrease: "One fewer",
    preview:
      "This is a preview of the store: checkout opens once the shop is connected. Your selection is saved on this device.",
    failed: "Checkout couldn't open just now. Please try again in a moment.",
    giftNote: "Every piece arrives in our keepsake box.",
    giftToggle: "This is a gift",
    giftHint: "We'll leave prices off the packing slip and write your message on a card by hand.",
    giftMessage: "Your message for the card",
    giftPlaceholder: "Happy housewarming, Meera. May every evening be golden.",
  },

  shop: {
    all: "All",
    allPrices: "Any price",
    under: (n: number) => `Under ₹${n.toLocaleString("en-IN")}`,
    between: (a: number, b: number) => `₹${a.toLocaleString("en-IN")}–${b.toLocaleString("en-IN")}`,
    over: (n: number) => `Over ₹${n.toLocaleString("en-IN")}`,
    sort: "Sort",
    sortFeatured: "Featured",
    sortNew: "New",
    sortPriceAsc: "Price, low to high",
    sortPriceDesc: "Price, high to low",
    none: "Nothing here at that price. Try another filter.",
    pieces: "The pieces",
  },

  personalise: {
    title: "Make it yours",
    preview: "Live preview",
    photos: "Photographs",
    lettering: "Lettering",
    ink: "Ink",
    role: "Role",
    photo: "Your photograph",
    photoHint: "A clear, well-lit JPG or PNG, up to 15 MB. We check every photo before printing.",
    choosePhoto: "Choose a photo",
    changePhoto: "Change photo",
    uploading: "Uploading…",
    uploaded: "Photo received.",
    whatsappPhoto:
      "We'll collect the full-resolution photo on WhatsApp after you order, so nothing is lost to compression.",
    neededBy: "Need it by",
    neededByHint: (days: number) => `We make it in about ${days} days, then 2–4 days to reach you.`,
    tight: "That's tight. Message us and we'll do our best to make it in time.",
    missingText: (label: string) => `Please add the ${label.toLowerCase()} so we can make it.`,
    missingPhoto: "Please choose a photograph first.",
    bulkTitle: "Planning for a big day?",
    bulkBody: "For more than 200 pieces, custom roles or a design matched to your invitation, talk to the atelier.",
    bulkCta: "Plan it on WhatsApp",
    proofNote: "We send a digital proof on WhatsApp before we make anything.",
    whatsappHello: (title: string) => `Hello Zohraé! I'd like to talk about ${title}.`,
  },

  madeFor: {
    steps: [
      { title: "Type it", body: "A name, initials, a date or a role. Choose the lettering and the ink." },
      { title: "See it, live", body: "The piece redraws as you type, so you know exactly what you'll receive." },
      {
        title: "We make it by hand",
        body: "A digital proof on WhatsApp first, then it's finished by hand and boxed to be kept.",
      },
    ],
    conciergeEyebrow: "The wedding concierge",
    conciergeTitle: "Two hundred guests? Matching your invitation?",
    conciergeBody:
      "Tell us the date, the colours and the numbers. We'll design the badges, magnets and return gifts as one family, and send a proof before anything is made.",
    conciergeCta: "Plan it on WhatsApp",
    conciergeHello: "Hello Zohraé! We're planning a wedding and would love help with badges, magnets and return gifts.",
  },

  dreamRoom: {
    eyebrow: "Your Dream Room",
    title: "The pieces you're dreaming of",
    empty: "Nothing saved yet. Tap the heart on any piece to keep it here.",
    save: "Save to Dream Room",
    saved: "Saved to your Dream Room",
  },

  trust: {
    items: ["Handcrafted", "Secure payments", "Easy returns", "Premium packaging"],
    payments: ["UPI", "GPay", "Cards", "Netbanking"],
    shipping: "Handcrafted in India · Shipped across India",
    prepaidOnly: "Prepaid orders only",
  },

  footer: {
    backToTop: "Back to top",
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
          { label: "Art Wall Frames", href: "/collections/art-frames" },
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

  finder: {
    step: (n: number, of: number) => `Question ${n} of ${of}`,
    back: "Back",
    resultEyebrow: "Your light",
    resultTitle: (name: string) => `Meet ${name}.`,
    meet: (name: string) => `Discover ${name}`,
    again: "Start again",
    alsoTitle: "Two more that would love your room",
    questions: [
      {
        title: "Where will it live?",
        options: [
          {
            id: "living",
            label: "The living room",
            hint: "Where evenings happen",
            because: "It's made to hold a room full of people in warm light.",
          },
          {
            id: "bedroom",
            label: "The bedroom",
            hint: "The last light you see",
            because: "Its glow is soft enough for the last page of a book.",
          },
          {
            id: "study",
            label: "A desk or study",
            hint: "Focus, with feeling",
            because: "It brings warmth to a desk without glare.",
          },
          {
            id: "console",
            label: "A console or entryway",
            hint: "The first impression",
            because: "It's sculptural enough to greet a guest on its own.",
          },
        ],
      },
      {
        title: "How should the light feel?",
        options: [
          {
            id: "cosy",
            label: "Honey-warm and cosy",
            hint: "A slow evening",
            because: "The light turns gold through every pleat.",
          },
          {
            id: "soft",
            label: "Soft and calm",
            hint: "Barely there",
            because: "The light is diffused and gentle, never bright.",
          },
          {
            id: "sculptural",
            label: "A statement",
            hint: "The piece people ask about",
            because: "By day it's a sculpture, by night it's the room's centrepiece.",
          },
          {
            id: "architectural",
            label: "Clean and architectural",
            hint: "Lines that order the light",
            because: "Crisp lines throw the light in quiet stripes.",
          },
        ],
      },
      {
        title: "Which feels most like you?",
        options: [
          { id: "classic", label: "Classic and warm", hint: "Wood, brass, linen", because: "" },
          { id: "modern", label: "Modern and minimal", hint: "Less, but better", because: "" },
          { id: "playful", label: "A little playful", hint: "Colour and curves", because: "" },
          { id: "organic", label: "Natural and organic", hint: "Stone, plants, texture", because: "" },
        ],
      },
      {
        title: "And the budget?",
        options: [
          { id: "under4", label: "Under ₹4,000", hint: "A beautiful start", because: "" },
          { id: "under5", label: "Under ₹5,000", hint: "The full collection", because: "" },
          { id: "any", label: "The right one, whatever it costs", hint: "Love at first light", because: "" },
          { id: "gift", label: "It's a gift", hint: "We'll wrap it to be remembered", because: "" },
        ],
      },
    ],
  },

  contactPage: {
    eyebrow: "Contact",
    title: "Talk to the atelier",
    intro: "A question about a piece, a wedding, a gift that has to arrive on time? We answer every message ourselves.",
    cardTitle: "The atelier",
    hours: "Monday to Saturday, 10am to 7pm IST. We usually reply within a few hours.",
    formTitle: "Send a note",
    name: "Your name",
    topic: "What's it about?",
    topics: ["A lamp or vase", "A personalised gift", "A wedding", "An existing order", "Something else"],
    message: "Your message",
    send: "Send on WhatsApp",
    sendHint: "Opens WhatsApp with your note ready to send.",
  },

  consent: {
    title: "A note on cookies",
    body: "We use essential storage to keep your bag and preferences. With your permission, we'd also like to measure visits to improve the site.",
    accept: "Accept",
    essential: "Essential only",
    more: "Privacy",
    settings: "Cookie settings",
  },

  notFound: {
    title: "This page has gone dark",
    body: "Let us light your way.",
    pull: "Pull the chain",
  },
} as const;
