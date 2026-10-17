"use client";

import clsx from "clsx";
import { useSyncExternalStore } from "react";
import { copy } from "@/copy/en";
import { fireflies } from "@/lib/delight/fireflies";
import { lamps } from "@/lib/light/lamps";
import { playClick } from "@/lib/light/sound";
import { light } from "@/lib/light/store";

const subscribe = (cb: () => void) => {
  const a = lamps.subscribe(cb);
  const b = light.subscribe(cb);
  return () => {
    a();
    b();
  };
};

/** "Lights off / on" for one grid of lamps: lights every lamp in it (in a wave, with fireflies), or puts them all out. */
export function LightsPill({ handles }: { handles: string[] }) {
  const key = handles.join(",");
  const allOn = useSyncExternalStore(
    subscribe,
    () => key.split(",").every((h) => lamps.isOn(h)),
    () => false,
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={allOn}
      data-silent
      onClick={(e) => {
        const next = !allOn;
        // A domino: lamps catch one after another across the grid.
        handles.forEach((h, i) => window.setTimeout(() => lamps.set(h, next), i * 110));
        if (light.get().sound) playClick(next);
        if (next) {
          const r = e.currentTarget.getBoundingClientRect();
          fireflies(r.left + r.width / 2, r.top + r.height / 2);
        }
      }}
      className={clsx(
        "label inline-flex h-10 shrink-0 items-center gap-3 whitespace-nowrap rounded-full border px-4 text-[10px] transition-colors duration-500",
        allOn ? "border-glow/60 bg-night text-glow" : "border-line text-fg-muted hover:border-current hover:text-fg",
      )}
    >
      {allOn ? copy.light.gridOn : copy.light.gridOff}
      <span
        aria-hidden
        className={clsx(
          "relative h-4 w-7 rounded-full transition-colors duration-500",
          allOn ? "bg-glow/30" : "bg-[color-mix(in_oklab,currentColor_18%,transparent)]",
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 size-3 rounded-full transition-[left,background-color,box-shadow] duration-500 ease-silk",
            allOn ? "left-3.5 bg-glow shadow-[0_0_10px_rgb(255_184_105/0.8)]" : "left-0.5 bg-current",
          )}
        />
      </span>
    </button>
  );
}
