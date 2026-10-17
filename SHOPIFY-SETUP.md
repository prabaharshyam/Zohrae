# Connecting Shopify

The site runs on placeholder data until three environment variables are set in Vercel. After that, products, prices, stock and checkout all come from your Shopify store. Nothing in the site's code changes.

## 1. Get a Storefront access token (about 5 minutes)

1. In Shopify admin, install the **Headless** sales channel. It's free, from the Shopify App Store.
2. Open **Headless → Create storefront**.
3. Under **Storefront API**, copy the **public access token**.
4. Note your store domain, e.g. `zohrae.myshopify.com`.
5. In **Storefront API permissions**, make sure these are on:
   - products and collections (read);
   - metaobjects and metafields (read);
   - cart (read and write).

## 2. Add the variables in Vercel

Go to Vercel → the project → **Settings → Environment Variables** (Production and Preview):

| Name                       | Value                   |
| -------------------------- | ----------------------- |
| `SHOPIFY_STORE_DOMAIN`     | `zohrae.myshopify.com`  |
| `SHOPIFY_STOREFRONT_TOKEN` | the public access token |
| `USE_MOCK_DATA`            | `false`                 |

Redeploy. The site now reads from Shopify, and "Proceed to secure checkout" opens Shopify's hosted checkout. That checkout handles UPI, cards and netbanking through Razorpay, PayU or Shopify Payments, whichever you've enabled.

## 3. Collections

Create these collections with these **handles** (the URL part):

| Handle               | Title              | Notes                      |
| -------------------- | ------------------ | -------------------------- |
| `lumiere`            | Lumière            | all lamps                  |
| `vases-vessels`      | Vases & Vessels    |                            |
| `planters`           | Planters           |                            |
| `art-frames`         | Art Wall Frames    | A3 · A2 · A1               |
| `objets`             | Objets             |                            |
| `personalised-gifts` | Personalised Gifts |                            |
| `wedding-atelier`    | Wedding Atelier    |                            |
| `limited-editions`   | Limited Editions   |                            |
| `gifts-under-2000`   | Gifts under ₹2,000 | set `zohrae.hidden` = true |

Collection metafields (namespace `zohrae`):

| Key       | Type             | Use                                              |
| --------- | ---------------- | ------------------------------------------------ |
| `eyebrow` | single-line text | the small line above the title, e.g. "I · Lamps" |
| `hidden`  | true/false       | keep it out of the menu                          |

## 4. Products

**Product type** must be one of these: `Lamp`, `Vase`, `Planter`, `Art Frame`, `Decor`, `Custom Gift`, `Wedding`.

**Tags** drive the home page:

| Tag         | What it does                                           |
| ----------- | ------------------------------------------------------ |
| `signature` | the hero lamp (one lamp)                               |
| `featured`  | gets a spotlight chapter on the home page (up to five) |
| `new`       | sorted first under "New"                               |
| `custom`    | the "Frame your own art" link points to this frame     |

**Options:**

- **Lamps, vases and planters:** one option, `Finish`. Give each value a swatch colour in Shopify's option settings, and the site shows the swatches.
- **Art frames:** two options:
  - `Size` with values `A3`, `A2`, `A1`, each variant priced separately;
  - `Frame` with values such as `Natural oak`, `Matte black` and `Antique gold`, with swatches.

**Product metafields** (namespace `zohrae`):

| Key                                          | Type             | Use                                                                         |
| -------------------------------------------- | ---------------- | --------------------------------------------------------------------------- |
| `tagline`                                    | single-line text | the line under the name                                                     |
| `story`                                      | multi-line text  | "The story of this piece"                                                   |
| `image_off`                                  | file (image)     | lamp switched off, transparent cut-out, 3:4                                 |
| `image_on`                                   | file (image)     | the same shot, lamp on: identical framing                                   |
| `stage_off`                                  | file (image)     | showroom scene, lamp off (landscape)                                        |
| `stage_on`                                   | file (image)     | the same scene, lamp on                                                     |
| `switch_at`                                  | JSON             | the lamp's switch on `image_off`, as `[x, y]` fractions, e.g. `[0.5, 0.83]` |
| `stage_switch_at`                            | JSON             | the same for `stage_off`, e.g. `[0.29, 0.8]`                                |
| `handcraft_hours`                            | integer          | hours of making                                                             |
| `edition_size`                               | integer          | limited editions                                                            |
| `dimensions`, `weight`, `material`, `finish` | single-line text | specifications                                                              |
| `bulb_type`, `cable_length`                  | single-line text | lamp specifications                                                         |

To place a switch, open the photo and divide the switch's pixel position by the image width and height. For example, x = 384 and y = 850 on a 768 × 1024 photo gives `[0.5, 0.83]`.

Any other photos go in the product's normal **Media**; they appear in the product gallery.

## 5. Check it

- Open `/collections/lumiere`: your lamps, with prices from Shopify.
- Open a product, pick options, then **Add to Collection** and **Proceed to secure checkout**. Shopify's checkout should open with the right items.
- If a page errors, check the variables in Vercel and that the Headless channel has the permissions above.
