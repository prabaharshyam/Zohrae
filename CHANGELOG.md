# Changelog

## Phase 1 — Foundation (17 Oct 2026)

### Built

- **Next.js 16** (App Router, Cache Components, Turbopack) + React 19 + TypeScript (strict) + Tailwind CSS v4.
- **Design tokens** in `app/globals.css`: brand palette, semantic day tokens and night overrides under `[data-lights="on"]` (ready for the Phase 2 switch), fluid type scale, gutters (16px on mobile), easing curves. Added `--ochre-deep` (#8F5C22) for gold _text_, because the brand ochre on ivory is only 2.9:1 contrast.
- **Fonts:** Bodoni Moda (variable, italic, optical sizing) + Jost via `next/font`, self-hosted at build time.
- **Logo:** your original traced to vector paths (`scripts/trace-logo.mjs` → `components/brand/wordmark-paths.ts`). `<Logo />` has three variants — `full` (wordmark + "LUXURY HOME DECOR STUDIO" as live text, justified to the wordmark's width), `mark` (header) and `monogram` (Z + É accent) — and three colourways (ivory-on-ochre, ochre-on-ivory, ivory-on-night) or `current`. The subline hides automatically below 240px wide. The É accent is a separate path, ready for the easter egg.
- **Favicon / Apple touch icon** from the monogram (`app/icon.svg`, `app/apple-icon.png`).
- **Header:** centred wordmark; Collections · Atelier · Wedding · Gifts on the left (Collections opens a panel); search, Dream Room, account and "Your Collection" with a count on the right. Shrinks and turns translucent on scroll. Full-screen menu on mobile with scroll lock and Escape to close. Skip-to-content link.
- **Footer:** full logo, link columns, WhatsApp concierge (pre-filled message), payment badges (UPI · GPay · Cards · Netbanking), "Prepaid orders only", "Handcrafted in India · Shipped across India", GSTIN once set, and the large outline wordmark (it fills with light in Phase 3).
- **Motion setup:** GSAP + ScrollTrigger registered once (`lib/motion/gsap.ts`); Lenis smooth scroll on GSAP's ticker (`lib/motion/SmoothScroll.tsx`), switched off completely under `prefers-reduced-motion`; a site-wide reduced-motion CSS guard.
- **Data layer:** shared types (`lib/commerce/types.ts`) mirroring the `zohrae.*` metafields, a mock adapter, a Shopify adapter stub (Phase 4) and an env switch (`USE_MOCK_DATA`). Calls are cached with `"use cache"`.
- **Mock catalogue in the house voice:** 8 lamps (your 5 photos — Aurelia, Sora, Nuvola, Onda, Ballerina — plus Lys, Coquille and Fiore with a branded placeholder), 4 vases, 2 planters, 4 personalised gifts, 4 wedding items; 8 collections. Lamps are priced ₹3,200–₹5,000.
- **All copy in one file:** `copy/en.ts`.
- **Routes:** `/`, `/collections/[handle]` and `/products/[handle]` are real pages driven by the data layer (prerendered for every handle). `/personalised`, `/wedding`, `/atelier`, `/journal`, `/light-finder`, `/cart`, `/about`, `/care`, `/shipping`, `/returns`, `/contact`, `/privacy`, `/terms` and `/dev/lights` (noindex) are editorial placeholders that say which phase fills them. There is also a first-draft 404.
- **Product photography:** white-backdrop shots fill a 3:4 frame and blend into the page (`mix-blend-mode: multiply`), so they sit on ivory with no editing. The hero feathers its edges so the shadows dissolve.

### Verified

- `npm run build` passes (51 pages prerendered); `npm run check` (typegen + tsc + eslint) is clean; Prettier applied.
- Headless Chromium at **390×844** and **1440×900**, with motion both allowed and reduced, on `/`, a collection, two product pages, `/wedding` and a missing URL: **no horizontal overflow, no console errors** (apart from the expected 404 response on the missing URL).

### What I need from you next

- WhatsApp number, Instagram handle and GSTIN (or tell me to leave them hidden).
- Free-shipping threshold and hours of making per lamp (placeholders for now).
- Whether packaging is plastic-free, and whether to offer "Return for renewal".
- For later phases: Shopify Storefront token (Phase 4), and "lamp on" photos whenever possible (see the photo guide in Phase 7).

### Next: Phase 2 — the Lumière light switch

Floating switch, day/night theming, procedural glow tuned to your five photos, background cutouts for night mode, dimmer and warmth, and the `/dev/lights` tuner.
