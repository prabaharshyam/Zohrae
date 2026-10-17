import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductStage } from "@/components/product/ProductImage";
import { copy } from "@/copy/en";
import { getProduct, getProducts } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  return product ? { title: product.title, description: product.tagline } : {};
}

/**
 * Phase 1 product page: the essentials, laid out on the final grid.
 * Gallery, buy box, AR, PIN checker and the rest arrive in Phase 4.
 */
export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const product = await getProduct((await params).handle);
  if (!product) notFound();

  const specs = Object.entries(product.specs).filter(([, v]) => v);

  return (
    <div className="gutter mx-auto grid max-w-[1600px] gap-10 pt-[calc(var(--header-h)+3rem)] md:grid-cols-[1.3fr_1fr] md:gap-16">
      <ProductStage product={product} priority sizes="(min-width: 768px) 55vw, 100vw" className="aspect-[4/5]" />

      <div className="md:sticky md:top-28 md:self-start">
        <p className="label text-fg-muted">{product.type}</p>
        <h1 className="font-display mt-4 text-[length:var(--fs-h1)]">{product.title}</h1>
        <p className="font-display mt-4 text-xl italic text-fg-muted">{product.tagline}</p>
        <p className="mt-8 text-xl">
          {formatPrice(product.priceRange.min)}
          <span className="label ml-3 text-[10px] text-fg-muted">{copy.product.priceNote}</span>
        </p>
        <p className="mt-8 max-w-prose">{product.description}</p>

        {product.story && (
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="label text-fg-muted">{copy.product.storyTitle}</h2>
            <p className="font-display mt-4 text-xl italic leading-snug">“{product.story}”</p>
          </section>
        )}

        {specs.length > 0 && (
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="label text-fg-muted">{copy.product.specsTitle}</h2>
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

        <p className="label mt-12 inline-block border border-line px-4 py-2 text-[10px] text-accent-text">
          {copy.stub.comingIn(4)} · {copy.product.addToCart}
        </p>
      </div>
    </div>
  );
}
