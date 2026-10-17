"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "./gsap";

/** Media conditions shared by every animated section. */
export const MQ = {
  /** Any motion at all. */
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
} as const;

/**
 * Sets up GSAP animations scoped to an element, inside gsap.matchMedia so
 * each breakpoint and the reduced-motion preference get their own setup,
 * and everything is reverted on unmount or when deps change.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia, root: HTMLElement) => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    setup(mm, root);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callers pass their own deps
  }, deps);
}
