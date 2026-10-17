# Putting Zohraé live

The site runs on **Vercel** (free plan is enough to start). Vercel watches the GitHub repo: every time new work is pushed, the live site rebuilds itself in about two minutes. You only set this up once.

---

## Part 1 — Get a live link (10 minutes)

1. Go to **https://vercel.com/signup** and choose **Continue with GitHub**. Sign in with the GitHub account that owns `prabaharshyam/Zohrae`.
   - Plan: choose **Hobby** (free). You can upgrade to Pro later for commercial traffic.
2. On the Vercel dashboard click **Add New… → Project**.
3. Under **Import Git Repository**, find **Zohrae** and click **Import**.
   - If it isn't listed, click **Adjust GitHub App Permissions** and give Vercel access to the `Zohrae` repository, then come back.
4. On the **Configure Project** screen:
   - **Framework Preset:** Next.js (detected automatically)
   - **Root Directory:** leave as `./`
   - **Build and Output Settings:** leave the defaults
   - Open **Environment Variables** and add:

     | Key             | Value  |
     | --------------- | ------ |
     | `USE_MOCK_DATA` | `true` |

5. Click **Deploy**. Wait about two minutes for the confetti.
6. Click **Continue to Dashboard**. Your live address is under **Domains**, something like `zohrae.vercel.app`. Open it on your phone too.

From now on, every phase pushed to GitHub appears on that link automatically.

---

## Part 2 — Your own domain (zohrae.in)

See **GO-LIVE.md**: pointing zohrae.in at Vercel, putting Shopify's checkout on `shop.zohrae.in` and customer accounts on `account.zohrae.in`.

----- | ----- | ---------------------- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Always use the exact values Vercel shows you.

3. In GoDaddy: **My Products → (your domain) → DNS → Manage DNS**.
   - Edit the existing **A** record named `@` and set it to the value from Vercel. Delete any other A records for `@` (for example GoDaddy's "Parked" record).
   - Edit or add the **CNAME** named `www` with the value from Vercel.
   - Save.
4. Back in Vercel, the domain turns green within a few minutes to a few hours. HTTPS is set up automatically.

---

## Part 3 — Connecting Shopify (Phase 4)

You'll add two more environment variables in **Vercel → Settings → Environment Variables**, then set `USE_MOCK_DATA` to `false`:

| Key                        | Where to find it                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `SHOPIFY_STORE_DOMAIN`     | e.g. `your-store.myshopify.com`                                                               |
| `SHOPIFY_STOREFRONT_TOKEN` | Shopify admin → install the **Headless** sales channel → Storefront API → public access token |

Full Shopify setup (metafields, checkout branding, the `shop.` checkout subdomain and redirects) will be in `SHOPIFY-SETUP.md` in Phase 4.

---

## Optional settings

Add these in Vercel whenever you have them. The site hides each feature until its value is set:

| Key                           | Example             | What it does                              |
| ----------------------------- | ------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919876543210`      | WhatsApp concierge (country code, no `+`) |
| `NEXT_PUBLIC_GSTIN`           | `29ABCDE1234F1Z5`   | Shows GSTIN in the footer                 |
| `NEXT_PUBLIC_SITE_URL`        | `https://zohrae.in` | Correct links in social previews          |

After changing a variable, open **Deployments**, click **⋯** on the latest one and choose **Redeploy**.

---

## Part 4 — Every setting in one place (launch checklist)

Vercel → the project → **Settings → Environment Variables**. Each one switches something on; leave a row empty and that part simply stays hidden.

| Variable                                                               | What it does                                                                                  |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                 | Your final address, e.g. `https://zohrae.in` (used for the sitemap, share images and Google). |
| `USE_MOCK_DATA`                                                        | `false` once Shopify is connected.                                                            |
| `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`                     | Live products, prices and checkout (SHOPIFY-SETUP.md).                                        |
| `NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL`                                      | Customer accounts, e.g. `https://account.zohrae.in` (GO-LIVE.md §3).                          |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                                          | WhatsApp concierge, e.g. `919606221205`.                                                      |
| `NEXT_PUBLIC_CONTACT_EMAIL`                                            | Shown on Contact, policies and footer.                                                        |
| `NEXT_PUBLIC_LEGAL_NAME`, `NEXT_PUBLIC_BUSINESS_ADDRESS`               | Your registered business name and address (shown on policy pages).                            |
| `NEXT_PUBLIC_GSTIN`                                                    | Shown in the footer.                                                                          |
| `NEXT_PUBLIC_INSTAGRAM_URL`                                            | Instagram link in the footer and for Google.                                                  |
| `NEXT_PUBLIC_GA_ID`                                                    | Google Analytics 4 measurement ID (`G-…`). Turns on the cookie banner.                        |
| `NEXT_PUBLIC_META_PIXEL_ID`                                            | Meta (Facebook/Instagram) Pixel ID. Turns on the cookie banner.                               |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Customer photo uploads (magnets, framed art).                                                 |

### Before announcing the launch

1. Set the variables above and **Redeploy** (Deployments → ⋯ → Redeploy).
2. Read the policy pages (Shipping, Returns, Privacy, Terms) and adjust anything that differs from how you work. Have a lawyer glance at Privacy and Terms.
3. Place a real test order with a small product and refund it in Shopify.
4. In **Google Search Console**, add your domain and submit `https://yourdomain/sitemap.xml`.
5. Share a product link on WhatsApp to see its preview card.
