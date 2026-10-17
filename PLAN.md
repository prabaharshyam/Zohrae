# Zohraé — Phase 0 Plan

> Status: **approved** (see Decisions at the end). Phase 1 complete — see CHANGELOG.md.

---

## 1. What the sample photos tell us

Five photos are saved in `public/products/samples/`:

| #   | File                                 | What it shows                                                  | Working name* |
| --- | ------------------------------------ | -------------------------------------------------------------- | ------------- |
| 1   | `01-ochre-pleated-lamp.webp`         | Ochre pleated cone shade on a ribbed globe base                | **Aurelia**   |
| 2   | `02-white-twist-vessel.webp`         | White twisted vessel with flowing ridges (lamp shade or vase?) | **Sora**      |
| 3   | `03-cloud-shade-orange-base.webp`    | White ribbed double-cloud shade on an orange fluted cone       | **Nuvola**    |
| 4   | `04-wave-shade-terracotta-base.webp` | Silky white wave-form shade on a terracotta ring base          | **Onda**      |
| 5   | `05-clear-ribbed-tripod.webp`        | Translucent ribbed shade on three blush-pink legs              | **Ballerina** |

\*Placeholder names in the brand voice. Please rename them as you like.

How this changes the build:

1. **All shots are lamp-off on pure white (#FEFEFE).** None of them have an "on" photo yet, so the **procedural glow (§6b) is the main path**, not a fallback. I'll build it to look convincing on exactly these photos. Each product gets a hand-tuned `glow_origin` and shade mask, set in `/dev/lights`.
2. **White backgrounds clash with night mode and with the ivory page.**
   - _Day mode:_ `mix-blend-mode: multiply` makes the white melt into ivory with no editing. The products sit on the page naturally.
   - _Night mode:_ multiply would turn the whole frame dark. I'll add a build-time script (`scripts/cutout.ts`, using `sharp`) that removes the backgrounds into transparent WebP/AVIF files with a soft contact shadow. The transparent versions are used whenever the lights are on. Pure-white studio shots like these cut out cleanly.
3. **The photos are portrait (≈9:16 and 2:3), not square.** Cards use a **3:4 frame** that the photo fills (`object-cover`, anchored at 68% height), so studio shadows end at the frame edge instead of making a visible seam mid-card. All five pieces fit with about 8% breathing room. PHOTO-GUIDE.md will recommend 3:4 at 2000×2667 instead of square.
4. **The pieces look like they would glow very well.** Thin PLA ribs (#1, #3, #5) light up unevenly where the wall is thin, and the brief's "layer lines glow brighter" shader is aimed at exactly that. #5's translucent shade can take a stronger glow. #4's smooth silk finish needs a soft, milky glow instead.
5. **There are no lifestyle shots yet.** The hover-reveal will use credited Unsplash/Pexels interiors for now (CREDITS.md). Product photos will **not** be composited into rooms, so nothing looks fake.

---

## 2. Stack (confirmed from the brief, with exact choices)

| Concern     | Choice                                                                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime     | Node 22, npm                                                                                                                                                |
| Framework   | Next.js 16 (App Router, Cache Components) + React 19 + TypeScript strict                                                                                    |
| Styling     | Tailwind CSS v4, with tokens as CSS variables on `:root` and a `[data-lights="on"]` override                                                                |
| Fonts       | `next/font/google`: **Bodoni Moda** for display (more fashion-house contrast than Cormorant at hero sizes, and it has an italic) + **Jost** for text and UI |
| Motion      | GSAP + ScrollTrigger (free licence), Lenis, Framer Motion (`motion` package)                                                                                |
| 3D          | three, @react-three/fiber, @react-three/drei, @react-three/postprocessing. Lazy, idle-hydrated, poster image first                                          |
| Lamp glow   | A WebGL2 fragment shader on a single shared canvas (see §5), with a CSS-only fallback                                                                       |
| AR          | `@google/model-viewer`, loaded only on the PDP when a GLB exists                                                                                            |
| Commerce    | Shopify Storefront API 2025-xx (GraphQL) + Cart API, using typed queries via `graphql-codegen`                                                              |
| Data switch | `USE_MOCK_DATA=true` → `lib/commerce/mock`, otherwise → `lib/commerce/shopify`. Both use one `Commerce` interface                                           |
| Uploads     | Cloudinary signed uploads (`/api/upload-signature`)                                                                                                         |
| Quality     | ESLint, Prettier, `tsc --noEmit`, Playwright smoke tests at 390px and 1440px                                                                                |
| Hosting     | Vercel + GoDaddy DNS                                                                                                                                        |

I'm **not** using Hydrogen/Oxygen. It's noted in the docs as the alternative.

---

## 3. Folder structure

```
/app
  layout.tsx                 fonts, providers (Light, Cart, Lenis), header/footer, switch
  page.tsx                   Home story
  collections/[handle]/      products/[handle]/
  personalised/  wedding/  atelier/  journal/[slug]/  light-finder/  cart/
  (legal)/about|care|shipping|returns|contact|privacy|terms
  dev/lights/                glow tuner (dev only, noindex)
  api/upload-signature/  api/newsletter/
  not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx
/components
  brand/        Logo (full | mark | monogram), Wordmark.svg paths
  layout/       Header, Footer, MobileNav, PageTransition
  light/        LightProvider, LightSwitch, LightPanel, LampImage, GlowCanvas, DustMotes, CursorLight
  home/         Preloader, Hero3D, LumiereGallery, WhyLight, Atelier, Vessels, Conscious, Teasers, ShopTheRoom, Proof, Circle
  product/      ProductCard, LifestyleReveal, Gallery, BuyBox, PinChecker, Specs, ScaleSilhouette
  cart/         CartDrawer, FilamentProgress, GiftMode, AddToCartOrb
  personalise/  TumblerPreview, BadgeBuilder, MagnetUploader
  ui/           Button (magnetic), Swatch, Sheet, Toast, Marquee, SplitText, Cursor
/lib
  commerce/     types.ts, index.ts (switch), mock/, shopify/ (client, queries, cart)
  light/        kelvin.ts, filament-ease.ts, glow-config.ts
  motion/       gsap.ts, lenis.ts, reduced-motion.ts, device-tier.ts
  seo/          jsonld.ts
/copy           en.ts — every UI string and all product copy, in one editable file
/data/mock      products.ts, collections.ts, journal/*.mdx
/public
  brand/        zohrae-logo-original.png (you'll supply it), favicon from the monogram
  products/     samples/ (yours), cutouts/ (generated)
  models/       lamp-hero.glb (procedural placeholder, Draco)
/scripts        cutout.ts, make-glb.ts
BRIEF.md  PLAN.md  CHANGELOG.md  CREDITS.md  DEPLOY.md  PHOTO-GUIDE.md  SHOPIFY-SETUP.md  .env.example
```

---

## 4. Design tokens

```css
:root {
  /* brand */
  --ochre: #c0823a;
  --ivory: #f6f1e7;
  --champagne: #e8d3a8;
  --espresso: #2a1d15;
  --night: #0e0b09;
  --glow: #ffb869;
  --sage: #8e9a7b;
  /* semantic (day) */
  --bg: var(--ivory);
  --fg: var(--espresso);
  --fg-muted: #6b5a4c;
  --line: color-mix(in oklab, var(--champagne) 70%, transparent);
  --accent: var(--ochre);
  --focus: var(--ochre);
  /* light engine (driven by LightProvider) */
  --lights: 0; /* 0 → 1, animated */
  --dim: 1; /* 0.1 → 1 */
  --warmth: #ffb869; /* derived from kelvin */
  /* type scale (fluid) */
  --fs-hero: clamp(3.5rem, 11vw, 11rem);
  --fs-h1: clamp(2.5rem, 6vw, 5.5rem);
  --fs-h2: clamp(2rem, 4vw, 3.5rem);
  --fs-body: 1.0625rem;
  --fs-label: 0.75rem;
  --track-label: 0.28em;
  --lead-display: 0.92;
  /* space & motion */
  --gutter: 16px;
  --gutter-lg: clamp(24px, 5vw, 96px);
  --ease-silk: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-filament: cubic-bezier(0.12, 0.9, 0.2, 1);
  --dur-theme: 1200ms;
}
[data-lights="on"] {
  --bg: var(--night);
  --fg: #f3e9d8;
  --fg-muted: #b8a894;
  --line: #3a2c20;
}
```

**Contrast check (AA):** espresso on ivory = 14.5:1 ✓. Warm ivory `#F3E9D8` on night = 16.3:1 ✓. Ochre on ivory = 2.9:1, which is just under the 3:1 needed even for large text. So ochre is used for decoration, hairlines and button fills only; ochre text on ivory gets a darker shade (`--ochre-deep:#8F5C22`, ≥4.5:1). Ochre buttons use **espresso text** (5.1:1 ✓).

---

## 5. How the light engine works (the signature, Phase 2)

- **`LightProvider`** holds `on`, `dim`, `kelvin` and `reducedMotion`, and saves them to `localStorage` inside try/catch. It sets `data-lights` on `<html>` and animates `--lights`.
- **`<LampImage>`** takes the off image, the optional on image, the optional cutout, and a glow config (`origin`, `radius`, `intensity`, `colour`, optional mask).
  - When an **on photo exists**, it does the luminance-weighted reveal: a shader thresholds the on image's luminance and sweeps the threshold from high to low, so highlights bloom first.
  - When there **isn't one** (all five samples today), it uses the procedural shader: warm the shade region, run a ridge-detection pass so the print lines glow brighter, add a bulb hot-spot, halation and a floor light pool.
- **One shared WebGL canvas** draws every visible lamp, using scissor rectangles from `IntersectionObserver`, instead of one GL context per card. That's what keeps mid-range Android phones at 60fps. If WebGL is missing or the device is low-power, a CSS fallback uses radial gradients + `filter` + `mix-blend-mode: screen`.
- **Warm-up timing:** a filament ease over 400–900ms with one flicker at 120ms. Lamps are staggered by their distance from the switch.
- **Light spill:** each lit lamp writes a soft screen-blend radial glow into a page-level layer.
- **Extras:** a dimmer, warmth from 2200K to 3500K (a Kelvin→RGB lookup), a "Golden hour" preset, a cursor torch, dust motes, an evening nudge after 7pm, an optional click sound and haptics.
- **`/dev/lights`:** pick a product, then drag the glow origin directly on the photo, adjust the sliders, and copy the resulting metafield JSON.

---

## 6. Component list by phase

- **P1:** Logo (3 variants × 3 colourways, subline auto-hides under 320px), Header (shrinks and turns translucent on scroll), Footer, MobileNav, LenisProvider, gsap registration, Commerce types + mock data (8 lamps, 4 vases, 2 planters, 4 gifts, 4 wedding items, with the 5 samples used as lamps), every route stubbed, `copy/en.ts`.
- **P2:** everything in §5.
- **P3:** Preloader, Hero3D (procedural lathe lamp with print ridges, bloom, dust), LumiereGallery (pinned horizontal scroll), WhyLight (scroll-scrubbed room), Atelier (layer-by-layer print + box unboxing), Vessels masonry, Conscious, two teasers, ShopTheRoom with mood switcher, Proof marquee, Circle newsletter, wordmark that fills with light.
- **P4:** Collection filters/sort, PDP, LifestyleReveal, CartDrawer, Shopify client + Cart API, checkout redirect, wishlist / Dream Room.
- **P5:** TumblerPreview (cylindrical text warp), BadgeBuilder, MagnetUploader (Cloudinary), line-item attributes, tiered pricing, WhatsApp enquiry, "Need it by" date picker.
- **P6:** Light Finder quiz, É easter egg, page transitions, pull-chain 404, cursor, add-to-cart orb, gift mode, exit-intent modal.
- **P7:** Lighthouse/a11y/SEO pass, JSON-LD, consent + GA4/Meta/Shopify analytics, legal pages, DEPLOY.md, PHOTO-GUIDE.md, SHOPIFY-SETUP.md, Vercel.

---

## 7. Questions for you (answers change what I build)

1. **Logo:** can you add `public/brand/zohrae-logo-original.png`, or an SVG if you have one? Until then I'll build the wordmark from Bodoni Moda glyphs and swap in the traced version later.
2. **Photo #2 (white twist):** is it a lamp shade, a vase, or both? It has no visible base or cord. Right now I'm listing it as a lamp, with a vase variant.
3. **Product names and prices:** keep my working names (Aurelia, Sora, Nuvola, Onda, Ballerina)? What price range should I use for placeholders? My guess is ₹4,500–₹14,000 for lamps.
4. **Real facts to confirm or leave as placeholders:** hours of making per lamp, free-shipping threshold, COD on/off, packaging being plastic-free, the "Return for renewal" programme, GSTIN, WhatsApp number, Instagram handle.
5. **Shopify:** is there an existing store? If so, I'll write the queries against its real metafields in Phase 4. Either way, I'll start with mock data.
6. **Background removal:** OK to generate the transparent cutouts automatically from your white-backdrop photos (§1.2)? The originals stay untouched.
7. **Display font:** Bodoni Moda (my recommendation) or Cormorant Garamond?

If you reply "approved" or answer only some of these, I'll go with the defaults above and start **Phase 1**.

---

## 8. Decisions (owner answers, 17 Oct 2026)

| #   | Question           | Decision                                                                                                                   |
| --- | ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Logo               | Original supplied → `public/brand/zohrae-logo-original.png`, traced to vector paths (`components/brand/wordmark-paths.ts`) |
| —   | Subline            | **"ATELIER · INDIA"**: owner asked for a researched recommendation (see §11)                                               |
| 2   | Photo #2           | It's a **lamp** (Sora)                                                                                                     |
| 3   | Names & prices     | Names approved. **Lamps priced ₹3,000–₹5,000**                                                                             |
| 4   | COD                | **Not available.** Footer shows "Prepaid orders only"; no COD badge anywhere. Other facts remain placeholders              |
| 5   | Shopify store      | **Exists.** Phase 4 will map its real products and metafields                                                              |
| 6   | Background removal | **Approved** (Phase 2, `scripts/cutout.ts`)                                                                                |
| 7   | Display font       | **Bodoni Moda** (with optical-size axis) + Jost                                                                            |

---

## 9. Coverage check against the owner's original idea (17 Oct 2026)

Every point from the owner's original prompt, mapped to where it's built. ✅ = covered as asked. ⚠️ = covered, but changed for a reason the owner should know. ➕ = added to the plan by this check.

| Owner's idea                                                                                              | Where it lives                                                                                                                                                                              | Status                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ultra-luxury e-commerce for home decor, mostly lamps & vases                                              | Whole site; Lumière + Vases & Vessels collections                                                                                                                                           | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| French / Italian designer feel                                                                            | Bodoni Moda, Roman numerals, one Italian/French word per section, restrained palette                                                                                                        | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Brand Zohraé, tagline "Shine Beyond!"                                                                     | Logo, hero, copy file                                                                                                                                                                       | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Logo subline changed from "Creative Studio"                                                               | Logo component                                                                                                                                                                              | ⚠️ Original prompt said "Luxury **online** home decor Studio"; owner's later instruction said "Luxury Home decor Studio", which is what's live. Confirm which one.                                                                                                                                                                                                                                                                   |
| Custom gifts: name sticker on a Stanley tumbler, Christmas juice tumbler, other Cricut Maker 4 home decor | `/personalised` (Phase 5): live name preview on the tumbler, Christmas collection with snow (1 Nov–31 Dec)                                                                                  | ⚠️ Products are titled "Personalised 40oz Insulated Tumbler", not "Stanley Tumbler", because using another brand's name in titles, SEO or ads risks a trademark complaint and Shopify/Meta ad takedowns. If the owner buys genuine Stanley tumblers, descriptions can say "on a genuine Stanley® tumbler" in plain text.                                                                                                             |
| ➕ More Cricut home decor                                                                                 | Phase 5 mock catalogue grows to: pantry & spice jar labels, wall decals/quotes, personalised name plates, mirror decals, cake toppers, festive door signs. Owner to confirm the real list.  | ➕                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Wedding: badges for bride, groom, bridesmaids, groomsmen, cousins, relatives                              | `/wedding` (Phase 5): role-based badge builder with live preview grid                                                                                                                       | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Wedding photo fridge magnets                                                                              | Photo upload → Cloudinary → saved on the order                                                                                                                                              | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Wedding return-gift fridge magnets                                                                        | Tiered bulk pricing + WhatsApp enquiry for large weddings                                                                                                                                   | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| "A small section" for wedding                                                                             | One page + one home teaser panel; not in the main visual story                                                                                                                              | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Shopify for cost, shipping, pricing, analytics, inventory, payments                                       | Headless Shopify + Shopify-hosted checkout (§2)                                                                                                                                             | ✅ See recommendation below                                                                                                                                                                                                                                                                                                                                                                                                          |
| Full of animation, surprises, fully scrolling 3D                                                          | Phase 3 (scroll story), Phase 6 (delight layer)                                                                                                                                             | ➕ Extended: see "More 3D" below                                                                                                                                                                                                                                                                                                                                                                                                     |
| Floating lights on/off switch; lamps look truly lit; ultra-realistic                                      | Phase 2 light engine (§5)                                                                                                                                                                   | ✅ Realism ceiling: procedural glow on current photos is convincing; _photographic_ "on" shots are what make it indistinguishable from real. PHOTO-GUIDE.md explains the two-shot method.                                                                                                                                                                                                                                            |
| Owner's lamp photos as reference; sample pictures until full list                                         | 5 real photos in use; branded placeholders for the rest                                                                                                                                     | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 3D printed, hand-crafted, premium packaging                                                               | L'Atelier chapter (print → finish → light test → unboxing), PDP "What's in the box", trust row                                                                                              | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Environment-friendly section: PLA                                                                         | Conscious luxury chapter (§10 of the brief)                                                                                                                                                 | ⚠️ PLA **is** a plastic: a _plant-based bioplastic_. Saying "not plastic" or "not harmful like plastic" would be a false green claim, which India's CCPA Guidelines on Greenwashing (2024) and ASCI prohibit and which savvy buyers call out. The copy instead says what is true and still persuasive: made from renewable plants (corn/sugarcane) instead of petroleum, made to order in small batches, designed to last for years. |
| Section on how lamps elevate luxury at home                                                               | Home chapter III "Why light is the ultimate luxury": scroll-scrubbed room going from flat overhead light to layered lamplight                                                               | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Seductive, purchase-driving content                                                                       | Copy voice (§13 of the brief), every section ends with a CTA, `copy/en.ts`                                                                                                                  | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Hover shows lifestyle image (home, studio, bedroom)                                                       | Phase 4 light-reveal hover on every card; tap/hold on mobile                                                                                                                                | ✅ Needs one lifestyle photo per product; credited stock interiors until then                                                                                                                                                                                                                                                                                                                                                        |
| Owner's extra ideas welcome                                                                               | Delight layer: É easter egg, Light Finder quiz, glowing add-to-cart orb, filament free-shipping bar, gift mode, Dream Room wishlist, pull-chain 404, room mood switcher, WhatsApp concierge | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Built in Claude Code                                                                                      | Yes                                                                                                                                                                                         | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| GoDaddy domain                                                                                            | DEPLOY.md Part 2 (A + CNAME records)                                                                                                                                                        | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ➕ Live preview on every push                                                                             | Vercel project connected: https://zohrae-five.vercel.app                                                                                                                                    | ✅                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Recommendation on the backend ("if you have a better way")

Keep Shopify. A custom backend built in Claude Code (database + Razorpay + admin screens) would cost more to build and maintain, and would still lack what Shopify gives for about ₹1,500–2,000/month: inventory, Indian payment gateways (UPI, cards, netbanking via Razorpay/PayU/Cashfree), shipping rates and labels (Shiprocket/Delhivery apps), discounts, GST invoices, abandoned-cart emails, analytics, customer accounts and a mobile admin app. Claude Code's job is the part Shopify themes can't do: this front-end.

Two Shopify settings directly answer the owner's list:

- **Cost:** enter "Cost per item" on every product; Shopify's **Profit by product** report then shows margin per lamp.
- **Analytics:** Shopify analytics + GA4 + Meta Pixel (Phase 7), with a consent banner.

### More 3D (extends Phase 3)

The brief's only true WebGL scene was the hero lamp. To make the site _fully_ 3D-on-scroll as asked, Phase 3 adds, without breaking the 60fps mobile budget (one shared canvas, lazy-loaded, still posters for low-power phones):

1. **Hero:** sculpted lamp turning on its plinth as you scroll, switching on at 30% (as briefed).
2. **L'Atelier:** the same lamp _printing itself_ layer by layer in 3D (a clipping plane rising through the model, with a glowing nozzle line), then the packaging box assembling around it.
3. **Conscious luxury:** a plant stem → filament spool → lamp morph in 3D.
4. **Vases & Vessels:** procedural 3D vessels (twist, wave, fluted) that rotate with scroll and drag.
5. **Why light is luxury:** a 2.5D room (layered photo planes with real-time light in a shader), so the lamps relight the room as you scroll.
6. **Product pages:** a 3D/AR view whenever a GLB exists (phone LiDAR scans later).

---

## 10. Decision: AI-generated "lit" and lifestyle images (17 Oct 2026)

Owner decision: **no photoshoots.** "Lamp on" images and lifestyle (in-the-room) images are AI-generated from the owner's real product photos, keeping each piece unchanged.

- **Tool:** Canva AI image generation, with the owner's original photo as the reference image (imported from the live site), so the generated lamp is the owner's actual design.
- **Per lamp:** `image_on` (same framing as the studio shot, lamp lit, room dimmed); `lifestyle_image` (styled room: bedroom / living room / studio / reading corner); `lifestyle_image_on` (same room at night) where it adds value.
- **Light switch:** crossfades the studio shot to the AI "on" shot, with the procedural glow layered on top to drive the filament warm-up, flicker and light spill. The procedural glow stays as the fallback for any product without an "on" image yet.
- **Quality bar:** every generated image is checked against the real piece (shape, rib/pleat pattern, colour, base). Anything that alters the product is regenerated, because product images that misrepresent the item can mislead buyers. Room scenes can be imaginative; the product cannot.
- **Pilot (Aurelia):** lit studio shot and an evening bedroom scene generated successfully.
- **Blocker:** this cloud environment's network blocks Canva's file servers, so full-resolution files can't be pulled into the repo automatically. Fix: allow `canva.com` / `*.canva.com` in the environment's network settings. Otherwise the owner downloads the files from Canva and sends them in chat.
- PHOTO-GUIDE.md (Phase 7) becomes a short **image-generation guide** with the prompts used, so the owner can make images for new products the same way.

---

## 11. Decision: logo subline "ATELIER · INDIA" (17 Oct 2026)

The owner rejected both earlier sublines and asked for a researched recommendation.

- **Origin as descriptor** is the strongest luxury convention: Hermès Paris, Diptyque Paris, Flos Italia, Bottega Veneta Milano. Naming India owns the brand's origin with pride.
- **"Atelier"** means a designer's workshop where pieces are made by hand. That's true of 3D-printed, hand-finished pieces, and it covers lamps, vessels, Cricut gifts and wedding keepsakes alike.
- **Rejected:** "Maison …" (implies multi-generation heritage a new studio can't claim); "Atelier de Lumière" (too close to the Atelier des Lumières, a well-known Paris digital-art museum); "Objets de Lumière" (an existing lighting collection by artist Thierry Dreyfus); long descriptive lines like "Luxury Home Decor Studio" (generic, and too long to show at small sizes).
- At 15 characters it stays visible down to 140px wide (the auto-hide threshold moved from 240px to 140px).
- "Luxury home decor" still appears in the page titles, meta descriptions and copy, where it helps search.

---

## 12. Phase 2 implementation notes (17 Oct 2026)

- **Cutouts replaced by "dark room" frames:** at night each product frame is a darkened, warm version of the photo whose edges feather into the page. It keeps real shadows and is safe for white or clear shades. `scripts/analyze-products.mjs` still writes silhouette masks, which the procedural glow uses.
- **Glow rendering:** layered CSS (opacity-only animation) instead of a WebGL shader; WebGL stays for the 3D scenes in Phase 3.
- **Alignment:** the AI lit shot is placed so its lamp lands on the studio shot's lamp, using measured subject boxes (`data/mock/image-meta.json`). In Shopify this becomes part of the image metafields, or the script runs at build time.

---

## 13. Light switch v2: photographic pairs (17 Oct 2026)

Supersedes §5, §10 and §12. The owner wants the light switch to look like the previous Zohraé site: a crossfade between **matched off/on photographs** of the same shot. The glow is photographed, not drawn. The previous site's pairs (cut-outs, stages, rooms) were imported for all five lamps plus three more. New lamps follow `docs/ai-image-prompts.md`: generate the off image, then make the on image _from_ it. The page itself still moves from ivory to night when the lights go on; the hero is a dark showroom in both modes.

---

## 14. Phase 3 decisions (17 Oct 2026)

- **Design:** the ivory editorial direction from Phases 1–2 (owner's preference), with photographic light pairs. The home hero shows the product as a real photograph; 3D is used for the atelier's making story, where a rendered look is expected.
- **No invented social proof:** the reviews marquee is replaced by true brand facts until real reviews exist.
- **No fake lighting moods:** the "Morning / Golden hour / Midnight" photo-grading switcher on Shop the room was dropped; filter-graded photos read as artificial.
- **Sustainability stats:** "100% plant-based filament" is avoided (pigments and additives); copy says "plant-based PLA".
