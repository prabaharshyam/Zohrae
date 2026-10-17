"use client";

import { useRef } from "react";
import { ProductStage } from "@/components/product/ProductImage";
import { DepthTurn } from "@/components/three/DepthTurn";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";
import { whooshSound } from "@/lib/sound/ui";

/**
 * Each lamp's chapter colour: a bold ground chosen to make that lamp's own
 * colour sing, and the ink for the type on it.
 */
const PALETTE: Record<string, { bg: string; ink: string }> = {
  aurelia: { bg: "#27382B", ink: "#E9D9A6" },
  sora: { bg: "#B4472C", ink: "#F7E7D6" },
  nuvola: { bg: "#1D3646", ink: "#F3D9B8" },
  onda: { bg: "#E2C9A0", ink: "#3A2417" },
  ballerina: { bg: "#3B2442", ink: "#F0D3D0" },
  rosalie: { bg: "#E7B8B0", ink: "#4A1E26" },
  colonna: { bg: "#E2AE3E", ink: "#2C2A16" },
  coquille: { bg: "#13233A", ink: "#E8DCCB" },
};
const FALLBACK = { bg: "#2A1D15", ink: "#F3E9D8" };

/**
 * II · The Lumière Collection, as chapters. Each lamp fills the screen on its
 * own colour with its name set huge behind it; the lamp turns toward the
 * cursor (and with scroll). Chapters are sticky, so each new one rises over
 * the last as a card that opens to full bleed while the one beneath recedes.
 */
export function LampChapters({ lamps }: { lamps: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const t = copy.home.gallery;

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".chapter", root);
      chapters.forEach((ch, i) => {
        const inner = ch.querySelector(".chapter-inner");
        const name = ch.querySelector(".chapter-name");
        const lamp = ch.querySelector(".chapter-lamp");
        if (i > 0) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ch,
                start: "top bottom",
                end: "top top",
                scrub: true,
                onEnter: () => whooshSound(),
              },
            })
            .fromTo(
              inner,
              { clipPath: "inset(12% 6% 0% 6% round 28px)" },
              { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
            )
            .fromTo(name, { yPercent: 60 }, { yPercent: 0, ease: "none" }, 0)
            .fromTo(lamp, { yPercent: 30, scale: 0.85 }, { yPercent: 0, scale: 1, ease: "none" }, 0);
        }
        // As the next chapter rises, this one recedes into the dark.
        const next = chapters[i + 1];
        if (next) {
          gsap.to(ch.querySelector(".chapter-shade"), {
            opacity: 0.6,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
          gsap.to(inner, {
            scale: 0.94,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        }
      });
      ScrollTrigger.refresh();
    });
  });

  return (
    <section id="lumiere" ref={ref} aria-label={t.title} className="relative">
      {lamps.map((p, i) => {
        const c = PALETTE[p.handle] ?? FALLBACK;
        return (
          <article
            key={p.handle}
            className="chapter sticky top-0 h-svh overflow-hidden bg-night"
            style={{ "--chap": c.bg, "--ink": c.ink } as React.CSSProperties}
          >
            <div data-header-tone className="chapter-inner chapter-ground relative flex h-full flex-col">
              {p.stage ? (
                <StageScene product={p} />
              ) : (
                /* The name, enormous, behind the lamp */
                <p
                  aria-hidden
                  className="chapter-name font-display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-[58%] select-none text-center text-[length:var(--fs-chapter)] leading-none italic tracking-[-0.04em] whitespace-nowrap"
                >
                  {p.title}
                </p>
              )}

              <header className="gutter relative z-10 mx-auto flex w-full max-w-[1600px] items-start justify-between pt-[calc(var(--header-h)+1rem)]">
                <p className="label opacity-80">
                  {i === 0 ? t.eyebrow : `Lumière · ${String(i + 1).padStart(2, "0")}`}
                </p>
                <p className="numeral text-sm not-italic opacity-80">
                  {String(i + 1).padStart(2, "0")} / {String(lamps.length).padStart(2, "0")}
                </p>
              </header>

              {p.stage ? (
                <div className="flex-1" />
              ) : (
                <div
                  data-cursor="Turn"
                  className="chapter-lamp relative z-10 mx-auto my-auto block w-[min(70vw,330px)] md:w-[min(30vw,420px)]"
                >
                  <span aria-hidden className="chapter-glow absolute inset-[8%] rounded-full" />
                  <DepthTurn
                    title={p.title}
                    off={p.imageOff}
                    on={p.imageOn}
                    sizes="(min-width: 768px) 30vw, 70vw"
                    frameClassName="aspect-[3/4]"
                    turn={0.5}
                    lampId={p.handle}
                    ignite
                  />
                </div>
              )}

              <footer className="gutter relative z-10 mx-auto grid w-full max-w-[1600px] gap-4 pb-8 md:grid-cols-2 md:items-end md:pb-10">
                <div className="max-w-md">
                  <h2 className="font-display text-3xl md:text-5xl">{p.title}</h2>
                  <p className="mt-2 text-sm opacity-80 md:text-base">{p.tagline}</p>
                  <p className="label mt-4 text-[10px] opacity-60">{copy.light.touchHint}</p>
                </div>
                <div className="flex items-center gap-6 md:justify-end">
                  <p className="font-display text-2xl">{formatPrice(p.priceRange.min)}</p>
                  <ButtonLink href={`/products/${p.handle}`} variant="ghost" arrow>
                    Discover
                  </ButtonLink>
                </div>
              </footer>
              <span
                aria-hidden
                className="chapter-shade pointer-events-none absolute inset-0 z-20 bg-night opacity-0"
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}

/**
 * A chapter for a lamp with showroom photography: the dark room fills the
 * screen, the lamp on its plinth, the name set in capitals on the far side.
 */
function StageScene({ product }: { product: Product }) {
  const lampLeft = (product.stage?.off.switchAt?.[0] ?? 0.5) < 0.5;
  return (
    <>
      <div className="chapter-lamp absolute inset-0">
        <ProductStage product={product} sizes="100vw" className="size-full" ignite />
      </div>
      <div
        aria-hidden
        className={
          "pointer-events-none absolute inset-0 " +
          (lampLeft
            ? "bg-[linear-gradient(to_top,rgb(14_11_9/0.8),transparent_50%)] md:bg-[linear-gradient(to_left,rgb(14_11_9/0.7),transparent_60%)]"
            : "bg-[linear-gradient(to_top,rgb(14_11_9/0.8),transparent_50%)] md:bg-[linear-gradient(to_right,rgb(14_11_9/0.7),transparent_60%)]")
        }
      />
      <p
        aria-hidden
        className={
          "chapter-name chapter-name-stage font-display pointer-events-none absolute top-[22%] hidden select-none text-[length:var(--fs-stage-name)] leading-none tracking-[0.02em] uppercase md:block " +
          (lampLeft ? "right-[var(--gutter)] text-right" : "left-[var(--gutter)]")
        }
      >
        {product.title}
      </p>
    </>
  );
}
