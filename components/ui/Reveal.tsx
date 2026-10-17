"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/motion/gsap";
import { MQ, useGsap } from "@/lib/motion/useGsap";

/**
 * Children marked .reveal-item rise in, staggered, as the block enters the
 * viewport. Content is fully visible without JS and with reduced motion.
 */
export function Reveal({
  children,
  className,
  stagger = 0.09,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, (mm, root) => {
    mm.add(MQ.motion, () => {
      gsap.from(root.querySelectorAll(".reveal-item"), {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
    });
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
