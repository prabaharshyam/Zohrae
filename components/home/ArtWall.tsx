"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/** Paper sizes in cm (portrait), for the to-scale size guide. */
const PAPER: Record<string, [number, number]> = { A3: [29.7, 42], A2: [42, 59.4], A1: [59.4, 84.1] };
/** Where each frame hangs on the wall, as offsets (rem) and tilt before it settles. */
const HANG = [
  { y: 0, tilt: -7 },
  { y: 3.5, tilt: 6 },
  { y: 1, tilt: -5 },
  { y: 4.5, tilt: 8 },
];

/**
 * VI · Galleria: framed art on a warm wall. Frames hang from fine wires and
 * swing into stillness as they enter, then lean toward the cursor. Beside
 * them, A3 · A2 · A1 drawn to true scale against a sofa line.
 */
export function ArtWall({ frames }: { frames: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const t = copy.home.artWall;
  const [size, setSize] = useState("A2");

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>(".art-hang", root).forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotation: HANG[i % HANG.length].tilt, y: -40, opacity: 0 },
          {
            rotation: 0,
            y: 0,
            opacity: 1,
            duration: 2.4,
            ease: "elastic.out(1, 0.28)",
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
      gsap.from(".paper", {
        scaleY: 0,
        transformOrigin: "50% 100%",
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".size-guide", start: "top 85%", once: true },
      });
    });
  });

  const custom = frames.find((f) => f.tags.includes("custom"));
  return (
    <section ref={ref} className="art-wall relative overflow-hidden py-24 md:py-36">
      <div className="gutter mx-auto grid max-w-[1600px] gap-16 md:grid-cols-[1fr_1.6fr] md:gap-20">
        <div className="md:sticky md:top-32 md:self-start">
          <p className="label text-fg-muted">{t.eyebrow}</p>
          <h2 className="font-display mt-4 text-[length:var(--fs-h2)]">{t.title}</h2>
          <p className="mt-5 max-w-md text-fg-muted">{t.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/collections/art-frames" arrow>
              {t.cta}
            </ButtonLink>
            {custom && (
              <ButtonLink href={`/products/${custom.handle}`} variant="ghost">
                {t.custom}
              </ButtonLink>
            )}
          </div>

          {/* Size guide, to scale: 1 cm = 2.2 px at md, against a sofa line */}
          <div className="size-guide mt-14">
            <p className="label text-[10px] text-fg-muted">{t.sizesTitle}</p>
            <div className="relative mt-6 flex h-[200px] items-end gap-5 border-b border-current/25 pb-0">
              {t.sizes.map((s) => {
                const [w, h] = PAPER[s.name];
                const active = size === s.name;
                return (
                  <button
                    key={s.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSize(s.name)}
                    onPointerEnter={() => setSize(s.name)}
                    data-cursor={s.name}
                    className="paper group relative flex flex-col items-center"
                    style={{ width: `${w * 2.2}px`, height: `${h * 2.2}px` }}
                  >
                    <span
                      className={clsx(
                        "absolute inset-0 border transition-[background-color,border-color] duration-500",
                        active ? "border-ochre bg-ochre/15" : "border-current/40",
                      )}
                    />
                    <span className="font-display relative mt-auto mb-2 text-lg">{s.name}</span>
                  </button>
                );
              })}
            </div>
            {t.sizes
              .filter((s) => s.name === size)
              .map((s) => (
                <p key={s.name} className="mt-4 text-sm" aria-live="polite">
                  <span className="font-display text-xl">{s.name}</span>
                  <span className="mx-2 text-fg-muted">·</span>
                  {s.cm}
                  <span className="block text-fg-muted">{s.use}</span>
                </p>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-16 md:gap-x-10">
          {frames.slice(0, 4).map((f, i) => (
            <Link
              key={f.handle}
              href={`/products/${f.handle}`}
              className="art-hang group relative block origin-top"
              style={{ marginTop: `${HANG[i % HANG.length].y}rem` }}
              data-cursor="View"
            >
              {/* the hanging wire */}
              <span aria-hidden className="absolute -top-10 left-1/2 h-10 w-px -translate-x-1/2 bg-current/30" />
              <span
                aria-hidden
                className="absolute -top-11 left-1/2 size-2 -translate-x-1/2 rounded-full bg-current/50"
              />
              <span
                data-tilt
                className="relative block aspect-[3/4] overflow-hidden shadow-[0_30px_50px_-25px_rgb(42_29_21/0.55)]"
              >
                {f.imageOff && (
                  <Image
                    src={f.imageOff.url}
                    alt={f.imageOff.alt}
                    fill
                    sizes="(min-width: 768px) 28vw, 45vw"
                    className="object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-105"
                  />
                )}
              </span>
              <span className="mt-4 flex items-baseline justify-between gap-3">
                <span className="font-display text-2xl">{f.title}</span>
                <span className="text-sm">
                  <span className="text-fg-muted">{copy.product.from} </span>
                  {formatPrice(f.priceRange.min)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
