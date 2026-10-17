import { ProductCard } from "@/components/product/ProductCard";
import { ProductStage } from "@/components/product/ProductImage";
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
    getProduct("nuvola"),
    getProducts({ collection: "lumiere", limit: 4 }),
    getProducts({ collection: "vases-vessels", limit: 4 }),
  ]);

  return (
    <>
      {/* Showroom hero: always dark, so the light switch is the whole show. */}
      <section className="relative mt-[var(--header-h)] bg-night text-moon">
        <div className="relative h-[62svh] md:h-[calc(100svh-var(--header-h))] md:min-h-[560px]">
          {hero && (
            <div className="absolute inset-0">
              <ProductStage
                product={hero}
                priority
                sizes="100vw"
                className="size-full [&_img]:object-[92%_50%] md:[&_img]:object-center"
              />
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,var(--night)_0%,transparent_45%)] md:bg-[linear-gradient(to_right,var(--night)_0%,rgb(14_11_9/0.75)_28%,transparent_58%)]"
          />
        </div>
        <div className="gutter relative mx-auto -mt-24 max-w-[1600px] pb-14 md:absolute md:inset-0 md:mt-0 md:flex md:items-center md:pb-0">
          <div className="max-w-xl">
            <p className="label text-moon/70">{copy.home.heroEyebrow}</p>
            <h1 className="font-display mt-6 text-[length:var(--fs-hero)]">
              <span className="block italic">{copy.home.heroLines[0]}</span>
              <span className="block">{copy.home.heroLines[1]}</span>
            </h1>
            <p className="font-display mt-6 text-[length:var(--fs-h3)] italic text-glow">{copy.home.heroTagline}</p>
            <p className="mt-6 max-w-md text-moon/75">{copy.home.heroSub}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/collections/lumiere" arrow>
                {copy.home.heroPrimaryCta}
              </ButtonLink>
              <ButtonLink href="/light-finder" variant="ghost">
                {copy.home.heroGhostCta}
              </ButtonLink>
            </div>
          </div>
        </div>
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
