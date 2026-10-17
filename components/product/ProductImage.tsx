import { LampImage } from "@/components/light/LampImage";
import type { Product } from "@/lib/commerce/types";
import { alignPlacement, coverPlacement } from "@/lib/light/geometry";
import { lampGlow } from "@/lib/light/glow";

const FRAME_ASPECT = 3 / 4;

type Props = {
  product: Product;
  sizes: string;
  priority?: boolean;
  /** Hero use: no frame background, feathered edges. */
  bare?: boolean;
  className?: string;
};

/**
 * The product in a 3:4 frame, for day and night. Studio shots fill the frame
 * (cast shadows end at the frame edge) and multiply into the page; the AI
 * "lit" shot is aligned to the studio shot so switching on doesn't jump.
 */
export function ProductImage({ product, sizes, priority, bare, className }: Props) {
  const off = product.images[0];
  const offPlacement = off ? coverPlacement(off, FRAME_ASPECT) : undefined;
  const on = off && product.imageOn ? product.imageOn : undefined;
  const onPlacement = on && off && offPlacement ? alignPlacement(on, off, offPlacement, FRAME_ASPECT) : undefined;
  const glow =
    product.type === "Lamp" && product.glow ? lampGlow(product.glow, off, offPlacement, FRAME_ASPECT) : undefined;

  return (
    <LampImage
      title={product.title}
      off={off}
      offPlacement={offPlacement}
      on={on}
      onPlacement={onPlacement}
      glow={glow}
      sizes={sizes}
      priority={priority}
      bare={bare}
      className={className}
    />
  );
}
