import { ProductCard } from "@/components/product/ProductCard";
import { ProductImage } from "@/components/product/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { getProduct, getProducts } from "@/lib/commerce";

/**
 * Phase 1 home: a still, typographic version of the opening chapters so the
 * layout, tokens and data layer can be reviewed. The scroll-driven story
 * (preloader, 3D hero, horizontal gallery…) replaces this in Phase 3.
 */
export default async function HomePage() {
  const [hero, lamps, vessels] = await Promise.all([
    getProduct("aurelia"),
    getProducts({ collection: "lumiere", limit: 4 }),
    getProducts({ collection: "vases-vessels", limit: 4 }),
  ]);

  return (
    <>
      <section className="gutter relative mx-auto grid min-h-[100svh] max-w-[1600px] items-end gap-10 pb-12 pt-[calc(var(--header-h)+4vh)] md:grid-cols-[1.25fr_1fr] md:items-center md:pb-16">
        <div className="relative z-10 order-2 md:order-1">
          <p className="label text-fg-muted">{copy.home.heroEyebrow}</p>
          <h1 className="font-display mt-6 text-[length:var(--fs-hero)]">
            <span className="block italic">{copy.home.heroLines[0]}</span>
            <span className="block">{copy.home.heroLines[1]}</span>
          </h1>
          <p className="font-display mt-6 text-[length:var(--fs-h3)] italic text-accent-text">
            {copy.home.heroTagline}
          </p>
          <p className="mt-6 max-w-md text-fg-muted">{copy.home.heroSub}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/collections/lumiere" arrow>
              {copy.home.heroPrimaryCta}
            </ButtonLink>
            <ButtonLink href="/light-finder" variant="ghost">
              {copy.home.heroGhostCta}
            </ButtonLink>
          </div>
        </div>

        {hero && (
          <ProductImage
            product={hero}
            bare
            priority
            sizes="(min-width: 768px) 40vw, 90vw"
            className="order-1 mx-auto w-full max-w-[260px] md:order-2 md:max-w-[480px]"
          />
        )}
      </section>

      <ProductRail
        eyebrow={copy.home.featuredEyebrow}
        title={copy.home.featuredTitle}
        cta={copy.home.featuredCta}
        href="/collections/lumiere"
        products={lamps}
      />

      <ProductRail
        eyebrow={copy.home.vesselsEyebrow}
        title={copy.home.vesselsTitle}
        cta={copy.home.vesselsCta}
        href="/collections/vases-vessels"
        products={vessels}
      />

      <p className="label gutter mx-auto mt-24 max-w-[1600px] text-center text-[10px] text-fg-muted">
        {copy.home.phaseNote}
      </p>
    </>
  );
}

function ProductRail({
  eyebrow,
  title,
  cta,
  href,
  products,
}: {
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  products: Awaited<ReturnType<typeof getProducts>>;
}) {
  return (
    <section className="gutter mx-auto mt-24 max-w-[1600px] md:mt-40">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-fg-muted">{eyebrow}</p>
          <h2 className="font-display mt-4 max-w-2xl text-[length:var(--fs-h2)]">{title}</h2>
        </div>
        <ButtonLink href={href} variant="text" arrow className="self-start md:self-auto">
          {cta}
        </ButtonLink>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
