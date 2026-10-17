"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";

/** Where the lamp sits in each room photograph (fractions of the image). */
const HOTSPOTS: Record<string, { x: number; y: number }> = {
  aurelia: { x: 0.35, y: 0.52 },
  rosalie: { x: 0.64, y: 0.62 },
  colonna: { x: 0.48, y: 0.6 },
  sora: { x: 0.38, y: 0.58 },
};

/** IX · Shop the room: real rooms, a pulsing hotspot on the lamp, a quick card on tap. */
export function ShopTheRoom({ products }: { products: Product[] }) {
  const rooms = products.filter((p) => p.lifestyle && HOTSPOTS[p.handle]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const cardId = useId();
  const t = copy.home.room;
  const room = rooms[active];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!room?.lifestyle) return null;
  const spot = HOTSPOTS[room.handle];

  return (
    <section className="gutter mx-auto max-w-[1600px] py-24 md:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-fg-muted">{t.eyebrow}</p>
          <h2 className="font-display mt-4 text-[length:var(--fs-h2)]">{t.title}</h2>
        </div>
        <div role="tablist" aria-label={t.title} className="flex flex-wrap gap-2">
          {rooms.map((p, i) => (
            <button
              key={p.handle}
              role="tab"
              type="button"
              aria-selected={i === active}
              onClick={() => {
                setActive(i);
                setOpen(false);
              }}
              className={clsx(
                "label border px-4 py-2.5 transition-colors",
                i === active ? "border-ochre bg-ochre text-espresso" : "border-line hover:border-current",
              )}
            >
              {p.lifestyle?.room} · {p.title}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" className="relative mt-10 aspect-[4/5] overflow-hidden bg-bg-raised md:aspect-[16/10]">
        {rooms.map((p, i) => (
          <Image
            key={p.handle}
            src={p.lifestyle!.url}
            alt={p.lifestyle!.alt}
            fill
            sizes="(min-width: 1600px) 1500px, 100vw"
            className={clsx(
              "object-cover transition-opacity duration-700 ease-silk",
              i === active ? "opacity-100" : "opacity-0",
            )}
            style={{ objectPosition: `${HOTSPOTS[p.handle].x * 100}% ${HOTSPOTS[p.handle].y * 100}%` }}
          />
        ))}

        <button
          type="button"
          className="hotspot absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%` }}
          aria-expanded={open}
          aria-controls={cardId}
          aria-label={t.hotspot(room.title)}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hotspot-ring" />
          <span className="hotspot-dot" />
        </button>

        <div
          id={cardId}
          hidden={!open}
          className="absolute bottom-4 left-4 right-4 flex gap-4 border border-line bg-bg-raised p-4 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.5)] md:bottom-8 md:left-auto md:right-8 md:w-[360px]"
        >
          {room.imageOff && (
            <div className="relative aspect-[3/4] w-20 shrink-0">
              <Image src={room.imageOff.url} alt="" fill sizes="80px" className="object-contain" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl">{room.title}</p>
            <p className="mt-1 text-sm">{formatPrice(room.priceRange.min)}</p>
            <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{room.tagline}</p>
            <Link
              href={`/products/${room.handle}`}
              className="label mt-3 inline-block border-b border-current/40 pb-0.5"
            >
              {t.viewPiece}
            </Link>
          </div>
          <button
            type="button"
            className="label self-start text-fg-muted"
            onClick={() => setOpen(false)}
            aria-label={t.close}
          >
            ✕
          </button>
        </div>
      </div>
    </section>
  );
}
