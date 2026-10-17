"use client";

import { light } from "@/lib/light/store";

/**
 * Interface sounds, synthesised with Web Audio (nothing to download).
 * Silent unless the visitor chose sound (the intro's "Enter with sound",
 * or the footer toggle). All very quiet: felt more than heard.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let lastHover = 0;

function audio() {
  if (!light.get().sound) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    if (!master) {
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
    }
    return { ctx, out: master };
  } catch {
    return null;
  }
}

/** A glassy, high "tink" for hovering links and buttons. */
export function hoverSound() {
  const now = performance.now();
  if (now - lastHover < 70) return; // sweeping across a menu shouldn't rattle
  lastHover = now;
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  const osc = a.ctx.createOscillator();
  const gain = a.ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1760 + Math.random() * 220, t);
  osc.frequency.exponentialRampToValueAtTime(1320, t + 0.09);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.05, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  osc.connect(gain).connect(a.out);
  osc.start(t);
  osc.stop(t + 0.18);
}

/** A soft wooden "tock" for presses. */
export function tapSound() {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  const osc = a.ctx.createOscillator();
  const gain = a.ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.16, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  osc.connect(gain).connect(a.out);
  osc.start(t);
  osc.stop(t + 0.16);
}

/** A breathy filtered-noise sweep for chapter changes. */
export function whooshSound() {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  const len = 0.7;
  const buffer = a.ctx.createBuffer(1, Math.ceil(a.ctx.sampleRate * len), a.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = a.ctx.createBufferSource();
  src.buffer = buffer;
  const filter = a.ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.8;
  filter.frequency.setValueAtTime(300, t);
  filter.frequency.exponentialRampToValueAtTime(2400, t + len * 0.6);
  const gain = a.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.06, t + len * 0.35);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(filter).connect(gain).connect(a.out);
  src.start(t);
}

/** A warm two-note chime: entering the site with sound on. */
export function chimeSound() {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime;
  [523.25, 783.99].forEach((f, i) => {
    const osc = a.ctx.createOscillator();
    const gain = a.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    const s = t + i * 0.12;
    gain.gain.setValueAtTime(0.0001, s);
    gain.gain.exponentialRampToValueAtTime(0.08, s + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, s + 1.2);
    osc.connect(gain).connect(a.out);
    osc.start(s);
    osc.stop(s + 1.3);
  });
}
