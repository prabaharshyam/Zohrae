import Image from "next/image";
import { CollectionBrowser } from "@/components/shop/CollectionBrowser";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { whatsappHref } from "@/lib/format";

/**
 * Landing for the personalised worlds (gifts, weddings): a photographic
 * opening, three steps from name to keepsake, the pieces, and (for
 * weddings) the WhatsApp concierge for large or bespoke orders.
 */
export function MadeForLanding({
  eyebrow,
  title,
  intro,
  image,
  products,
  concierge,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image: { url: string; alt: string };
  products: Product[];
  concierge?: boolean;
}) {
  const t = copy.madeFor;
  return (
    <div className="pb-24">
      <section className="gutter mx-auto grid max-w-[1600px] items-center gap-10 pt-[calc(var(--header-h)+6vh)] md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <p className="label text-fg-muted">{eyebrow}</p>
          <h1 className="font-display mt-5 text-[length:var(--fs-h1)] leading-[1.02]">{title}</h1>
          <p className="mt-6 max-w-lg text-fg-muted">{intro}</p>
        </div>
        <div data-reveal-media className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <Reveal className="gutter mx-auto mt-20 grid max-w-[1600px] gap-8 border-y border-line py-12 md:grid-cols-3">
        {t.steps.map((s, i) => (
          <div key={s.title} className="reveal-item">
            <p className="numeral text-sm not-italic text-accent-text">0{i + 1}</p>
            <p className="font-display mt-2 text-2xl">{s.title}</p>
            <p className="mt-2 text-sm text-fg-muted">{s.body}</p>
          </div>
        ))}
      </Reveal>

      <div className="gutter mx-auto max-w-[1600px]">
        <CollectionBrowser products={products} />
      </div>

      {concierge && (
        <section className="gutter mx-auto mt-24 max-w-[1600px]">
          <div className="on-night relative overflow-hidden px-8 py-14 md:px-16 md:py-20">
            <p className="label text-fg-muted">{t.conciergeEyebrow}</p>
            <h2 className="font-display mt-4 max-w-2xl text-[length:var(--fs-h2)]">{t.conciergeTitle}</h2>
            <p className="mt-4 max-w-xl text-fg-muted">{t.conciergeBody}</p>
            <a
              href={whatsappHref(t.conciergeHello)}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="label mt-8 inline-flex h-14 items-center bg-ochre px-8 text-espresso"
            >
              {t.conciergeCta}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
