"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

const AtelierScene = dynamic(() => import("./AtelierScene"), { ssr: false });
const ROMAN = ["I", "II", "III", "IV", "V"];

function canUse3d() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * IV · L'Atelier. Pinned; scrolling walks through five steps while a 3D
 * lamp is sketched, printed layer by layer, finished, lit and boxed.
 * Reduced motion or no WebGL: the owner's studio photograph instead.
 */
export function Atelier({ poster }: { poster: { url: string; alt: string } }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  const [threeD, setThreeD] = useState<boolean | null>(null);
  const [active, setActive] = useState(false);
  const t = copy.home.atelier;

  // Decide on 3D after mount, and only render frames while the section is near the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok = canUse3d();
    const io = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting);
        if (e.isIntersecting) setThreeD((v) => v ?? ok);
      },
      { rootMargin: "120% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=380%",
          pin: true,
          scrub: true,
          onUpdate: (st) => {
            progress.current = st.progress;
            setStep(Math.min(4, Math.floor(st.progress * 5)));
          },
        },
      });
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
        </div>

        <div className="relative min-h-0 md:order-2 md:h-[78svh]">
          {threeD ? (
            <AtelierScene progress={progress} active={active} />
          ) : (
            threeD === false && (
              <Image
                src={poster.url}
                alt={poster.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="on-white object-contain"
              />
            )
          )}
        </div>

        <dl className="grid grid-cols-3 gap-4 border-t border-line pt-4 md:absolute md:inset-x-[var(--gutter)] md:bottom-8 md:pt-6">
          {t.stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-3xl md:text-5xl">
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
      <div className="gutter mx-auto max-w-[1600px] pb-4 md:hidden">
        <ButtonLink href="/atelier" variant="text" arrow>
          {t.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
