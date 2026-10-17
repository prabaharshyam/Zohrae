"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/lib/commerce/types";
import { LitImage } from "@/components/light/LitImage";

type Props = {
  title: string;
  off?: ImageAsset;
  on?: ImageAsset;
  sizes: string;
  priority?: boolean;
  frameClassName?: string;
  className?: string;
  lampId?: string;
  ignite?: boolean;
  /** Max turn toward the cursor, in radians. */
  turn?: number;
};

/**
 * A real photograph that turns in 3D with the cursor and with scroll.
 *
 * The cut-out's silhouette is read row by row and treated as a surface of
 * revolution (every row a circle of the silhouette's width), which gives a
 * depth map for a finely tessellated plane. The lamp-off and lamp-on photos
 * share that geometry, so the light switch still crossfades them mid-turn.
 *
 * The LitImage underneath is the server-rendered fallback (no WebGL, reduced
 * motion) and keeps driving --lamp, which the shader reads every frame.
 */
export function DepthTurn({ turn = 0.42, className, ...lit }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !lit.off) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stage: Awaited<ReturnType<typeof import("./depth-stage").createDepthStage>> | null = null;
    let cancelled = false;

    const io = new IntersectionObserver(
      async ([e]) => {
        if (e.isIntersecting && !stage) {
          const { createDepthStage } = await import("./depth-stage");
          if (cancelled || stage) return;
          stage = await createDepthStage(el, { off: lit.off!.url, on: lit.on?.url, turn });
          if (cancelled) return stage?.dispose();
          if (stage) setReady(true);
        } else if (!e.isIntersecting && stage) {
          // Free the WebGL context when far away: browsers cap live contexts.
          stage.dispose();
          stage = null;
          setReady(false);
        }
      },
      { rootMargin: "60% 60%" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      stage?.dispose();
    };
  }, [lit.off, lit.on, turn]);

  return (
    <div ref={wrap} className={clsx("depth-turn relative", ready && "is-ready", className)}>
      <LitImage {...lit} />
    </div>
  );
}
