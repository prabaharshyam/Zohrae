# Changelog

## Phase 2 — The Lumière light switch (17 Oct 2026)

### Built

- **Floating rocker switch** (`components/light/LightSwitch.tsx`): ivory plate, brass screws and a rocker that tilts in 3D. The pilot light glows when it's on. It sits bottom-right on desktop and bottom-centre on phones, clear of the safe area. It's a real `role="switch"` with `aria-checked` and works from the keyboard. Haptic tick on supported phones.
- **Settings panel:** press and hold the switch, or tap ⋯. It has a dimmer (10–100%), warmth from Candle 2200K through Warm 2700K to Soft white 3500K, a **Golden hour** preset and Reset.
- **Night mode for the whole site:** ivory crossfades to night over 1.2s, text turns warm ivory, and a soft vignette appears. The choice is remembered, and an inline script applies a saved "lights on" before first paint, so night mode never flashes in.
- **Every lamp lights up:**
  - _With an AI lit shot_ (Aurelia, Sora, Nuvola): the shot is aligned exactly to the studio photo using measured subject boxes, so nothing jumps. Highlights bloom first, then mid-tones.
  - _Without one_ (Onda, Ballerina): a procedural glow built from the studio photo itself. The shade is warmed and lit inside its own silhouette mask, so the ribs and pleats stay visible. Added on top: an inner bulb glow, a soft halo, and a light pool on the table.
  - _Placeholders:_ a gentle glow behind the monogram.
- **Filament warm-up:** each lamp switches on over 450–900ms with a fast rise, a slow settle and one tiny flicker at ~120ms. Lamps nearest the switch light first, so the light travels across the page. Switching off is a quick ember fade.
- **Light spill:** each lit lamp throws a soft glow past its card onto the page around it.
- **Atmosphere:** dust motes drift in the light of the lamps on screen, and on desktop a warm torch-like glow follows the cursor.
- **Evening nudge:** after 7pm the switch pulses once with "It's evening. Want to see them glow?" (once per session).
- **Optional click sound,** synthesised in the browser so there's no file to download. It's off by default; the Sound toggle is in the footer.
- **`/dev/lights` tuner:** drag the bulb marker on each lamp's photo, set radius, intensity and light colour, compare the AI shot with the procedural glow, and copy the metafield values.
- **`scripts/analyze-products.mjs`:** measures where each piece sits in every photo, for alignment, and writes the silhouette masks used by the glow. Run it again whenever photos change.
- **Performance:** per-frame work is limited to opacity, plus one filter on AI lit shots during warm-up. Off-screen lamps switch instantly. Dust motes are capped at 60, pause when the tab is hidden, and are skipped on low-power devices.
- **Reduced motion:** instant switching, no flicker, no dust motes, no cursor light.

### Changed from the plan

- **No background cutouts.** At night, product photos become a darkened, warm "room" whose edges feather into the page. It looks more natural than cut-outs, keeps the real shadows, and doesn't risk losing the edges of white or clear shades. (The owner had approved cutouts, so this is called out here.)
- The glow is built with layered CSS on the GPU compositor instead of a WebGL shader. It looks equivalent on these photos and is cheaper on mid-range phones. WebGL is still used for the 3D hero in Phase 3.

### Verified

- Production build passes; typecheck and lint are clean.
- Headless Chromium at 1440×900 and 390×844: switch on and off, settings panel, Golden hour, evening nudge (browser clock set to 8:15pm IST), state remembered across reloads, `/dev/lights`. No console errors, no horizontal overflow, and reduced motion switches instantly.

### What I need from you

- Nothing blocking. When Canva's AI credits reset on 1 November, or if you upgrade, I'll generate lit shots for Onda and Ballerina and the room scenes. They'll replace the procedural glow automatically.

---

## Phase 1 — Foundation (17 Oct 2026)

### Built

- **Next.js 16** (App Router, Cache Components, Turbopack) + React 19 + TypeScript (strict) + Tailwind CSS v4.
- **Design tokens** in `app/globals.css`: brand palette, semantic day tokens and night overrides under `[data-lights="on"]` (ready for the Phase 2 switch), fluid type scale, gutters (16px on mobile), easing curves. Added `--ochre-deep` (#8F5C22) for gold _text_, because the brand ochre on ivory is only 2.9:1 contrast.
- **Fonts:** Bodoni Moda (variable, italic, optical sizing) + Jost via `next/font`, self-hosted at build time.
- **Logo:** your original traced to vector paths (`scripts/trace-logo.mjs` → `components/brand/wordmark-paths.ts`). `<Logo />` has three variants — `full` (wordmark + subline as live text, now "ATELIER · INDIA", justified to the wordmark's width), `mark` (header) and `monogram` (Z + É accent) — and three colourways (ivory-on-ochre, ochre-on-ivory, ivory-on-night) or `current`. The subline hides automatically below 140px wide. The É accent is a separate path, ready for the easter egg.
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
