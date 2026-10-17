"use client";

import { useRef } from "react";
import { WORDMARK_ACCENT, WORDMARK_GLYPHS, WORDMARK_VIEWBOX } from "@/components/brand/wordmark-paths";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

const [VX, VY, VW, VH] = WORDMARK_VIEWBOX.split(" ").map(Number);

/**
 * The big wordmark at the very end of the page. As you arrive it fills with
 * gold light from the bottom; once full, a slow band of light sweeps across
 * the letters now and then, a warm glow follows the cursor over them, and
 * the accent of the É gives a little bob.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      const fill = root.querySelector(".wordmark-fill");
      const shine = root.querySelector(".wordmark-shine");
      const accent = root.querySelector(".wordmark-accent");
      const sweep = gsap
        .timeline({ paused: true, repeat: -1, repeatDelay: 3.5 })
        .fromTo(shine, { attr: { x: VX - 420 } }, { attr: { x: VX + VW + 120 }, duration: 2.4, ease: "power2.inOut" })
        .fromTo(accent, { y: 0 }, { y: -10, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.out" }, 1.9);

      gsap.fromTo(
        fill,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "max", // full exactly at the end of the page
            scrub: 0.6,
            // Measured after the pinned chapters above have taken their space.
            refreshPriority: -1,
            invalidateOnRefresh: true,
            onUpdate: (st) => (st.progress > 0.98 ? sweep.play() : sweep.pause(0)),
          },
        },
      );

      // A warm glow follows the cursor across the letters.
      const glow = root.querySelector<SVGCircleElement>(".wordmark-glow")!;
      const pos = { x: VX + VW / 2, y: VY + VH / 2 };
      const follow = () => (glow.setAttribute("cx", String(pos.x)), glow.setAttribute("cy", String(pos.y)));
      const move = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        gsap.to(pos, {
          x: VX + ((e.clientX - r.left) / r.width) * VW,
          y: VY + ((e.clientY - r.top) / r.height) * VH,
          duration: 0.6,
          ease: "power3.out",
          overwrite: true,
          onUpdate: follow,
        });
        gsap.to(glow, { attr: { r: 260 }, opacity: 1, duration: 0.5, overwrite: "auto" });
      };
      const leave = () => gsap.to(glow, { opacity: 0, duration: 0.8 });
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      return () => {
        sweep.kill();
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      };
    });
  });

  const glyphs = Object.values(WORDMARK_GLYPHS).map((d, i) => <path key={i} d={d} fillRule="evenodd" />);

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
        <g style={{ vectorEffect: "non-scaling-stroke" }}>
          {glyphs}
          <path d={WORDMARK_ACCENT} />
        </g>
      </svg>
      <svg
        viewBox={WORDMARK_VIEWBOX}
        className="wordmark-fill absolute inset-0 w-full overflow-visible motion-reduce:[clip-path:none]"
      >
        <defs>
          <linearGradient id="wordmark-gold" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffb869" />
            <stop offset="0.6" stopColor="#c0823a" />
            <stop offset="1" stopColor="#e8d3a8" />
          </linearGradient>
          <linearGradient id="wordmark-shine-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff6e0" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff6e0" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff6e0" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="wordmark-glow-g">
            <stop offset="0" stopColor="#fff1cf" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffb869" stopOpacity="0" />
          </radialGradient>
          <clipPath id="wordmark-letters">
            {Object.values(WORDMARK_GLYPHS).map((d, i) => (
              <path key={i} d={d} clipRule="evenodd" />
            ))}
          </clipPath>
        </defs>
        <g fill="url(#wordmark-gold)">{glyphs}</g>
        <path className="wordmark-accent" d={WORDMARK_ACCENT} fill="url(#wordmark-gold)" />
        <g clipPath="url(#wordmark-letters)" style={{ mixBlendMode: "screen" }}>
          <rect
            className="wordmark-shine"
            x={VX - 420}
            y={VY}
            width="300"
            height={VH}
            fill="url(#wordmark-shine-g)"
            transform="skewX(-18)"
          />
          <circle
            className="wordmark-glow"
            cx={VX + VW / 2}
            cy={VY + VH / 2}
            r="0"
            fill="url(#wordmark-glow-g)"
            opacity="0"
          />
        </g>
      </svg>
    </div>
  );
}
