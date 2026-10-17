"use client";

import { useRef } from "react";
import { LitImage } from "@/components/light/LitImage";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { gsap, SplitText } from "@/lib/motion/gsap";
import { useLenis } from "@/lib/motion/SmoothScroll";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/** I · Hero: the signature lamp as a real photograph that lights with the switch. */
export function Hero({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      // If the first-visit intro is playing, let it finish first.
      const delay = document.documentElement.classList.contains("intro-seen") ? 0.1 : 1.65;
      const split = SplitText.create(root.querySelector("h1"), { type: "lines", mask: "lines" });
      gsap
        .timeline({ delay })
        .from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.12, ease: "expo.out" })
        .from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, "<0.35")
        .from(".hero-lamp", { opacity: 0, y: 30, scale: 0.97, duration: 1.4, ease: "expo.out" }, 0.1);

      // Scroll: the lamp drifts slower than the words.
      gsap.to(".hero-lamp", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-copy", {
        yPercent: -14,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      return () => split.revert();
    });
  });

  return (
    <section
      ref={ref}
      className="gutter relative mx-auto grid min-h-[100svh] max-w-[1600px] items-end gap-8 pb-28 pt-[calc(var(--header-h)+3vh)] md:grid-cols-[1.2fr_1fr] md:items-center md:pb-20"
    >
      <div className="hero-copy relative z-10 order-2 md:order-1">
        <p className="hero-fade label text-fg-muted">{copy.home.heroEyebrow}</p>
        <h1 className="font-display mt-6 text-[length:var(--fs-hero)]">
          <span className="block italic">{copy.home.heroLines[0]}</span>
          <span className="block">{copy.home.heroLines[1]}</span>
        </h1>
        <p className="hero-fade font-display mt-6 text-[length:var(--fs-h3)] italic text-accent-text">
          {copy.home.heroTagline}
        </p>
        <p className="hero-fade mt-6 max-w-md text-fg-muted">{copy.home.heroSub}</p>
        <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/collections/lumiere" arrow>
            {copy.home.heroPrimaryCta}
          </ButtonLink>
          <ButtonLink href="/light-finder" variant="ghost">
            {copy.home.heroGhostCta}
          </ButtonLink>
        </div>
      </div>

      <div className="hero-lamp relative order-1 mx-auto w-full max-w-[280px] md:order-2 md:max-w-[500px]">
        <div
          aria-hidden
          className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--champagne)_75%,transparent),transparent)] [[data-lights=on]_&]:bg-[radial-gradient(closest-side,rgb(var(--glow-rgb)/0.2),transparent)]"
        />
        <LitImage
          title={product.title}
          off={product.imageOff}
          on={product.imageOn}
          priority
          sizes="(min-width: 768px) 40vw, 70vw"
          frameClassName="aspect-[3/4]"
        />
      </div>

      <PullChain
        onPull={() =>
          lenis?.scrollTo("#lumiere", { duration: 1.6 }) ??
          document.getElementById("lumiere")?.scrollIntoView({ behavior: "smooth" })
        }
      />
    </section>
  );
}

/** Scroll cue: a tiny brass pull-chain that sways with the cursor; pulling it moves on to the collection. */
function PullChain({ onPull }: { onPull: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const chain = root.querySelector(".chain");
      let last = 0;
      const onMove = (e: PointerEvent) => {
        const v = Math.max(-1, Math.min(1, (e.clientX - last) / 40));
        last = e.clientX;
        gsap.to(chain, { rotation: v * 9, duration: 0.25, ease: "power2.out", overwrite: true });
        gsap.to(chain, { rotation: 0, duration: 1.6, ease: "elastic.out(1, 0.3)", delay: 0.25 });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });
  });

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        gsap.fromTo(
          ref.current?.querySelector(".chain") ?? null,
          { y: 0 },
          { y: 14, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.in" },
        );
        setTimeout(onPull, 200);
      }}
      className="group absolute bottom-0 left-[var(--gutter)] hidden flex-col items-center md:flex"
      aria-label={copy.home.scrollCue}
    >
      <span className="chain flex origin-top flex-col items-center">
        <svg width="10" height="72" viewBox="0 0 10 72" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx="5" cy={3 + i * 6} r="1.6" fill="none" stroke="var(--ochre)" strokeWidth="1" />
          ))}
        </svg>
        <span className="block size-3.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7dc9a,#c0823a_60%,#7a4f1e)] shadow-[0_2px_6px_rgb(42_29_21/0.3)] transition-transform group-hover:scale-110" />
      </span>
      <span className="label mb-6 mt-3 text-[9px] text-fg-muted">{copy.home.scrollCue}</span>
    </button>
  );
}
