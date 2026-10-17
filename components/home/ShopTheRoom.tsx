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
    <section className="gutter mx-auto max-w-[1600px] py-20 md:flex md:min-h-svh md:items-center md:py-16">
      <div className="grid w-full gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16">
        {/* Left: the rooms, and the piece in the active one */}
        <div className="md:max-w-xl">
          <p className="label text-fg-muted">{t.eyebrow}</p>
          <h2 className="font-display mt-4 text-[length:var(--fs-h2)]">{t.title}</h2>
          <p className="mt-4 max-w-md text-fg-muted">{t.body}</p>

          <div role="tablist" aria-label={t.title} className="mt-8 divide-y divide-line border-y border-line">
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
                className="group flex w-full items-center gap-4 py-3 text-left"
              >
                <span
                  className={clsx(
                    "numeral w-6 text-sm not-italic transition-colors",
                    i === active ? "text-accent-text" : "text-fg-muted",
                  )}
                >
                  0{i + 1}
                </span>
                <span className="flex-1">
                  <span className="label block text-[10px] text-fg-muted">{p.lifestyle?.room}</span>
                  <span
                    className={clsx(
                      "font-display block text-2xl transition-[color,transform] duration-500 ease-silk",
                      i === active ? "translate-x-1 text-fg" : "text-fg-muted group-hover:text-fg",
                    )}
                  >
                    {p.title}
                  </span>
                </span>
                <span className="text-sm text-fg-muted">{formatPrice(p.priceRange.min)}</span>
                <span
                  aria-hidden
                  className={clsx(
                    "size-2 rounded-full transition-[background-color,box-shadow]",
                    i === active ? "bg-ochre shadow-[0_0_10px_rgb(255_184_105/0.8)]" : "bg-line",
                  )}
                />
              </button>
            ))}
          </div>

          <Link
            href={`/products/${room.handle}`}
            className="label mt-8 inline-flex items-center gap-3 border-b border-current/40 pb-1 hover:border-current"
          >
            {t.viewPiece}: {room.title} →
          </Link>
        </div>

        {/* Right: the room, at its own portrait proportion, never taller than the screen */}
        <div
          role="tabpanel"
          data-reveal-media
          className="relative mx-auto aspect-[4/5] w-full overflow-hidden bg-bg-raised md:h-[min(84svh,900px)] md:w-auto"
        >
          {rooms.map((p, i) => (
            <Image
              key={p.handle}
              src={p.lifestyle!.url}
              alt={p.lifestyle!.alt}
              fill
              quality={90}
              sizes="(min-width: 768px) 46vw, 100vw"
              className={clsx(
                "object-cover transition-[opacity,transform] duration-[1.2s] ease-silk",
                i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
              )}
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
            className="absolute bottom-4 left-4 right-4 flex gap-4 border border-line bg-bg-raised p-4 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.5)]"
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
      </div>
    </section>
  );
}
