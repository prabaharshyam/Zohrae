import { LitImage } from "@/components/light/LitImage";
import type { Product } from "@/lib/commerce/types";

type Props = {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Card image: the product cut-out in a 3:4 frame; for lamps, the switch crossfades it to the lit cut-out. */
export function ProductImage({ product, sizes, priority, className }: Props) {
  return (
    <LitImage
      title={product.title}
      off={product.imageOff ?? product.images[0]}
      on={product.imageOn}
      sizes={sizes}
      priority={priority}
      frameClassName="aspect-[3/4] bg-bg-raised"
      className={className}
    />
  );
}

/** Showroom scene for heroes and product pages; falls back to the cut-out pair. */
export function ProductStage({ product, sizes, priority, className }: Props) {
  if (!product.stage) return <ProductImage product={product} sizes={sizes} priority={priority} className={className} />;
  return (
    <LitImage
      title={product.title}
      off={product.stage.off}
      on={product.stage.on}
      fit="cover"
      sizes={sizes}
      priority={priority}
      frameClassName="bg-night"
      className={className}
    />
  );
}
