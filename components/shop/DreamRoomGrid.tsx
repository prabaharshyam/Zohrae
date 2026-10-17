"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { useWishlist } from "@/lib/wishlist/store";

/** The saved pieces, in the order they were saved. */
export function DreamRoomGrid({ products }: { products: Product[] }) {
  const saved = useWishlist();
  const shown = saved.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => Boolean(p));
  if (!shown.length)
    return (
      <div className="flex flex-col items-start gap-6 py-16">
        <p className="font-display text-2xl italic text-fg-muted">{copy.dreamRoom.empty}</p>
        <Link href="/collections/lumiere" className="label border-b border-current/40 pb-1">
          {copy.cart.emptyCta}
        </Link>
      </div>
    );
  return (
    <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
      {shown.map((p) => (
        <div key={p.id} className="shop-card">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
