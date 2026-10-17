"use client";

/* eslint-disable react-hooks/immutability -- R3F: mutating three.js objects inside useFrame is the intended per-frame pattern (no React re-renders). */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The atelier's 3D lamp, driven by scroll progress (0–1) across five steps:
 * sketch (wireframe) → print (clipping plane rises, nozzle ring glows) →
 * hand finishing (sheen) → light test (glow) → packaging (box rises).
 */
export default function AtelierScene({ progress, active }: { progress: React.RefObject<number>; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.3, 4.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <Lamp progress={progress} />
    </Canvas>
  );
}

const SHADE = { y0: 0.98, y1: 1.62, rBottom: 0.66, rTop: 0.43 };
const BASE = { y0: 0.06, y1: 0.98, r: 0.47 };
const HEIGHT = SHADE.y1;

/** Surface of revolution with vertical ribs and fine print-layer ridges. */
function ribbedSurface(
  radius: (y: number) => number,
  y0: number,
  y1: number,
  ribs: number,
  ribAmp: number,
  rows = 140,
  cols = 192,
) {
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= rows; i++) {
    const y = y0 + ((y1 - y0) * i) / rows;
    const base = radius(y);
    for (let j = 0; j <= cols; j++) {
      const a = (j / cols) * Math.PI * 2;
      const rib = 1 + ribAmp * Math.pow(Math.abs(Math.cos((ribs * a) / 2)), 0.6);
      const layer = 1 + 0.004 * Math.sin(y * 520);
      const r = base * rib * layer;
      pos.push(Math.cos(a) * r, y, Math.sin(a) * r);
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const a = i * (cols + 1) + j;
      const b = a + cols + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const shadeRadius = (y: number) => {
  const t = (y - SHADE.y0) / (SHADE.y1 - SHADE.y0);
  return SHADE.rBottom + (SHADE.rTop - SHADE.rBottom) * t;
};
const baseRadius = (y: number) => {
  const t = (y - BASE.y0) / (BASE.y1 - BASE.y0); // 0..1
  const k = Math.sin(Math.PI * Math.min(1, Math.max(0, t * 0.92 + 0.04)));
  return 0.16 + (BASE.r - 0.16) * Math.pow(k, 0.7);
};
const radiusAt = (y: number) => (y >= SHADE.y0 ? shadeRadius(y) : baseRadius(y));

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Lamp({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const nozzle = useRef<THREE.Mesh>(null);
  const box = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Mesh>(null);
  const bulb = useRef<THREE.PointLight>(null);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  const { scene } = useThree();

  const shadeGeo = useMemo(() => ribbedSurface(shadeRadius, SHADE.y0, SHADE.y1, 84, 0.035), []);
  const baseGeo = useMemo(() => ribbedSurface(baseRadius, BASE.y0, BASE.y1, 56, 0.045), []);
  // A light, hand-drawn-looking sketch: few rings, few meridians.
  const wireShade = useMemo(
    () => new THREE.WireframeGeometry(ribbedSurface(shadeRadius, SHADE.y0, SHADE.y1, 0, 0, 6, 28)),
    [],
  );
  const wireBase = useMemo(
    () => new THREE.WireframeGeometry(ribbedSurface(baseRadius, BASE.y0, BASE.y1, 0, 0, 10, 28)),
    [],
  );

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#b9a14a"),
        roughness: 0.9,
        metalness: 0,
        side: THREE.DoubleSide,
        clippingPlanes: [plane],
        emissive: new THREE.Color("#ffb869"),
        emissiveIntensity: 0,
      }),
    [plane],
  );
  const wireMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#c0823a", transparent: true, opacity: 0.55 }),
    [],
  );

  useEffect(() => {
    return () => {
      [shadeGeo, baseGeo, wireShade, wireBase].forEach((g) => g.dispose());
      mat.dispose();
      wireMat.dispose();
    };
  }, [shadeGeo, baseGeo, wireShade, wireBase, mat, wireMat]);

  useFrame((state, delta) => {
    const p = progress.current ?? 0;
    // Step windows: 0 sketch · .2 print · .4 finish · .6 light · .8 pack
    const print = smooth(0.12, 0.4, p);
    const finish = smooth(0.42, 0.56, p);
    const lit = smooth(0.6, 0.72, p);
    const pack = smooth(0.8, 0.95, p);

    const h = print * (HEIGHT + 0.02);
    plane.constant = h;
    wireMat.opacity = 0.55 * (1 - smooth(0.25, 0.42, p));
    if (nozzle.current) {
      nozzle.current.visible = print > 0.001 && print < 0.999;
      nozzle.current.position.y = h;
      const r = radiusAt(Math.min(h, HEIGHT - 0.001));
      nozzle.current.scale.setScalar(r * (h >= SHADE.y0 ? 1.04 : 1.08));
    }
    mat.roughness = 0.9 - 0.35 * finish;
    mat.color.set(finish > 0.5 ? "#c9ad55" : "#b9a14a");
    mat.emissiveIntensity = 0.55 * lit;
    if (bulb.current) bulb.current.intensity = 6 * lit;
    scene.background = null;

    if (box.current) {
      box.current.visible = pack > 0.001;
      box.current.scale.y = Math.max(0.001, pack);
    }
    if (lid.current) {
      // The lid floats down at a tilt, hovering above the lamp: "about to be closed".
      const l = smooth(0.35, 1, pack);
      lid.current.visible = pack > 0.3;
      lid.current.position.set(0.55 * (1 - l) + 0.25, 2.75 - 0.8 * l, 0);
      lid.current.rotation.z = 0.32 - 0.12 * l;
    }
    // Ease the camera back a little for the packaging step.
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 4.4 + 0.9 * pack, 3, delta);
    if (group.current) {
      const target = p * Math.PI * 1.1 + state.clock.elapsedTime * 0.08;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 4, delta);
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 3]} intensity={1.6} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#e8d3a8" />
      <group ref={group} position={[0, -0.85, 0]}>
        <mesh geometry={shadeGeo} material={mat} />
        <mesh geometry={baseGeo} material={mat} />
        <lineSegments geometry={wireShade} material={wireMat} />
        <lineSegments geometry={wireBase} material={wireMat} />
        <pointLight ref={bulb} position={[0, 1.25, 0]} intensity={0} distance={5} decay={2} color="#ffb869" />
        <mesh ref={nozzle} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.018, 12, 96]} />
          <meshBasicMaterial color="#ffb869" toneMapped={false} />
        </mesh>
        {/* Plinth */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.04, 96]} />
          <meshStandardMaterial color="#e8d3a8" roughness={0.8} />
        </mesh>
        {/* Keepsake box: low walls rise around the base, the ochre lid floats above. */}
        <group ref={box} visible={false}>
          {[0, 1, 2, 3].map((i) => (
            <group key={i} rotation={[0, (i * Math.PI) / 2, 0]} position={[0, 0.36, 0]}>
              <mesh position={[0, 0, 0.84]}>
                <boxGeometry args={[1.71, 0.72, 0.035]} />
                <meshStandardMaterial color="#efe4cc" roughness={0.75} />
              </mesh>
              {/* gold rim */}
              <mesh position={[0, 0.36, 0.84]}>
                <boxGeometry args={[1.72, 0.02, 0.04]} />
                <meshStandardMaterial color="#c0823a" roughness={0.4} metalness={0.5} />
              </mesh>
            </group>
          ))}
        </group>
        <mesh ref={lid} visible={false}>
          <boxGeometry args={[1.78, 0.14, 1.78]} />
          <meshStandardMaterial color="#c0823a" roughness={0.55} />
        </mesh>
      </group>
    </>
  );
}
