"""Original 30-second launch track for the Zohraé film, synthesised from scratch.

120 BPM (a beat every 0.5 s), D major, I–V–vi–IV. Sound effects are placed on
the same clock as the animation in scenes.js, so every cut lands on a beat.

    python3 music.py out/music.wav
"""

import sys
import wave

import numpy as np

SR = 44100
DUR = 30.0
N = int(SR * DUR)
BEAT = 0.5
BAR = 2.0
rng = np.random.default_rng(7)

mix = np.zeros((N, 2))


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def place(x, at, gain=1.0, pan=0.0):
    """Add mono or stereo x into the mix at time `at` (seconds)."""
    i = int(round(at * SR))
    if i >= N:
        return
    if x.ndim == 1:
        left, right = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
        x = np.stack([x * left, x * right], axis=1) * np.sqrt(2)
    x = x[: N - i]
    mix[i : i + len(x)] += x * gain


def band(x, lo=None, hi=None):
    """Brick-wall-ish band filter in the frequency domain (soft edges)."""
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(spec * m, len(x))


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def saw(freq, t):
    return 2 * ((freq * t) % 1.0) - 1


# ---------------------------------------------------------------- instruments
def kick():
    t = t_axis(0.4)
    f = 48 + 120 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7.5)
    click = band(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 250) * 0.4
    return np.tanh((body + click) * 1.6)


def clap():
    t = t_axis(0.3)
    n = band(rng.standard_normal(len(t)), 900, 3500)
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 60), 0)
    env += np.where(t >= 0.03, np.exp(-(t - 0.03) * 14) * 0.6, 0)
    return n * env * 0.9


def hat(open_=False):
    t = t_axis(0.25 if open_ else 0.06)
    return band(rng.standard_normal(len(t)), 7000) * np.exp(-t * (12 if open_ else 70)) * 0.5


def snare():
    t = t_axis(0.25)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5
    noise = band(rng.standard_normal(len(t)), 1500, 9000) * np.exp(-t * 22)
    return tone + noise


def bass_note(n, dur=0.24):
    t = t_axis(dur)
    f = midi(n)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)
    env = np.minimum(t / 0.004, 1) * np.exp(-t * 6)
    return np.tanh(x * env * 1.8) * 0.8


def supersaw(notes, dur, cutoff=3500, decay=7.0, attack=0.003):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for n in notes:
        for d in (-0.12, -0.06, 0, 0.06, 0.12):
            x += saw(midi(n + d), t + rng.random())
    x = band(x / (len(notes) * 5), 80, cutoff)
    env = np.minimum(t / attack, 1) * np.exp(-t * decay)
    return x * env


def pad(notes, dur):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for n in notes:
        for d in (-0.08, 0, 0.08):
            x += saw(midi(n + d), t + rng.random())
    x = band(x / (len(notes) * 3), 100, 1400)
    env = np.minimum(t / 0.35, 1) * np.minimum((dur - t) / 0.3, 1)
    return x * np.clip(env, 0, 1)


def pluck(n, dur=0.5, bright=0.996):
    """Karplus–Strong string, computed block by block."""
    f = midi(n)
    period = int(SR / f)
    total = int(dur * SR)
    y = np.zeros(total + period + 1)
    y[: period + 1] = rng.uniform(-1, 1, period + 1)
    i = period + 1
    while i < len(y):
        j = min(i + period, len(y))
        k = np.arange(i, j)
        y[k] = bright * 0.5 * (y[k - period] + y[k - period - 1])
        i = j
    out = y[period + 1 : period + 1 + total]
    return band(out, 200) * 0.6


def bell(n, dur=0.9):
    t = t_axis(dur)
    f = midi(n)
    x = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 6) + 0.2 * np.sin(2 * np.pi * f * 3.99 * t) * np.exp(-t * 9)
    return x * np.exp(-t * 3.2) * np.minimum(t / 0.002, 1) * 0.5


# ---------------------------------------------------------------- effects
def sfx_click():
    t = t_axis(0.12)
    tick = np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 180)
    thump = np.sin(2 * np.pi * 120 * t) * np.exp(-t * 40)
    noise = band(rng.standard_normal(len(t)), 2000) * np.exp(-t * 300)
    return (tick * 0.6 + thump * 0.8 + noise * 0.5) * 0.9


def sfx_riser(dur):
    t = t_axis(dur)
    f = 180 * (12 ** (t / dur))
    tone = saw(1, np.cumsum(f) / SR) * 0.15
    noise = band(rng.standard_normal(len(t)), 1200) * 0.5
    env = (t / dur) ** 2
    return band(tone, None, 6000) * env + noise * env * 0.6


def sfx_impact():
    t = t_axis(2.2)
    boom = np.sin(2 * np.pi * (40 + 60 * np.exp(-t * 8)) * t) * np.exp(-t * 2.2)
    crash = band(rng.standard_normal(len(t)), 3500) * np.exp(-t * 1.6) * 0.45
    return np.tanh((boom * 1.3 + crash) * 1.2)


def sfx_pop(up=True, base=380):
    t = t_axis(0.12)
    f = base * (3 if up else 0.4) ** (t / 0.12)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.7


def sfx_whoosh(dur=0.6):
    t = t_axis(dur)
    out = np.zeros_like(t)
    centres = np.geomspace(500, 6000, 6)
    for k, c in enumerate(centres):
        n = band(rng.standard_normal(len(t)), c * 0.7, c * 1.4)
        mid = dur * (0.25 + 0.5 * k / (len(centres) - 1))
        out += n * np.exp(-(((t - mid) / (dur * 0.18)) ** 2))
    return out * 0.35


def sfx_sparkle(dur=0.8, count=14):
    t = t_axis(dur + 0.3)
    out = np.zeros_like(t)
    for _ in range(count):
        at = rng.random() * dur
        f = rng.uniform(2600, 6500)
        tt = t - at
        out += np.where(tt >= 0, np.sin(2 * np.pi * f * tt) * np.exp(-np.maximum(tt, 0) * 22), 0)
    return out * 0.12


def sfx_type():
    t = t_axis(0.05)
    return band(rng.standard_normal(len(t)), 1800, 8000) * np.exp(-t * 160) * 0.7 + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 120) * 0.3


def sfx_boing():
    t = t_axis(0.5)
    f = 260 * np.exp(-t * 1.5) * (1 + 0.12 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 3))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * 0.6


def sfx_popper():
    t = t_axis(0.25)
    bang = band(rng.standard_normal(len(t)), 400, 7000) * np.exp(-t * 35)
    return bang * 0.9


# ---------------------------------------------------------------- arrangement
# D major I–V–vi–IV, one chord per bar (2 s). Root MIDI notes (octave 3).
PROG = [(50, [62, 66, 69]), (45, [61, 64, 69]), (47, [62, 66, 71]), (43, [62, 67, 71])]  # D, A, Bm, G


def chord_at(bar):
    return PROG[bar % 4]


def sidechain(kick_times):
    g = np.ones(N)
    t = np.arange(N) / SR
    for kt in kick_times:
        i = int(kt * SR)
        seg = t[i : i + int(0.3 * SR)] - kt
        g[i : i + len(seg)] = np.minimum(g[i : i + len(seg)], 1 - 0.65 * np.exp(-seg / 0.09))
    return g


def build():
    k, cl, hc, ho, sn = kick(), clap(), hat(), hat(True), snare()
    beats = np.arange(0, DUR, BEAT)

    # Where the groove plays: drop at 4 s, a lighter half-time lift 18–20 s, full energy 20–28 s.
    def groove(b):
        return 4.0 <= b < 18.0 or 20.0 <= b < 28.0

    kicks = [b for b in beats if groove(b)] + [18.0, 19.0]
    for b in kicks:
        place(k, b, 0.95)
    for b in beats:
        if groove(b) and int(round(b / BEAT)) % 2 == 1:
            place(cl, b, 0.55, 0.1)
        if groove(b):
            place(ho, b + BEAT / 2, 0.28, 0.35)
            for s in (0.25, 0.75):
                place(hc, b + s * BEAT, 0.12, -0.4)
    # Extra clap layer for the offers section.
    for b in np.arange(20.0, 26.0, BEAT):
        place(cl, b + 0.25, 0.18, -0.2)

    sc = sidechain(kicks)
    music = np.zeros((N, 2))

    def place_m(x, at, gain=1.0, pan=0.0):
        nonlocal music
        global mix
        saved = mix
        mix = music
        place(x, at, gain, pan)
        music = mix
        mix = saved

    for bar in range(15):
        root, notes = chord_at(bar)
        t0 = bar * BAR
        # Pad all the way through (soft in the intro).
        place_m(pad(notes, BAR + 0.05), t0, 0.32 if t0 < 4 else 0.22)
        if t0 >= 4 and not (18 <= t0 < 20) and t0 < 28:
            # Bass: offbeat octave bounce.
            for i in range(4):
                place_m(bass_note(root - 12), t0 + i * BEAT + BEAT / 2, 0.55)
                place_m(bass_note(root), t0 + i * BEAT + 0.75 * BEAT, 0.3)
            # Offbeat chord stabs.
            for i in range(4):
                place_m(supersaw([n + 12 for n in notes], 0.22), t0 + i * BEAT + BEAT / 2, 0.42, 0.0)
        # Plucked arpeggio, eighth notes, from the start (filtered by gain in the intro).
        pattern = [0, 1, 2, 1, 0, 2, 1, 2]
        for i, p in enumerate(pattern):
            n = notes[p] + 12 + (12 if i == 4 else 0)
            at = t0 + i * BEAT / 2
            if at < 28:
                place_m(pluck(n, 0.45), at, 0.32 if t0 >= 4 else 0.2, -0.3 if i % 2 else 0.3)

    # Hook on bells for the offers and the call to action.
    hook = [(78, 0), (81, 0.5), (83, 1.0), (81, 1.5), (78, 2.0), (76, 2.5), (74, 3.0), (76, 3.5)]
    for start in (20.0, 24.0):
        for n, off in hook:
            place_m(bell(n), start + off, 0.45, 0.15)
    # Final chord at 28 s rings out.
    place_m(supersaw([62, 66, 69, 74, 78], 2.0, cutoff=5000, decay=1.6, attack=0.005), 28.0, 0.6)
    place_m(pad([50, 62, 66, 69], 2.0), 28.0, 0.3)
    place_m(bell(86, 1.6), 28.0, 0.4)

    music *= sc[:, None]
    mix[:] += music

    # ------------------------------------------------ sound effects, on the film's clock
    place(sfx_click(), 2.0, 1.0)
    place(sfx_riser(2.0), 2.0, 0.5)
    for i, at in enumerate(np.concatenate([np.arange(3.0, 3.5, 0.125), np.arange(3.5, 4.0, 0.0625)])):
        place(sn, at, 0.18 + 0.4 * (at - 3.0))
    place(sfx_impact(), 4.0, 0.9)
    place(sfx_sparkle(1.0, 20), 4.05, 1.0)
    place(sfx_pop(True, 300), 5.0, 0.8)
    place(sfx_popper(), 5.0, 0.5)

    place(sfx_whoosh(0.5), 5.75, 0.8)
    for i, at in enumerate((6.5, 7.0, 7.5)):  # three lamps switch on
        place(sfx_click(), at, 0.55)
        place(sfx_pop(True, 420 + 120 * i), at + 0.02, 0.45)
    for at in (8.5, 9.75, 11.0, 12.25, 13.5, 14.75):
        place(sfx_whoosh(0.4), at - 0.2, 0.7)
    place(sfx_pop(True, 500), 8.75, 0.5)
    place(sfx_pop(True, 600), 9.0, 0.5)
    place(sfx_pop(True, 520), 10.0, 0.55)
    for i, at in enumerate((11.25, 11.5, 11.75)):
        place(sfx_pop(False, 900 - 100 * i), at, 0.4)
    for i in range(5):  # A-a-n-y-a
        place(sfx_type(), 12.55 + i * 0.13, 0.8)
    place(sfx_sparkle(0.4, 8), 13.2, 1.0)
    place(sfx_click(), 13.75, 0.7)
    place(sfx_boing(), 13.77, 0.8)
    place(sfx_pop(True, 450), 15.0, 0.6)
    place(sfx_pop(True, 560), 15.25, 0.6)
    place(sfx_whoosh(0.7), 15.7, 0.9)
    place(sfx_sparkle(1.2, 26), 16.0, 1.0)

    for at in np.concatenate([np.arange(19.0, 19.5, 0.125), np.arange(19.5, 20.0, 0.0625)]):
        place(sn, at, 0.2 + 0.45 * (at - 19.0))
    place(sfx_riser(1.5), 18.5, 0.45)
    place(sfx_impact(), 20.0, 1.0)
    for at in (20.0, 20.08, 20.2):
        place(sfx_popper(), at, 0.6, rng.uniform(-0.6, 0.6))
    place(sfx_sparkle(1.5, 40), 20.05, 1.2)
    place(sfx_pop(True, 350), 20.5, 0.6)
    place(sfx_pop(True, 470), 21.0, 0.6)
    place(sfx_whoosh(0.5), 25.8, 0.8)
    place(sfx_click(), 27.5, 0.9)
    place(sfx_sparkle(0.6, 12), 27.55, 1.0)
    place(sfx_impact(), 28.0, 0.55)
    place(sfx_sparkle(1.6, 30), 28.1, 1.0)


def master(x):
    x = x - x.mean(axis=0)
    x /= np.max(np.abs(x)) + 1e-9
    x = np.tanh(x * 1.6) / np.tanh(1.6)
    fade = int(0.25 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    fade_in = int(0.02 * SR)
    x[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
    return x * 0.93


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
    build()
    y = master(mix)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((y * 32767).astype("<i2").tobytes())
    print(out, f"{DUR:.1f}s")
