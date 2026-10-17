import * as THREE from "three";

const GRID = { x: 96, y: 128 }; // depth-map resolution
const SEGMENTS = { x: 120, y: 160 }; // plane tessellation

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Depth from silhouette: per row, the opaque span gives a centre and radius;
 * depth across the row is the front half of a circle of that radius, so the
 * stem of a lamp is shallow and the shade is deep, as in life. Returned in
 * units of the image width.
 */
function depthFromAlpha(img: HTMLImageElement) {
  const { x: w, y: h } = GRID;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const alpha = ctx.getImageData(0, 0, w, h).data;

  const centre = new Float32Array(h);
  const radius = new Float32Array(h);
  for (let y = 0; y < h; y++) {
    let l = -1;
    let r = -1;
    for (let x = 0; x < w; x++) {
      if (alpha[(y * w + x) * 4 + 3] > 40) {
        if (l < 0) l = x;
        r = x;
      }
    }
    centre[y] = l < 0 ? w / 2 : (l + r + 1) / 2;
    radius[y] = l < 0 ? 0 : (r - l + 1) / 2;
  }
  // Smooth the profile vertically so print ridges and AI noise don't ripple the surface.
  const smooth = (src: Float32Array, k: number) => {
    const out = new Float32Array(src.length);
    for (let y = 0; y < h; y++) {
      let sum = 0;
      let n = 0;
      for (let d = -k; d <= k; d++) {
        const v = src[Math.min(h - 1, Math.max(0, y + d))];
        sum += v;
        n++;
      }
      out[y] = sum / n;
    }
    return out;
  };
  const cs = smooth(centre, 2);
  const rs = smooth(radius, 2);

  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const r = rs[y];
      const dx = (x + 0.5 - cs[y]) / Math.max(r, 1e-3);
      const d = r > 0 && Math.abs(dx) < 1 ? Math.sqrt(1 - dx * dx) * (r / w) : 0;
      const i = ((h - 1 - y) * w + x) * 4; // bottom row first, like a flipped image texture
      // Depth is at most 0.5 image widths: store it at 2× for precision.
      data[i] = Math.round(Math.min(1, d * 2) * 255);
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const vertex = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uDepthScale;
  uniform float uPlaneW;
  uniform vec2 uTexel;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  float depthAt(vec2 uv) { return texture2D(uDepth, uv).r * 0.5 * uDepthScale; }

  void main() {
    vUv = uv;
    float d = depthAt(uv);
    float dx = depthAt(uv + vec2(uTexel.x, 0.0)) - depthAt(uv - vec2(uTexel.x, 0.0));
    float dy = depthAt(uv + vec2(0.0, uTexel.y)) - depthAt(uv - vec2(0.0, uTexel.y));
    vec3 n = normalize(vec3(-dx / (2.0 * uTexel.x * uPlaneW), -dy / (2.0 * uTexel.y), 1.0));
    vNormal = normalize(normalMatrix * n);
    vec4 mv = modelViewMatrix * vec4(position.xy, d, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uOff;
  uniform sampler2D uOn;
  uniform float uLamp;
  uniform float uHasOn;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 off = texture2D(uOff, vUv);
    vec4 on = uHasOn > 0.5 ? texture2D(uOn, vUv) : off;
    vec4 c = mix(off, on, uLamp);
    if (c.a < 0.02) discard;

    // A soft key light that stays put while the object turns: the photo's own
    // lighting does most of the work, this only reads the new angle.
    vec3 n = normalize(vNormal);
    vec3 l = normalize(vec3(-0.45, 0.55, 0.7));
    vec3 v = normalize(vView);
    float diffuse = 0.82 + 0.28 * max(dot(n, l), 0.0);
    float spec = pow(max(dot(reflect(-l, n), v), 0.0), 24.0) * 0.08;
    float shade = mix(diffuse, 1.0, uLamp * 0.7); // a lit lamp glows from inside
    gl_FragColor = vec4(c.rgb * shade + spec * (1.0 - uLamp), c.a);
  }
`;

export async function createDepthStage(el: HTMLElement, opts: { off: string; on?: string; turn: number }) {
  const [offImg, onImg] = await Promise.all([loadImage(opts.off), opts.on ? loadImage(opts.on) : null]);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    return null;
  }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // photos in, photos out: no conversion
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = "depth-canvas";
  canvas.setAttribute("aria-hidden", "true");
  el.appendChild(canvas);

  const tex = (img: HTMLImageElement) => {
    const t = new THREE.Texture(img);
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  };
  const offTex = tex(offImg);
  const onTex = onImg ? tex(onImg) : offTex;
  const depth = depthFromAlpha(offImg);

  const aspect = offImg.naturalWidth / offImg.naturalHeight;
  const planeW = aspect; // height 1
  const geometry = new THREE.PlaneGeometry(planeW, 1, SEGMENTS.x, SEGMENTS.y);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    uniforms: {
      uOff: { value: offTex },
      uOn: { value: onTex },
      uHasOn: { value: onImg ? 1 : 0 },
      uLamp: { value: 0 },
      uDepth: { value: depth },
      uDepthScale: { value: planeW * 0.55 }, // shallow: enough to read as round, never to stretch
      uPlaneW: { value: planeW },
      uTexel: { value: new THREE.Vector2(1 / GRID.x, 1 / GRID.y) },
    },
  });
  const mesh = new THREE.Mesh(geometry, material);
  const scene = new THREE.Scene();
  scene.add(mesh);
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 20);

  const lit = el.querySelector<HTMLElement>(".lit");
  const root = document.documentElement;

  let dirty = true;
  const resize = () => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    // Fit the plane (contain) with a little margin for the turn.
    const fitH = 1 / Math.min(1, camera.aspect / planeW);
    const dist = (fitH * 0.5) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, dist + 0.15);
    camera.updateProjectionMatrix();
    dirty = true;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  // Pointer anywhere on the page steers the turn; scroll position adds a slow spin.
  const target = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    target.y = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)));
    target.x = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.6)));
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let raf = 0;
  let last = performance.now();
  const rot = { x: 0, y: 0 };
  let frame = 0;
  let covered = false;
  let lastLamp = -1;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) return;
    // Covered by something else (a sticky chapter on top)? Check a few times a second, skip drawing.
    if (frame++ % 12 === 0) {
      const x = Math.min(window.innerWidth - 1, Math.max(0, r.left + r.width / 2));
      const y = Math.min(window.innerHeight - 1, Math.max(0, r.top + r.height / 2));
      const hit = document.elementFromPoint(x, y);
      covered = Boolean(hit) && !(el.closest("article, section") ?? el).contains(hit);
    }
    if (covered) return;
    const scroll = (r.top + r.height / 2) / window.innerHeight - 0.5; // -0.5..0.5 across the viewport
    const idle = Math.sin(now / 2400) * 0.06;
    const ty = target.y * opts.turn + scroll * 0.5 + idle;
    const tx = target.x * opts.turn * 0.25;
    rot.y = THREE.MathUtils.damp(rot.y, ty, 5, dt);
    rot.x = THREE.MathUtils.damp(rot.x, tx, 5, dt);
    mesh.rotation.set(rot.x, rot.y, 0);

    const lamp = Number(lit?.style.getPropertyValue("--lamp") || 0);
    const dim = Number(root.style.getPropertyValue("--dim") || 1);
    material.uniforms.uLamp.value = lamp * (0.3 + 0.7 * dim);
    // Draw only when something moved: a resting lamp costs nothing.
    const u = material.uniforms.uLamp.value as number;
    if (
      !dirty &&
      Math.abs(rot.y - mesh.userData.ry) < 1e-4 &&
      Math.abs(rot.x - mesh.userData.rx) < 1e-4 &&
      u === lastLamp
    )
      return;
    dirty = false;
    lastLamp = u;
    mesh.userData.rx = rot.x;
    mesh.userData.ry = rot.y;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      offTex.dispose();
      onTex.dispose();
      depth.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
