"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { copy } from "@/copy/en";
import { INTRO_KEY } from "@/lib/boot-scripts";
import { gsap } from "@/lib/motion/gsap";

/**
 * First-visit intro (≤1.8s): a filament draws itself in gold on a night
 * screen, flickers once, warms into the monogram, then the curtain lifts.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
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
    const t = gsap.timeline({ onComplete: () => setDone(true) });
    t.set(path, { strokeDasharray: len, strokeDashoffset: len })
      .to(path, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" })
      .to(path, { opacity: 0.25, duration: 0.05, ease: "none" })
      .to(path, { opacity: 1, duration: 0.08, ease: "none" })
      .to(".intro-glow", { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, "<")
      .to(".intro-filament-wrap", { opacity: 0, duration: 0.3 }, ">-0.05")
      .fromTo(".intro-mark", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35 }, "<")
      .to(el, { yPercent: -100, duration: 0.55, ease: "power3.inOut" }, ">+0.05");
    tl.current = t;
    return () => {
      t.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={ref} className="preloader fixed inset-0 z-[70] grid place-items-center bg-night text-glow" aria-hidden>
      <div className="intro-glow absolute size-[60vmin] scale-75 rounded-full opacity-0 [background:radial-gradient(circle,rgb(255_184_105/0.28),transparent_65%)]" />
      <svg className="intro-filament-wrap relative w-[min(260px,60vw)]" viewBox="0 0 240 80" fill="none">
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
      <button
        type="button"
        className="label absolute bottom-8 right-6 text-moon/50 hover:text-moon"
        style={{ pointerEvents: "auto" }}
        onClick={() => tl.current?.progress(1)}
        tabIndex={-1}
      >
        {copy.home.skipIntro}
      </button>
    </div>
  );
}
