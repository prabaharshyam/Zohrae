"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/motion/gsap";

const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Site-wide motion, applied by convention so every page gets it:
 * - section headings (main h2) flip up word by word in 3D as they enter;
 * - [data-reveal-media] wipes up from below while its image settles;
 * - [data-tilt] cards lean toward the cursor in 3D, with a moving sheen;
 * - [data-skew] leans with scroll speed (the marquee);
 * - [data-torch] dark sections carry a warm glow that follows the cursor;
 * - a filament along the top of the page fills as you scroll.
 * Re-applied on every route; nothing runs with reduced motion.
 */
export function MotionDirector() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    // Let the page mount its own triggers (pins change layout) before measuring.
    const t = window.setTimeout(() => {
      mm.add(MOTION, () => {
        const splits: SplitText[] = [];
        gsap.utils.toArray<HTMLElement>("main h2:not([data-no-reveal])").forEach((h) => {
          if (h.closest("[data-no-reveal]")) return;
          const split = SplitText.create(h, { type: "words", mask: "words" });
          splits.push(split);
          gsap.from(split.words, {
            yPercent: 110,
            rotationX: -80,
            transformOrigin: "50% 100% -30px",
            transformPerspective: 600,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: h, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-media]").forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          tl.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" },
          ).from(el.querySelectorAll("img"), { scale: 1.25, duration: 1.8, ease: "expo.out" }, 0.1);
        });

        // Marquee leans with scroll velocity, then springs back.
        const skewers = gsap.utils.toArray<HTMLElement>("[data-skew]");
        const setters = skewers.map((el) => gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3.out" }));
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-12, 12, self.getVelocity() / -250);
            setters.forEach((s) => s(v));
          },
        });

        // Scroll progress, drawn as a warming filament.
        const progress = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => bar.current && gsap.set(bar.current, { scaleX: self.progress }),
        });

        return () => {
          splits.forEach((s) => s.revert());
          st.kill();
          progress.kill();
        };
      });
      ScrollTrigger.refresh();
    }, 400);
    return () => {
      clearTimeout(t);
      mm.revert();
    };
  }, [pathname]);

  // Pointer effects: tilt and torch (fine pointers only), delegated from the document.
  useEffect(() => {
    if (!window.matchMedia(`${MOTION} and (hover: hover) and (pointer: fine)`).matches) return;
    let tilted: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;
    const reset = (el: HTMLElement) =>
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });
    const frame = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element;
      const card = target.closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (card !== tilted) {
        if (tilted) reset(tilted);
        tilted = card;
      }
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        gsap.to(card, {
          rotationY: (x - 0.5) * 6,
          rotationX: -(y - 0.5) * 5,
          transformPerspective: 900,
          duration: 0.5,
          ease: "power3.out",
        });
        card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      }
      const torch = target.closest?.<HTMLElement>("[data-torch]");
      if (torch) {
        const r = torch.getBoundingClientRect();
        torch.style.setProperty("--tx", `${e.clientX - r.left}px`);
        torch.style.setProperty("--ty", `${e.clientY - r.top}px`);
      }
    };
    const move = (e: PointerEvent) => {
      last = e;
      raf ||= requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={bar} aria-hidden className="scroll-filament" />;
}
