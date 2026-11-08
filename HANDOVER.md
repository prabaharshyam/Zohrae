# Zohraé — Project Handover

- **Prepared:** 8 November 2026
- **Repository:** https://github.com/prabaharshyam/Zohrae
- **Working branch (default, deploys to production):** `claude/master-prompt-product-pictures-4hsujs`
- **Live site:** https://www.zohrae.in (zohrae.in redirects there) · preview: https://zohrae-five.vercel.app
- **Downloadable copies:** `docs/handover/Zohrae-Handover.pdf` and `.docx` (generated from this file; see §18)

This document lets anyone (you, a developer, or a new Claude account) pick the project up exactly where it was left. It covers the business, every account and setting, the architecture, every feature, the decisions behind them, what is finished, what is half-done and what is still to do.

> **If you are a new Claude session:** read this file end to end, then `CLAUDE.md` (working rules), then the guide for whatever you're asked to do (listed in §18). Don't start building until you've read §5.4, §11 and §12.

---

## Contents

1. [Snapshot: where things stand](#1-snapshot-where-things-stand)
2. [The business and the brand](#2-the-business-and-the-brand)
3. [Accounts and services](#3-accounts-and-services)
4. [Domains and DNS](#4-domains-and-dns)
5. [Moving to a new Claude account](#5-moving-to-a-new-claude-account)
6. [Architecture](#6-architecture)
7. [Repository map](#7-repository-map)
8. [Features, page by page](#8-features-page-by-page)
9. [Catalogue, merchandising and the Shopify data model](#9-catalogue-merchandising-and-the-shopify-data-model)
10. [Environment variables](#10-environment-variables)
11. [Development workflow](#11-development-workflow)
12. [Technical gotchas and lessons learned](#12-technical-gotchas-and-lessons-learned)
13. [Owner preferences and feedback history](#13-owner-preferences-and-feedback-history)
14. [Content, legal and compliance rules](#14-content-legal-and-compliance-rules)
15. [Marketing assets](#15-marketing-assets)
16. [Status and what's next](#16-status-and-whats-next)
17. [Known issues and technical debt](#17-known-issues-and-technical-debt)
18. [Document index](#18-document-index)
19. [Glossary](#19-glossary)

---

## 1. Snapshot: where things stand

| Area                             | State on 8 Nov 2026                                                                                                                                                                                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Website (front end)**          | Built through Phase 7 plus several review rounds. Live on www.zohrae.in.                                                                                                                                                                                   |
| **Product data**                 | Still the **sample catalogue** in the code (`USE_MOCK_DATA` is not `false`). 26 sample products with AI-generated placeholder photos and sample prices.                                                                                                    |
| **Shopify**                      | Store `zohrae-studio` exists (`zohrae-studio-fq4ee-bxukykzf.myshopify.com`). Headless channel installed; Storefront token is in Vercel. **No products loaded yet.** Store is still password-protected ("Private"). `shop.zohrae.in` is its primary domain. |
| **Payments**                     | **Cashfree** installed inside Shopify, **test mode on**. Shopify says "set up to take payments". Not yet tested end to end.                                                                                                                                |
| **Checkout from the website**    | Shows the honest preview message ("checkout opens once the shop is connected") until products are in Shopify and `USE_MOCK_DATA=false`.                                                                                                                    |
| **Domain**                       | zohrae.in on GoDaddy, pointed at Vercel (verified). www is the primary address. `shop.` → Shopify. `account.` not set up yet.                                                                                                                              |
| **Business details on the site** | ZEREH VENTURES (legal name), GSTIN 33GDZPS4274J1ZK, Zohraé™ trademark: all live. **Registered address and business email still missing.**                                                                                                                  |
| **Payment-gateway verification** | Cashfree asked for the parent company on the contact page: done. Address still to add.                                                                                                                                                                     |
| **Launch video**                 | Done (portrait + landscape, 30 s, with original music). Offer line is generic until the real offer is decided.                                                                                                                                             |
| **Product spreadsheet**          | Template sent to the owner (`catalogue/Zohrae-Product-Sheet.xlsx`). Owner is filling it in (40–50 real products).                                                                                                                                          |

**The one thing blocking a real launch:** the real products need to go into Shopify (with photos), then the site is switched off sample data and Cashfree is tested end to end. See §16.

---

## 2. The business and the brand

### 2.1 Identity

|                               |                                                                                                                                                                                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Brand**                     | **Zohraé** (always with the accent on the É). Written "Zohraé™" where the trademark is claimed.                                                                                                                                                                 |
| **Registered business**       | **ZEREH VENTURES** (appears to be a proprietorship: the PAN inside the GSTIN is an individual's; confirm with the owner)                                                                                                                                        |
| **GSTIN**                     | **33GDZPS4274J1ZK** (Tamil Nadu, state code 33; check digit verified)                                                                                                                                                                                           |
| **Trademark**                 | Owner says Zohraé is registered/filed. The site uses **™**, not ®: ® is legal in India only once the certificate is issued (Trade Marks Act s.107). If registration is granted, get the registration number and class, then switch to ® (§14).                  |
| **Tagline**                   | Shine Beyond!                                                                                                                                                                                                                                                   |
| **Descriptor / logo subline** | ATELIER · INDIA (owner chose this after a researched recommendation; PLAN.md §11)                                                                                                                                                                               |
| **Origin line**               | Designed and hand-finished in India                                                                                                                                                                                                                             |
| **What they sell**            | 3D-printed (PLA), hand-finished **lamps** (core), **vases**, **planters**, **art wall frames** (A3 / A2 / A1), **personalised gifts** (Cricut: tumblers, glasses, coasters, trays), **wedding pieces** (role badges, photo fridge magnets, return-gift magnets) |
| **Orders**                    | **Prepaid only** (no cash on delivery: every piece is made to order). Ships across India.                                                                                                                                                                       |
| **WhatsApp concierge**        | +91 96062 21205 (`919606221205`, in `copy/en.ts`, overridable with `NEXT_PUBLIC_WHATSAPP_NUMBER`)                                                                                                                                                               |
| **Instagram**                 | https://www.instagram.com/zohrae.in/ (@zohrae.in)                                                                                                                                                                                                               |
| **Owner's GitHub**            | `prabaharshyam`                                                                                                                                                                                                                                                 |

### 2.2 Voice

Sensual, warm, confident, quietly playful. European atelier sensibility with Indian warmth. Short sentences. One French/Italian flourish per section at most (Lumière, L'Atelier, Galleria, Fatto per te, Matrimonio). Every section ends with a reason to act. Never invent facts, reviews or awards. All copy lives in **`copy/en.ts`** (policies and long pages in `data/pages.ts`, journal in `data/journal.ts`).

### 2.3 Visual system

- **Palette** (tokens in `app/globals.css`): ivory `#F6EFE4` (day ground), espresso `#2A1D15` (text), ochre/gold `#C0823A` (brand accent), **ochre-deep `#8F5C22` for gold text** (ochre on ivory is only 2.9:1 contrast), night `#120C09`, glow `#FFB869`, plus chapter colours per lamp (forest, terracotta, petrol, sand, plum, blush, saffron, midnight).
- **Fonts** (`app/fonts.ts`, via `next/font`): **Bodoni Moda** (display, variable with optical-size axis, italic), **Jost** (text/labels), **Pinyon Script** and **Parisienne** (personalisation only; not preloaded).
- **Logo:** original at `public/brand/zohrae-logo-original.png`, traced to vector paths in `components/brand/wordmark-paths.ts` (`scripts/trace-logo.mjs`). `<Logo />` has variants `full`, `mark`, `monogram`.
- **Day/night:** the whole site has a night theme driven by the light switch (`[data-lights="on"]`).

---

## 3. Accounts and services

Nothing secret is stored in the repository. Secrets live only in Vercel's environment variables (or in each service).

| Service                                     | Account / identifier                                                  | What it does                                                                                         | State                                                                                                                                                                                                                |
| ------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub**                                  | `prabaharshyam/Zohrae` (private repo)                                 | Source code. Vercel deploys from it.                                                                 | Single branch `claude/master-prompt-product-pictures-4hsujs`, which is also the **default branch**.                                                                                                                  |
| **Vercel**                                  | Team **Zaiphr** (Hobby plan), project **zohrae**                      | Hosting, builds on every push, environment variables, domains                                        | Domains: `zohrae.in` (308 → www), `www.zohrae.in` (Production), `zohrae-five.vercel.app`. Hobby is for non-commercial use: **upgrade to Pro before taking real orders** (Vercel's terms).                            |
| **GoDaddy**                                 | Owner's account                                                       | Registrar and DNS for zohrae.in (nameservers `ns77/ns78.domaincontrol.com`)                          | Records in §4. Also hosts **email MX** (secureserver.net): never delete MX or TXT records.                                                                                                                           |
| **Shopify**                                 | Store **zohrae-studio**, `zohrae-studio-fq4ee-bxukykzf.myshopify.com` | Back office: products, stock, orders, checkout, payments, shipping, taxes, customer accounts, emails | Headless channel installed (Storefront token → Vercel). Online Store theme = the **old Lovable-era design**, still password-protected. Primary domain `shop.zohrae.in`. **Plan:** confirm a paid plan before launch. |
| **Cashfree**                                | Owner's merchant account (approved)                                   | Payment provider inside Shopify checkout: UPI, cards, netbanking, wallets, pay-later                 | Account approved; installed in Shopify, **test mode**. See PAYMENTS.md.                                                                                                                                              |
| **Canva**                                   | Owner's account (connected to Claude earlier)                         | AI image generation for placeholders                                                                 | Working design "Zohraé — website image exports" holds exports.                                                                                                                                                       |
| **Instagram**                               | @zohrae.in                                                            | Social                                                                                               | Linked in footer and phone menu.                                                                                                                                                                                     |
| **WhatsApp**                                | +91 96062 21205                                                       | Concierge, order help, bulk enquiries, photo hand-off                                                | Live links across the site.                                                                                                                                                                                          |
| **Cloudinary**                              | Not created yet                                                       | Customer photo uploads (photo magnets, Your Art Framed)                                              | Without it the site falls back to collecting photos on WhatsApp.                                                                                                                                                     |
| **Google Analytics 4 / Meta Pixel**         | Not created yet                                                       | Analytics, behind the cookie consent banner                                                          | No banner shows until one ID is set.                                                                                                                                                                                 |
| **Mailing list** (Klaviyo or Shopify Email) | Not chosen                                                            | "The Zohraé Circle" newsletter                                                                       | `/api/newsletter` answers "opens at launch" honestly until connected.                                                                                                                                                |
| **Lovable**                                 | Owner's earlier project                                               | The old Shopify theme came from there                                                                | Not used by this site. Shopify's Home page "Lovable" card is a generic Shopify tip.                                                                                                                                  |

---

## 4. Domains and DNS

Verified from public DNS on 8 Nov 2026.

| Host                | Record | Points to                                              | Served by                                     |
| ------------------- | ------ | ------------------------------------------------------ | --------------------------------------------- |
| `zohrae.in`         | A      | `216.198.79.1`                                         | Vercel → **308 redirect** to www              |
| `www.zohrae.in`     | CNAME  | `74d9ff2c5e240d2b.vercel-dns-017.com`                  | Vercel (Production, primary address)          |
| `shop.zohrae.in`    | CNAME  | `shops.myshopify.com`                                  | Shopify (checkout; old theme behind password) |
| `account.zohrae.in` | —      | not set                                                | Planned: Shopify customer accounts            |
| `zohrae.in`         | MX     | `smtp.secureserver.net`, `mailstore1.secureserver.net` | GoDaddy email: **don't touch**                |

**History:** until 17 Oct 2026, zohrae.in and www pointed at Shopify (the Lovable-era store). The owner confirmed it was only a development store, and the domain was moved to Vercel.

**Site address setting:** `NEXT_PUBLIC_SITE_URL` should be `https://www.zohrae.in` (sitemap and robots already show www, so it's set or inferred).

**Cashfree note:** Cashfree whitelists the checkout domain (`shop.zohrae.in`). If the checkout domain ever changes, disconnect and reconnect the Cashfree app in Shopify.

---

## 5. Moving to a new Claude account

### 5.1 What carries over and what doesn't

- **Carries over:** everything in the GitHub repo (code, these documents, the changelog, the plan, the brief, the product sheet, the launch video). Vercel, Shopify, GoDaddy and Cashfree are untouched by a Claude account change.
- **Doesn't carry over:** the old conversation itself, connectors (Canva, Gmail, Drive) and the cloud environment settings. Reconnect what you need in the new account. This document and `CLAUDE.md` replace the conversation history.

### 5.2 Steps (about 15 minutes)

1. **Sign in** to the new Claude account and open **Claude Code on the web** (claude.ai/code), or the desktop app.
2. **Connect GitHub:** sign in with the GitHub account **`prabaharshyam`** when asked, and install the **Claude GitHub App** on the repository **`prabaharshyam/Zohrae`** (choose "Only select repositories" → Zohrae). If prompted, use https://github.com/apps/claude/installations/select_target.
3. **Create a cloud environment** for the project (Claude Code → environment settings):
   - Name: `zohrae`.
   - Network: the default ("trusted"/package registries) is enough to install and build. Allow `www.zohrae.in`, `zohrae-five.vercel.app`, `zohrae-studio-fq4ee-bxukykzf.myshopify.com` and `dns.google` if you want Claude to check the live site, the Shopify Storefront API and DNS.
   - Setup script (optional, speeds up every session): `cd Zohrae && npm ci`.
   - **No secrets** in environment variables. Shopify and other keys stay in Vercel.
4. **Start a session** on `prabaharshyam/Zohrae`, branch **`claude/master-prompt-product-pictures-4hsujs`**.
5. **Paste the first prompt** from §5.3.
6. **Reconnect connectors** you used before, if needed: **Canva** (image generation), **Google Drive** (to read the owner's product sheet and photos), **Gmail** (optional).
7. **Old account:** nothing to delete. You can archive the old sessions. Keep the GitHub App installed only where it's used.

### 5.3 First prompt for the new account

> Read HANDOVER.md fully, then CLAUDE.md and AGENTS.md. This is the Zohraé luxury headless e-commerce site (Next.js 16 + Shopify + Vercel). Work on the branch `claude/master-prompt-product-pictures-4hsujs` and push to it (it is the default branch and deploys to production on www.zohrae.in). Summarise back to me in a few lines: what's live, what's blocking launch, and the next three things you recommend, then wait for my go-ahead.

### 5.4 Branch and deployment rules (important)

- The **only** branch is `claude/master-prompt-product-pictures-4hsujs`. It is the GitHub **default branch**, so Vercel builds it as **Production** (www.zohrae.in).
- A new Claude session may want to create its own `claude/...` branch. **Anything pushed to another branch becomes a Vercel _Preview_ deployment, not the live site.** Either tell Claude to push to the branch above, or open a pull request into it and merge.
- **Optional tidy-up (recommended once):** rename it to `main`. In GitHub → Settings → Branches, rename the default branch to `main` (GitHub keeps redirects). Then in Vercel → Project → Settings → Git, set **Production Branch** to `main`, and update this document and CLAUDE.md. Do it on a quiet day and check that the next push deploys to production.

---

## 6. Architecture

### 6.1 The shape

```
Visitor ──► www.zohrae.in (Vercel, Next.js 16)
              │  reads products/collections (server, cached)
              ▼
         Shopify Storefront API  ◄── Owner manages everything in Shopify admin
              │
  "Proceed to secure checkout" → cartCreate → checkoutUrl
              ▼
         shop.zohrae.in/checkouts/…  (Shopify hosted checkout)
              │  payment
              ▼
         Cashfree (UPI · cards · netbanking · wallets)  → order "Paid" in Shopify
```

- **Headless Shopify:** Shopify is the brain (products, prices, stock, orders, payments, shipping, taxes, customer accounts, discounts, emails). The custom front end is the experience no Shopify theme can give.
- **The site never touches payment data.** Payments happen only on Shopify's hosted checkout, through Cashfree. No payment keys in the site or Vercel.
- **Two data sources, one shape:** `lib/commerce/types.ts` defines the domain types. `lib/commerce/mock` (sample catalogue in `data/mock/`) and `lib/commerce/shopify` (Storefront GraphQL) both return exactly these shapes. `lib/commerce/index.ts` picks one:
  - **mock** unless `USE_MOCK_DATA=false` **and** `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` are set.
  - Calls are cached with `"use cache"` + `cacheLife("hours")` (Next 16 Cache Components).
- **Shopify API version:** `2025-07` (`lib/commerce/shopify/client.ts`). Shopify supports each version for about 12 months, so 2025-07 is now past its window (requests fall forward to the oldest supported version). **Bump it to a current version and re-test once real products are in Shopify** (P1 in §16.3).
- **The bag:** device-local (`lib/cart/store.ts`, localStorage). It becomes a Shopify cart only at checkout (`app/cart/actions.ts` → `createCheckout`). Line-item properties carry personalisation; gift mode sends a cart note plus a "hide prices" attribute. Quantities are capped at 999 and attributes are sanitised server-side.
- **Wishlist ("Dream Room"):** device-local (`lib/wishlist/store.ts`).
- **Customer accounts:** Shopify's (passwordless) customer accounts. `/account` redirects to `NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL` when set, otherwise offers WhatsApp help.
- **Customer photo uploads:** `/api/upload` → Cloudinary (signed). Without keys it returns `{error:"not-configured"}` and the order notes a WhatsApp photo hand-off.
- **Newsletter:** `/api/newsletter`: honest "soon" until `CIRCLE_LIST_ENDPOINT` and `CIRCLE_WELCOME_CODE` are set.

### 6.2 Stack

| Layer     | Choice                                                                                                                                                                                                                                                          |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | **Next.js 16.4.2** (App Router, **Cache Components**, Turbopack, `partialPrefetching`). **Not the Next.js in your training data:** read `node_modules/next/dist/docs/` (see AGENTS.md).                                                                         |
| UI        | React 19.3, TypeScript (strict), **Tailwind CSS v4** (via `@tailwindcss/turbopack`)                                                                                                                                                                             |
| Motion    | **GSAP 3.15** (ScrollTrigger, SplitText, CustomEase) through one `gsap.matchMedia` helper (`lib/motion/useGsap.ts`: `MQ.motion`, `MQ.desktop`, `MQ.mobile`); **Lenis** smooth scroll on GSAP's ticker (`lib/motion/SmoothScroll.tsx`), off under reduced motion |
| Sound     | Web Audio, synthesised (no files): `lib/sound/ui.ts`, `lib/light/sound.ts`                                                                                                                                                                                      |
| Images    | `next/image`, AVIF/WebP; remote patterns: cdn.shopify.com, res.cloudinary.com, images.unsplash.com, images.pexels.com                                                                                                                                           |
| OG images | `next/og` + sharp (`lib/og/card.tsx`, `app/opengraph-image.tsx`, `app/products/[handle]/opengraph-image.tsx`)                                                                                                                                                   |
| Hosting   | Vercel                                                                                                                                                                                                                                                          |
| Node      | 22.x (tested on 22.22.0), npm 10                                                                                                                                                                                                                                |
| Removed   | three.js / `@react-three/fiber` (the 3D "DepthTurn" lamps distorted the photos and were removed on 17 Oct; the unused packages were removed on 8 Nov), `motion` (never used)                                                                                    |

### 6.3 Security and privacy

- Security headers in `next.config.ts`: HSTS (preload), nosniff, `X-Frame-Options: SAMEORIGIN`, strict referrer, permissions policy.
- Analytics (GA4, Meta Pixel) load **only after "Accept"** in the consent banner (`components/consent/Consent.tsx`). With no IDs set, there's no banner at all.
- Privacy policy written with India's DPDP Act in mind; names Shopify, Cashfree, Vercel, Cloudinary, GA/Meta and couriers as processors.
- `.env*` files are git-ignored (except `.env.example`).

---

## 7. Repository map

```
app/                         Routes (App Router)
  page.tsx                   Home: the scroll story (see §8.1)
  layout.tsx                 Fonts, header/footer, light switch, consent, JSON-LD (Organization + WebSite), boot scripts
  globals.css                Design tokens, day/night theme, component CSS (light switch, chapters…)
  fonts.ts                   Bodoni Moda, Jost, Pinyon Script, Parisienne
  template.tsx               Page-transition entrance (gold filament sweep)
  products/[handle]/         Product page (+ opengraph-image)
  collections/[handle]/      Collection page with filters
  personalised/, wedding/    Landing pages for gifts and weddings
  light-finder/              4-question lamp quiz
  dream-room/                Wishlist
  cart/                      /cart page + actions.ts (server action → Shopify checkout)
  account/                   Redirects to Shopify customer accounts (or WhatsApp help)
  atelier/, about/, contact/, care/, shipping/, returns/, privacy/, terms/   Content pages
  journal/ (+[slug])         Three articles
  api/upload                 Cloudinary signed upload
  api/newsletter             Circle sign-up (honest "soon" until connected)
  dev/lights                 Internal pair checker for lamp off/on photos (noindex)
  sitemap.ts, robots.ts, not-found.tsx (the dark-room 404), icon.svg, apple-icon.png, opengraph-image.tsx

components/
  brand/       Logo + traced wordmark paths
  home/        Preloader, Hero, LampChapters, CollectionGrid, WhyLight, Atelier, Vessels, ArtWall,
               Conscious, Teasers, ShopTheRoom, ValuesBand, Circle
  light/       LightSwitch (floating rocker + settings), LitImage (off/on crossfade + TouchSwitch),
               useLampLevel (ignition/flicker/fade), LightsPill, SoundToggle
  shop/        BuyBox, Gallery, CollectionBrowser, DreamRoomGrid, HeartButton
  personalise/ PersonalisedProduct, CylinderPreview (canvas wrap), Badge (SVG badges/magnets), MadeForLanding
  cart/        CartDrawer (bag drawer, gift mode, checkout)
  layout/      Header, Footer, FooterWordmark, BackToTop, ProsePage, ContactCard, ContactForm, ChapterStub
  delight/     MotionDirector (site-wide 3D reveals, tilt, torch), Interactions (cursor, sounds, toasts, "shine" easter egg), DarkRoom404
  finder/      LightFinder
  product/     ProductCard, ProductImage (ProductStage)
  consent/     Consent banner + cookie settings
  seo/         JsonLd
  ui/          Button, Reveal, icons

lib/
  commerce/    types.ts, index.ts (mock vs Shopify), mock/, shopify/ (client + adapter + createCheckout)
  light/       store.ts (room light: on, dim, kelvin, sound), lamps.ts (per-lamp overrides), kelvin.ts, filament.ts, sound.ts
  motion/      gsap.ts, useGsap.ts (MQ), SmoothScroll.tsx (Lenis + useLenis), reduced-motion.ts
  cart/store.ts, wishlist/store.ts, analytics.ts, business.ts (legal name, GSTIN, address…), site.ts (siteUrl),
  format.ts (prices, WhatsApp links), boot-scripts.ts (pre-paint scripts), og/card.tsx, delight/, sound/

copy/en.ts                   ALL interface copy
data/pages.ts                Policies and long pages (UPDATED date at top)
data/journal.ts              Journal articles
data/mock/                   Sample catalogue (products.ts, collections.ts)

public/
  brand/                     Original logo
  products/<handle>/         cutout-off/on.webp, stage-off/on.webp, room.webp, photo.webp…
  products/samples/          The owner's five original studio photos
  personalise/               Blank tumbler (cut-out), coasters, tray, glass
  scenes/                    Living room / corner off-on pairs (Why light)
  atelier/                   Aurelia pencil sketch + older atelier scenes

catalogue/Zohrae-Product-Sheet.xlsx    Product template for the owner (+ scripts/make-product-sheet.py)
marketing/launch-video/                30 s launch film: SCRIPT.md, index.html, scenes.js, music.py, render.mjs, out/*.mp4
scripts/                     trace-logo.mjs, import-legacy-assets.mjs, make-product-sheet.py
docs/ai-image-prompts.md     How to make lamp off/on photo pairs with AI
```

---

## 8. Features, page by page

### 8.1 Home (`app/page.tsx`), top to bottom

| #    | Section            | Component                   | What it does                                                                                                                                                                                                                                                                                                                            |
| ---- | ------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | Intro              | `Preloader`                 | First visit only: a gold filament draws, flickers, becomes the monogram, then **Enter with sound / Enter in silence**. Remembered per tab (`sessionStorage` key `zohrae:intro`). Skipped with reduced motion.                                                                                                                           |
| I    | Hero               | `Hero`                      | The lamp tagged **signature** (Aurelia) on its plinth in the dark showroom (stage photo pair). Lights itself ("first light"), iris reveal, camera tilt on scroll. Headline "Light, sculpted."                                                                                                                                           |
| II   | Spotlight chapters | `LampChapters`              | Up to **5 lamps tagged featured** (Nuvola, Ballerina, Rosalie, Colonna): sticky full-screen chapters on each lamp's colour, giant name behind, lamp drifts toward the cursor (2D only: never distorts). Stage-photo lamps get full-bleed scenes. Lamp size is capped by screen height so name, price and Discover fit on short laptops. |
| II   | The collection     | `CollectionGrid`            | Every lamp as a card on the dark ground, with a "Lights on/off" pill (domino wave). Shows up to 8, then "Explore all N lamps".                                                                                                                                                                                                          |
| III  | Why light          | `WhyLight`                  | Pinned: a living room goes from flat daylight to evening lamplight (photo pair) with three copy beats.                                                                                                                                                                                                                                  |
| IV   | L'Atelier          | `Atelier`                   | **"One lamp, five lives"** (rebuilt 17 Oct): pinned 500% scroll; Aurelia sketches itself in pencil, prints layer by layer under a glowing nozzle, is polished, is lit in the dark (section goes dark), then sinks into a keepsake box (lid, ribbon, handwritten card). Big step counter with a filament bar.                            |
| V    | Vases & planters   | `Vessels`                   | Masonry with sticky intro.                                                                                                                                                                                                                                                                                                              |
| VI   | Galleria           | `ArtWall`                   | Frames hang on wires, swing in, lean to the cursor; to-scale A3/A2/A1 size guide.                                                                                                                                                                                                                                                       |
| VII  | Conscious luxury   | `Conscious`                 | Four line drawings (sprout, spool, lamp, keepsake box): honest PLA copy (§14).                                                                                                                                                                                                                                                          |
| VIII | Gifts & Wedding    | `Teasers`                   | Two split panels.                                                                                                                                                                                                                                                                                                                       |
| IX   | Shop the room      | `ShopTheRoom`               | Numbered tab list + 4:5 room photo (fits one screen), hotspot quick card.                                                                                                                                                                                                                                                               |
| —    | Values band        | `ValuesBand`                | Marquee of true facts (placeholder for real reviews later).                                                                                                                                                                                                                                                                             |
| XI   | The Circle         | `Circle`                    | Newsletter with code reveal (honest "soon" until connected).                                                                                                                                                                                                                                                                            |
| —    | Footer             | `Footer` + `FooterWordmark` | Brand block, WhatsApp, Instagram (@zohrae.in), links (2-column on phones), payment badges, "Prepaid orders only", big wordmark that fills with gold at the page end (shine sweep, cursor glow, accent bob), **"© Zohraé™, a brand of ZEREH VENTURES"**, GSTIN, back-to-top button, Sound and Cookie settings.                           |

### 8.2 The light system (the signature feature)

- **Room switch** (`components/light/LightSwitch.tsx`): floating rocker, bottom-right on desktop **and phones** (moved right on 17 Oct). Real `role="switch"`. Press-and-hold or ⋯ opens settings: dimmer 10–100%, warmth 2200–3500 K (Candle / Warm 2700 K / Soft white), Golden hour preset, Reset. Evening nudge after 7 pm (once per session). Choice saved; applied before first paint by `lib/boot-scripts.ts`.
- **Night mode:** `[data-lights="on"]` on `<html>` re-themes the site. `data-tint` is set only when warmth moves off 2700 K (keeps rendering cheap).
- **Photographic lamps** (`LitImage`): every lamp is a **matched pair of photographs**, off and on, crossfaded on a filament curve (catch, blink, hold). Nothing is painted in code. Dimmer blends the two photos.
- **Per-lamp switches:** a gold button on each lamp's base (`ImageAsset.switchAt` = fractions of the photo) lights that lamp alone (`lib/light/lamps.ts`). Flipping the room switch clears per-lamp overrides.
- **First light:** lamps light themselves the first time they're seen. Lamps below the fold wait dark and ignite as they scroll in. Idle "bzz" every 15–25 s on lit lamps.
- **`/dev/lights`:** checks every off/on pair side by side. Anything that shifts when you flip is a bad pair.

### 8.3 Shop

- **Product page** (`app/products/[handle]`): gallery (lamps keep their switch), option pickers (size buttons, finish swatches), live price, quantity, **Add to Collection**, Dream Room heart, made-to-order note, story, specs, related pieces. Product + Breadcrumb JSON-LD. Personalised products render `PersonalisedProduct` instead.
- **Collections** (`app/collections/[handle]`): sticky filter bar (type chips, price bands, sort), Lights pill.
- **Bag** (`CartDrawer`): drawer on every page + `/cart`. Steppers, remove, subtotal, "Every piece arrives in our keepsake box", **gift mode** (message + hide prices), glowing orb flies to the bag icon on add, toast. **Proceed to secure checkout** → Shopify (or the preview message on sample data).
- **Per-piece items** (wedding): "₹149 / piece" with "Based on the quantity, the price may vary. Contact us for more information", minimum quantity, running total.
- **Dream Room** (`/dream-room`): saved pieces.
- **Light Finder** (`/light-finder`): four questions, 3D page turns, fireflies, a recommended lamp plus two more. New lamps join automatically (scored on price until they get a profile).

### 8.4 Personalisation (Phase 5)

Configured per product by the `zohrae.personalise` JSON (SHOPIFY-SETUP.md §5), so new personalised products need no code. Kinds: `tumbler`, `glass`, `coasters`, `tray`, `badge`, `badge-set`, `magnet`, `magnet-set`, `frame`.

- Cylinders (tumbler, glass): canvas wrap with arcsine column re-sampling, live colour tint of a real photo.
- Flat pieces: lettering on blank photography. Badges and magnets: SVG.
- Lettering styles Script / Calligraphy / Classic / Modern; inks; roles; "Need it by" date check (lead days plus delivery); proof promise on WhatsApp; bulk concierge for weddings; photo upload (Cloudinary, or WhatsApp fallback).
- Every choice becomes a **line-item property** on the Shopify order.

### 8.5 Delight layer

Custom cursor and magnetic buttons (mouse/trackpad only); 3D word flips on headings; reveal/tilt/skew/torch attributes (`MotionDirector`: `[data-reveal-media]`, `[data-tilt]`, `[data-skew]`, `[data-torch]`); scroll filament at the top; interface sounds (opt-in); **secret switch**: type "shine" or long-press the logo → every lamp lights in a wave, fireflies, chime; five quick taps on a lamp's button → it winks; **dark-room 404** with a pull-chain bulb; page-transition filament.

### 8.6 Content, SEO, trust

- Pages: Shipping, Returns, Care, Privacy, **Terms** (opens with "Who we are": operated by ZEREH VENTURES; trademark line), About, **Contact** (WhatsApp form + **Business details**: "Zohraé™ is a brand and trademark of ZEREH VENTURES…", legal name, address when set, GSTIN), L'Atelier, Journal (3 articles), `/account`, `/personalised`, `/wedding`.
- Policy defaults: prepaid only; 48-hour damage claims with unboxing video; 7-day change-of-mind returns for non-personalised pieces; personalised pieces non-returnable unless faulty. **Owner must confirm; a lawyer should review Privacy and Terms.** "Last updated" date = `UPDATED` in `data/pages.ts` (currently 4 November 2026).
- SEO: sitemap (with product images), robots (disallows /api, /account, /cart, /dream-room, /dev), canonical URLs, JSON-LD (Organization with `legalName` ZEREH VENTURES and `taxID` GSTIN, WebSite, Product, BreadcrumbList, Article), generated share cards.
- Lighthouse (mobile, measured on a software GPU, so pessimistic): accessibility, best practices and SEO **100** on key pages; performance ~66 home, ~78 other pages.

---

## 9. Catalogue, merchandising and the Shopify data model

### 9.1 Current sample catalogue (in `data/mock/products.ts`)

All prices are **samples** (owner will set final prices). Photos are AI-generated placeholders, except the owner's five original studio shots (`public/products/samples/`), which remain in galleries.

| Handle                                                 | Title                               | Type        | Sample price (₹)                 | Tags / notes                                                         |
| ------------------------------------------------------ | ----------------------------------- | ----------- | -------------------------------- | -------------------------------------------------------------------- |
| aurelia                                                | Aurelia                             | Lamp        | 4,600                            | bestseller, **signature** (hero)                                     |
| sora                                                   | Sora                                | Lamp        | 4,200                            |                                                                      |
| nuvola                                                 | Nuvola                              | Lamp        | 3,800                            | new, **featured**                                                    |
| onda                                                   | Onda                                | Lamp        | 4,900                            | limited                                                              |
| ballerina                                              | Ballerina                           | Lamp        | 4,400                            | **featured**                                                         |
| rosalie                                                | Rosalie                             | Lamp        | 4,800                            | limited, **featured**                                                |
| colonna                                                | Colonna                             | Lamp        | 3,900                            | **featured**                                                         |
| coquille                                               | Coquille                            | Lamp        | 3,600                            | removed from spotlight: its AI lit photo doesn't match the unlit one |
| vela, marea, seta, duna                                | Vases                               | Vase        | 2,200 / 2,600 / 2,400 / 2,800    |                                                                      |
| radice, giardino                                       | Planters                            | Planter     | 1,900 / 2,300                    |                                                                      |
| personalised-insulated-tumbler                         | Personalised 40oz Insulated Tumbler | Custom Gift | 1,499                            | personalised (not called "Stanley": §14)                             |
| festive-juice-tumbler                                  | Festive Juice Tumbler               | Custom Gift | 899                              | personalised                                                         |
| personalised-coaster-set                               | Personalised Coaster Set            | Custom Gift | 1,199                            | personalised                                                         |
| monogram-serving-tray                                  | Monogram Serving Tray               | Custom Gift | 1,999                            | personalised                                                         |
| your-art-framed                                        | Your Art, Framed                    | Art Frame   | 1,999 / 3,299 / 4,999 (A3/A2/A1) | custom, photo upload                                                 |
| arches-art-frame, botanica-art-frame, soleil-art-frame | Arches, Botanica, Soleil            | Art Frame   | A3 1,999 · A2 3,299 · A1 4,999   | frame finish: Natural oak, Matte black, Antique gold                 |
| couture-wedding-badge                                  | Couture Wedding Badge               | Wedding     | 249 / piece                      | personalised                                                         |
| wedding-party-badge-set                                | Wedding Party Badge Set             | Wedding     | 149 / piece, min 6               | personalised                                                         |
| wedding-photo-magnet                                   | Wedding Photo Fridge Magnet         | Wedding     | 349 / piece                      | personalised, photo                                                  |
| return-gift-magnets                                    | Return-Gift Magnets                 | Wedding     | 149 / piece, min 25              | personalised                                                         |

Collections (handles): `lumiere`, `vases-vessels`, `planters`, `art-frames`, `objets`, `personalised-gifts`, `wedding-atelier`, `limited-editions`, `gifts-under-2000` (hidden).

### 9.2 Merchandising rules (same in mock and Shopify)

- Tag **`signature`** → the hero lamp (one).
- Tag **`featured`** → spotlight chapters (up to five; the hero is never repeated).
- Tag **`new`** → sorted first under "New". Tag **`custom`** → target of "Frame your own art".
- Product type must be one of `Lamp`, `Vase`, `Planter`, `Art Frame`, `Decor`, `Custom Gift`, `Wedding`.

### 9.3 Shopify data model (full detail in SHOPIFY-SETUP.md)

- Options: lamps/vases/planters → `Finish` (with swatch colours); frames → `Size` (A3/A2/A1, priced per variant) × `Frame`.
- Product metafields, namespace **`zohrae`**: `tagline`, `story`, `image_off`, `image_on`, `stage_off`, `stage_on` (file refs), `switch_at`, `stage_switch_at` (JSON `[x, y]`), `handcraft_hours`, `edition_size`, `dimensions`, `weight`, `material`, `finish`, `bulb_type`, `cable_length`, `personalise` (JSON), `min_quantity` (integer).
- Collection metafields: `zohrae.eyebrow`, `zohrae.hidden`.
- **Metafield definitions must have Storefront access enabled**, or the Storefront API returns null for them.

### 9.4 Loading the real catalogue (next big job)

1. The owner fills `catalogue/Zohrae-Product-Sheet.xlsx` (instructions inside: one row per product, required columns, `Size = price; …` and `Finish; Finish = +amount` formats, Home page = No / Featured chapter / Hero) and shares it with photos in Google Drive, one folder per product (`1.jpg…`, lamps `off.jpg` + `on.jpg`, optional `showroom-off/on.jpg`, personalised `blank.jpg`).
2. **Recommended route (agreed in principle, not built yet):** the owner creates a private Shopify app (Dev Dashboard) with Admin API scopes `write_products`, `write_files`, `write_publications` (+ read), installs it on the store and shares the credentials through a secure channel (not chat). Claude writes a seed script that creates metafield definitions (with storefront access), collections, products, variants, images, metafields, publishes to the Headless channel, and reads the switch positions from the lamp photos.
3. Alternative: Shopify CSV import for the basics, and lamp extras set by hand (more owner time).
4. Then set `USE_MOCK_DATA=false` in Vercel → redeploy → check every page → test checkout with Cashfree in test mode.

---

## 10. Environment variables

Set in **Vercel → Project zohrae → Settings → Environment Variables** (Production, and Preview where useful), then **Redeploy**. `NEXT_PUBLIC_*` values are baked in at build time.

| Variable                                                               | Purpose                                                                   | Default in code                        | State (8 Nov)                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------- |
| `USE_MOCK_DATA`                                                        | `false` switches to Shopify (needs the two below)                         | mock unless `false`                    | Not `false` (site on samples)      |
| `SHOPIFY_STORE_DOMAIN`                                                 | `zohrae-studio-fq4ee-bxukykzf.myshopify.com`                              | —                                      | Set by owner                       |
| `SHOPIFY_STOREFRONT_TOKEN`                                             | Headless channel public Storefront token                                  | —                                      | Set by owner (secret: Vercel only) |
| `NEXT_PUBLIC_SITE_URL`                                                 | `https://www.zohrae.in`                                                   | Vercel production URL                  | Set/inferred (sitemap shows www)   |
| `NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL`                                      | e.g. `https://account.zohrae.in`                                          | — (WhatsApp help page)                 | Not set                            |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                                          | Concierge number                                                          | `919606221205`                         | Default in use                     |
| `NEXT_PUBLIC_LEGAL_NAME`                                               | Registered business                                                       | `ZEREH VENTURES`                       | Default in use                     |
| `NEXT_PUBLIC_GSTIN`                                                    | GSTIN                                                                     | `33GDZPS4274J1ZK`                      | Default in use                     |
| `NEXT_PUBLIC_BUSINESS_ADDRESS`                                         | Registered address (exactly as on GST certificate)                        | —                                      | **Missing** (needed for Cashfree)  |
| `NEXT_PUBLIC_CONTACT_EMAIL`                                            | Business email                                                            | —                                      | **Missing**                        |
| `NEXT_PUBLIC_INSTAGRAM_URL`                                            | Instagram                                                                 | `https://www.instagram.com/zohrae.in/` | Default in use                     |
| `NEXT_PUBLIC_GA_ID`                                                    | GA4 measurement ID (`G-…`); turns on consent banner                       | —                                      | Not set                            |
| `NEXT_PUBLIC_META_PIXEL_ID`                                            | Meta Pixel; turns on consent banner                                       | —                                      | Not set                            |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Customer photo uploads                                                    | —                                      | Not set (WhatsApp fallback)        |
| `CIRCLE_LIST_ENDPOINT`, `CIRCLE_WELCOME_CODE`                          | Newsletter list webhook + welcome code (must exist as a Shopify discount) | —                                      | Not set                            |

Local development: copy `.env.example` to `.env.local` (git-ignored).

---

## 11. Development workflow

### 11.1 Commands

```bash
npm ci                    # install (Node 22)
npm run dev               # dev server (Turbopack)
npm run check             # next typegen + tsc --noEmit + eslint   ← run before every commit
npx prettier --write <files>   # formatting (Prettier is the house style)
npm run build && npx next start -p 3100   # production build + server for testing
```

### 11.2 How changes were verified (keep doing this)

- **Playwright with the pre-installed Chromium** (cloud sessions): `executablePath: "/opt/pw-browsers/chromium"`, args `--use-angle=swiftshader --enable-unsafe-swiftshader`. Import Playwright from `node_modules/playwright`.
- Before loading the home page in tests, set `sessionStorage["zohrae:intro"] = "1"` (add it with `context.addInitScript`), or the intro waits for a click.
- Test at **1440×900, 1280×680, 1000×570 (short laptop), 390×844 and 375×667**; motion on and reduced; lights off and on; **no console errors, no horizontal overflow**.
- Screenshot scroll positions for pinned/scrubbed sections and compare frames (contact sheets with PIL).
- Kill the test server by port: `fuser -k 3100/tcp`. **Never `pkill -f chromium`** (or any pattern that appears in your own command line): it kills your own shell.
- Lighthouse numbers in the cloud are pessimistic (software GPU).

### 11.3 Conventions

- **Copy in `copy/en.ts`**, long pages in `data/pages.ts`, business facts in `lib/business.ts` (env-overridable defaults).
- **Motion:** every GSAP effect goes through `useGsap(scope, (mm, root) => …)` with `MQ.motion` / `MQ.desktop` / `MQ.mobile`. Nothing animates under reduced motion: content must be fully visible without JS motion.
- **Pinned sections:** triggers created _before_ pins measure wrong; use `refreshPriority: -1` and `end: "max"` for end-of-page effects (see FooterWordmark).
- **Images:** `next/image` with `sizes`. Lamp photos come as off/on pairs with identical framing (see PHOTO-GUIDE.md and docs/ai-image-prompts.md).
- **CHANGELOG.md:** add a plain-language entry for every user-visible change (newest at the top of the "Fixes after review" list).
- **Commits:** clear messages; push to `claude/master-prompt-product-pictures-4hsujs`. Vercel deploys in about two minutes.
- **No secrets in the repo**, ever. The owner pastes keys into Vercel or the service itself.

---

## 12. Technical gotchas and lessons learned

1. **Next 16 is different:** read `node_modules/next/dist/docs/` before using an API. Cache Components are on: server data functions use `"use cache"` + `cacheLife`.
2. **`new Date()` in client components breaks prerendering:** use `useSyncExternalStore` with a server snapshot of `null`. In server code, put it in a `"use cache"` function (see `currentYear()` in Footer).
3. **Scripts that must run before paint** live in `lib/boot-scripts.ts`. A client-only module inlined a broken reference once.
4. **Measuring layout:** a parent's ref isn't attached during a child's layout effect, so give the child its own measuring element. Use `offsetWidth` (not `getBoundingClientRect`) when GSAP is scaling a parent.
5. **Stacking contexts:** a hover `transform` on a card created a new stacking context that let the link swallow the lamp switch's clicks. The photo is `pointer-events-none relative z-[11]` and only the switch catches clicks.
6. **GSAP `quickTo` doesn't support `attr:` values:** animate a proxy object and `setAttribute` in `onUpdate`.
7. **Playwright `page.evaluate` must not return GSAP objects:** returning a timeline (e.g. from `tl.seek()`) makes Playwright try to serialise it and the call hangs forever.
8. **`.gutter` is unlayered CSS** (padding-inline), so it beats Tailwind padding utilities. Use `!` (important) utilities or pad an inner element.
9. **Bodoni Moda at display sizes:** automatic optical sizing makes hairlines vanish in video and at huge sizes. The launch film sets `font-variation-settings: "opsz" 26`.
10. **3D depth-turn of photos distorts asymmetric lamps:** removed for good (owner complained twice). Use 2D drift/sway only on product photography.
11. **`USE_MOCK_DATA`:** the cart's variant IDs are mock IDs until Shopify is live. Never send mock carts to Shopify (the checkout action guards this).
12. **Shopify tokenless Storefront access fails while the Online Store is password-locked** ("Online Store channel is locked"). The Headless token works regardless.
13. **Shopify Online Store theme** is still the old Lovable design. Before removing the password, add the redirect line to `theme.liquid` (GO-LIVE.md step 4) so visitors land on zohrae.in.
14. **Python edit scripts against Prettier-formatted files:** match the formatted text, or edit after `prettier --write`.
15. **Cloud session network:** some hosts (e.g. cashfree.com docs) may be blocked; ask the owner to allow a host rather than guessing.

---

## 13. Owner preferences and feedback history

What the owner wants:

- An **ultra-luxury, smooth, futuristic, 3D, engaging** site with **joy and surprise**. The bar: lummar.studio and eldendesigns.com (per-lamp light switches).
- **The lighting is the signature.** Owner: "you have almost nailed it."
- **Pinterest-level imagery.** Pinterest images can't be reused (copyright), so placeholders are AI-generated with high-end art direction until real photos arrive.
- **Sample prices for now**; final prices at the end. Wedding items: "₹149 / piece" with "Based on the quantity, the price may vary. Contact us for more information."
- Keeps adding lamps → home page shows the top 3–5 as chapters (by tag), the rest in a grid.

What the owner disliked (don't repeat):

- **Stretched/distorted lamps** when the cursor moves (3D turn) → removed entirely.
- Sections that **don't fit one screen** (Shop the Room; lamp chapters on short laptops) → fixed.
- **Static footer logo** → animated fill + shine.
- **Irrelevant/boring images and effects** (old L'Atelier) → rebuilt as "one lamp, five lives".
- **Glitchy AI images** (Coquille) → dropped from the spotlight.
- **Long footer on phones** → two columns.
- Rated an earlier version **7/10**: wanted more animation, 3D and surprise, done without hurting smoothness.
- Light switch on the left on phones → moved right.

How the owner works: sends screenshots from desktop Chrome (~1000×570 viewport) and an iPhone; is non-technical, so give click-by-click guides; prefers decisions explained briefly with a recommendation.

---

## 14. Content, legal and compliance rules

- **No invented reviews, testimonials, press or awards.** The values band stands in until real reviews exist.
- **PLA is a plastic** (a plant-based bioplastic). Never say "not plastic" or "plastic-free product". India's CCPA greenwashing guidelines (2024) and ASCI apply. Say: made from renewable plants instead of petroleum, made to order, built to last, industrial composting only.
- **Don't use "Stanley"** in titles, SEO or ads (trademark). "Personalised 40oz Insulated Tumbler" is fine; descriptions may say "on a genuine Stanley® tumbler" only if they truly are.
- **Trademark:** use **Zohraé™** until registration is granted; **®** only with a registration certificate (number and class).
- **Legal entity:** ZEREH VENTURES operates the site, takes payment and issues GST invoices. Contact page, footer and Terms say so (for payment-gateway verification). Address must match the GST certificate exactly.
- **Prepaid only:** keep Cash on Delivery off in Shopify.
- **Cookie consent:** analytics only after Accept.
- **Offers:** don't publish a specific discount or code that doesn't exist in Shopify. The launch video says "Special launch prices…" until the real offer is decided.

---

## 15. Marketing assets

- **Launch film** (`marketing/launch-video/`): 30 s, 120 BPM original track (synthesised in `music.py`, no licensing issues). Files: `out/zohrae-launch-portrait.mp4` (1080×1920, Reels/Shorts) and `out/zohrae-launch-landscape.mp4` (1920×1080, YouTube). Scenes, captions and hashtags are in `SCRIPT.md`. To change the offer: edit `OFFER_LINE` in `scenes.js`, then `python3 music.py out/music.wav && node render.mjs` (about 4 minutes). No voiceover (no TTS available); mix one in later if recorded.
- **Product sheet:** `catalogue/Zohrae-Product-Sheet.xlsx` (regenerate with `python3 scripts/make-product-sheet.py`).
- **Image prompts:** `docs/ai-image-prompts.md` (how to make an "on" image from the "off" image).

---

## 16. Status and what's next

### 16.1 Done

Phases 0–7 (foundation, light switch, home story, immersive redesign, per-lamp switches, shop, personalisation, delight, launch pass) plus the review rounds of 17 Oct–4 Nov 2026: L'Atelier rebuild, removal of the 3D distortion, layout fixes, back to top, the domain move, account page, Instagram, Cashfree, ZEREH VENTURES/GSTIN/trademark, launch film, product sheet, and this handover. Full detail in CHANGELOG.md.

### 16.2 Owner to-do (in order)

1. **Business details for verification:** registered address (as on the GST certificate) and business email → Vercel (`NEXT_PUBLIC_BUSINESS_ADDRESS`, `NEXT_PUBLIC_CONTACT_EMAIL`), or send them to Claude.
2. **Fill the product sheet** and upload photos to Drive (can be sent in batches of ~10).
3. **Create the private Shopify app** for loading products (Claude will guide you), or choose the CSV route.
4. **Test Cashfree now** with a ₹1 test product via Orders → Create order → Send invoice (PAYMENTS.md §3 / the invoice method), then archive the test product.
5. **Shopify settings:** a paid plan; shipping zones and rates; Taxes (prices include GST, GSTIN); Payment capture **automatic**; COD off; phone number required at checkout; Notifications sender `hello@zohrae.in` plus the DNS records Shopify gives (SPF/DKIM) in GoDaddy.
6. **Customer accounts:** Shopify → Settings → Customer accounts (new, passwordless) → connect `account.zohrae.in` (+ the DNS record) → set `NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL`.
7. **Vercel plan:** upgrade to **Pro** before taking real orders (Hobby is non-commercial).
8. **Optional services:** Cloudinary (photo uploads), GA4 / Meta Pixel IDs, mailing list (Klaviyo or Shopify Email) + Circle welcome discount code.
9. **Real photos and final prices** (PHOTO-GUIDE.md); confirm policies; lawyer review of Privacy and Terms; decide the launch offer (then re-render the film).
10. **Trademark:** if registered, send the registration number and class (to switch to ®).

### 16.3 Developer to-do (for the next Claude session)

| Priority | Task                                                                                                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | **Shopify seed script** (Admin API): metafield definitions with storefront access, collections, products/variants/images/metafields, publish to Headless; read the owner's sheet + Drive photos; derive `switch_at` from lamp photos.                    |
| P0       | Switch to live data (`USE_MOCK_DATA=false`), then QA every page against real data: missing images, long names, products without metafields, empty collections, per-piece items, personalisation JSON.                                                    |
| P0       | End-to-end checkout test on zohrae.in (bag → Shopify checkout → Cashfree test → order "Paid" with line-item properties and gift note).                                                                                                                   |
| P1       | Launch day: theme redirect snippet in the Shopify theme → remove the store password → real ₹1 order and refund.                                                                                                                                          |
| P1       | Add the registered address and email once received; refresh the `UPDATED` date if policies change.                                                                                                                                                       |
| P1       | Hide the floating light switch (and its nudge) while the phone menu is open (they overlap the menu). Offered to the owner, not yet answered.                                                                                                             |
| P2       | Performance on real devices (home ~66 on the software GPU): lighter preloader, fewer simultaneous pinned effects, image sizes.                                                                                                                           |
| P1       | Bump the Shopify Storefront API version (currently 2025-07, past its support window) to a current one and re-test against the live store.                                                                                                                |
| P2       | Rename the branch to `main` (§5.4) if the owner agrees.                                                                                                                                                                                                  |
| P3       | Real reviews section (when real reviews exist); lifestyle-image hover on cards; PIN-code delivery estimate (needs a courier API, e.g. Shiprocket); Circle prompt on second visit; wishlist sync to customer accounts; AR/3D models only from real scans. |

### 16.4 Go-live checklist

- [ ] Products in Shopify, published to Headless, with metafields and photos
- [ ] `USE_MOCK_DATA=false` in Vercel; redeployed; every page checked
- [ ] Checkout works from zohrae.in; Cashfree test payment succeeds; order shows Paid
- [ ] Shipping rates, GST taxes, notifications sender + SPF/DKIM set
- [ ] Address + email on the contact page; Cashfree verification complete
- [ ] Theme redirect snippet added; store password removed
- [ ] Cashfree test mode off; one real order placed and refunded
- [ ] Vercel Pro; GA/Pixel (optional) set and consent banner tested
- [ ] Policies confirmed (lawyer review recommended)
- [ ] Launch film offer line updated; posted

---

## 17. Known issues and technical debt

- **Light switch overlaps the open phone menu** (z-index): P1 above.
- **Sample data:** everything product-related is placeholder until Shopify is live (images are AI; prices are samples).
- **Coquille**'s lit photo doesn't match its unlit one (kept only in the grid).
- **Atelier and other sections use Aurelia assets**, including a generated pencil sketch (`public/atelier/aurelia-sketch.webp`). Replace with real atelier photography/video later if wanted.
- **`app/dev/lights`** is an internal tool (noindex, disallowed in robots): keep it, it's how lamp pairs are checked.
- **`scripts/import-legacy-assets.mjs`** imported images from the previous site once; not needed again.
- **No automated test suite**: verification is manual Playwright scripting (§11.2). Adding a small Playwright smoke test (home, product, collection, cart drawer, 404; no console errors) would be valuable.
- **Policies** are defaults pending owner and lawyer review.
- **Lighthouse performance** on home is the weakest score (motion-heavy by design).

---

## 18. Document index

| File                                          | Read it when                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **HANDOVER.md** (this)                        | First, always                                                                                                         |
| **docs/handover/Zohrae-Handover.pdf / .docx** | The same document, to download or share (regenerate with `python3 scripts/build-handover.py` after editing this file) |
| **CLAUDE.md**                                 | Working rules for Claude sessions (auto-loaded by Claude Code)                                                        |
| **AGENTS.md**                                 | Next.js 16 warning (auto-written by `next dev`)                                                                       |
| **BRIEF.md**                                  | The original creative brief: brand, sections, signature feature, non-negotiables                                      |
| **PLAN.md**                                   | Phase 0 plan plus every decision log (§8–§20)                                                                         |
| **CHANGELOG.md**                              | Everything built, phase by phase, in plain language                                                                   |
| **DEPLOY.md**                                 | Vercel setup and every environment variable                                                                           |
| **GO-LIVE.md**                                | Domain, Shopify checkout domain, customer accounts                                                                    |
| **SHOPIFY-SETUP.md**                          | Storefront token, collections, products, metafields, personalisation JSON                                             |
| **PAYMENTS.md**                               | Cashfree inside Shopify: install, test, go live                                                                       |
| **PHOTO-GUIDE.md**                            | How to photograph products (off/on pairs)                                                                             |
| **docs/ai-image-prompts.md**                  | Making lamp off/on pairs with AI                                                                                      |
| **marketing/launch-video/SCRIPT.md**          | Launch film script, captions, re-rendering                                                                            |
| **.env.example**                              | Every variable with comments                                                                                          |

---

## 19. Glossary

| Term                       | Meaning                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| **Headless**               | Shopify runs the shop; our own website (on Vercel) shows it.                                      |
| **Storefront API / token** | Shopify's read API for products and carts; the public token lives in Vercel.                      |
| **Admin API**              | Shopify's write API (create products); needs a private app; not used yet.                         |
| **Mock data**              | The sample catalogue in `data/mock/`, used until `USE_MOCK_DATA=false`.                           |
| **Off/on pair**            | Two photos of the same lamp, same framing, switched off and on; the light switch crossfades them. |
| **Stage**                  | A showroom scene pair (landscape) used for the hero and chapters.                                 |
| **`switch_at`**            | Where the lamp's gold button sits on the photo, as fractions `[x, y]`.                            |
| **Signature / featured**   | Tags that choose the hero lamp and the spotlight chapters.                                        |
| **Dream Room**             | The wishlist.                                                                                     |
| **The Circle**             | The newsletter.                                                                                   |
| **Light Finder**           | The lamp quiz.                                                                                    |
| **Line-item properties**   | Personalisation details attached to each product on the Shopify order.                            |
| **ZEREH VENTURES**         | The registered business behind the Zohraé brand.                                                  |
