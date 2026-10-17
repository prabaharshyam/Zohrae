import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { copy } from "@/copy/en";

const PHOTOS = ["/products/personalised-insulated-tumbler/photo.webp", "/products/wedding-party-badge-set/photo.webp"];

/** VII & VIII · Personalised gifts and Wedding Atelier, as two photographic panels. */
export function Teasers() {
  return (
    <section className="gutter mx-auto max-w-[1600px] py-24 md:py-32">
      <Reveal className="grid gap-4 md:grid-cols-2 md:gap-6">
        {copy.home.teasers.map((t, i) => (
          <Link
            key={t.href}
            href={t.href}
            className={
              "reveal-item group relative flex min-h-[340px] flex-col justify-end overflow-hidden p-8 md:min-h-[460px] md:p-12 " +
              (i === 0 ? "teaser-gifts" : "teaser-wedding")
            }
          >
            <Image
              src={PHOTOS[i]}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.6s] ease-silk group-hover:scale-105"
            />
            <span aria-hidden className="teaser-scrim absolute inset-0" />
            <span className="relative">
              <span className="label block text-fg-muted">{t.eyebrow}</span>
              <span className="font-display mt-3 block text-[length:var(--fs-h2)]">{t.title}</span>
              <span className="mt-4 block max-w-sm text-fg-muted">{t.body}</span>
              <span className="label mt-8 inline-flex items-center gap-3 border-b border-current/30 pb-1 transition-colors group-hover:border-current">
                {t.cta}
                <ArrowIcon
                  width={16}
                  height={16}
                  className="transition-transform duration-500 ease-silk group-hover:translate-x-1"
                />
              </span>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
