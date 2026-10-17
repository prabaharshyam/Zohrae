"use client";

import { useRef } from "react";
import { WORDMARK_ACCENT, WORDMARK_GLYPHS, WORDMARK_VIEWBOX } from "@/components/brand/wordmark-paths";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/** The big outline wordmark; it fills with gold light from the bottom as you reach the end of the page. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        root.querySelector(".wordmark-fill"),
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 95%", end: "bottom bottom", scrub: 0.5 },
        },
      );
    });
  });

  const paths = (
    <>
      {Object.values(WORDMARK_GLYPHS).map((d, i) => (
        <path key={i} d={d} fillRule="evenodd" />
      ))}
      <path d={WORDMARK_ACCENT} />
    </>
  );

  return (
    <div ref={ref} className="relative" aria-hidden>
      <svg
        viewBox={WORDMARK_VIEWBOX}
        className="w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        opacity={0.35}
      >
        <g style={{ vectorEffect: "non-scaling-stroke" }}>{paths}</g>
      </svg>
      <svg viewBox={WORDMARK_VIEWBOX} className="wordmark-fill absolute inset-0 w-full motion-reduce:[clip-path:none]">
        <defs>
          <linearGradient id="wordmark-gold" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffb869" />
            <stop offset="0.6" stopColor="#c0823a" />
            <stop offset="1" stopColor="#e8d3a8" />
          </linearGradient>
        </defs>
        <g fill="url(#wordmark-gold)">{paths}</g>
      </svg>
    </div>
  );
}
