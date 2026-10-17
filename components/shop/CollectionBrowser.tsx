"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { LightsPill } from "@/components/light/LightsPill";
import { ProductCard } from "@/components/product/ProductCard";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";

type Sort = "featured" | "price-asc" | "price-desc" | "new";
const PRICES = [
  { id: "all", label: copy.shop.allPrices, test: () => true },
  { id: "u2", label: copy.shop.under(2000), test: (n: number) => n < 2000 },
  { id: "2-4", label: copy.shop.between(2000, 4000), test: (n: number) => n >= 2000 && n <= 4000 },
  { id: "o4", label: copy.shop.over(4000), test: (n: number) => n > 4000 },
] as const;

/** A collection grid with type and price filters, sorting and (for lamps) one switch for them all. */
export function CollectionBrowser({ products }: { products: Product[] }) {
  const types = useMemo(() => [...new Set(products.map((p) => p.type))], [products]);
  const [type, setType] = useState<string>("all");
  const [price, setPrice] = useState<(typeof PRICES)[number]["id"]>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const shown = useMemo(() => {
    const test = PRICES.find((p) => p.id === price)!.test;
    const list = products.filter((p) => (type === "all" || p.type === type) && test(p.priceRange.min.amount));
    const by = {
      featured: () => 0,
      "price-asc": (a: Product, b: Product) => a.priceRange.min.amount - b.priceRange.min.amount,
      "price-desc": (a: Product, b: Product) => b.priceRange.min.amount - a.priceRange.min.amount,
      new: (a: Product, b: Product) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")),
    }[sort];
    return [...list].sort(by);
  }, [products, type, price, sort]);
  const lamps = shown.filter((p) => p.imageOn).map((p) => p.handle);

  const chip = (active: boolean) =>
    clsx(
      "label h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-[10px] transition-colors",
      active ? "border-fg bg-fg text-bg" : "border-line text-fg-muted hover:border-current hover:text-fg",
    );

  return (
    <>
      <div className="sticky top-16 z-30 -mx-[var(--gutter)] mt-12 flex items-center gap-2 overflow-x-auto border-y border-line bg-bg/95 px-[var(--gutter)] py-3 [scrollbar-width:none] md:top-[68px] md:flex-wrap md:overflow-visible">
        {types.length > 1 && (
          <>
            <button
              type="button"
              aria-pressed={type === "all"}
              onClick={() => setType("all")}
              className={chip(type === "all")}
            >
              {copy.shop.all}
            </button>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(t)}
                className={chip(type === t)}
              >
                {t}
              </button>
            ))}
            <span aria-hidden className="mx-1 h-5 w-px bg-line" />
          </>
        )}
        {PRICES.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={price === p.id}
            onClick={() => setPrice(p.id)}
            className={chip(price === p.id)}
          >
            {p.label}
          </button>
        ))}
        <div className="ml-auto flex shrink-0 items-center gap-4">
          {lamps.length > 0 && <LightsPill handles={lamps} />}
          <label className="label flex items-center gap-2 text-[10px] text-fg-muted">
            {copy.shop.sort}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="label h-9 border border-line bg-bg px-2 text-[10px] text-fg"
            >
              <option value="featured">{copy.shop.sortFeatured}</option>
              <option value="new">{copy.shop.sortNew}</option>
              <option value="price-asc">{copy.shop.sortPriceAsc}</option>
              <option value="price-desc">{copy.shop.sortPriceDesc}</option>
            </select>
          </label>
        </div>
      </div>

      <p className="label mt-8 text-[10px] text-fg-muted" aria-live="polite">
        {copy.cart.count(shown.length)}
      </p>
      {shown.length === 0 ? (
        <p className="font-display py-24 text-center text-2xl italic text-fg-muted">{copy.shop.none}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
          {shown.map((p, i) => (
            <div key={p.id} className="shop-card" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
