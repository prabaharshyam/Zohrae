"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

const SCENE = {
  off: {
    url: "/scenes/living-off.webp",
    alt: "A calm living room in flat daylight, a Zohraé lamp switched off on a mirrored side table",
  },
  on: { url: "/scenes/living-on.webp", alt: "The same living room at dusk, lit by the glowing Zohraé lamp" },
};

/**
 * III · Why light is the ultimate luxury. Pinned; scrolling turns a real
 * room from flat daylight to evening lamplight (a matched photo pair) while
 * three short beats of copy play out.
 */
export function WhyLight() {
  const ref = useRef<HTMLElement>(null);
  const t = copy.home.why;

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const beats = gsap.utils.toArray<HTMLElement>(".why-beat", root);
      gsap.set(beats, { opacity: 0, y: 30 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "+=260%", pin: true, scrub: 0.8 },
      });
      tl.to(".why-on", { opacity: 1, duration: 3 }, 0.4)
        .to(".why-scene", { scale: 1.06, duration: 4 }, 0)
        .to(beats[0], { opacity: 1, y: 0, duration: 0.5 }, 0.1)
        .to(beats[0], { opacity: 0, y: -30, duration: 0.4 }, 1.2)
        .to(beats[1], { opacity: 1, y: 0, duration: 0.5 }, 1.5)
        .to(beats[1], { opacity: 0, y: -30, duration: 0.4 }, 2.6)
        .to(beats[2], { opacity: 1, y: 0, duration: 0.5 }, 2.9)
        .to(".why-cta", { opacity: 1, y: 0, duration: 0.4 }, 3.3);
      gsap.set(".why-cta", { opacity: 0, y: 20 });
    });
  });

  return (
    <section ref={ref} className="dark-band relative overflow-hidden bg-night text-moon">
      <div className="relative h-svh min-h-[560px]">
        <div className="why-scene absolute inset-0">
          <Image
            src={SCENE.off.url}
            alt={SCENE.off.alt}
            fill
            sizes="100vw"
            className="object-cover object-[72%_50%] md:object-center"
          />
          <Image
            src={SCENE.on.url}
            alt=""
            fill
            sizes="100vw"
            className="why-on object-cover object-[72%_50%] opacity-0 motion-reduce:opacity-100 md:object-center"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(14_11_9/0.92)_0%,rgb(14_11_9/0.35)_45%,transparent_70%)] md:bg-[linear-gradient(to_right,rgb(14_11_9/0.9)_0%,rgb(14_11_9/0.55)_34%,transparent_62%)]"
        />

        <div className="gutter relative mx-auto flex h-full max-w-[1600px] flex-col justify-end pb-16 md:justify-center md:pb-0">
          <p className="label text-moon/70">{t.eyebrow}</p>
          <div className="mt-6 grid max-w-xl [&>*]:[grid-area:1/1] motion-reduce:gap-8 motion-reduce:[&>*]:[grid-area:auto]">
            {t.beats.map((b) => (
              <div key={b.title} className="why-beat">
                <h2 className="font-display text-[length:var(--fs-h2)] leading-[1.02]">{b.title}</h2>
                <p className="mt-5 max-w-md text-moon/75">{b.body}</p>
              </div>
            ))}
          </div>
          <div className="why-cta mt-10">
            <ButtonLink href="/collections/lumiere" arrow>
              {t.cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
