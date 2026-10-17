import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { whatsappHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your account",
  description: "Sign in to see your orders, track a delivery and manage your addresses.",
  alternates: { canonical: "/account" },
  robots: { index: false },
};

/**
 * Customer accounts live with Shopify (orders, tracking, addresses, sign-in
 * by a one-time email code). Once NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL is set,
 * this page simply sends the customer there; until then it explains how to
 * reach the atelier about an order.
 */
export default function AccountPage() {
  const accountUrl = process.env.NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL;
  if (accountUrl) redirect(accountUrl);

  const t = copy.accountPage;
  return (
    <section className="gutter mx-auto max-w-[1600px] pb-24 pt-[calc(var(--header-h)+10vh)]">
      <p className="label text-fg-muted">{t.eyebrow}</p>
      <h1 className="font-display mt-5 text-[length:var(--fs-h1)] leading-[1.02]">{t.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-fg-muted">{t.intro}</p>
      <div className="mt-12 flex flex-wrap items-center gap-6">
        <ButtonLink href={whatsappHref(t.whatsappMessage)} arrow>
          {t.cta}
        </ButtonLink>
        <Link href="/shipping" className="label border-b border-line pb-1 hover:text-accent-text">
          {t.shippingLink}
        </Link>
      </div>
    </section>
  );
}
