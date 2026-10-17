# ZOHRAÉ — Build Brief for Claude Code
### Ultra-luxury headless e-commerce site · "Shine Beyond!"

> **How to use:** Create an empty project folder, save this file in it as `BRIEF.md`, open Claude Code there and say:
> *"Read BRIEF.md fully. Start with Phase 0 and stop after each phase so I can review."*
> Do not ask Claude Code to build everything in one go — the phased plan at the end exists for a reason.

---

## 1. Role & mission

You are a senior creative developer and luxury brand designer — think the craft level of an Awwwards Site of the Day, with the restraint of a Parisian or Milanese maison (Hermès, Flos, Bottega Veneta, Diptyque). Build **Zohraé**, an online luxury home-décor studio from India selling designer lamps and vases that are 3D-printed and hand-finished, presented in premium packaging.

The site must make visitors *feel* something within three seconds: warmth, desire, calm, a sense of being let into a private atelier. Every scroll should reward them. Every click should feel tactile. And it must sell — beauty serves conversion, never fights it.

---

## 2. Brand

| | |
|---|---|
| **Name** | Zohraé (always with the accent on the É) |
| **Tagline** | Shine Beyond! |
| **Descriptor** | LUXURY ONLINE HOME DECOR STUDIO |
| **Category line** | DECOR · LAMPS · VASES · PLANTERS |
| **Origin** | Designed and hand-finished in India |
| **Personality** | Sensual, warm, confident, quietly playful. European atelier sensibility, Indian warmth and craft. |

### Logo
- The original logo file will be placed at `/public/brand/zohrae-logo-original.png`: a thin high-contrast display serif wordmark "ZOHRAÉ" in ivory on ochre, with a spaced sans-serif subline.
- **Change the subline** from "CREATIVE STUDIO" to **"LUXURY ONLINE HOME DECOR STUDIO"**, same letterspaced geometric sans (Poppins/Jost-style, light weight, wide tracking).
- Build `<Logo />` as an inline SVG component: the wordmark (trace/vectorise the original, or I will supply an SVG) + the new subline as live text. Variants: `full` (wordmark + subline), `mark` (wordmark only, for the header), `monogram` (a "Z" with the É accent flourish, for favicon, loader, and stamp).
- Logo must work in ivory-on-ochre, ochre-on-ivory, and ivory-on-night.
- Because the new subline is long, at small sizes hide the subline automatically and show the wordmark only.

### Palette (design tokens on `:root`)
| Token | Hex | Use |
|---|---|---|
| `--ochre` (Zohraé Gold) | `#C0823A` | Brand colour from the logo, primary accents, CTAs |
| `--ivory` | `#F6F1E7` | Main background (lights off / day) |
| `--champagne` | `#E8D3A8` | Secondary surfaces, hairlines |
| `--espresso` | `#2A1D15` | Body text |
| `--night` | `#0E0B09` | "Lights on" evening mode background |
| `--glow` | `#FFB869` | Warm 2700K lamplight tint |
| `--sage` | `#8E9A7B` | Sustainability section only |

Use gold as a precious accent, not a flood. Large areas of ivory and night; ochre in moments.

### Typography
- **Display:** a high-contrast Didone/editorial serif — *Cormorant Garamond* or *Bodoni Moda* (Google Fonts). Huge sizes, tight leading, occasional italic for seduction ("*light* is the last thing you notice and the first thing you feel").
- **Text/UI:** *Jost* or *Poppins* Light/Regular, generous letterspacing for labels (0.2–0.35em uppercase).
- French/Italian flavour through small details: section numerals in Roman (I, II, III), occasional italic French/Italian words used sparingly as accents ("*Lumière*", "*L'Atelier*", "*Fatto a mano*" — never more than one per section, always understandable from context).

---

## 3. Recommended architecture

**Headless Shopify** — Shopify stays the brain (products, pricing, inventory, orders, shipping, payments, discounts, analytics, customer accounts), and a fully custom front-end delivers the luxury experience that no Shopify theme can.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Best ecosystem for 3D + animation, great SEO, image optimisation |
| Commerce | **Shopify Storefront API (GraphQL)** + Cart API | Products, collections, cart; created via Shopify's *Headless* sales channel app |
| Checkout | **Shopify hosted checkout** via `cart.checkoutUrl` | Keeps all Indian payment gateways set up in Shopify (UPI/GPay, cards, netbanking via Razorpay/PayU/Cashfree, COD if enabled). Never build a custom payment flow. |
| 3D | **React Three Fiber + drei + @react-three/postprocessing** | Hero lamp, bloom, real-time light |
| Scroll & motion | **GSAP + ScrollTrigger**, **Lenis** smooth scroll, **Framer Motion** for UI micro-interactions | |
| AR | **`<model-viewer>`** with GLB (+ USDZ for iOS Quick Look) | "See it in your room" |
| Styling | Tailwind CSS + CSS variables for tokens | |
| Custom-order uploads | **Cloudinary** (or UploadThing) signed uploads | Wedding photos for magnets; URL stored as a cart line attribute |
| Hosting | **Vercel** | Free tier is enough to start; domain from GoDaddy pointed via DNS |
| Content | Shopify metaobjects/metafields for product data; MDX or Shopify metaobjects for editorial copy | One place to manage everything |

Alternative to mention to the owner (do not build unless asked): Shopify **Hydrogen** hosted on Shopify **Oxygen**. Next.js is chosen for its stronger 3D/animation ecosystem.

**Dev tooling:** if available, install Shopify's Dev MCP server in Claude Code so you can look up current Storefront API schemas instead of guessing.

### Shopify data model (set up instructions for the owner + typed queries)
Product types: `Lamp`, `Vase`, `Planter`, `Decor`, `Custom Gift`, `Wedding`.

Product metafields (namespace `zohrae`):
- `image_off` (file) — product photographed with lamp OFF
- `image_on` (file) — exact same framing, lamp ON (powers the Lights toggle)
- `lifestyle_image` (file) — product styled in a real room (hover reveal)
- `lifestyle_image_on` (file, optional) — the lifestyle shot with lamp on
- `model_glb`, `model_usdz` (file, optional) — for 3D/AR
- `light_colour` (single line: e.g. `amber`, `warm white`, `rose`) — tints the procedural glow
- `dimensions`, `weight`, `material`, `finish`, `bulb_type`, `cable_length`, `handcraft_hours` (number), `edition_size` (number, for limited editions)
- `story` (rich text) — the designer's note for this piece

Collections: Lumière (Lamps), Vases & Vessels, Planters, Objets (Decor), Personalised Gifts, Wedding Atelier, Limited Editions, Gifts under ₹X.

Until real products are added, build against a **local mock data layer with the same TypeScript types**, switchable with an env flag (`USE_MOCK_DATA=true`). Use tasteful placeholder images (Unsplash/Pexels lamp & interior photography, credited in a `CREDITS.md`) and generate lit/unlit variants procedurally for the toggle demo.

---

## 4. Site map

```
/                       Home (the cinematic story)
/collections/[handle]   Collection pages (Lumière, Vases, Planters, Objets…)
/products/[handle]      Product detail page
/personalised           Cricut personalised gifts
/wedding                Wedding Atelier (badges & magnets)
/atelier                How it's made + sustainability
/journal                Styling guides / light & interiors editorial (SEO)
/light-finder           "Find your light" quiz
/cart                   Drawer by default, page as fallback
/about, /care, /shipping, /returns, /contact, /privacy, /terms
```

Header: mark logo (centre), left "Collections · Atelier · Wedding · Gifts", right search, wishlist, account, cart ("Your Collection" with count). Header shrinks and turns translucent on scroll.

---

## 5. Home page — scroll-driven story

Build as one continuous cinematic journey. Every section has a scroll-linked reveal; nothing just "appears".

**0 · Preloader (max ~1.8s, skippable, only on first visit)**
Night screen. A single filament line draws itself in gold, flickers once, and blooms into the monogram. Then the curtain lifts to ivory. Count-up 0–100 is too cliché — use the filament warming instead.

**I · Hero — "Shine Beyond!"**
- A full-viewport R3F scene: one signature lamp (GLB placeholder: a sculptural ribbed/twisted lamp built from a lathe geometry with visible print-layer ridges) slowly rotating on a plinth.
- As the user scrolls, the camera orbits; at 30% scroll the lamp switches on — real bloom, warm light pooling on the plinth, soft shadows, dust motes drifting in the light.
- Headline in huge display serif, split into lines with masked rise animation: "*Light,* sculpted." / "Shine Beyond!"
- Sub-copy and two CTAs: "Explore Lumière" (primary) and "Find your light" (ghost).
- Scroll cue: a tiny pull-chain at the bottom that swings with cursor movement.

**II · "The Lumière Collection" — horizontal scroll gallery**
Pinned section; vertical scroll drives a horizontal track of featured lamps. Each card has a slight 3D tilt on cursor, parallax on the image, and the hover lifestyle reveal (see §7).

**III · "Why light is the ultimate luxury"** (the owner explicitly wants this section)
A dark, intimate editorial chapter. Scroll-scrubbed: a styled living room starts in flat overhead light, and as the user scrolls, overheads dim and Zohraé lamps glow on one by one — the room transforms from ordinary to five-star hotel suite. Three short beats of copy appear alongside:
1. *"The most beautiful homes aren't lit. They're layered."* — on layered light (ambient, task, accent).
2. *"Warm light makes a room feel twice as expensive."* — on 2700K warmth, shadow, depth, texture.
3. *"A lamp is jewellery for a room."* — on sculpture by day, atmosphere by night.
End with CTA: "Light your room".

**IV · L'Atelier — from thread to treasure**
Pinned scroll story of the making process, 5 steps, each with a scroll-animated visual:
Design sketch → layer-by-layer print (animate a lamp being built up line by line from the plinth, like a real print) → hand finishing → light testing → wrapping in premium packaging (box lid lifts, tissue unfolds, a handwritten card appears).
Stats with count-up: "_ hours of making per lamp", "1 pair of hands", "100% plant-based filament".

**V · Vases & Vessels / Planters**
Masonry grid with staggered reveals. Vases slowly rotate on hover (360° image sequence if available, else subtle 3D tilt).

**VI · Conscious luxury (sustainability)** — sage-tinted chapter. Copy rules in §10.

**VII · Personalised gifts teaser** and **VIII · Wedding Atelier teaser** — two elegant split panels linking to their pages.

**IX · Shop the room** — a full-width lifestyle photo with pulsing hotspots on each product; clicking opens a quick-add card.

**X · Social proof** — customer photos/reviews in a slow marquee; press/"as seen in" if any (placeholder hidden until real).

**XI · The Zohraé Circle** — newsletter: "Be first to see new pieces. Members get early access to limited editions." Reward on signup: a "private" discount code revealed with a light-up animation.

**Footer** — big wordmark in outline that fills with gold light as you reach the bottom; descriptor; social links; WhatsApp concierge; payment icons (UPI, cards); "Handcrafted in India · Shipped across India".

---

## 6. ★ Signature feature: the "Lumière" light switch

A floating, physical-looking toggle — a brass/ivory rocker switch with a tiny gold screw detail — fixed bottom-right (bottom-centre on mobile, above the safe area). Label underneath: "Lights" with OFF/ON.

**When switched ON — the whole site becomes evening:**
1. **Sound & touch:** an optional soft mechanical click (muted by default; sound toggle in the footer; only after user gesture). Haptic `navigator.vibrate(10)` on supported mobiles.
2. **Filament warm-up, not an instant switch:** each lamp ramps up over 400–900ms with an ease that mimics a filament (fast start, slow settle) and **one tiny flicker** at ~120ms. Stagger lamps by their position on screen (nearest to the switch first — light "travels" across the page).
3. **Page goes to night:** background crossfades ivory → `--night`, text to warm ivory, imagery gets a subtle warm grade, a soft vignette appears. Transition ~1.2s.
4. **Every lamp image lights up realistically.** Use this priority:
   - **a) Photographic (most realistic, preferred):** crossfade `image_off` → `image_on` (same framing). Overlay the "on" image using a luminance-weighted reveal so bright areas appear first, then mid-tones — light *blooms* rather than fades.
   - **b) Procedural fallback (no "on" photo yet):** a WebGL/CSS shader layer that: brightens and warms the shade region (mask auto-generated from a soft radial gradient centred on a configurable `glow_origin` x/y, or from a supplied mask PNG), adds translucency so the 3D-print layer lines glow brighter at thin points, adds bloom/halation around the shade, a hot-spot where the bulb is, and a light pool/cast on the surface beneath. Tint from `light_colour`.
   - **c) 3D hero lamp:** emissive material + point light + bloom + volumetric cone, soft shadows.
5. **Light spills beyond the card:** each lit lamp casts a large, very soft radial glow (`mix-blend-mode: screen`) onto neighbouring content so the page feels genuinely illuminated, not just images swapped.
6. **Dust motes** drift slowly in the brightest areas (canvas particles, low count, paused when off-screen).
7. **Bonus controls** (appear as a small panel when the switch is long-pressed or via a "⋯" next to it):
   - **Dimmer** slider 10–100% (scales glow intensity and exposure).
   - **Warmth** slider: Candle 2200K → Warm 2700K → Soft White 3500K.
   - "Golden hour" preset.
8. **Cursor becomes a light** in night mode (desktop): a faint warm torch-like radial glow follows the cursor, revealing texture on surfaces.
9. Persist the switch state for the session (`localStorage`, wrapped in try/catch).
10. **Smart nudge:** if the visitor's local time is after 7pm, the switch gently pulses once with a tooltip "It's evening. Want to see them glow?"
11. Respect `prefers-reduced-motion`: instant crossfade, no flicker, no particles.
12. Must stay smooth at 60fps on a mid-range Android phone — lazy-initialise heavy effects only for lamps in the viewport.

Add a short dev page `/dev/lights` to tune glow origin, intensity, and colour per product and output the metafield values.

---

## 7. Product cards & hover lifestyle reveal

- Default: clean product shot on ivory/neutral.
- **Desktop hover:** a soft circular "light reveal" mask expands from the cursor position to show the **lifestyle image** (in a bedroom, living room, studio). Small label fades in: "In the bedroom" / "In the studio".
- **Mobile:** tap-and-hold or a small "See in a room" icon toggles; also swipeable image carousel.
- If lights are ON, show `lifestyle_image_on` when available.
- Card details on hover: name in serif, price, "Handcrafted · Limited" tag, quick-add (opens variant mini-sheet), heart for wishlist with a tiny gold burst.
- Magnetic buttons, 3D tilt (max 6°), image parallax.

---

## 8. Product detail page (PDP)

- Left: large gallery with zoom (pinch on mobile), 3D viewer tab if GLB exists, **"View in your room" AR** button (model-viewer), and a per-product light switch on the image ("Switch it on").
- Right (sticky): name, short seductive line, price (₹, tax-inclusive), variant selectors as visual swatches (finish/colour), quantity, **Add to Collection** (cart) and **Buy now**, delivery estimate with **PIN code checker**, "Gift-wrap with handwritten note" option (+ note field → cart attribute), trust row (Handcrafted · Secure payments · Easy returns · Premium packaging).
- Below: "The story of this piece" (designer note), specifications (dimensions shown with a human-scale silhouette illustration for size), materials & care, "What's in the box" with packaging imagery, **certificate of authenticity** for limited editions ("No. 07 of 50"), reviews with photos, "Complete the room" cross-sells, recently viewed.
- Sticky mobile add-to-cart bar.

---

## 9. Personalised gifts (Cricut) — `/personalised`

Cheerful but still premium; slightly lighter tone than the lamps.
- Products: personalised name decals on tumblers, festive/Christmas juice tumblers, home décor décor pieces made with Cricut Maker 4 (labels, wall decals, personalised trays, coasters, etc. — mock a few).
- **Live personalisation preview:** customer types a name, chooses font (5 curated fonts), colour, and placement; a preview updates in real time on the tumbler image (render text along the curved surface with a slight cylindrical warp). Character limit + profanity filter.
- Selections saved as Shopify **line item attributes** (`Name`, `Font`, `Colour`, `Placement`) so they show on the order in Shopify admin.
- Seasonal mode: a "Christmas" collection with subtle falling snow particles only on that collection page from 1 Nov – 31 Dec.
- **Trademark note:** never use other brands' names (e.g. "Stanley") in product titles, SEO, or ads as if affiliated. Use generic titles like "Personalised 40oz Insulated Tumbler". Only mention a brand in plain descriptive text if the owner confirms that's allowed.

---

## 10. Sustainability chapter — copy rules (important)

Lamps are printed in **PLA**. Copy must be **honest and specific** — luxury buyers and Indian consumer-protection rules both punish vague green claims.
- ✅ Say: "Printed in PLA, a **plant-based bioplastic** made from renewable sources like corn starch or sugarcane, rather than petroleum." "Made to order in small batches — no warehouse of unsold stock." "Designed to last for years, not seasons." "Plastic-free/recyclable packaging" (only if true — placeholder until confirmed).
- ❌ Never say: "not plastic", "100% biodegradable", "eco-friendly" without a reason, or "compostable at home". PLA is a bioplastic and breaks down only in industrial composting conditions.
- Optional section: "Return for renewal" — offer to take back old Zohraé pieces (placeholder, owner to confirm).

Visual: a slowly growing plant-to-filament-to-lamp morph animation on scroll.

---

## 11. Wedding Atelier — `/wedding` (small, exquisite section)

Tone: romantic, celebratory, couture.
- Hero: soft blush-on-ivory with gold foil textures; petals drifting very slowly.
- Products: luxury customised **wedding badges** for Bride, Groom, Bridesmaids, Groomsmen, Cousins, Relatives (role-based templates); **wedding photo fridge magnets**; **return-gift fridge magnets** (bulk).
- **Badge builder:** pick a design → choose roles (multi-select) → enter names/role text per badge → set quantities per role → live preview grid.
- **Photo magnet upload:** drag & drop images → upload to Cloudinary → thumbnails with crop guide → URL saved as line item attribute.
- **Bulk/return gifts:** tiered quantity pricing table, and an "Enquire for weddings over 100 guests" form that opens WhatsApp with a pre-filled message (wedding date, guest count, items).
- Show production lead time clearly and a "Need it by" date picker that warns if too close.

---

## 12. Surprise & delight layer (the joy budget)

Sprinkle these — subtle, never in the way of buying:
1. **The É easter egg:** clicking the accent on the logo 5 times turns every lamp on in a cascade + releases floating golden light particles + a hidden code "SHINEBEYOND" for a small gift.
2. **Light Finder quiz** (`/light-finder`): 4 visual questions (room, mood, style, budget) → animated reveal of 3 matched lamps, shareable result card.
3. **Add-to-cart moment:** the product image shrinks into a glowing orb that arcs into the cart icon; cart icon "lights up".
4. **Free-shipping progress bar** in the cart drawer, styled as a filament that glows brighter as they approach the threshold.
5. **Gift mode:** a toggle in cart that hides prices on the invoice, adds gift wrap, and a card message.
6. **Room mood switcher** on the "Shop the room" section: Morning / Golden hour / Midnight — the same photo graded and lamps lit accordingly.
7. **Wishlist "Dream Room"** — saved items shown as a mini mood board the visitor can share.
8. **Custom cursor:** small gold dot with a lagging ring; grows on interactive elements; becomes the light orb in night mode.
9. **Page transitions:** a quick "lights dim → next page lights up" transition between routes.
10. **404 page:** a dark room with one swinging pull-chain; pulling it lights the room and reveals "This page has gone dark — let us light your way" + links.
11. **Footer wordmark fills with light** as you reach the end.
12. **Exit-intent (desktop) / scroll-up (mobile)** — one gentle, beautiful offer modal per session max. Never more.
13. **Concierge:** WhatsApp floating chat (bottom-left), styled to match, opens with "Hello Zohraé, I'd love help choosing a lamp."

---

## 13. Copywriting voice

Seductive, sensory, confident — sell the *feeling*, then the object. Short lines. Present tense. Second person. No exclamation-mark spam (the tagline already has its one).
- Product line example: "*Sora* — a ribbon of light, twisted by hand. By day, a sculpture. By night, the warmest room in your home."
- Microcopy: cart = "Your Collection"; empty cart = "Your collection awaits its first light."; add-to-cart toast = "Beautiful choice."; out-of-stock = "Being crafted — join the waitlist".
- Every section ends with a clear, elegant CTA. Create a `copy/` file with all strings so the owner can edit them easily.
- Write all placeholder product copy in this voice for 8 lamps, 4 vases, 2 planters, 4 personalised gifts, 4 wedding items.

---

## 14. Non-negotiables: performance, accessibility, SEO, trust

- **Performance:** Lighthouse ≥ 90 on mobile for Performance, Accessibility, SEO. LCP < 2.5s. Lazy-load 3D (render a still poster image first, hydrate the canvas after idle). Use `next/image`, AVIF/WebP, Draco-compressed GLBs, KTX2 textures. Pause animations/canvases off-screen. Cap device pixel ratio at 1.5 for WebGL on mobile. Detect low-power devices and gracefully disable heavy effects.
- **Accessibility:** full keyboard navigation, visible focus states (gold ring), the light switch is a real `role="switch"` with `aria-checked`, colour contrast AA in both day and night modes, alt text everywhere, `prefers-reduced-motion` honoured site-wide, smooth scroll disable-able.
- **Mobile-first:** most Indian shoppers are on phones. Every effect must have a designed mobile version, not a squeezed desktop one. 16px side gutters, no horizontal overflow, thumb-reachable CTAs.
- **SEO:** server-rendered product/collection pages, structured data (Product, Offer, Review, BreadcrumbList, Organization), OG images auto-generated per product with the logo, sitemap.xml, robots.txt, clean URLs, `/journal` for content like "How to light a living room like a luxury hotel".
- **Trust (India):** prices in ₹ inclusive of GST, UPI/GPay and card logos, COD badge if enabled, delivery timelines, return/replacement policy, secure checkout badge, real contact details, GSTIN in footer when available.
- **Analytics:** Shopify analytics events for headless (page view, product view, add to cart), plus GA4 and Meta Pixel via a consent banner.

---

## 15. Deployment & domain

1. Create the **Headless** sales channel in Shopify admin → get Storefront API public token + store domain → put in `.env.local` (never commit; provide `.env.example`).
2. Deploy on **Vercel** from a GitHub repo.
3. Domain from **GoDaddy**: add the domain in Vercel, then in GoDaddy DNS set the records Vercel shows (apex A record + `www` CNAME). Write a step-by-step `DEPLOY.md` for the owner with screenshots-level clarity.
4. In Shopify, connect a checkout subdomain (e.g. `shop.yourdomain`) so checkout stays on-brand, and brand the checkout (logo, ochre, fonts) in Shopify's checkout editor.
5. Set up redirects so the old Shopify online-store URLs point to the new site.

---

## 16. Asset guide to write for the owner (`PHOTO-GUIDE.md`)

The light toggle only looks *truly* real with real photos. Write a simple guide:
- Tripod, same position, same zoom — **two shots per lamp**: lamp off (normal light), lamp on (room lights low, 2700K warm bulb, slightly lower exposure so the glow isn't blown out).
- One lifestyle shot per product in a styled room (bedroom/living/studio); ideally the same shot lamp-on too.
- Square 2000×2000 product shots on a consistent backdrop; 3:4 lifestyle shots.
- File naming convention: `handle_off.jpg`, `handle_on.jpg`, `handle_life.jpg`, `handle_life_on.jpg`.
- Optional: phone photogrammetry/LiDAR scan → GLB for AR on hero pieces.

---

## 17. Build phases (stop and show me after each)

- **Phase 0 — Plan:** confirm stack, folder structure, design tokens, component list, and any questions. No code until I approve.
- **Phase 1 — Foundation:** Next.js + TS + Tailwind, tokens, fonts, logo component (new subline), layout, header/footer, Lenis + GSAP setup, mock data layer + types, page routes stubbed.
- **Phase 2 — The Light Switch:** global light context, floating switch, day/night theming, photographic + procedural lamp glow, dimmer/warmth, `/dev/lights` tuner. (Build this early — it's the signature.)
- **Phase 3 — Home page story:** preloader, 3D hero, horizontal gallery, "Why light is luxury", Atelier, vases, sustainability, teasers, shop-the-room, newsletter, footer.
- **Phase 4 — Commerce:** collection pages with filters/sort, PDP, hover lifestyle reveal, cart drawer, Shopify Storefront API + Cart API, checkout redirect, wishlist.
- **Phase 5 — Personalised & Wedding:** live tumbler preview, badge builder, photo uploads, line item attributes, bulk pricing, WhatsApp enquiry.
- **Phase 6 — Delight layer:** quiz, easter egg, page transitions, 404, cursor, add-to-cart orb, gift mode.
- **Phase 7 — Polish & launch:** performance pass, accessibility audit, SEO/structured data, analytics + consent, legal pages, `DEPLOY.md`, `PHOTO-GUIDE.md`, Vercel deploy, domain.

**Definition of done for every phase:** runs with `npm run dev` without errors, tested at 390px and 1440px widths, reduced-motion respected, no console errors, short changelog of what was built and what I need to provide next.
