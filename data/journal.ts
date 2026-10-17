/** The Journal: styling and light, written to be useful (and found). */
export type Article = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  image: { url: string; alt: string };
  body: { heading?: string; text: string }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "light-a-living-room-like-a-luxury-hotel",
    title: "How to light a living room like a luxury hotel",
    dek: "The secret isn't a brighter ceiling. It's three quiet layers of warm light, at three heights.",
    date: "2026-10-12",
    image: { url: "/scenes/living-on.webp", alt: "A living room at dusk, lit by a single warm lamp" },
    body: [
      {
        text: "Walk into a great hotel lobby at night and you'll notice something: you can't see where the light comes from. There's no glare, no single hard source, just pools of warmth that make faces, fabrics and wood look their best.",
      },
      {
        heading: "1. Ambient: the soft wash",
        text: "Dim or switch off the overhead light. Let a floor or wall light bounce off the ceiling instead, so the room glows rather than shines.",
      },
      {
        heading: "2. Task: light where you live",
        text: "A reading lamp beside the sofa, a lamp on the desk. Keep them low and warm (2700K), so they feel like an invitation, not an office.",
      },
      {
        heading: "3. Accent: the jewellery",
        text: "This is where a sculptural lamp belongs: on a console, a sideboard or a shelf, lit for its own sake. By day it's an object; at night it's the warmest point in the room, and the one your guests remember.",
      },
      {
        heading: "The hotel rule",
        text: "Aim for at least three light sources in a room, at three different heights, and never rely on the ceiling alone.",
      },
    ],
  },
  {
    slug: "why-2700k-warm-light-matters",
    title: "Why 2700K is the most flattering light in your home",
    dek: "Colour temperature changes how a room feels more than almost anything else. Here's the number to remember.",
    date: "2026-10-05",
    image: { url: "/products/aurelia/stage-on.webp", alt: "The Aurelia lamp glowing honey-gold in a dark room" },
    body: [
      {
        text: "Light has a colour, measured in kelvin (K). Daylight at noon is around 5500K, cool and blue. A candle is about 1900K, deep amber. Most homes look their best somewhere in between.",
      },
      {
        heading: "The magic number",
        text: "At 2700K, light turns golden. Skin looks warm, wood looks rich, and linen and stone look the way they did in the showroom. It's the colour of every lamp we photograph.",
      },
      {
        heading: "When to go cooler",
        text: "A kitchen counter or a reading desk can take 3000K for a little more clarity. Above 4000K, rooms start to feel like offices.",
      },
      {
        heading: "Try it",
        text: "Switch on the light on our site and move the warmth slider: you'll see the difference between a candle and soft white in a second.",
      },
    ],
  },
  {
    slug: "what-is-pla-and-is-it-sustainable",
    title: "What is PLA, honestly?",
    dek: "Our pieces are printed in PLA, a bioplastic made from plants. Here's what that means, and what it doesn't.",
    date: "2026-09-28",
    image: { url: "/atelier/print.webp", alt: "A 3D printer laying a glowing thread of ochre PLA" },
    body: [
      {
        text: "PLA (polylactic acid) is made from renewable plant sugars such as corn starch or sugarcane, instead of petroleum. It's the material our printers lay down, one fine thread at a time.",
      },
      {
        heading: "What it is",
        text: "A plant-based bioplastic that's rigid, lightweight and beautiful to finish by hand. It takes light wonderfully, which is why our shades glow the way they do.",
      },
      {
        heading: "What it isn't",
        text: "It isn't 'biodegradable' in your garden or a landfill. PLA breaks down only in industrial composting facilities. So rather than make a promise we can't keep, we design every piece to be kept for years.",
      },
      {
        heading: "The other half of the story",
        text: "We print only what's ordered, so there's no warehouse of unsold stock, and our keepsake boxes are made to be kept, too.",
      },
    ],
  },
];
