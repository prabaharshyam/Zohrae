"use client";

import { gsap } from "@/lib/motion/gsap";

/** A small burst of glowing fireflies that drift up from a point and fade. */
export function fireflies(x: number, y: number, count = 22) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.className = "firefly-layer";
  document.body.appendChild(layer);
  const tl = gsap.timeline({ onComplete: () => layer.remove() });
  for (let i = 0; i < count; i++) {
    const f = document.createElement("span");
    f.className = "firefly";
    f.style.left = `${x}px`;
    f.style.top = `${y}px`;
    layer.appendChild(f);
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const dist = 80 + Math.random() * 220;
    tl.fromTo(
      f,
      { x: 0, y: 0, scale: 0.4 + Math.random() * 0.8, opacity: 0 },
      {
        x: Math.cos(angle) * dist + (Math.random() - 0.5) * 60,
        y: Math.sin(angle) * dist - 40,
        opacity: 1,
        duration: 1.4 + Math.random() * 1.2,
        ease: "power2.out",
      },
      Math.random() * 0.25,
    ).to(f, { opacity: 0, duration: 0.9, ease: "power1.in" }, ">-0.7");
  }
}

/** A short line of copy in a toast at the bottom of the screen (see Interactions). */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("zohrae:toast", { detail: message }));
}
