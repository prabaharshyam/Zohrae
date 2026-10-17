"use client";

import clsx from "clsx";
import { HeartIcon } from "@/components/ui/icons";
import { copy } from "@/copy/en";
import { fireflies } from "@/lib/delight/fireflies";
import { gsap } from "@/lib/motion/gsap";
import { useWishlist, wishlist } from "@/lib/wishlist/store";

/** Save to (or remove from) the Dream Room. A small pop and a few sparks when saved. */
export function HeartButton({ handle, title, className }: { handle: string; title: string; className?: string }) {
  const saved = useWishlist().includes(handle);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? copy.dreamRoom.saved : copy.dreamRoom.save}: ${title}`}
      data-silent
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = wishlist.toggle(handle);
        const el = e.currentTarget;
        gsap.fromTo(el, { scale: 0.8 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        if (now) {
          const r = el.getBoundingClientRect();
          fireflies(r.left + r.width / 2, r.top + r.height / 2, 10);
        }
      }}
      className={clsx(
        "grid place-items-center transition-colors",
        saved ? "text-ochre [&_path]:fill-current" : "hover:text-accent-text",
        className,
      )}
    >
      <HeartIcon />
    </button>
  );
}
