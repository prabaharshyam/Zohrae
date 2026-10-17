"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { ProductStage } from "@/components/product/ProductImage";
import type { ImageAsset, Product } from "@/lib/commerce/types";
import { gsap } from "@/lib/motion/gsap";

/**
 * Product gallery: the lit hero shot first (lamps keep their own switch),
 * then every other photograph. Thumbnails cross-dissolve the main frame.
 */
export function Gallery({ product }: { product: Product }) {
  const extras: ImageAsset[] = [
    ...product.images.filter((i) => i.url !== product.imageOff?.url),
    ...(product.lifestyle ? [product.lifestyle] : []),
  ];
  const [active, setActive] = useState(0); // 0 = the hero (lit) shot
  const frame = "relative aspect-[4/5] overflow-hidden bg-bg-raised";

  const choose = (i: number, el: HTMLElement | null) => {
    if (i === active) return;
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(el, { opacity: 0.2, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" });
    }
    setActive(i);
  };

  const shown = active > 0 ? extras[active - 1] : null;
  return (
    <div>
      <div id="gallery-main" className={frame}>
        {shown ? (
          <Image
            src={shown.url}
            alt={shown.alt}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className={clsx(shown.onWhite ? "on-white object-contain" : "object-cover")}
          />
        ) : (
          <ProductStage product={product} priority sizes="(min-width: 768px) 55vw, 100vw" className="size-full" turn />
        )}
      </div>
      {extras.length > 0 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Photographs">
          {[product.stage?.off ?? product.imageOff ?? product.images[0], ...extras].map(
            (img, i) =>
              img && (
                <button
                  key={img.url + i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={img.alt}
                  onClick={() => choose(i, document.getElementById("gallery-main"))}
                  className={clsx(
                    "relative aspect-square w-20 shrink-0 overflow-hidden border bg-bg-raised transition-[border-color,opacity]",
                    active === i ? "border-ochre" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ),
          )}
        </div>
      )}
    </div>
  );
}
