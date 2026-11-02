# Payments with Cashfree

Customers pay on Shopify's secure checkout (`shop.zohrae.in/checkouts/…`). Cashfree is connected **inside Shopify** as the payment provider, so the website itself never handles card or UPI details and needs **no Cashfree keys**. Never paste your Cashfree secret key into Vercel, the code, or a chat.

## Before you start

- **Cashfree:** account approved and **KYC complete** (you have this).
- **Shopify:** a paid plan (Basic is enough). The store's password page can only be removed, and real payments taken, on a paid plan.
- **Checkout domain:** `shop.zohrae.in` is already Shopify's primary domain. Keep it that way: Cashfree whitelists the checkout domain when you connect, and if the domain changes later you must reconnect the Cashfree app.

## 1. Install the Cashfree app in Shopify (about 10 minutes)

1. Shopify admin → **Settings → Payments**.
2. Under the payment providers section, click **Add payment method** (or **Choose a provider**) → search **Cashfree Payments** → **Install** / **Connect**. You can also install it from the Shopify App Store listing "Cashfree Payments".
3. When asked, sign in to Cashfree, or enter the **App ID** from your Cashfree dashboard (Cashfree → **Developers → API Keys**, production). Only the App ID is entered in Shopify's own form; nowhere else.
4. Click **Activate Cashfree Payments**. UPI (GPay, PhonePe, Paytm), cards, netbanking, wallets and pay-later are all included in Cashfree's standard Shopify plugin.

## 2. Settings to check in Shopify

- **Settings → Payments → Payment capture method:** choose **Automatically at checkout**, so orders don't wait for you to capture them by hand.
- **Manual payment methods:** leave **Cash on Delivery off**. The site promises prepaid only, because every piece is made to order.
- **Settings → Checkout:** keep **customer contact by phone or email**, and require a phone number at shipping (couriers need it).

## 3. Test before going live

1. In **Settings → Payments → Cashfree Payments → Manage**, turn on **Test mode**.
2. On zohrae.in (once products are connected), add something to the bag → **Proceed to secure checkout** → pay with Cashfree's test card or test UPI (listed in Cashfree's docs under "Test data").
3. Check that the order appears in Shopify **Orders** as **Paid**, and the payment appears in the Cashfree dashboard (test mode).
4. Turn **Test mode off**. Place one small real UPI order, then refund it from Shopify (**Orders → Refund**). The refund goes back through Cashfree automatically.

## 4. Day to day

- **Orders** live in Shopify; **settlements** (money to your bank) and payment-level details in the Cashfree dashboard. Cashfree settles to the bank account you verified.
- **Refunds:** always start them from the Shopify order. They pass through to Cashfree.
- **Failed or pending payments:** Shopify marks the order "Payment pending". Cashfree's dashboard shows the reason (declined, timeout, UPI not approved).
