# Zohraé: working rules for Claude

@AGENTS.md

Read **HANDOVER.md** before any task: it has the full state of the project, every account and setting, and what's next. This file is the short list of rules.

## The project in one paragraph

Zohraé (brand of **ZEREH VENTURES**, GSTIN 33GDZPS4274J1ZK) is an ultra-luxury headless e-commerce site for 3D-printed, hand-finished lamps, vases, planters, art frames, personalised gifts and wedding pieces, made in India. Next.js 16 front end on Vercel (www.zohrae.in), Shopify as the back office and hosted checkout (shop.zohrae.in), Cashfree as the payment provider inside Shopify. The signature feature is the light switch: real off/on photo pairs crossfaded, room-wide and per lamp. The site still runs on the sample catalogue (`USE_MOCK_DATA` not `false`) until the owner's real products are loaded into Shopify.

## Branch and deploy

- Work on and push to **`claude/master-prompt-product-pictures-4hsujs`**. It is the default branch and deploys to **production** on Vercel in about two minutes. Other branches only get preview deployments.
- Push with `git push -u origin claude/master-prompt-product-pictures-4hsujs`, retrying on network errors.
- Never commit secrets. Keys live in Vercel environment variables only (HANDOVER.md §10).

## Before you write code

- **Next.js 16 is not the version you know.** Check `node_modules/next/dist/docs/` for any API you use. Cache Components are on (`"use cache"` + `cacheLife`).
- Copy goes in `copy/en.ts`; long pages in `data/pages.ts`; business facts in `lib/business.ts`; sample products in `data/mock/`.
- Animation goes through `useGsap(scope, (mm, root) => …)` with `MQ.motion` / `MQ.desktop` / `MQ.mobile` (`lib/motion/useGsap.ts`). Nothing may depend on motion to be visible; respect reduced motion.
- Product photography is shown **flat**: no 3D depth-turns or anything that distorts the lamps (the owner rejected it twice). 2D drift, sway, tilt of whole cards and light effects are fine.
- Lamp images come as **off/on pairs with identical framing**. Check them at `/dev/lights`.

## Before you push

1. `npm run check` (typegen + tsc + eslint) is clean, and `npx prettier --write` has run on changed files.
2. `npm run build` passes.
3. Verify in a real browser. Playwright with `executablePath: "/opt/pw-browsers/chromium"` and args `--use-angle=swiftshader --enable-unsafe-swiftshader`. Set `sessionStorage["zohrae:intro"]="1"` via `addInitScript`, or the intro blocks the page.
4. Check 1440×900, 1000×570, 390×844 (and 375×667 for tight phones): no console errors, no horizontal overflow, and the floating light switch doesn't cover buttons.
5. Add a plain-language entry to the top of CHANGELOG.md.

## Traps that have bitten before

- `page.evaluate` must never return a GSAP object (e.g. `tl.seek()`'s return value), or it hangs.
- Don't `pkill -f` a pattern that appears in your own command; it kills your shell. Stop the test server with `fuser -k 3100/tcp`.
- `new Date()` in client components breaks prerender: use `useSyncExternalStore` with a null server snapshot.
- GSAP `quickTo` can't animate `attr:`; tween a proxy object and `setAttribute`.
- `.gutter` is unlayered CSS and beats Tailwind padding utilities.
- ScrollTriggers created before pinned sections need `refreshPriority: -1`.

## Content rules

- Never invent reviews, testimonials, awards or offers. Launch offers stay generic until a real discount exists in Shopify.
- PLA is a plant-based **bioplastic**: no "plastic-free" or "not plastic" claims.
- Use **Zohraé™** (not ®) until the trademark registration certificate exists.
- Don't use "Stanley" in product titles or SEO.
- Prepaid only; never mention cash on delivery.

## Working with the owner

The owner is non-technical. They send screenshots from desktop Chrome (~1000×570) and an iPhone. Give click-by-click guides for anything in Vercel, Shopify, GoDaddy or Cashfree. Explain choices briefly with one recommendation. They value joy, surprise and luxury polish, but smoothness and correctness come first.
