"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion/gsap";
import { hoverSound, tapSound } from "@/lib/sound/ui";

const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, summary, [data-cursor]";

/**
 * The site's delight layer, delegated from the document:
 * - a custom cursor (fine pointers only): a dot, and a ring that swells over
 *   anything interactive and shows the element's data-cursor label;
 * - magnetic pull on [data-magnetic] elements;
 * - hover and press sounds, when the visitor chose sound.
 */
export function Interactions() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Toasts: a short line, a few seconds, then gone.
  useEffect(() => {
    let t = 0;
    const show = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = window.setTimeout(() => setMessage(null), 3200);
    };
    window.addEventListener("zohrae:toast", show);
    return () => {
      window.removeEventListener("zohrae:toast", show);
      clearTimeout(t);
    };
  }, []);

  // Sounds work everywhere, including touch.
  useEffect(() => {
    let current: Element | null = null;
    const over = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.(INTERACTIVE) ?? null;
      if (el && el !== current && e.pointerType === "mouse") hoverSound();
      current = el;
    };
    const down = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.(INTERACTIVE);
      if (el && !el.closest("[data-silent]")) tapSound();
    };
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
    };
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    let magnet: HTMLElement | null = null;
    const release = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      magnet = null;
    };

    const move = (e: PointerEvent) => {
      root.classList.remove("cursor-away");
      dx(e.clientX);
      dy(e.clientY);
      const target = e.target as Element;
      const m = target.closest?.<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        gsap.to(m, { x: (e.clientX - cx) * 0.3, y: (e.clientY - cy) * 0.4, duration: 0.4, ease: "power3.out" });
        // The ring hugs the magnet.
        rx(cx + (e.clientX - cx) * 0.15);
        ry(cy + (e.clientY - cy) * 0.15);
      } else {
        rx(e.clientX);
        ry(e.clientY);
      }

      const el = target.closest?.<HTMLElement>(INTERACTIVE);
      const text = target.closest?.<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      root.classList.toggle("cursor-hover", Boolean(el));
      root.classList.toggle("cursor-label", Boolean(text));
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
    };
    const leave = () => {
      root.classList.add("cursor-away");
      release();
    };
    const down = () => root.classList.add("cursor-down");
    const up = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-cursor", "cursor-hover", "cursor-label", "cursor-down");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <p role="status" aria-live="polite" className={message ? "toast" : "sr-only"}>
        {message}
      </p>
      <div aria-hidden className="cursor-layer">
        <div ref={ring} className="cursor-ring">
          <span ref={label} className="cursor-text label" />
        </div>
        <div ref={dot} className="cursor-dot" />
      </div>
    </>
  );
}
