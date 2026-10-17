"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import type { Product } from "@/lib/commerce/types";
import { fireflies } from "@/lib/delight/fireflies";
import { formatPrice } from "@/lib/format";
import { gsap } from "@/lib/motion/gsap";
import { tapSound, whooshSound } from "@/lib/sound/ui";

type Answer = string;
const Q = copy.finder.questions;

/**
 * How each lamp scores against each answer (0–3). A lamp missing from the
 * map (a new arrival) still takes part, scored on price alone.
 */
const PROFILE: Record<string, Record<string, number>> = {
  aurelia: { living: 3, bedroom: 2, cosy: 3, classic: 3, organic: 2, side: 3, console: 2 },
  sora: { bedroom: 2, study: 2, sculptural: 3, modern: 3, shelf: 3, side: 2 },
  nuvola: { living: 3, study: 2, cosy: 2, playful: 3, modern: 2, side: 3 },
  onda: { bedroom: 3, living: 2, soft: 3, organic: 3, shelf: 2, side: 3 },
  ballerina: { bedroom: 3, living: 2, soft: 3, romantic: 3, playful: 2, side: 2, console: 2 },
  rosalie: { bedroom: 3, soft: 2, sculptural: 3, romantic: 3, classic: 2, side: 3 },
  colonna: { study: 3, console: 3, architectural: 3, modern: 3, side: 2 },
  coquille: { bedroom: 3, soft: 3, romantic: 2, classic: 2, organic: 2, shelf: 3, side: 2 },
};

/** Four questions, then three lamps: one in the spotlight, two to consider. */
export function LightFinder({ lamps }: { lamps: Product[] }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const step = answers.length;
  const done = step >= Q.length;

  const transition = (fn: () => void) => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return fn();
    gsap.to(el, {
      opacity: 0,
      y: -24,
      rotationX: 12,
      transformPerspective: 900,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        fn();
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, rotationX: -12 },
          { opacity: 1, y: 0, rotationX: 0, duration: 0.7, ease: "expo.out" },
        );
      },
    });
  };

  const choose = (id: string, e: React.MouseEvent) => {
    tapSound();
    if (step === Q.length - 1) {
      whooshSound();
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      fireflies(r.left + r.width / 2, r.top + r.height / 2, 18);
    }
    transition(() => setAnswers((a) => [...a, id]));
  };

  const ranked = done ? rank(lamps, answers) : [];

  return (
    <div className="gutter mx-auto min-h-[100svh] max-w-[1200px] pt-[calc(var(--header-h)+8vh)] pb-24">
      <div className="flex items-center gap-3" aria-hidden>
        {Q.map((_, i) => (
          <span
            key={i}
            className={clsx(
              "h-0.5 flex-1 rounded-full transition-colors duration-500",
              i < step ? "bg-ochre shadow-[0_0_8px_rgb(255_184_105/0.7)]" : "bg-line",
            )}
          />
        ))}
      </div>

      <div ref={stage} className="mt-12">
        {!done ? (
          <fieldset key={step}>
            <legend className="w-full">
              <span className="label text-fg-muted">{copy.finder.step(step + 1, Q.length)}</span>
              <span className="font-display mt-4 block text-[length:var(--fs-h1)] leading-[1.02]">{Q[step].title}</span>
            </legend>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {Q[step].options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  data-tilt
                  onClick={(e) => choose(o.id, e)}
                  className="group relative flex min-h-28 flex-col justify-between overflow-hidden border border-line p-6 text-left transition-colors duration-500 hover:border-ochre"
                >
                  <span className="font-display text-3xl">{o.label}</span>
                  <span className="mt-3 text-sm text-fg-muted">{o.hint}</span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(closest-side,rgb(255_184_105/0.35),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={() => transition(() => setAnswers((a) => a.slice(0, -1)))}
                className="label mt-10 text-[10px] text-fg-muted hover:text-fg"
              >
                ← {copy.finder.back}
              </button>
            )}
          </fieldset>
        ) : (
          <Results ranked={ranked} answers={answers} onRestart={() => transition(() => setAnswers([]))} />
        )}
      </div>
    </div>
  );
}

function rank(lamps: Product[], answers: Answer[]) {
  const [, , , budget] = answers;
  const cap = budget === "under4" ? 4000 : budget === "under5" ? 5000 : Infinity;
  return lamps
    .map((p) => {
      const prof = PROFILE[p.handle] ?? {};
      let score = answers.reduce((s, a) => s + (prof[a] ?? 0), 0);
      if (p.priceRange.min.amount > cap) score -= 4;
      if (p.imageOn) score += 0.5; // a lamp you can see lit wins ties
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.p);
}

function Results({ ranked, answers, onRestart }: { ranked: Product[]; answers: Answer[]; onRestart: () => void }) {
  const [winner, ...others] = ranked;
  const card = useRef<HTMLDivElement>(null);
  const t = copy.finder;
  const why = answers
    .slice(0, 3)
    .map((a, i) => Q[i].options.find((o) => o.id === a)?.because)
    .filter(Boolean)
    .join(" ");

  // The winner turns over like a card, then lights itself.
  const flip = (el: HTMLDivElement | null) => {
    card.current = el;
    if (!el || el.dataset.flipped || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.flipped = "1";
    gsap.fromTo(
      el,
      { rotationY: -160, opacity: 0, transformPerspective: 1200 },
      { rotationY: 0, opacity: 1, duration: 1.6, ease: "expo.out", delay: 0.2 },
    );
  };

  if (!winner) return null;
  return (
    <div>
      <p className="label text-fg-muted">{t.resultEyebrow}</p>
      <div className="mt-6 grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
        <div ref={flip} className="on-night relative overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
          <ProductImage product={winner} sizes="(min-width: 768px) 45vw, 100vw" ignite />
        </div>
        <div>
          <h2 data-no-reveal className="font-display text-[length:var(--fs-h1)] leading-none">
            {t.resultTitle(winner.title)}
          </h2>
          <p className="font-display mt-4 text-xl italic text-fg-muted">{winner.tagline}</p>
          <p className="mt-6 max-w-md">{why}</p>
          <p className="mt-6 text-xl">{formatPrice(winner.priceRange.min)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/products/${winner.handle}`} arrow>
              {t.meet(winner.title)}
            </ButtonLink>
            <button
              type="button"
              onClick={onRestart}
              className="label h-12 border border-current/40 px-7 text-[11px] hover:border-current md:h-14"
            >
              {t.again}
            </button>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section className="mt-24">
          <h3 className="label text-fg-muted">{t.alsoTitle}</h3>
          <div className="mt-6 grid grid-cols-2 gap-6 md:gap-10">
            {others.map((p) => (
              <Link key={p.handle} href={`/products/${p.handle}`} className="group block" data-cursor="View">
                <ProductImage product={p} sizes="(min-width: 768px) 30vw, 50vw" />
                <span className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-2xl">{p.title}</span>
                  <span className="text-sm">{formatPrice(p.priceRange.min)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
