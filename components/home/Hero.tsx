"use client";

import { useRef } from "react";
import { ENTER_EVENT } from "@/components/home/Preloader";
import { DepthTurn } from "@/components/three/DepthTurn";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { gsap, SplitText } from "@/lib/motion/gsap";
import { useLenis } from "@/lib/motion/SmoothScroll";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/**
 * I · Hero: giant type with the signature lamp standing in front of it, a
 * real photograph that turns toward the cursor. Scrolling parts the words
 * like curtains while the lamp rises and turns to face you.
 */
export function Hero({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero-word", root);
      const splits = lines.map((l) => SplitText.create(l, { type: "chars", mask: "chars" }));
      const intro = gsap
        .timeline({ paused: true })
        .from(
          splits.map((s) => s.chars),
          { yPercent: 115, duration: 1.3, stagger: 0.035, ease: "expo.out" },
        )
        .from(".hero-lamp", { opacity: 0, y: 80, scale: 0.9, duration: 1.6, ease: "expo.out" }, 0.15)
        .from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.6);
      // Wait for the visitor to step through the intro on a first visit.
      const play = () => intro.play();
      if (document.documentElement.classList.contains("intro-seen") || !document.querySelector(".preloader")) {
        gsap.delayedCall(0.1, play);
      } else window.addEventListener(ENTER_EVENT, play, { once: true });

      const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(lines[0], { xPercent: -22, ease: "none", scrollTrigger: scrub });
      gsap.to(lines[1], { xPercent: 22, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-lamp", { yPercent: -18, scale: 1.12, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-meta", { opacity: 0, y: -30, ease: "none", scrollTrigger: { ...scrub, end: "40% top" } });
      return () => {
        window.removeEventListener(ENTER_EVENT, play);
        splits.forEach((s) => s.revert());
      };
    });
  });

  return (
    <section
      ref={ref}
      className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-h)]"
    >
      {/* Giant words, behind the lamp */}
      <h1
        className="font-display pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+4svh)] z-0 select-none text-center leading-[0.82] tracking-[-0.03em] md:top-[calc(var(--header-h)+2svh)]"
        aria-label={copy.home.heroLines.join(" ")}
      >
        <span className="hero-word block text-[length:var(--fs-giant)] italic">{copy.home.heroLines[0]}</span>
        <span className="hero-word hero-word-outline block text-[length:var(--fs-giant)]">
          {copy.home.heroLines[1]}
        </span>
      </h1>

      <div className="hero-lamp relative z-10 mx-auto mt-[14svh] w-[min(78vw,340px)] md:mt-[6svh] md:w-[min(34vw,470px)]">
        <div
          aria-hidden
          className="absolute inset-[4%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--champagne)_80%,transparent),transparent)] [[data-lights=on]_&]:bg-[radial-gradient(closest-side,rgb(var(--glow-rgb)/0.24),transparent)]"
        />
        <DepthTurn
          title={product.title}
          off={product.imageOff}
          on={product.imageOn}
          priority
          sizes="(min-width: 768px) 34vw, 78vw"
          frameClassName="aspect-[3/4]"
          className="cursor-grab"
        />
      </div>

      <div className="hero-meta gutter relative z-20 mx-auto mt-auto grid w-full max-w-[1600px] gap-6 pb-10 md:grid-cols-[1fr_auto_1fr] md:items-end md:pb-12">
        <div className="hero-fade max-w-sm">
          <p className="label text-fg-muted">{copy.home.heroEyebrow}</p>
          <p className="mt-3 text-sm text-fg-muted md:text-base">{copy.home.heroSub}</p>
        </div>
        <p className="hero-fade font-display hidden text-center text-2xl italic text-accent-text md:block">
          {copy.home.heroTagline}
        </p>
        <div className="hero-fade flex flex-col gap-3 sm:flex-row md:justify-end">
          <ButtonLink href="/collections/lumiere" arrow>
            {copy.home.heroPrimaryCta}
          </ButtonLink>
          <ButtonLink href="/light-finder" variant="ghost">
            {copy.home.heroGhostCta}
          </ButtonLink>
        </div>
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
      className="group absolute top-[var(--header-h)] right-[var(--gutter)] z-20 hidden flex-col items-center md:flex"
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
