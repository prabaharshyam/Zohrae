/**
 * Long-form pages (policies, care, about), written in the house voice.
 * Policies are sensible defaults for a made-to-order studio in India; the
 * owner should review them (and a lawyer, for privacy and terms) before launch.
 */
export type Section = { title: string; body?: string[]; list?: string[] };
export type ProsePage = { eyebrow: string; title: string; intro: string; updated?: string; sections: Section[] };

const UPDATED = "17 October 2026";

export const PAGES: Record<string, ProsePage> = {
  shipping: {
    eyebrow: "Care · Shipping",
    title: "From our atelier to your door",
    intro:
      "Every piece is made to order, then packed by hand in a rigid keepsake box. Here's how long that takes, and how it reaches you.",
    updated: UPDATED,
    sections: [
      {
        title: "Making time",
        list: [
          "Lamps, vases and planters: 5–7 working days to print, finish and test.",
          "Art wall frames: 4–6 working days.",
          "Personalised gifts: 3–5 working days after you approve the proof.",
          "Wedding pieces: 7–14 working days, depending on quantity. Large orders are confirmed with you on WhatsApp.",
        ],
      },
      {
        title: "Delivery",
        body: [
          "We ship across India with tracked, insured couriers. Once dispatched, most metro cities receive their parcel in 2–4 days, and the rest of India in 4–7 days.",
          "You'll receive the tracking link by email and WhatsApp as soon as your piece leaves the atelier.",
        ],
      },
      {
        title: "Shipping cost",
        body: ["The shipping cost for your pin code is shown at checkout, before you pay."],
      },
      {
        title: "Payment",
        body: [
          "We accept prepaid orders only: UPI, GPay, cards and netbanking through a secure checkout. Every piece is made for you, so we don't offer cash on delivery.",
        ],
      },
      {
        title: "Outside India",
        body: [
          "We'd love to send a piece abroad. Message us on WhatsApp with your country and we'll share options and costs.",
        ],
      },
    ],
  },
  returns: {
    eyebrow: "Care · Returns",
    title: "Returns, replacements and peace of mind",
    intro:
      "Each piece is made for you and inspected twice before it's packed. If anything isn't right when it arrives, we'll put it right.",
    updated: UPDATED,
    sections: [
      {
        title: "If it arrives damaged",
        body: [
          "Please record a short video as you open the parcel, and message us within 48 hours of delivery with the video and a photo of the outer box. We'll send a replacement at no cost.",
        ],
      },
      {
        title: "If you change your mind",
        body: [
          "Lamps, vases, planters and art frames (not personalised) can be returned within 7 days of delivery, unused and in their original keepsake box. Return shipping is paid by you; we'll refund the product price once the piece reaches the atelier and is checked.",
        ],
      },
      {
        title: "Personalised and wedding pieces",
        body: [
          "Pieces made with your name, photo or design can't be returned unless they arrive damaged or differ from the proof you approved. That's why we always send a proof first.",
        ],
      },
      {
        title: "Cancellations",
        body: [
          "You can cancel free of charge until we start making your piece (usually within 24 hours of your order). Message us on WhatsApp and we'll confirm.",
        ],
      },
      {
        title: "Refunds",
        body: ["Approved refunds go back to your original payment method within 7–10 working days."],
      },
    ],
  },
  care: {
    eyebrow: "Care · Your piece",
    title: "Caring for your piece",
    intro:
      "Our pieces are printed in PLA, a plant-based bioplastic, then finished by hand. A little care keeps them beautiful for years.",
    sections: [
      {
        title: "Keep it cool",
        list: [
          "PLA softens above about 55°C. Keep pieces away from heaters, stovetops, hot car interiors and long hours of direct afternoon sun.",
          "Use LED bulbs only (they stay cool). Every lamp ships with the right warm-white LED bulb.",
        ],
      },
      {
        title: "Cleaning",
        list: [
          "Dust with a soft, dry brush or microfibre cloth. The ribs and pleats hold a little dust, which a soft make-up brush lifts easily.",
          "For marks, use a cloth barely damp with water. Never use alcohol, acetone or solvent cleaners.",
          "Vases are sealed for fresh flowers. Empty and dry them every few days.",
        ],
      },
      {
        title: "Bulbs and electricals",
        list: [
          "Replace bulbs with the same type and wattage shown on the product page (warm white, 2700K, for the glow you see in our photographs).",
          "Switch off and unplug before changing a bulb or cleaning.",
        ],
      },
      {
        title: "Frames, tumblers and gifts",
        list: [
          "Art frames: hang away from bathrooms and damp walls; wipe the glazing with a dry cloth.",
          "Tumblers: hand-wash only, not in a dishwasher, to keep the lettering perfect.",
          "Coasters and trays: wipe clean; avoid soaking.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Legal · Privacy",
    title: "Your privacy",
    intro:
      "We collect only what we need to make and deliver your piece, and to look after you afterwards. This page explains what, why, and your choices.",
    updated: UPDATED,
    sections: [
      {
        title: "What we collect",
        list: [
          "Order details: your name, delivery address, phone number, email and what you ordered, including personalisation (names, dates, photographs).",
          "Messages you send us on WhatsApp or email.",
          "If you allow it, anonymous analytics about how the site is used (pages visited, device type).",
        ],
      },
      {
        title: "Why we use it",
        list: [
          "To make, personalise, ship and support your order.",
          "To send order updates, and the Zohraé Circle newsletter if you join it (you can leave at any time).",
          "To improve the site, only with your consent for analytics.",
        ],
      },
      {
        title: "Who helps us",
        body: [
          "Our store and checkout run on Shopify; payments are handled by Shopify's payment partners and we never see your card details. The site is hosted on Vercel. Customer photographs are stored with Cloudinary. If you accept analytics cookies, Google Analytics and Meta measure visits. Couriers receive your name, address and phone number to deliver your parcel.",
        ],
      },
      {
        title: "Cookies",
        body: [
          'Essential storage keeps your bag, your Dream Room and your light switch preferences on your device. Analytics and marketing cookies are used only after you accept them, and you can change your choice any time from "Cookie settings" in the footer.',
        ],
      },
      {
        title: "Your rights",
        body: [
          "Under India's Digital Personal Data Protection Act, you can ask to see, correct or delete your personal data, or withdraw consent. Message us and we'll respond within 30 days.",
        ],
      },
      {
        title: "How long we keep it",
        body: [
          "Order records are kept as long as the law requires for tax and accounting. Personalisation photographs are deleted 90 days after delivery unless you ask us to keep them for a reorder.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Legal · Terms",
    title: "Terms of sale",
    intro: "The short version: we make each piece for you with care, describe it honestly, and stand behind it.",
    updated: UPDATED,
    sections: [
      {
        title: "Prices",
        body: ["All prices are in Indian rupees and include GST. Shipping is shown at checkout."],
      },
      {
        title: "Handmade by nature",
        body: [
          "Each piece is printed and finished by hand, so small variations in layer lines, finish and colour are part of its character, not defects. Colours on screen may differ slightly from the finished piece.",
        ],
      },
      {
        title: "Personalisation",
        body: [
          "You're responsible for the spelling and content of names, messages and photographs you send. We'll send a proof for approval; once approved, we make it exactly as shown. We may decline content that's offensive or infringes someone else's rights.",
        ],
      },
      {
        title: "Orders",
        body: [
          "Your order is confirmed when payment is received. If we can't make a piece for any reason, we'll tell you straight away and refund you in full.",
        ],
      },
      {
        title: "Our designs",
        body: ["The designs, photographs and text on this site belong to Zohraé. Please don't copy or reproduce them."],
      },
      {
        title: "Governing law",
        body: ["These terms are governed by the laws of India."],
      },
    ],
  },
  about: {
    eyebrow: "The studio",
    title: "Light, sculpted. In India.",
    intro:
      "Zohraé is a small design studio making sculptural lamps, vessels and keepsakes: printed layer by layer in plant-based PLA, then finished by hand.",
    sections: [
      {
        title: "Why light",
        body: [
          "The most beautiful rooms aren't lit, they're layered. A lamp is the one object that changes a room twice a day: a sculpture by daylight, and the warmest thing in the house after dark.",
        ],
      },
      {
        title: "How we make",
        body: [
          "Each design begins as a pencil line in a sketchbook. It's printed as one continuous thread, sometimes for thirty hours, then sanded, smoothed and inspected by hand, and switched on in a dark room before it's ever boxed.",
        ],
      },
      {
        title: "What we believe",
        list: [
          "Made to order, so there's no warehouse of unsold stock.",
          "Honest materials, honestly described: PLA is a bioplastic made from plants, and we design every piece to be kept for years.",
          "Packaging worth keeping, because the box is the first thing you touch.",
        ],
      },
    ],
  },
};
