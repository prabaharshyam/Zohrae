import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { BuyBox } from "@/components/shop/BuyBox";
import { Gallery } from "@/components/shop/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/copy/en";
import { getProduct, getProducts } from "@/lib/commerce";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  return product ? { title: product.title, description: product.tagline } : {};
}

/**
 * Product page: gallery on the left (lamps keep their own gold switch),
 * the buy box on the right, then the story, specifications and pieces that
 * keep it company.
 */
export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const product = await getProduct((await params).handle);
  if (!product) notFound();

  const specs = Object.entries(product.specs).filter(([, v]) => v);
  const related = (await getProducts({ collection: product.collections[0] }))
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  return (
    <>
      <div className="gutter mx-auto grid max-w-[1600px] gap-10 pt-[calc(var(--header-h)+3rem)] md:grid-cols-[1.3fr_1fr] md:gap-16">
        <Gallery product={product} />

        <div className="md:sticky md:top-28 md:self-start">
          <p className="label text-fg-muted">
            {product.type}
            {product.editionSize ? ` · ${copy.product.limited} · ${product.editionSize}` : ""}
          </p>
          <h1 className="font-display mt-4 text-[length:var(--fs-h1)]">{product.title}</h1>
          <p className="font-display mt-4 text-xl italic text-fg-muted">{product.tagline}</p>
          <div className="mt-8">
            <BuyBox product={product} />
          </div>
          <p className="mt-10 max-w-prose">{product.description}</p>

          {product.story && (
            <section className="mt-12 border-t border-line pt-8">
              <h2 data-no-reveal className="label text-fg-muted">
                {copy.product.storyTitle}
              </h2>
              <p className="font-display mt-4 text-xl italic leading-snug">“{product.story}”</p>
            </section>
          )}

          {specs.length > 0 && (
            <section className="mt-12 border-t border-line pt-8">
              <h2 data-no-reveal className="label text-fg-muted">
                {copy.product.specsTitle}
              </h2>
              <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
                {specs.map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="capitalize text-fg-muted">{key.replace(/([A-Z])/g, " $1")}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <ul className="label mt-12 grid grid-cols-2 gap-3 border-t border-line pt-8 text-[10px] text-fg-muted">
            {copy.trust.items.map((t) => (
              <li key={t}>✦ {t}</li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="gutter mx-auto mt-32 max-w-[1600px] pb-24">
          <h2 className="font-display text-[length:var(--fs-h2)]">{copy.product.related}</h2>
          <Reveal className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8">
            {related.map((p) => (
              <div key={p.id} className="reveal-item">
                <ProductCard product={p} />
              </div>
            ))}
          </Reveal>
        </section>
      )}
    </>
  );
}
