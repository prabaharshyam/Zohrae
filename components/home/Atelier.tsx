"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/** The signature lamp, told through its own making. */
const LAMP = {
  sketch: "/atelier/aurelia-sketch.webp",
  off: "/products/aurelia/cutout-off.webp",
  on: "/products/aurelia/cutout-on.webp",
  /** The lamp's top and bottom in the cut-out (fractions of height). */
  top: 0.103,
  bottom: 0.896,
};
const LAYERS = 72; // visible print layers as it rises

/**
 * IV · L'Atelier: one lamp, five lives, scrubbed by scroll.
 * I    a pencil drawing of Aurelia sketches itself onto paper;
 * II   the real lamp rises out of the drawing layer by layer under a
 *      glowing nozzle;
 * III  the raw print (matte, grey, ridged) is polished to its finish as a
 *      sheen sweeps across it;
 * IV   the room goes dark and it flickers on;
 * V    it sinks into the keepsake box, the lid comes down, a ribbon and a
 *      handwritten card.
 * Without motion it simply shows the finished lamp beside the five steps.
 */
export function Atelier() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const t = copy.home.atelier;

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root);
      const span = LAMP.bottom - LAMP.top;
      // Print height p (0–1) → clip from the top, rounded to whole layers.
      const printClip = (p: number) => {
        const layered = Math.round(p * LAYERS) / LAYERS;
        return `inset(${((LAMP.top + span * (1 - layered)) * 100).toFixed(2)}% 0% 0% 0%)`;
      };
      const print = { p: 0 };

      gsap.set(q(".a-print"), { clipPath: printClip(0), filter: "grayscale(0.85) contrast(0.82) brightness(1.1)" });
      gsap.set(q(".a-sketch"), { "--draw": 0 });
      gsap.set(q(".a-ridges"), { opacity: 0.5 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 0.7,
          onUpdate: (st) => setStep(Math.min(4, Math.floor(st.progress * 5))),
        },
      });

      // I · Drawn by hand: the pencil drawing appears top to bottom, the pencil riding the line.
      tl.fromTo(
        q(".a-paper"),
        { opacity: 0, rotation: -6, y: 30 },
        { opacity: 1, rotation: -2, y: 0, duration: 0.3, ease: "power2.out" },
        0,
      )
        .to(q(".a-sketch"), { "--draw": 1, duration: 0.8 }, 0.1)
        .fromTo(
          q(".a-pencil"),
          { top: `${LAMP.top * 100}%`, opacity: 1 },
          { top: `${LAMP.bottom * 100}%`, duration: 0.8 },
          0.1,
        )
        .to(q(".a-pencil"), { opacity: 0, duration: 0.1 }, 0.9)

        // II · Printed layer by layer: the real lamp rises out of the drawing under a glowing nozzle.
        .to(
          print,
          {
            p: 1,
            duration: 1,
            onUpdate: () => {
              gsap.set(q(".a-print"), { clipPath: printClip(print.p) });
              gsap.set(q(".a-nozzle"), { top: `${(LAMP.top + span * (1 - print.p)) * 100}%` });
            },
          },
          1,
        )
        .fromTo(q(".a-nozzle"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 1)
        .to(q(".a-nozzle"), { opacity: 0, duration: 0.1 }, 1.95)
        .to(q(".a-sketch"), { opacity: 0.25, duration: 0.6 }, 1.4)

        // III · Finished by hand: matte grey to its true colour, ridges softened, a sheen of polish.
        .to(q(".a-print"), { filter: "grayscale(0) contrast(1) brightness(1)", duration: 0.8 }, 2.05)
        .to(q(".a-ridges"), { opacity: 0, duration: 0.7 }, 2.1)
        .fromTo(q(".a-sheen"), { xPercent: -130 }, { xPercent: 130, duration: 0.8, ease: "power1.inOut" }, 2.1)
        .to([q(".a-paper"), q(".a-sketch")], { opacity: 0, duration: 0.5 }, 2.4)

        // IV · Tested in the dark: it catches, blinks and holds.
        .to(q(".a-lit"), { keyframes: { opacity: [0, 0.9, 0.15, 1] }, duration: 0.5 }, 3.25)
        .to(q(".a-halo"), { opacity: 1, scale: 1, duration: 0.5 }, 3.3)

        // V · Wrapped to be remembered: into the keepsake box, lid down, ribbon and card.
        .to(q(".a-lamp"), { scale: 0.55, transformOrigin: "50% 92%", duration: 0.45, ease: "power2.inOut" }, 4.15)
        .to([q(".a-halo"), q(".a-lit")], { opacity: 0.35, duration: 0.4 }, 4.1)
        .fromTo(q(".a-box"), { yPercent: 110 }, { yPercent: 0, duration: 0.4, ease: "power3.out" }, 4)
        // Solid at once, so the lamp never shows through the box as it rises.
        .set(q(".a-box"), { opacity: 1 }, 4)
        .fromTo(
          q(".a-lid"),
          { yPercent: -260, opacity: 0, rotation: -8 },
          { yPercent: 0, opacity: 1, rotation: 0, duration: 0.45, ease: "power3.inOut" },
          4.45,
        )
        .fromTo(
          q(".a-ribbon"),
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.25, transformOrigin: "50% 0%" },
          4.75,
        )
        .fromTo(
          q(".a-card"),
          { xPercent: 60, rotation: 14, opacity: 0 },
          { xPercent: 0, rotation: -6, opacity: 1, duration: 0.3, ease: "back.out(1.6)" },
          4.75,
        )
        .to({}, { duration: 0.15 });

      // Count-up stats.
      q(".stat-value").forEach((el: Element) => {
        const end = Number((el as HTMLElement).dataset.value);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 95%" },
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        });
      });
    });
  });

  return (
    <section
      ref={ref}
      className={clsx(
        "atelier relative overflow-hidden transition-colors duration-700 ease-silk",
        step === 3 && "is-dark",
      )}
    >
      <div className="gutter mx-auto grid h-svh min-h-[620px] max-w-[1600px] grid-rows-[auto_1fr] gap-6 pt-[calc(var(--header-h)+1.5rem)] pb-6 md:grid-cols-[1fr_1.1fr] md:grid-rows-1 md:items-center md:gap-16 md:pb-0">
        {/* The story */}
        <div className="relative z-10">
          <p className="label text-fg-muted">{t.eyebrow}</p>
          <h2 className="font-display mt-3 text-[length:var(--fs-h2)] leading-[1.02]">{t.title}</h2>

          <div className="mt-8 flex items-start gap-6 md:mt-12">
            {/* Step counter with a filament that fills */}
            <div className="flex flex-col items-center" aria-hidden>
              <span className="font-display text-5xl leading-none md:text-7xl">
                {String(step + 1).padStart(2, "0")}
              </span>
              <span className="label mt-2 text-[10px] text-fg-muted">/ 05</span>
              <span className="relative mt-4 hidden h-28 w-px bg-line md:block">
                <span
                  className="absolute inset-x-0 top-0 bg-ochre shadow-[0_0_8px_rgb(255_184_105/0.8)] transition-[height] duration-500 ease-silk"
                  style={{ height: `${((step + 1) / 5) * 100}%` }}
                />
              </span>
            </div>
            <ol
              className="grid flex-1 [&>*]:[grid-area:1/1] motion-reduce:gap-5 motion-reduce:[&>*]:[grid-area:auto]"
              aria-label="Steps"
            >
              {t.steps.map((s, i) => (
                <li
                  key={s.title}
                  aria-current={i === step ? "step" : undefined}
                  className={clsx(
                    "transition-[opacity,transform,filter] duration-700 ease-silk motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:!blur-none",
                    i === step
                      ? "translate-y-0 opacity-100 blur-0"
                      : i < step
                        ? "-translate-y-4 opacity-0 blur-sm"
                        : "translate-y-6 opacity-0 blur-sm",
                  )}
                >
                  <h3 className="font-display text-[length:var(--fs-h3)] italic">{s.title}</h3>
                  <p className="mt-3 max-w-md text-fg-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <dl className="mt-10 hidden grid-cols-3 gap-6 border-t border-line pt-6 md:grid">
            {t.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display text-3xl">
                    <span className="stat-value" data-value={s.value}>
                      {s.value}
                    </span>
                    {s.suffix}
                  </span>
                  <span className="mt-1 block text-xs text-fg-muted">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/atelier" variant="text" arrow className="mt-6 hidden md:inline-flex">
            {t.cta}
          </ButtonLink>
        </div>

        {/* The stage: one lamp through its five lives */}
        <div
          className="relative mx-auto aspect-[3/4] h-full max-h-[min(80svh,860px)] min-h-0 w-auto max-md:max-h-[48svh] max-md:self-end"
          aria-hidden
        >
          {/* paper, under the sketch */}
          <div className="a-paper absolute inset-[4%] bg-[#f8f3e8] opacity-0 shadow-[0_30px_60px_-30px_rgb(42_29_21/0.45),inset_0_0_0_1px_rgb(42_29_21/0.06)] [background-image:repeating-linear-gradient(0deg,transparent_0_31px,rgb(120_150_190/0.12)_31px_32px)] motion-reduce:hidden" />

          <div className="a-lamp absolute inset-0 origin-[50%_85%]">
            <div className="a-halo absolute -inset-[12%] scale-90 rounded-full bg-[radial-gradient(closest-side,rgb(255_184_105/0.5),rgb(255_184_105/0.14)_50%,transparent)] opacity-0" />
            {/* pencil drawing, revealed top to bottom */}
            <Image
              src={LAMP.sketch}
              alt=""
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="a-sketch object-contain opacity-100 motion-reduce:hidden"
              style={{
                maskImage:
                  "linear-gradient(to bottom, #000 calc(var(--draw, 1) * 100% - 4%), transparent calc(var(--draw, 1) * 100% + 4%))",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 calc(var(--draw, 1) * 100% - 4%), transparent calc(var(--draw, 1) * 100% + 4%))",
              }}
            />
            {/* the printed lamp */}
            <Image
              src={LAMP.off}
              alt=""
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="a-print object-contain"
            />
            {/* fresh print ridges, masked to the lamp */}
            <div
              className="a-ridges absolute inset-0 opacity-0 mix-blend-multiply [background-image:repeating-linear-gradient(0deg,rgb(0_0_0/0.18)_0_1px,transparent_1px_5px)]"
              style={{
                maskImage: `url(${LAMP.off})`,
                WebkitMaskImage: `url(${LAMP.off})`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
            {/* polishing sheen, masked to the lamp */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: `url(${LAMP.off})`,
                WebkitMaskImage: `url(${LAMP.off})`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            >
              <div className="a-sheen absolute inset-y-0 left-0 w-full -translate-x-[130%] bg-[linear-gradient(100deg,transparent_35%,rgb(255_250_235/0.75)_50%,transparent_65%)]" />
            </div>
            {/* lit */}
            <Image
              src={LAMP.on}
              alt=""
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="a-lit object-contain opacity-0 [filter:brightness(1.12)_saturate(1.1)]"
            />
            {/* print nozzle riding the top layer */}
            <div className="a-nozzle absolute inset-x-[12%] opacity-0" style={{ top: `${LAMP.bottom * 100}%` }}>
              <div className="h-[2px] w-full bg-[linear-gradient(90deg,transparent,#ffb869,#fff1cf,#ffb869,transparent)] shadow-[0_0_14px_3px_rgb(255_184_105/0.8)]" />
              <div className="absolute left-1/2 top-0 h-6 w-4 -translate-x-1/2 -translate-y-full rounded-b-sm bg-[linear-gradient(90deg,#8a8f96,#d9dde2,#7a7f86)]" />
            </div>
            {/* pencil riding the line */}
            <div className="a-pencil absolute left-[72%] h-28 w-2.5 -translate-y-full rotate-[28deg] opacity-0">
              <div className="h-full w-full rounded-t-sm bg-[linear-gradient(90deg,#d79a3c,#f2c46b,#c4872f)]" />
              <div className="mx-auto h-3 w-0 border-x-[5px] border-t-[12px] border-x-transparent border-t-[#e9cfa3]" />
            </div>
          </div>

          {/* the keepsake box */}
          <div className="a-box absolute inset-x-[8%] bottom-[4%] h-[50%] opacity-0">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#d39446,#b9772d_70%,#9d6224)] shadow-[0_30px_50px_-20px_rgb(42_29_21/0.6)]" />
            <div className="absolute inset-x-0 top-0 h-[16%] bg-[linear-gradient(180deg,#f4ecdc,#e6d8bd)] [clip-path:polygon(0_100%,6%_0,20%_70%,34%_10%,50%_80%,64%_5%,80%_75%,94%_0,100%_100%)]" />
            <div className="absolute inset-[7%] top-[24%] border border-[#f1d59a]/50" />
            <p className="font-display absolute inset-x-0 bottom-[30%] text-center text-[clamp(14px,2.2vw,30px)] tracking-[0.35em] text-[#fbe7bd]/90">
              ZOHRAÉ
            </p>
          </div>
          <div className="a-lid absolute inset-x-[5%] bottom-[52%] h-[11%] opacity-0">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#e1a454,#c4843a)] shadow-[0_18px_30px_-14px_rgb(42_29_21/0.6)]" />
            <div className="absolute inset-[10%] border border-[#f6dca6]/60" />
          </div>
          <div className="a-ribbon absolute bottom-[4%] left-1/2 h-[59%] w-[5%] -translate-x-1/2 bg-[linear-gradient(90deg,#b08a3a,#f0d48a,#a8822f)] opacity-0 shadow-sm" />
          <div className="a-card absolute bottom-[8%] left-[-4%] w-[36%] rotate-[-6deg] bg-[#fdfaf3] p-[3%] opacity-0 shadow-[0_14px_30px_-12px_rgb(42_29_21/0.45)]">
            <p className="font-[family-name:var(--font-pinyon)] text-[clamp(14px,2vw,26px)] leading-tight text-[#5a4630]">
              Made for you, by hand.
            </p>
            <p className="label mt-2 text-[8px] text-[#8a7458]">No. 07 · Aurelia</p>
          </div>
        </div>
      </div>
    </section>
  );
}
