import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";

/** V · Vases & Vessels / Planters: a staggered masonry of quiet forms. */
export function Vessels({ products }: { products: Product[] }) {
  const t = copy.home.vessels;
  return (
    <section className="gutter mx-auto max-w-[1600px] py-24 md:py-40">
      <Reveal className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="reveal-item md:sticky md:top-32 md:self-start">
          <p className="label text-fg-muted">{t.eyebrow}</p>
          <h2 className="font-display mt-4 text-[length:var(--fs-h2)]">{t.title}</h2>
          <p className="mt-5 max-w-sm text-fg-muted">{t.body}</p>
          <ButtonLink href="/collections/vases-vessels" variant="text" arrow className="mt-8">
            {t.cta}
          </ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8">
          {products.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "reveal-item md:mt-24" : "reveal-item"}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
