/* Zohraé launch film: every scene on one paused GSAP timeline, on the same
 * 120 BPM clock as music.py (a beat every 0.5 s). render.mjs seeks it frame
 * by frame. Open index.html?fmt=portrait (or landscape) and add &play to watch. */

// The offer line. Change it once the launch offer is decided, then re-render.
const OFFER_LINE = "Special launch prices on <b>lamps, décor &amp; gifts</b>";

const params = new URLSearchParams(location.search);
const FMT = params.get("fmt") === "landscape" ? "landscape" : "portrait";
const P = FMT === "portrait";
document.body.classList.add(FMT);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = (p) => `../../public/${p}`;

// Seeded random, so every render is identical.
let seed = 20261018;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const pick = (a) => a[Math.floor(rand() * a.length)];

const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
const show = (el, at) => tl.set(el, { autoAlpha: 1 }, at);
const hide = (el, at) => tl.set(el, { autoAlpha: 0 }, at);
const bg = (color, at, d = 0.35) => tl.to("#bg", { backgroundColor: color, duration: d, ease: "power2.inOut" }, at);
const maskIn = (root, at, stagger = 0.12, d = 0.55) =>
  tl.fromTo($$(".mask > span", typeof root === "string" ? $(root) : root), { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: d, stagger }, at);

// ------------------------------------------------------------ wordmark
function wordmarkSVG(id) {
  const [x, y, w, h] = WORDMARK_VIEWBOX.split(" ").map(Number);
  const glyphs = Object.values(WORDMARK_GLYPHS)
    .map((d) => `<path class="g" d="${d}" fill-rule="evenodd" fill="url(#${id})"/>`)
    .join("");
  return `<svg viewBox="${x} ${y - 20} ${w} ${h + 40}">
    <defs><linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#b8782f"/><stop offset=".55" stop-color="#8a5a1f"/><stop offset="1" stop-color="#d9a35a"/>
    </linearGradient></defs>
    ${glyphs}<path class="acc" d="${WORDMARK_ACCENT}" fill="url(#${id})"/></svg>`;
}
$("#wordmark").innerHTML = wordmarkSVG("wmg");
$("#mini-mark").innerHTML = wordmarkSVG("wmg2");

// ------------------------------------------------------------ confetti
const CONFETTI_COLORS = ["#e7a535", "#b4472c", "#f2d6cf", "#c0823a", "#8e9a7b", "#fff4e2", "#e3b5ae", "#ffb869"];
const W = innerWidth;
const H = innerHeight;
const U = Math.min(W, H) / 100;

function confetti(at, { x = 0.5, y = 0.5, count = 90, speed = 1, up = 1, spread = Math.PI * 2, dir = -Math.PI / 2, dur = 2.4 } = {}) {
  const box = $("#confetti");
  const pieces = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("i");
    const w = (0.8 + rand() * 1.4) * U;
    el.style.width = `${w}px`;
    el.style.height = `${w * (rand() < 0.5 ? 0.45 : 1)}px`;
    if (rand() < 0.25) el.style.borderRadius = "50%";
    el.style.background = pick(CONFETTI_COLORS);
    el.style.opacity = 0;
    box.appendChild(el);
    const a = dir + (rand() - 0.5) * spread;
    const v = (0.35 + rand() * 0.9) * speed * Math.max(W, H);
    pieces.push({ el, vx: Math.cos(a) * v, vy: Math.sin(a) * v * up, r: rand() * 360, vr: (rand() - 0.5) * 900, flip: 2 + rand() * 6 });
  }
  const x0 = x * W;
  const y0 = y * H;
  const g = 1.25 * H;
  const proxy = { t: 0 };
  tl.fromTo(
    proxy,
    { t: 0 },
    {
      t: dur,
      duration: dur,
      ease: "none",
      onUpdate() {
        const t = proxy.t;
        const drag = 1 - Math.exp(-t * 2.2);
        for (const p of pieces) {
          const px = x0 + (p.vx / 2.2) * drag;
          const py = y0 + (p.vy / 2.2) * drag + 0.5 * g * t * t * 0.55;
          const o = t <= 0 ? 0 : t > dur * 0.75 ? Math.max(0, (dur - t) / (dur * 0.25)) : 1;
          p.el.style.opacity = o;
          p.el.style.transform = `translate(${px}px, ${py}px) rotate(${p.r + p.vr * t}deg) scaleY(${Math.cos(t * p.flip)})`;
        }
      },
    },
    at,
  );
}

// ============================================================ 1 · lights off (0–4 s)
gsap.set("#switch", P ? { left: "64%", top: "50%" } : { left: "63%", top: "46%" });
if (!P) gsap.set("#lamp1", { bottom: "10%", width: "40vmin" });
if (!P) gsap.set("#s1-text", { top: "12%" });
gsap.set("#lamp1", { opacity: 0 });
gsap.set("#switch", { y: "40vh", opacity: 0 });

maskIn("#s1-text .a", 0.25, 0, 0.6);
maskIn("#s1-text .b", 0.75, 0.18, 0.6);
tl.fromTo("#switch", { y: "40vh", opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, 1.0);
tl.to("#lamp1", { opacity: 0.22, duration: 0.6, ease: "power1.out" }, 1.2);
// Click!
tl.to("#switch .rocker", { scaleY: -1, duration: 0.08, ease: "none" }, 2.0);
tl.to("#switch", { scale: 0.9, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, 2.0);
tl.to("#lamp1", { opacity: 1, duration: 0.05 }, 2.0);
tl.to("#lamp1 .on", { keyframes: { opacity: [0, 1, 0.25, 1, 0.7, 1] }, duration: 0.45, ease: "none" }, 2.02);
tl.fromTo("#glow", { scale: 0 }, { scale: 0.55, duration: 0.6, ease: "power2.out" }, 2.05);
tl.to("#bg", { backgroundColor: "#2a1a10", duration: 0.6 }, 2.05);
tl.to("#s1-text", { y: "-6vh", opacity: 0, duration: 0.5, ease: "power2.in" }, 2.6);
tl.to("#switch", { x: "30vw", opacity: 0, duration: 0.5, ease: "power2.in" }, 2.6);
tl.to("#lamp1", { scale: 1.25, y: P ? "-14vh" : "-10vh", duration: 1.3, ease: "power2.in" }, 2.7);
tl.to("#glow", { scale: 1.4, duration: 1.3, ease: "power2.in" }, 2.7);
tl.to("#flash", { opacity: 1, duration: 0.25, ease: "power2.in" }, 3.75);
hide("#s1", 4.0);
tl.set("#glow", { scale: 0 }, 4.0);

// ============================================================ 2 · reveal (4–6 s)
bg("#f6efe4", 4.0, 0.01);
show("#s2", 4.0);
tl.to("#flash", { opacity: 0, duration: 0.6, ease: "power2.out" }, 4.0);
tl.fromTo("#wordmark", { scale: 1.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.4)" }, 4.0);
tl.fromTo($$("#wordmark .g"), { yPercent: 18 }, { yPercent: 0, duration: 0.5, stagger: 0.04, ease: "back.out(2)" }, 4.0);
tl.fromTo("#wordmark .acc", { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }, 4.35);
confetti(4.0, { x: 0.5, y: 0.5, count: 110, speed: 1.1 });
tl.fromTo("#s2-url", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 4.6);
gsap.set("#stamp", P ? { right: "6%", top: "29%" } : { right: "12%", top: "15%" });
tl.fromTo("#stamp", { scale: 0, rotation: -120 }, { scale: 1, rotation: -10, duration: 0.7, ease: "back.out(2.2)" }, 5.0);
tl.to("#stamp .ring", { rotation: 90, duration: 1.0, ease: "none" }, 5.0);
tl.to("#s2", { scale: 0.85, opacity: 0, duration: 0.3, ease: "power2.in" }, 5.72);
hide("#s2", 6.0);

// ============================================================ 3 · shelves (6–16 s)
const SHELVES = [
  {
    id: "lamps", at: 6.0, end: 8.5, bg: "#2a1d15", ink: "#f6efe4", label: "Lumière",
    title: "Lamps that <span class='it gold'>glow</span>",
    items: ["nuvola", "ballerina", "rosalie"].map((h) => `<div class="item"><span class="halo"></span><img class="off" src="${IMG(`products/${h}/cutout-off.webp`)}"/><img class="on" src="${IMG(`products/${h}/cutout-on.webp`)}"/></div>`).join(""),
    anim(el, t) {
      const items = $$(".item", el);
      tl.fromTo(items, { scale: 0, y: 60 }, { scale: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "back.out(1.8)" }, t + 0.05);
      items.forEach((it, i) => {
        const at = t + 0.5 + i * 0.5;
        tl.to($(".on", it), { keyframes: { opacity: [0, 1, 0.3, 1] }, duration: 0.3, ease: "none" }, at);
        tl.to($(".halo", it), { scale: 1, duration: 0.5, ease: "power2.out" }, at);
        tl.to(it, { y: -18, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out" }, at);
      });
    },
  },
  {
    id: "vases", at: 8.5, end: 9.75, bg: "#ead9c4", label: "Vases & vessels",
    title: "Vases with <span class='it gold'>soul</span>",
    items: `<img class="cut v1" src="${IMG("products/vela/cutout.webp")}"/><img class="cut v2" src="${IMG("products/marea/cutout.webp")}"/>`,
    anim(el, t) {
      tl.fromTo($(".v1", el), { yPercent: 120, rotation: -14 }, { yPercent: 0, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }, t + 0.2);
      tl.fromTo($(".v2", el), { yPercent: 120, rotation: 14 }, { yPercent: 0, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }, t + 0.45);
      tl.to($$(".cut", el), { rotation: 4, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut", stagger: 0.1 }, t + 0.8);
    },
  },
  {
    id: "planters", at: 9.75, end: 11.0, bg: "#dfe5d3", label: "Planters",
    title: "Planters that <span class='it gold'>bloom</span>",
    items: `<img class="cut p1" src="${IMG("products/giardino/cutout.webp")}"/>`,
    anim(el, t) {
      const p = $(".p1", el);
      tl.fromTo(p, { yPercent: -140 }, { yPercent: 0, duration: 0.35, ease: "power2.in" }, t + 0.05);
      tl.to(p, { keyframes: { scaleY: [1, 0.82, 1.06, 1], scaleX: [1, 1.12, 0.96, 1] }, transformOrigin: "50% 100%", duration: 0.45, ease: "none" }, t + 0.4);
    },
  },
  {
    id: "frames", at: 11.0, end: 12.25, bg: "#f3e2d0", label: "Galleria · A3 · A2 · A1",
    title: "Art for your <span class='it gold'>walls</span>",
    items: [["arches-art-frame", "A3"], ["soleil-art-frame", "A2"], ["botanica-art-frame", "A1"]].map(([h, s]) => `<div class="card"><span class="nail"></span><img src="${IMG(`products/${h}/photo.webp`)}"/><span class="chip">${s}</span></div>`).join(""),
    anim(el, t) {
      const cards = $$(".card", el);
      cards.forEach((c, i) => {
        tl.fromTo(c, { y: "-70vh", rotation: -30 }, { y: 0, rotation: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" }, t + 0.15 + i * 0.25);
      });
    },
  },
  {
    id: "gifts", at: 12.25, end: 13.5, bg: "#f3d5cd", label: "Personalised",
    title: "Custom <span class='it gold'>gifts</span>",
    items: `<div class="tumbler-wrap"><img src="${IMG("personalise/tumbler.webp")}"/><div class="tumbler-name script">${"Aanya".split("").map((c) => `<span>${c}</span>`).join("")}</div></div><div class="pill" style="right:-6vmin;top:8%">with your name</div>`,
    anim(el, t) {
      tl.fromTo($(".tumbler-wrap", el), { scale: 0.6, rotation: -8, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, t + 0.05);
      $$(".tumbler-name span", el).forEach((s, i) => tl.to(s, { clipPath: "inset(0 0% 0 0)", duration: 0.12, ease: "none" }, t + 0.3 + i * 0.13));
      tl.fromTo($(".pill", el), { scale: 0, rotation: 10 }, { scale: 1, rotation: 4, duration: 0.4, ease: "back.out(2)" }, t + 0.95);
    },
  },
  {
    id: "magnets", at: 13.5, end: 14.75, bg: "#fbe5c0", label: "Keepsakes",
    title: "Fridge <span class='it gold'>magnets</span>",
    items: `<div class="duo"><div class="card m1"><img src="${IMG("products/wedding-photo-magnet/photo.webp")}"/></div><div class="card m2"><img src="${IMG("products/return-gift-magnets/photo.webp")}"/></div></div><div class="burst">SNAP!</div>`,
    anim(el, t) {
      tl.fromTo($(".m1", el), { x: "-60vw", rotation: -40 }, { x: 0, rotation: -5, duration: 0.25, ease: "power3.in" }, t);
      tl.to($(".m1", el), { keyframes: { x: [0, -10, 8, -4, 0] }, duration: 0.25, ease: "none" }, t + 0.25);
      tl.fromTo($(".m2", el), { x: "60vw", rotation: 40 }, { x: 0, rotation: 5, duration: 0.3, ease: "back.out(1.4)" }, t + 0.55);
      gsap.set($(".burst", el), P ? { left: "8%", top: "-4%" } : { left: "-4%", top: "4%" });
      tl.fromTo($(".burst", el), { scale: 0, rotation: -20 }, { scale: 1, rotation: -12, duration: 0.35, ease: "back.out(3)" }, t + 0.25);
    },
  },
  {
    id: "badges", at: 14.75, end: 16.0, bg: "#f1dbe1", label: "Wedding atelier",
    title: "Wedding <span class='it gold'>badges</span>",
    items: `<div class="duo"><div class="card b1"><img src="${IMG("products/couture-wedding-badge/photo.webp")}"/></div><div class="card b2"><img src="${IMG("products/wedding-party-badge-set/photo.webp")}"/></div></div><div class="pill q1">Bride</div><div class="pill q2">Groom</div>`,
    anim(el, t) {
      tl.fromTo($(".b1", el), { scale: 0, rotation: -25 }, { scale: 1, rotation: -4, duration: 0.45, ease: "back.out(1.8)" }, t + 0.1);
      tl.fromTo($(".b2", el), { scale: 0, rotation: 25 }, { scale: 1, rotation: 4, duration: 0.45, ease: "back.out(1.8)" }, t + 0.3);
      gsap.set($(".q1", el), { left: "-2vmin", top: "-4vmin" });
      gsap.set($(".q2", el), { right: "-2vmin", bottom: "-3vmin" });
      tl.fromTo($(".q1", el), { scale: 0 }, { scale: 1, rotation: -8, duration: 0.35, ease: "back.out(2.5)" }, t + 0.25);
      tl.fromTo($(".q2", el), { scale: 0 }, { scale: 1, rotation: 6, duration: 0.35, ease: "back.out(2.5)" }, t + 0.5);
    },
  },
];

for (const s of SHELVES) {
  const el = document.createElement("section");
  el.className = `layer shelf ${s.id} hide`;
  el.innerHTML = `<div class="shelf-title display" style="color:${s.ink || "var(--espresso)"}"><span class="label">${s.label}</span><span class="mask"><span>${s.title}</span></span></div><div class="items">${s.items}</div>`;
  $("#shelves").appendChild(el);
  bg(s.bg, s.at - 0.05, 0.3);
  show(el, s.at);
  maskIn(el, s.at, 0, 0.45);
  tl.fromTo($(".label", el), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.35 }, s.at + 0.1);
  s.anim(el, s.at);
  tl.to(el, { opacity: 0, y: "-5vh", duration: 0.2, ease: "power2.in" }, s.end - 0.2);
  hide(el, s.end);
}

// ============================================================ 4 · and so much more (16–18 s)
const ORBIT = [
  ["products/aurelia/cutout-on.webp", 1], ["products/arches-art-frame/photo.webp"], ["products/onda/cutout-on.webp", 1],
  ["products/personalised-coaster-set/photo.webp"], ["products/vela/cutout.webp", 1], ["products/wedding-party-badge-set/photo.webp"],
  ["products/colonna/cutout-on.webp", 1], ["products/monogram-serving-tray/photo.webp"], ["products/sora/cutout-on.webp", 1],
  ["products/return-gift-magnets/photo.webp"], ["products/giardino/cutout.webp", 1], ["products/personalised-insulated-tumbler/photo.webp"],
];
const orbit = $("#orbit");
const orbs = ORBIT.map(([src, cut]) => {
  const o = document.createElement("div");
  o.className = `o${cut ? " cutout" : ""}`;
  o.innerHTML = `<img src="${IMG(src)}"/>`;
  orbit.appendChild(o);
  return o;
});
const RX = P ? 0.38 * W : 0.38 * W;
const RY = P ? 0.36 * H : 0.34 * H;
const spin = { a: 0, r: 0 };
const placeOrbs = () =>
  orbs.forEach((o, i) => {
    const a = spin.a + (i / orbs.length) * Math.PI * 2;
    gsap.set(o, { x: Math.cos(a) * RX * spin.r, y: Math.sin(a) * RY * spin.r, rotation: Math.sin(a * 2) * 8 });
  });
placeOrbs();
bg("#f6efe4", 15.95, 0.2);
show("#s4", 16.0);
tl.fromTo(spin, { a: 0, r: 0 }, { a: Math.PI * 0.9, r: 1, duration: 2.0, ease: "power2.out", onUpdate: placeOrbs }, 16.0);
tl.fromTo(orbs, { scale: 0 }, { scale: 1, duration: 0.4, stagger: 0.04, ease: "back.out(2)" }, 16.0);
tl.fromTo("#more-text", { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 16.2);
tl.to("#s4", { opacity: 0, scale: 1.15, duration: 0.25, ease: "power2.in" }, 17.75);
hide("#s4", 18.0);

// ============================================================ 5 · the heart (18–20 s)
bg("#2a1d15", 17.95, 0.15);
show("#s5", 18.0);
maskIn("#s5 .l1", 18.0, 0, 0.5);
maskIn("#s5 .l2", 18.45, 0, 0.5);
maskIn("#s5 .l3", 19.0, 0, 0.5);
tl.fromTo("#s5 .l3 .script", { color: "#f6efe4" }, { color: "#ffb869", duration: 0.4 }, 19.3);
tl.to("#s5", { scale: 1.08, duration: 0.9, ease: "power1.in" }, 19.05);
tl.to("#s5", { keyframes: { x: [0, -6, 6, -4, 4, 0] }, duration: 0.3, ease: "none" }, 19.65);
tl.to("#flash", { opacity: 1, duration: 0.12, ease: "power2.in" }, 19.85);
hide("#s5", 20.0);

// ============================================================ 6 · launch offers (20–26 s)
const star = [];
for (let i = 0; i < 28; i++) {
  const r = i % 2 ? 78 : 98;
  const a = (i / 28) * Math.PI * 2;
  star.push(`${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`);
}
$("#star").setAttribute("points", star.join(" "));
$(".offer-line.l1").innerHTML = OFFER_LINE;

bg("#e7a535", 20.0, 0.01);
show("#s6", 20.0);
show("#rays", 20.0);
tl.to("#flash", { opacity: 0, duration: 0.4 }, 20.0);
tl.fromTo("#rays", { rotation: 0 }, { rotation: 75, duration: 6, ease: "none" }, 20.0);
const words = $$("#offer-words .w");
gsap.set("#offer-words", { y: P ? "-6vh" : "-4vh" });
tl.fromTo(words[0], { scale: 3.2, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: -4, duration: 0.35, ease: "back.out(1.3)" }, 20.0);
tl.fromTo(words[1], { scale: 3.2, opacity: 0, rotation: 12 }, { scale: 1, opacity: 1, rotation: -4, duration: 0.35, ease: "back.out(1.3)" }, 20.5);
confetti(20.0, { x: 0.05, y: 1.0, count: 90, dir: -Math.PI / 3, spread: 0.7, speed: 1.3 });
confetti(20.0, { x: 0.95, y: 1.0, count: 90, dir: (-2 * Math.PI) / 3, spread: 0.7, speed: 1.3 });
confetti(20.5, { x: 0.5, y: 0.45, count: 70, speed: 0.9 });
gsap.set("#sticker", P ? { right: "6%", top: "20%" } : { right: "17%", top: "12%" });
tl.fromTo("#sticker", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.4)" }, 21.0);
tl.to("#sticker svg", { rotation: 120, duration: 5, ease: "none" }, 21.0);
const lineTop = P ? { bottom: "22%" } : { bottom: "12%" };
gsap.set(".offer-line", lineTop);
tl.fromTo(".offer-line.l1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45 }, 21.5);
tl.to(".offer-line.l1", { opacity: 0, y: -20, duration: 0.25, ease: "power2.in" }, 23.75);
tl.fromTo(".offer-line.l2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45 }, 24.0);
// Products float around the edges.
const floatPos = P
  ? [{ left: "4%", top: "6%" }, { right: "6%", bottom: "6%" }, { left: "6%", bottom: "5%" }, { right: "4%", top: "4%" }]
  : [{ left: "4%", top: "8%" }, { right: "4%", bottom: "8%" }, { left: "7%", bottom: "6%" }, { right: "34%", top: "4%" }];
$$(".floaty").forEach((f, i) => {
  gsap.set(f, floatPos[i]);
  tl.fromTo(f, { scale: 0, rotation: i % 2 ? 20 : -20 }, { scale: 1, rotation: i % 2 ? 6 : -6, duration: 0.5, ease: "back.out(2)" }, 21.2 + i * 0.15);
  tl.to(f, { y: i % 2 ? 18 : -18, duration: 0.5, yoyo: true, repeat: 7, ease: "sine.inOut" }, 21.7);
});
// Pulse on the beat.
for (let b = 22.0; b < 25.8; b += 0.5) tl.fromTo("#offer-words", { scale: 1.05 }, { scale: 1, duration: 0.3, ease: "power2.out" }, b);
tl.to("#s6", { opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in" }, 25.75);
tl.to("#rays", { opacity: 0, duration: 0.25 }, 25.75);
hide("#s6", 26.0);

// ============================================================ 7 · order now (26–30 s)
bg("#f6efe4", 25.95, 0.2);
show("#s7", 26.0);
if (P) gsap.set("#s7", { paddingTop: "26vh" });
gsap.set("#lamp7", P ? { left: "50%", xPercent: -50, top: "5%", width: "28vmin" } : { left: "7%", bottom: "6%", width: "34vmin" });
tl.fromTo("#lamp7", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, 26.05);
maskIn("#order-top", 26.1, 0, 0.5);
tl.fromTo("#btn", { scale: 0, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)" }, 26.45);
gsap.set("#cursor", { left: "50%", top: "50%" });
tl.fromTo("#cursor", { x: W * 0.45, y: H * 0.4, opacity: 0 }, { x: () => btnTarget().x, y: () => btnTarget().y, opacity: 1, duration: 0.55, ease: "power3.inOut" }, 26.9);
tl.to("#cursor", { scale: 0.85, duration: 0.07, yoyo: true, repeat: 1 }, 27.5);
tl.to("#btn", { scale: 0.92, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.inOut" }, 27.5);
tl.fromTo("#ripple", { scale: 0.5, opacity: 1 }, { scale: 6, opacity: 0, duration: 0.7, ease: "power2.out" }, 27.55);
tl.to("#cursor", { opacity: 0, duration: 0.3 }, 27.85);
tl.fromTo("#sign > *", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.12 }, 28.0);
confetti(28.0, { x: 0.5, y: P ? 0.4 : 0.35, count: 80, speed: 0.9 });
tl.to("#lamp7 .halo", { scale: 1.15, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, 28.0);
tl.to({}, { duration: 0.01 }, 29.99);

function btnTarget() {
  const r = $("#btn").getBoundingClientRect();
  return { x: r.left + r.width * 0.62 - W * 0.5, y: r.top + r.height * 0.55 - H * 0.5 };
}

// ------------------------------------------------------------ driver
window.__duration = 30;
window.__seek = (t) => {
  tl.seek(t, false);
};
window.__ready = (async () => {
  await document.fonts.ready;
  await Promise.all($$("img").map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => (i.onload = i.onerror = r)))));
  tl.seek(0, false);
  return true;
})();
if (params.has("play")) window.__ready.then(() => tl.play(params.get("t") ? Number(params.get("t")) : 0));
