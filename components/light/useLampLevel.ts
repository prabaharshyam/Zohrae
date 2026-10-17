"use client";

import { useEffect } from "react";
import { BZZ_MS, bzz, fadeOut, filament, IGNITION_MS, ignition } from "@/lib/light/filament";
import { lamps } from "@/lib/light/lamps";
import { light } from "@/lib/light/store";

/** Small stable hash so each lamp warms up at its own speed. */
function seed(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return (((Math.sin(r.left * 12.9898 + r.top * 78.233) * 43758.5453) % 1) + 1) % 1;
}

/**
 * Drives an element's --lamp variable (0–1) for one lamp.
 * - Page loads apply the state instantly.
 * - The room switch: filament warm-up, delayed by distance from the switch.
 * - The lamp's own switch (or its first-sight ignition): catch, blink, hold.
 * - Off: a short ember fade.
 * - While lit and on screen, now and then a short bzz (idle life).
 * Lamps that should be lit but are off-screen wait dark and light on arrival;
 * reduced-motion visitors skip the animation.
 */
export function useLampLevel(ref: React.RefObject<HTMLElement | null>, enabled: boolean, id?: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    let timer = 0;
    let idleTimer = 0;
    let on = lamps.isOn(id);
    let level = on ? 1 : 0;
    const write = (v: number) => {
      level = v;
      el.style.setProperty("--lamp", v.toFixed(3));
    };
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const visible = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    };
    // A lit lamp that's still below the fold waits in the dark and switches on
    // as it scrolls into view, so even with the room lights on, lamps light up as you go.
    let waiting = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || !waiting) return;
        waiting = false;
        if (on) window.setTimeout(() => on && run(ignition, IGNITION_MS), 120 + seed(el) * 260);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const wait = () => {
      waiting = true;
      write(0);
    };
    if (on && !visible() && !reduced()) wait();
    else write(level);
    const run = (fn: (t: number) => number, duration: number) => {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const step = (now: number) => {
        write(fn(now - t0));
        if (now - t0 < duration) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const armIdle = () => {
      clearTimeout(idleTimer);
      if (!on || reduced()) return;
      idleTimer = window.setTimeout(
        () => {
          if (on && visible() && !document.hidden) run(bzz, BZZ_MS);
          armIdle();
        },
        15000 + Math.random() * 10000,
      );
    };
    armIdle();

    const unsubscribe = lamps.subscribe(() => {
      const next = lamps.isOn(id);
      if (next === on) return;
      on = next;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      armIdle();
      if (reduced()) return write(on ? 1 : 0);
      if (!visible()) return on ? wait() : ((waiting = false), write(0));
      const { cause } = lamps.last();
      if (!on) {
        const from = level;
        return run((t) => from * fadeOut(t, 280), 280);
      }
      if (cause !== "room") return run(ignition, IGNITION_MS);
      const rect = el.getBoundingClientRect();
      const c = light.switchCentre();
      const dist = Math.hypot(rect.left + rect.width / 2 - c.x, rect.top + rect.height / 2 - c.y);
      const delay = 60 + Math.min(500, dist * 0.35);
      const duration = 380 + seed(el) * 320;
      timer = window.setTimeout(() => run((t) => filament(t, duration), duration), delay);
    });

    return () => {
      unsubscribe();
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      clearTimeout(idleTimer);
    };
  }, [ref, enabled, id]);
}
