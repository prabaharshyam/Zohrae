"use client";

import { copy } from "@/copy/en";
import { lamps } from "@/lib/light/lamps";
import { chimeSound } from "@/lib/sound/ui";
import { fireflies, toast } from "./fireflies";

/** The secret switch: every lamp on the page lights in a wave, fireflies rise, a chime. */
export function celebrate() {
  const ids = [
    ...new Set([...document.querySelectorAll<HTMLElement>("[data-lamp-id]")].map((el) => el.dataset.lampId!)),
  ];
  ids.forEach((id, i) => window.setTimeout(() => lamps.set(id, true, "ignite"), 120 + i * 140));
  for (let i = 0; i < 6; i++) {
    window.setTimeout(
      () =>
        fireflies(
          window.innerWidth * (0.15 + Math.random() * 0.7),
          window.innerHeight * (0.4 + Math.random() * 0.5),
          16,
        ),
      i * 180,
    );
  }
  chimeSound();
  toast(copy.home.easterEgg);
}
