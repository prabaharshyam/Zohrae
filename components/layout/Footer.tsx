import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { WORDMARK_ACCENT, WORDMARK_GLYPHS, WORDMARK_VIEWBOX } from "@/components/brand/wordmark-paths";
import { WhatsAppIcon } from "@/components/ui/icons";
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
    <footer className="relative mt-32 border-t border-line">
      <div className="gutter mx-auto max-w-[1600px] pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo variant="full" title={copy.brand.name} className="w-52" />
            <p className="mt-6 text-sm text-fg-muted">{copy.brand.origin}.</p>
            {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
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
          </div>

          {copy.footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="label mb-5 text-fg-muted">{col.title}</h2>
              <ul className="space-y-3 text-[0.95rem]">
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

      {/* Outline wordmark — fills with light as you arrive (Phase 3). */}
      <div className="gutter mx-auto max-w-[1600px] pb-6 pt-14" aria-hidden>
        <svg
          viewBox={WORDMARK_VIEWBOX}
          className="w-full"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.35}
        >
          {Object.values(WORDMARK_GLYPHS).map((d, i) => (
            <path key={i} d={d} fillRule="evenodd" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={WORDMARK_ACCENT} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="gutter mx-auto flex max-w-[1600px] flex-col gap-2 pb-8 text-xs text-fg-muted md:flex-row md:justify-between">
        <p>{copy.footer.rights(year)}</p>
        {gstin && <p>GSTIN {gstin}</p>}
        <ul className="flex gap-5">
          {copy.footer.social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-text">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
