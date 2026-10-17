"use client";

import { useEffect } from "react";
import { fadeOut, filament } from "@/lib/light/filament";
import { light } from "@/lib/light/store";

/** Small stable hash so each lamp warms up at its own speed. */
function seed(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return (((Math.sin(r.left * 12.9898 + r.top * 78.233) * 43758.5453) % 1) + 1) % 1;
}

/**
 * Drives an element's --lamp variable (0–1). Page loads apply the saved state
 * instantly; switch flips animate: on = filament warm-up with one flicker,
 * delayed by distance from the switch; off = a short fade. Off-screen lamps
 * and reduced-motion visitors skip the animation.
 */
export function useLampLevel(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let timer = 0;
    let level = light.get().on ? 1 : 0;
    let flips = light.get().flips;
    const write = (v: number) => {
      level = v;
      el.style.setProperty("--lamp", v.toFixed(3));
    };
    write(level);

    const unsubscribe = light.subscribe(() => {
      const s = light.get();
      if (s.flips === flips) return;
      flips = s.flips;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      const target = s.on ? 1 : 0;
      const rect = el.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!visible || reduced) return write(target);

      const run = (fn: (t: number) => number, duration: number) => {
        const t0 = performance.now();
        const step = (now: number) => {
          write(fn(now - t0));
          if (now - t0 < duration) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      };

      if (target === 1) {
        const c = light.switchCentre();
        const dist = Math.hypot(rect.left + rect.width / 2 - c.x, rect.top + rect.height / 2 - c.y);
        const delay = 60 + Math.min(500, dist * 0.35);
        const duration = 380 + seed(el) * 320;
        timer = window.setTimeout(() => run((t) => filament(t, duration), duration), delay);
      } else {
        const from = level;
        run((t) => from * fadeOut(t, 280), 280);
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [ref, enabled]);
}
