"use client";

import { ArrowIcon } from "@/components/ui/icons";
import { copy } from "@/copy/en";
import { useLenis } from "@/lib/motion/SmoothScroll";

/** A small round button at the foot of the page that glides back to the top. */
export function BackToTop() {
  const lenis = useLenis();
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) lenis.scrollTo(0, { duration: 1.6, immediate: reduce });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Hand focus back to the top of the page for keyboard users.
    document.querySelector<HTMLElement>("#main, main")?.focus({ preventScroll: true });
  };
  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={copy.footer.backToTop}
      title={copy.footer.backToTop}
      className="group grid size-11 place-items-center rounded-full border border-line text-fg-muted transition-colors duration-500 hover:border-accent-text hover:text-accent-text"
    >
      <ArrowIcon className="-rotate-90 transition-transform duration-500 ease-silk group-hover:-translate-y-0.5" />
    </button>
  );
}
