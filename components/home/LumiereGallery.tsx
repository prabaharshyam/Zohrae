"use client";

import Link from "next/link";
import { useRef } from "react";
import { LitImage } from "@/components/light/LitImage";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/format";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/** II · The Lumière Collection: pinned on desktop, vertical scroll drives a horizontal track. */
export function LumiereGallery({ lamps }: { lamps: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const t = copy.home.gallery;

  useGsap(ref, (mm, root) => {
    mm.add(MQ.desktop, () => {
      const track = root.querySelector<HTMLElement>(".gallery-track")!;
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (st) => gsap.set(".gallery-progress", { scaleX: st.progress }),
        },
      });

      // Cards tilt toward the cursor (max 6°).
      const cards = gsap.utils.toArray<HTMLElement>(".gallery-card", root);
      const cleanups = cards.map((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
      return () => cleanups.forEach((c) => c());
    });

    mm.add(MQ.mobile, () => {
      gsap.from(".gallery-card", {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 75%" },
      });
    });
  });

  return (
    <section id="lumiere" ref={ref} className="relative overflow-hidden md:flex md:h-svh md:flex-col md:justify-center">
      <div className="gutter mx-auto w-full max-w-[1600px] pt-20 md:pt-[calc(var(--header-h)+2rem)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="label text-fg-muted">{t.eyebrow}</p>
            <h2 className="font-display mt-4 text-[length:var(--fs-h2)]">{t.title}</h2>
            <p className="mt-4 text-fg-muted">{t.body}</p>
          </div>
          <ButtonLink href="/collections/lumiere" variant="text" arrow className="self-start md:self-auto">
            {t.cta}
          </ButtonLink>
        </div>
        <div className="mt-8 hidden h-px bg-line md:block">
          <div className="gallery-progress h-px origin-left scale-x-0 bg-ochre" />
        </div>
      </div>

      <div className="gallery-track mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none] md:mt-12 md:snap-none md:gap-8 md:overflow-visible md:pb-0">
        {lamps.map((p, i) => (
          <Link
            key={p.handle}
            href={`/products/${p.handle}`}
            className="gallery-card group block w-[72vw] shrink-0 snap-start [perspective:900px] md:w-[min(26vw,380px)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <LitImage
              title={p.title}
              off={p.imageOff}
              on={p.imageOn}
              sizes="(min-width: 768px) 26vw, 72vw"
              priority={i < 2}
              frameClassName="aspect-[3/4] bg-bg-raised"
              className="transition-transform duration-700 ease-silk group-hover:-translate-y-1"
            />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-[1.75rem] leading-none md:text-3xl">
                <span className="numeral mr-3 text-base not-italic">{String(i + 1).padStart(2, "0")}</span>
                {p.title}
              </h3>
              <p className="shrink-0 text-sm">{formatPrice(p.priceRange.min)}</p>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{p.tagline}</p>
          </Link>
        ))}
        <div className="w-[var(--gutter)] shrink-0" aria-hidden />
      </div>
    </section>
  );
}
