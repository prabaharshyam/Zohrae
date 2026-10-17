import Link from "next/link";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { HeartButton } from "@/components/shop/HeartButton";
import { ProductImage } from "./ProductImage";

/** Product card: photo (lamps keep their own switch), name, price, tagline, and a Dream Room heart. */
export function ProductCard({ product, priority, turn }: { product: Product; priority?: boolean; turn?: boolean }) {
  const tags = [copy.product.handcrafted, product.editionSize ? copy.product.limited : null].filter(Boolean);

  // The title link stretches over the whole card, so the lamp's own switch
  // (a button) can sit on the photo without being nested inside a link. The
  // photo sits above the link but lets clicks through; only its switch catches them.
  return (
    <article data-tilt className="group relative">
      <ProductImage
        product={product}
        priority={priority}
        turn={turn}
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
        className="pointer-events-none relative z-[11] transition-transform duration-700 ease-silk group-hover:-translate-y-1"
      />
      <HeartButton
        handle={product.handle}
        title={product.title}
        className="absolute right-2 top-2 z-20 size-10 rounded-full bg-bg/70 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:aria-pressed:opacity-100"
      />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[1.65rem] leading-none md:text-3xl">
          <Link href={`/products/${product.handle}`} className="after:absolute after:inset-0 after:z-10">
            {product.title}
          </Link>
        </h3>
        <p className="shrink-0 text-sm">
          {product.priceRange.max.amount > product.priceRange.min.amount && (
            <span className="text-fg-muted">{copy.product.from} </span>
          )}
          {formatPrice(product.priceRange.min)}
          {product.unit && <span className="text-fg-muted"> / {product.unit.label}</span>}
        </p>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{product.tagline}</p>
      <p className="label mt-3 text-[10px] text-accent-text">{tags.join(" · ")}</p>
    </article>
  );
}
