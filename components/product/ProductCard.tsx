import Link from "next/link";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./ProductImage";

/**
 * Phase 1 card: image, name, tagline, price. Hover lifestyle reveal, tilt,
 * quick-add and wishlist arrive in Phase 4.
 */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const tags = [copy.product.handcrafted, product.editionSize ? copy.product.limited : null].filter(Boolean);

  // The title link stretches over the whole card, so the lamp's own switch
  // (a button) can sit on the photo without being nested inside a link. The
  // photo sits above the link but lets clicks through; only its switch catches them.
  return (
    <article className="group relative">
      <ProductImage
        product={product}
        priority={priority}
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
        className="pointer-events-none relative z-[11] transition-transform duration-700 ease-silk group-hover:-translate-y-1"
      />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[1.65rem] leading-none md:text-3xl">
          <Link href={`/products/${product.handle}`} className="after:absolute after:inset-0 after:z-10">
            {product.title}
          </Link>
        </h3>
        <p className="shrink-0 text-sm">{formatPrice(product.priceRange.min)}</p>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{product.tagline}</p>
      <p className="label mt-3 text-[10px] text-accent-text">{tags.join(" · ")}</p>
    </article>
  );
}
