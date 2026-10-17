"use client";

import { useEffect, useRef } from "react";
import { ENTER_EVENT } from "@/components/home/Preloader";
import { ProductStage } from "@/components/product/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { lamps } from "@/lib/light/lamps";
import { light } from "@/lib/light/store";
import { gsap, SplitText } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/**
 * I · Hero: a dark showroom, full-bleed, with the signature lamp on its
 * plinth. Once the visitor steps in, the lamp catches and lights by itself;
 * after that its gold base button is theirs. The scene drifts with the
 * cursor and settles closer as you scroll.
 */
export function Hero({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);

  // First light: shortly after the curtain lifts (or on load for returning visitors).
  useEffect(() => {
    let t = 0;
    const lightUp = () => {
      t = window.setTimeout(() => {
        if (!lamps.touched(product.handle) && !light.get().on) lamps.set(product.handle, true, "ignite");
      }, 900);
    };
    if (document.documentElement.classList.contains("intro-seen") || !document.querySelector(".preloader")) lightUp();
    else window.addEventListener(ENTER_EVENT, lightUp, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener(ENTER_EVENT, lightUp);
    };
  }, [product.handle]);

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const split = SplitText.create(root.querySelector("h1"), { type: "lines,chars", mask: "lines" });
      // The room opens like an iris from the lamp itself, then the words flip up letter by letter.
      const [fx] = product.stage?.off.switchAt ?? [0.5];
      const at = `at ${(fx * 100).toFixed(0)}% 45%`;
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(
          ".hero-scene",
          { clipPath: `circle(0% ${at})`, scale: 1.15 },
          { clipPath: `circle(150% ${at})`, scale: 1, duration: 2.4, ease: "expo.inOut" },
        )
        .from(
          split.chars,
          {
            yPercent: 120,
            rotationX: -90,
            transformOrigin: "50% 100% -20px",
            transformPerspective: 500,
            duration: 1.2,
            stagger: 0.03,
            ease: "expo.out",
          },
          0.9,
        )
        .from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 1.3);
      const play = () => intro.play();
      if (document.documentElement.classList.contains("intro-seen") || !document.querySelector(".preloader")) {
        gsap.delayedCall(0.1, play);
      } else window.addEventListener(ENTER_EVENT, play, { once: true });

      // The room drifts a little with the cursor, like a slow camera.
      const scene = root.querySelector<HTMLElement>(".hero-drift")!;
      const dx = gsap.quickTo(scene, "xPercent", { duration: 1.6, ease: "power3.out" });
      const dy = gsap.quickTo(scene, "yPercent", { duration: 1.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        dx((e.clientX / window.innerWidth - 0.5) * -1.6);
        dy((e.clientY / window.innerHeight - 0.5) * -1.2);
      };
      window.addEventListener("pointermove", move, { passive: true });

      const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-drift", { scale: 1.1, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-copy", { yPercent: -25, opacity: 0, ease: "none", scrollTrigger: { ...scrub, end: "60% top" } });
      return () => {
        window.removeEventListener(ENTER_EVENT, play);
        window.removeEventListener("pointermove", move);
        split.revert();
      };
    });
  });

  return (
    <section
      ref={ref}
      data-header-tone
      className="hero relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-night text-moon"
    >
      <div className="hero-drift absolute inset-x-[-2%] top-0 h-[50svh] md:inset-[-2%] md:h-auto">
        <ProductStage product={product} priority sizes="100vw" className="hero-scene size-full" />
      </div>
      {/* Legibility: night gathers on the copy's side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--night)_50svh,rgb(14_11_9/0.4)_56svh,transparent_64%)] md:bg-[linear-gradient(to_left,rgb(14_11_9/0.8),rgb(14_11_9/0.25)_55%,transparent_75%)]"
      />

      <div className="hero-copy gutter pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end pb-28 md:items-end md:justify-center md:pb-0">
        <div className="pointer-events-auto max-w-xl md:text-right">
          <p className="hero-fade label text-moon/70">{copy.home.heroEyebrow}</p>
          <h1 className="font-display mt-5 text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.95]">
            <span className="block italic">{copy.home.heroLines[0]}</span>
            <span className="block">{copy.home.heroLines[1]}</span>
          </h1>
          <p className="hero-fade mt-6 hidden text-moon/75 md:ml-auto md:block md:max-w-md">{copy.home.heroSub}</p>
          <div className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row md:justify-end">
            <ButtonLink href="/collections/lumiere" arrow>
              {copy.home.heroPrimaryCta}
            </ButtonLink>
            <ButtonLink href="/light-finder" variant="ghost">
              {copy.home.heroGhostCta}
            </ButtonLink>
          </div>
        </div>
      </div>

      <p className="hero-fade label pointer-events-none absolute bottom-6 left-[var(--gutter)] z-10 hidden text-[10px] text-moon/55 md:block">
        {copy.light.touchHint}
      </p>
    </section>
  );
}
