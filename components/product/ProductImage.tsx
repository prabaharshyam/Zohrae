import clsx from "clsx";
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import type { Product } from "@/lib/commerce/types";

type Props = {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * The product's hero shot in a 3:4 frame, or the brand placeholder when the
 * piece hasn't been photographed yet. White-backdrop studio shots fill the
 * frame (so their cast shadows end at the frame edge, not mid-card) and
 * multiply into the page colour.
 */
export function ProductImage({ product, sizes, priority, className }: Props) {
  const image = product.images[0];

  return (
    <div className={clsx("relative aspect-[3/4] overflow-hidden bg-bg-raised", className)}>
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          className={clsx(image.onWhite ? "on-white object-cover object-[50%_68%]" : "object-contain p-[6%]")}
        />
      ) : (
        <Placeholder title={product.title} />
      )}
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div
      role="img"
      aria-label={`${title} — photograph coming soon`}
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_38%,color-mix(in_oklab,var(--champagne)_55%,transparent),transparent_62%)]"
    >
      <div className="flex flex-col items-center gap-5 text-accent-text">
        <Logo variant="monogram" title="" className="size-16 opacity-60" />
        <span className="font-display text-2xl italic text-fg-muted">{title}</span>
      </div>
    </div>
  );
}
