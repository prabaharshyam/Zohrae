"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";

let firstLoad = true;

/**
 * Page transitions: every navigation after the first rises in softly while
 * a gold filament sweeps across the top of the screen. The first load is
 * left alone (the intro plays then). Transforms are cleared afterwards so
 * fixed and sticky children behave.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstLoad) {
      firstLoad = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap
      .timeline()
      .fromTo(
        ref.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity" },
      )
      .fromTo(
        sweep.current,
        { scaleX: 0, opacity: 1, transformOrigin: "0% 50%" },
        { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
        0,
      )
      .to(sweep.current, { opacity: 0, duration: 0.4 }, ">-0.1");
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div ref={sweep} aria-hidden className="page-sweep" />
      <div ref={ref}>{children}</div>
    </>
  );
}
