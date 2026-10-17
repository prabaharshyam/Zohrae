# Going live on zohrae.in

Three jobs, in this order. Each one is done in your own accounts (domain registrar, Vercel, Shopify); the site's code is already prepared for all of them.

## How it fits together

| Address             | What lives there                                                   | Run by  |
| ------------------- | ------------------------------------------------------------------ | ------- |
| `zohrae.in`         | The website you've been reviewing                                  | Vercel  |
| `www.zohrae.in`     | Redirects to `zohrae.in`                                           | Vercel  |
| `shop.zohrae.in`    | Shopify's secure checkout (customers see your domain, not Shopify) | Shopify |
| `account.zohrae.in` | Customer accounts: orders, tracking, addresses                     | Shopify |

Shopify stays your back office: products, stock, orders, payments, shipping, customer emails. The website only reads from it.

---

## Before you start: zohrae.in currently runs your Shopify store

As of 17 Oct 2026, GoDaddy points `zohrae.in` (A record `23.227.38.32`) and `www` (CNAME `shops.myshopify.com`) at Shopify. Pointing them at Vercel takes the old Shopify storefront off zohrae.in at once. So do it in this order:

1. **Move Shopify to `shop.zohrae.in` first.** GoDaddy → DNS → add **CNAME** `shop` → `shops.myshopify.com`. Shopify → **Settings → Domains → Connect existing domain** → `shop.zohrae.in` → make it **primary**. The old store and checkout keep working there.
2. **Connect Shopify to the new site** (step 2 below) and check products, cart and checkout on `zohrae-five.vercel.app`.
3. **Then switch zohrae.in** (step 1 below): change the `@` A record and the `www` CNAME in GoDaddy to the values Vercel shows. In Shopify → Settings → Domains, remove `zohrae.in` and `www.zohrae.in`.

Vercel has made `www.zohrae.in` the main address (zohrae.in redirects to it). That's fine: set `NEXT_PUBLIC_SITE_URL` to `https://www.zohrae.in`. To have the bare `zohrae.in` as the main address instead, click **Edit** on `zohrae.in` in Vercel and remove the redirect, then set the redirect on `www`.

## 1. Point zohrae.in at the website (about 15 minutes, then up to a few hours for DNS)

1. **Vercel** → the project → **Settings → Domains** → add `zohrae.in`. When it offers to add `www.zohrae.in` as a redirect, accept.
2. Vercel lists the records it needs. Usually:

   | Type  | Name  | Value                  |
   | ----- | ----- | ---------------------- |
   | A     | `@`   | `76.76.21.21`          |
   | CNAME | `www` | `cname.vercel-dns.com` |

   Always copy the exact values Vercel shows.

3. **Where you bought zohrae.in** (GoDaddy, Hostinger, BigRock…) → **DNS / Manage DNS**:
   - set the `@` **A** record to Vercel's value, and delete any other `@` A records (e.g. a "parked" page);
   - set the `www` **CNAME** to Vercel's value;
   - save.
4. **Vercel → Settings → Environment Variables**: set `NEXT_PUBLIC_SITE_URL` to `https://zohrae.in` (Production). This makes the sitemap, Google results and share previews use the real address.
5. **Deployments → ⋯ → Redeploy.** The domain turns green in Vercel within minutes to a few hours, with HTTPS set up automatically. `zohrae-five.vercel.app` keeps working too.

## 2. Connect Shopify

Follow **SHOPIFY-SETUP.md** (token, collections, products, metafields). In short:

1. Shopify admin → install the free **Headless** channel → create a storefront → copy the **public Storefront access token**.
2. Vercel → Environment Variables:

   | Name                       | Value                                                  |
   | -------------------------- | ------------------------------------------------------ |
   | `SHOPIFY_STORE_DOMAIN`     | your `something.myshopify.com` address (not zohrae.in) |
   | `SHOPIFY_STOREFRONT_TOKEN` | the token                                              |
   | `USE_MOCK_DATA`            | `false`                                                |

3. **Checkout on your own domain.** Shopify admin → **Settings → Domains → Connect existing domain** → `shop.zohrae.in`. At your registrar add the record Shopify shows (usually **CNAME** `shop` → `shops.myshopify.com`). Then make `shop.zohrae.in` the **primary domain** in Shopify. Don't connect `zohrae.in` itself to Shopify: that one belongs to Vercel.
4. **Keep visitors on the real site.** Shopify still has its own theme pages at `shop.zohrae.in`. In **Online Store → Themes → ⋯ → Edit code → `theme.liquid`**, paste this as the first line inside `<head>`. Anyone who lands there is sent to the same page on zohrae.in (product and collection addresses match). Checkout and accounts aren't theme pages, so they keep working:

   ```liquid
   <script>location.replace("https://zohrae.in" + location.pathname);</script>
   ```

5. **Payments:** Settings → Payments → enable Razorpay, PayU or another Indian gateway for UPI, cards and netbanking.
6. Redeploy, then place a small real order and refund it.

## 3. Customer accounts

Shopify's **customer accounts** cover sign-in, order history, live tracking, reordering and saved addresses. Customers sign in with a one-time code sent to their email, so there are no passwords to forget.

1. Shopify admin → **Settings → Customer accounts** → choose **Customer accounts** (the new, passwordless version, not "legacy").
2. Same page → **Domain** → connect `account.zohrae.in` and add the record Shopify shows at your registrar.
3. If that page offers sign-in links at checkout, turn them on, so returning customers are recognised and their address fills in.
4. Vercel → Environment Variables: `NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL` = `https://account.zohrae.in`. Redeploy.

The person icon in the site's header (and "Account" in the phone menu) then opens the account. Until it's set, that page offers to help with an order on WhatsApp.

Order confirmation and shipping emails come from Shopify and link to the order status page, where customers follow the delivery. Add the courier's tracking number in Shopify when you fulfil an order (Shiprocket and Delhivery apps can do this for you).
