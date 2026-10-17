"use client";

/** A soft mechanical switch click, synthesised (no audio file to download). */
let ctx: AudioContext | null = null;

export function playClick(on: boolean) {
  try {
    ctx ??= new AudioContext();
    const now = ctx.currentTime;
    const len = 0.045;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = on ? 2400 : 1700;
    filter.Q.value = 1.4;
    const gain = ctx.createGain();
    gain.gain.value = 0.5;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now);
  } catch {
    // Audio unavailable: stay silent.
  }
}
