"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";
import { playClick } from "@/lib/light/sound";
import { light } from "@/lib/light/store";
import { fireflies } from "@/lib/delight/fireflies";
import { gsap } from "@/lib/motion/gsap";

/**
 * 404: the room is dark, save for a bare bulb on a brass pull-chain. Pull it
 * (click, or drag it down) and the filament catches, flickers and blooms,
 * and the way home appears.
 */
export function DarkRoom404() {
  const [lit, setLit] = useState(false);
  const chain = useRef<HTMLButtonElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number } | null>(null);

  const pull = () => {
    if (lit) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (light.get().sound) playClick(true);
    if (reduce) return setLit(true);
    gsap
      .timeline({ onComplete: () => setLit(true) })
      .to(chain.current, { y: 26, duration: 0.18, ease: "power2.in" })
      .to(chain.current, { y: 0, duration: 1.2, ease: "elastic.out(1, 0.25)" })
      .fromTo(glow.current, { opacity: 0 }, { opacity: 0.9, duration: 0.06 }, 0.2)
      .to(glow.current, { opacity: 0.15, duration: 0.07 })
      .to(glow.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
    window.setTimeout(() => {
      const r = chain.current?.getBoundingClientRect();
      if (r) fireflies(r.left + r.width / 2, r.top - 120, 16);
    }, 500);
  };

  return (
    <section
      data-header-tone
      className={clsx(
        "relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-[var(--header-h)] transition-colors duration-[1.6s]",
        lit ? "bg-[#1b140f] text-moon" : "bg-night text-moon",
      )}
    >
      {/* The light the bulb throws */}
      <div
        ref={glow}
        aria-hidden
        className={clsx(
          "pointer-events-none absolute left-1/2 top-[28svh] size-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_184_105/0.45),rgb(255_184_105/0.08)_45%,transparent)]",
          !lit && "opacity-0",
        )}
      />
      {/* Cord and bulb */}
      <div className="relative flex flex-col items-center" aria-hidden>
        <span className="block h-[14svh] w-px bg-moon/30" />
        <svg viewBox="0 0 60 90" className="w-16">
          <path d="M22 0h16v10H22z" fill="#8a6a26" />
          <path
            d="M30 10c-16 0-26 12-26 26 0 10 6 17 12 23 4 4 5 8 5 12h18c0-4 1-8 5-12 6-6 12-13 12-23 0-14-10-26-26-26Z"
            fill={lit ? "#ffe6b0" : "#2a221c"}
            stroke={lit ? "#ffd27e" : "#4a3b30"}
            strokeWidth="1.5"
            style={{
              filter: lit ? "drop-shadow(0 0 18px rgb(255 184 105 / 0.9))" : undefined,
              transition: "fill 0.6s",
            }}
          />
          <path
            d="M24 64c0-10 3-18 6-24 3 6 6 14 6 24"
            fill="none"
            stroke={lit ? "#c0823a" : "#4a3b30"}
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <button
        ref={chain}
        type="button"
        onClick={pull}
        onPointerDown={(e) => (drag.current = { y: e.clientY })}
        onPointerMove={(e) => {
          if (drag.current && e.clientY - drag.current.y > 24) {
            drag.current = null;
            pull();
          }
        }}
        onPointerUp={() => (drag.current = null)}
        data-cursor={lit ? undefined : "Pull"}
        aria-label={copy.notFound.pull}
        className="group relative -mt-2 flex flex-col items-center"
      >
        <svg width="10" height="110" viewBox="0 0 10 110" aria-hidden>
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx="5" cy={3 + i * 6} r="1.7" fill="none" stroke="#c0823a" strokeWidth="1" />
          ))}
        </svg>
        <span className="block size-5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7dc9a,#c0823a_60%,#7a4f1e)] shadow-[0_2px_10px_rgb(0_0_0/0.5)] transition-transform group-hover:scale-110" />
        {!lit && <span className="label mt-4 text-[10px] text-moon/60">{copy.notFound.pull}</span>}
      </button>

      <div
        className={clsx(
          "gutter relative mt-10 flex max-w-3xl flex-col items-center text-center transition-[opacity,transform] duration-[1.2s] ease-silk",
          lit ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
        aria-hidden={!lit}
      >
        <p className="label text-moon/60">404</p>
        <h1 className="font-display mt-4 text-[length:var(--fs-h1)]">{copy.notFound.title}</h1>
        <p className="font-display mt-3 text-[length:var(--fs-h3)] italic text-glow">{copy.notFound.body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" arrow>
            {copy.stub.backHome}
          </ButtonLink>
          <ButtonLink href="/light-finder" variant="ghost">
            {copy.home.heroGhostCta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
