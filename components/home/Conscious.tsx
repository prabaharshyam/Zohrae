"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/** Line drawings for plant → filament → lamp, drawn on scroll. */
const DRAWINGS = [
  // Grown: a sprout of corn/sugarcane leaves
  "M60 150 C60 120 60 95 60 70 M60 112 C40 104 26 88 22 66 C44 70 56 86 60 104 M60 92 C80 84 94 66 98 44 C76 48 64 64 60 84 M60 70 C54 52 56 34 66 18 C72 36 68 54 60 70",
  // Spun: a spool of filament
  "M24 40 L96 40 M24 130 L96 130 M34 40 L34 130 M86 40 L86 130 M34 52 C54 58 66 46 86 52 M34 66 C54 72 66 60 86 66 M34 80 C54 86 66 74 86 80 M34 94 C54 100 66 88 86 94 M34 108 C54 114 66 102 86 108 M86 108 C100 112 104 124 112 136",
  // Sculpted: a pleated lamp
  "M34 70 L46 30 L74 30 L86 70 Z M40 70 L50 30 M46 70 L54 30 M52 70 L58 30 M58 70 L62 30 M64 70 L66 30 M70 70 L70 30 M76 70 L74 30 M46 70 C34 84 34 112 46 126 L74 126 C86 112 86 84 74 70 M52 70 C46 90 46 108 52 126 M60 70 L60 126 M68 70 C74 90 74 108 68 126 M36 134 L84 134",
];

/** VI · Conscious luxury: honest material story in a sage chapter. */
export function Conscious() {
  const ref = useRef<HTMLElement>(null);
  const t = copy.home.conscious;

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const paths = gsap.utils.toArray<SVGPathElement>(".draw", root);
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", end: "center 40%", scrub: 0.6 } });
      paths.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, ease: "none", duration: 1 }, i * 0.7));
      tl.from(".stage-label", { opacity: 0, y: 10, stagger: 0.7, duration: 0.5 }, 0.4);
      gsap.from(".conscious-point", {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        scrollTrigger: { trigger: ".conscious-points", start: "top 80%", once: true },
      });
    });
  });

  return (
    <section ref={ref} className="sage-band">
      <div className="gutter mx-auto max-w-[1600px] py-24 md:py-36">
        <p className="label text-fg-muted">{t.eyebrow}</p>
        <h2 className="font-display mt-4 max-w-3xl text-[length:var(--fs-h1)]">{t.title}</h2>

        <div className="mt-14 grid grid-cols-3 gap-3 md:mt-20 md:max-w-4xl md:gap-10" aria-hidden>
          {DRAWINGS.map((d, i) => (
            <figure key={i} className="flex flex-col items-center">
              <svg viewBox="0 0 120 160" className="w-full max-w-[180px]" fill="none">
                <path
                  className="draw"
                  d={d}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <figcaption className="stage-label numeral mt-3 text-lg md:text-2xl">{t.stages[i]}</figcaption>
            </figure>
          ))}
        </div>

        <ul className="conscious-points mt-16 grid gap-8 border-t border-current/15 pt-10 md:grid-cols-3 md:gap-12">
          {t.points.map((p) => (
            <li key={p} className="conscious-point text-[1.05rem]">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-sm text-fg-muted">{t.note}</p>
        <ButtonLink href="/atelier" variant="text" arrow className="mt-8">
          {t.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
