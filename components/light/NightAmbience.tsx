"use client";

import { useEffect, useRef } from "react";
import { useLight } from "@/lib/light/store";

/**
 * Atmosphere that only exists with the lights on: a soft vignette, a warm
 * torch-like glow following the cursor (desktop), and dust motes drifting in
 * the light of lamps on screen. Motion is skipped for reduced-motion visitors
 * and on low-power devices.
 */
export function NightAmbience() {
  const { on } = useLight();
  return (
    <>
      <div className="night-vignette" aria-hidden />
      {on && <CursorLight />}
      {on && <DustMotes />}
    </>
  );
}

function prefersCalm() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 3;
}

function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || prefersCalm()) return;
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
        el.style.opacity = "1";
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 size-[600px] opacity-0 mix-blend-screen transition-opacity duration-700"
      style={{
        background: "radial-gradient(circle, rgb(var(--glow-rgb) / calc(0.1 * var(--dim))), transparent 60%)",
      }}
    />
  );
}

type Mote = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number };

function DustMotes() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersCalm()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let sources: { x: number; y: number; r: number }[] = [];
    let rgb = ["255", "167", "87"];
    const motes: Mote[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    // Where the light is: glowing lamps currently on screen.
    const findSources = () => {
      rgb = (getComputedStyle(document.documentElement).getPropertyValue("--glow-rgb").trim() || "255 167 87").split(
        /\s+/,
      );
      sources = [];
      document.querySelectorAll<HTMLElement>(".lamp[style*='--ox']").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const ox = parseFloat(el.style.getPropertyValue("--ox")) / 100;
        const oy = parseFloat(el.style.getPropertyValue("--oy")) / 100;
        sources.push({ x: rect.left + rect.width * ox, y: rect.top + rect.height * oy, r: rect.width * 0.55 });
      });
    };
    const spawn = (): Mote | null => {
      if (!sources.length) return null;
      const s = sources[Math.floor(Math.random() * sources.length)];
      const a = Math.random() * Math.PI * 2;
      const d = Math.sqrt(Math.random()) * s.r;
      return {
        x: s.x + Math.cos(a) * d,
        y: s.y + Math.sin(a) * d * 0.8,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.04 - Math.random() * 0.1,
        r: 0.6 + Math.random() * 1.3,
        life: 0,
        max: 240 + Math.random() * 360,
      };
    };

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      while (motes.length < Math.min(60, sources.length * 14)) {
        const m = spawn();
        if (!m) break;
        motes.push(m);
      }
      const [r, g, b] = rgb;
      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.life++;
        m.x += m.vx + Math.sin((m.life + i * 13) / 60) * 0.05;
        m.y += m.vy;
        const t = m.life / m.max;
        const alpha = Math.sin(Math.PI * t) * 0.55;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
        if (m.life >= m.max) motes.splice(i, 1);
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    findSources();
    const interval = window.setInterval(findSources, 800);
    const onScroll = () => findSources();
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-30 size-full mix-blend-screen" />;
}
