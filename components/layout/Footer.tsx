import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CookieSettings } from "@/components/consent/Consent";
import { SoundToggle } from "@/components/light/SoundToggle";
import { business } from "@/lib/business";
import { BackToTop } from "./BackToTop";
import { FooterWordmark } from "./FooterWordmark";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { copy } from "@/copy/en";
import { whatsappHref } from "@/lib/format";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();
  const gstin = process.env.NEXT_PUBLIC_GSTIN;

  return (
    <footer className="relative border-t border-line">
      <div className="gutter mx-auto max-w-[1600px] pt-16 md:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.2fr_repeat(3,1fr)] md:gap-12">
          <div className="col-span-2 max-w-xs md:col-span-1">
            <Logo variant="full" title={copy.brand.name} className="w-52" />
            <p className="mt-6 text-sm text-fg-muted">{copy.brand.origin}.</p>
            {(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || copy.contact.whatsapp) && (
              <a
                href={whatsappHref(copy.footer.conciergeMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-6 inline-flex items-center gap-2 border-b border-line pb-1 transition-colors hover:text-accent-text"
              >
                <WhatsAppIcon width={16} height={16} />
                {copy.footer.concierge}
              </a>
            )}
            {business.instagram && (
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title={copy.footer.instagram}
                className="group mt-6 flex w-fit items-center gap-3 text-sm text-fg-muted transition-colors hover:text-accent-text"
              >
                <span className="grid size-11 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:border-accent-text">
                  <InstagramIcon className="transition-transform duration-500 ease-silk group-hover:scale-110" />
                </span>
                <span>
                  <span className="sr-only">Instagram </span>
                  {copy.footer.instagramHandle}
                </span>
              </a>
            )}
          </div>

          {/* On phones the long Shop list takes the left column; the rest stack beside it. */}
          {copy.footer.columns.map((col, i) => (
            <nav key={col.title} aria-label={col.title} className={i === 0 ? "max-md:row-span-2" : undefined}>
              <h2 className="label mb-5 text-fg-muted">{col.title}</h2>
              <ul className="space-y-3 text-[0.95rem] max-md:text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-accent-text">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <ul aria-label="Accepted payments" className="flex flex-wrap gap-2">
            {copy.trust.payments.map((p) => (
              <li key={p} className="label border border-line px-3 py-1.5 text-[10px]">
                {p}
              </li>
            ))}
            <li className="label px-1 py-1.5 text-[10px] text-fg-muted">{copy.trust.prepaidOnly}</li>
          </ul>
          <p className="label text-fg-muted">{copy.trust.shipping}</p>
        </div>
      </div>

      {/* Outline wordmark that fills with gold light as you arrive. */}
      <div className="gutter mx-auto max-w-[1600px] pb-6 pt-14">
        <FooterWordmark />
      </div>

      {/* Right padding keeps the last row clear of the fixed light switch. */}
      <div className="gutter mx-auto grid max-w-[1600px] gap-x-6 gap-y-4 pb-8 text-xs text-fg-muted md:grid-cols-[1fr_auto_1fr] md:items-center md:!pr-[calc(var(--gutter)+7rem)]">
        <div className="space-y-2">
          <p>{copy.footer.rights(year)}</p>
          {gstin && <p>GSTIN {gstin}</p>}
        </div>
        <div className="max-md:order-first">
          <BackToTop />
        </div>
        <ul className="flex gap-5 md:justify-end">
          <li>
            <SoundToggle />
          </li>
          <li>
            <CookieSettings />
          </li>
        </ul>
      </div>
    </footer>
  );
}
