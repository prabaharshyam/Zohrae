"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

const ROMAN = ["I", "II", "III", "IV", "V"];

/** One photograph per step, in the order of copy.home.atelier.steps. */
const SCENES = [
  { src: "/atelier/sketch.webp", alt: "A hand sketching lamp shapes in pencil on a wooden desk" },
  { src: "/atelier/print.webp", alt: "A 3D printer nozzle laying a glowing thread of ochre PLA" },
  { src: "/atelier/finish.webp", alt: "An artisan hand-finishing a ribbed white lampshade" },
  { src: "/atelier/dark.webp", alt: "A pleated lamp glowing amber in a dark workshop" },
  { src: "/atelier/pack.webp", alt: "A lamp wrapped in tissue inside an ochre keepsake box" },
];

/**
 * III · L'Atelier. Pinned; scrolling walks through five steps, each a
 * photograph that wipes up over the last while slowly settling (a scrubbed
 * Ken Burns), and leans toward the cursor. Step IV dims the whole room.
 */
export function Atelier() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const t = copy.home.atelier;

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const frames = gsap.utils.toArray<HTMLElement>(".atelier-frame", root);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.8,
          onUpdate: (st) => setStep(Math.min(4, Math.floor(st.progress * 5))),
        },
      });
      // Five equal windows, one per step. Each photo flips down onto the deck
      // like a page hinged at its top edge, while the one beneath sinks back
      // into the dark; inside, the photo settles from 1.18 to 1.
      frames.forEach((frame, i) => {
        const img = frame.querySelector("img");
        const start = Math.max(0, i - 0.45);
        tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: i + 1 - start }, start);
        if (i > 0) {
          tl.fromTo(
            frame,
            { rotationX: 100, opacity: 0, transformOrigin: "50% 0%", z: 60 },
            { rotationX: 0, opacity: 1, z: 0, duration: 0.45, ease: "power2.out" },
            start,
          ).to(frames[i - 1], { z: -160, opacity: 0.25, duration: 0.45, ease: "power1.in" }, start);
        }
      });

      // The whole stack leans toward the cursor.
      const stack = root.querySelector<HTMLElement>(".atelier-stack")!;
      const rx = gsap.quickTo(stack, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(stack, "rotationY", { duration: 0.8, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        ry((e.clientX / window.innerWidth - 0.5) * 8);
        rx(-(e.clientY / window.innerHeight - 0.5) * 6);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });
    // Count-up stats.
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>(".stat-value", root).forEach((el) => {
        const end = Number(el.dataset.value);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        });
      });
    });
  });

  return (
    <section
      ref={ref}
      className={clsx(
        "atelier relative overflow-hidden transition-[background-color,color] duration-700 ease-silk",
        step === 3 && "is-dark",
      )}
    >
      <div className="gutter mx-auto grid h-svh min-h-[600px] max-w-[1600px] grid-rows-[auto_1fr_auto] gap-4 pt-[calc(var(--header-h)+1rem)] pb-6 md:grid-cols-[1fr_1.15fr] md:grid-rows-1 md:items-center md:gap-12 md:pb-0">
        <div className="md:order-1">
          <p className="label text-fg-muted">{t.eyebrow}</p>
          <h2 className="font-display mt-3 text-[length:var(--fs-h2)]">{t.title}</h2>

          <ol className="mt-6 flex gap-2" aria-label="Steps">
            {t.steps.map((s, i) => (
              <li
                key={s.title}
                aria-current={i === step ? "step" : undefined}
                className={clsx(
                  "numeral grid size-9 place-items-center rounded-full border text-sm not-italic transition-colors duration-500",
                  i === step ? "border-ochre bg-ochre text-espresso" : "border-line text-fg-muted",
                )}
              >
                {ROMAN[i]}
              </li>
            ))}
          </ol>

          <div className="mt-6 grid [&>*]:[grid-area:1/1] motion-reduce:gap-6 motion-reduce:[&>*]:[grid-area:auto]">
            {t.steps.map((s, i) => (
              <div
                key={s.title}
                className={clsx(
                  "transition-[opacity,transform] duration-700 ease-silk motion-reduce:!translate-y-0 motion-reduce:!opacity-100",
                  i === step ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                )}
              >
                <h3 className="font-display text-[length:var(--fs-h3)] italic">{s.title}</h3>
                <p className="mt-3 max-w-md text-fg-muted">{s.body}</p>
              </div>
            ))}
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-4 md:mt-12 md:pt-6">
            {t.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display text-3xl md:text-4xl">
                    <span className="stat-value" data-value={s.value}>
                      {s.value}
                    </span>
                    {s.suffix}
                  </span>
                  <span className="mt-1 block text-xs text-fg-muted md:text-sm">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-h-0 [perspective:1200px] md:order-2 md:h-[min(72svh,720px)]">
          <div className="atelier-stack relative size-full [perspective:1600px] [transform-style:preserve-3d]">
            {SCENES.map((s, i) => (
              <div
                key={s.src}
                className="atelier-frame absolute inset-0 overflow-hidden rounded-[2px] bg-night shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)] [backface-visibility:hidden]"
                style={i > 0 ? { opacity: 0 } : undefined}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover will-change-transform"
                />
              </div>
            ))}
            <span className="numeral absolute bottom-4 left-5 text-sm text-moon/80 not-italic" aria-hidden>
              {ROMAN[step]} / V
            </span>
          </div>
        </div>
      </div>
      <div className="gutter mx-auto max-w-[1600px] pb-4 md:hidden">
        <ButtonLink href="/atelier" variant="text" arrow>
          {t.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
