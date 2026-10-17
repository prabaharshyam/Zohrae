import { LitImage } from "@/components/light/LitImage";
import { DepthTurn } from "@/components/three/DepthTurn";
import type { Product } from "@/lib/commerce/types";

type Props = {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Light up by itself the first time it's seen. */
  ignite?: boolean;
  /** Turn in 3D toward the cursor (cut-outs only). */
  turn?: boolean;
};

/** Card image: the product cut-out in a 3:4 frame; lamps light with the room switch or their own gold button. */
export function ProductImage({ product, sizes, priority, className, ignite, turn }: Props) {
  const Frame = turn && product.imageOff ? DepthTurn : LitImage;
  return (
    <Frame
      title={product.title}
      off={product.imageOff ?? product.images[0]}
      on={product.imageOn}
      sizes={sizes}
      priority={priority}
      frameClassName="aspect-[3/4] bg-bg-raised"
      className={className}
      lampId={product.handle}
      ignite={ignite}
    />
  );
}

/** Showroom scene for heroes and product pages; falls back to the cut-out pair. */
export function ProductStage({ product, sizes, priority, className, ignite }: Props) {
  if (!product.stage)
    return <ProductImage product={product} sizes={sizes} priority={priority} className={className} ignite={ignite} />;
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
      lampId={product.handle}
      ignite={ignite}
    />
  );
}
