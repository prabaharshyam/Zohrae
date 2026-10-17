"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { copy } from "@/copy/en";
import { INTRO_KEY } from "@/lib/boot-scripts";
import { light } from "@/lib/light/store";
import { gsap } from "@/lib/motion/gsap";
import { chimeSound } from "@/lib/sound/ui";

/** Fired when the curtain lifts, so the hero can start its entrance. */
export const ENTER_EVENT = "zohrae:enter";

/**
 * First-visit intro: a filament draws itself in gold on a night screen,
 * flickers once and warms into the monogram. Then the visitor chooses:
 * enter with sound, or in silence. The curtain lifts on their choice.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const curtain = useRef<gsap.core.Timeline | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || getComputedStyle(el).display === "none") return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // ignore
    }
    const path = el.querySelector<SVGPathElement>(".intro-filament");
    const len = path?.getTotalLength() ?? 400;
    const t = gsap.timeline();
    t.set(path, { strokeDasharray: len, strokeDashoffset: len })
      .to(path, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" })
      .to(path, { opacity: 0.25, duration: 0.05, ease: "none" })
      .to(path, { opacity: 1, duration: 0.08, ease: "none" })
      .to(".intro-glow", { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, "<")
      .to(".intro-filament-wrap", { opacity: 0, duration: 0.3 }, ">-0.05")
      .fromTo(".intro-mark", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35 }, "<")
      .fromTo(".intro-choice", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, ">-0.1");
    curtain.current = gsap
      .timeline({ paused: true, onComplete: () => setDone(true) })
      .to(".intro-choice", { opacity: 0, y: -10, duration: 0.3, stagger: 0.04 })
      .to(".intro-mark", { scale: 1.15, opacity: 0, duration: 0.5, ease: "power2.in" }, "<")
      .add(() => window.dispatchEvent(new Event(ENTER_EVENT)), ">-0.15")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "<");
    return () => {
      t.kill();
      curtain.current?.kill();
    };
  }, []);

  const enter = (sound: boolean) => {
    light.setSound(sound);
    if (sound) chimeSound();
    curtain.current?.play();
  };

  if (done) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={copy.brand.name}
      className="preloader fixed inset-0 z-[70] grid place-items-center bg-night text-glow"
    >
      <div className="intro-glow absolute size-[60vmin] scale-75 rounded-full opacity-0 [background:radial-gradient(circle,rgb(255_184_105/0.28),transparent_65%)]" />
      <svg className="intro-filament-wrap relative w-[min(260px,60vw)]" viewBox="0 0 240 80" fill="none" aria-hidden>
        <path
          className="intro-filament"
          d="M6 58 C 26 58, 30 22, 46 22 S 64 58, 80 58 S 98 22, 114 22 S 132 58, 148 58 S 166 22, 182 22 S 200 58, 216 58 L 234 58"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px rgb(255 184 105 / 0.9))" }}
        />
      </svg>
      <div className="intro-mark absolute opacity-0">
        <Logo variant="monogram" title="" className="size-24 text-glow drop-shadow-[0_0_18px_rgb(255_184_105/0.6)]" />
      </div>
      <div className="absolute inset-x-0 bottom-[14svh] flex flex-col items-center gap-6 px-6 text-center">
        <p className="text-sm text-moon/60">{copy.home.enterHint}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <button
            type="button"
            data-magnetic
            onClick={() => enter(true)}
            className="intro-choice label h-12 rounded-full border border-glow/60 px-8 text-glow opacity-0 transition-colors hover:bg-glow hover:text-night"
          >
            {copy.home.enterSound}
          </button>
          <button
            type="button"
            onClick={() => enter(false)}
            className="intro-choice label h-12 px-6 text-moon/60 opacity-0 transition-colors hover:text-moon"
          >
            {copy.home.enterSilent}
          </button>
        </div>
      </div>
    </div>
  );
}
