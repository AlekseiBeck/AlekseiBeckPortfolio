"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { stage } from "@/lib/stage";

const vertexShader = /* glsl */ `
  uniform float uTime, uIntro, uCollapse, uDpr, uRailY, uWidth, uTokenX, uSize, uRadius;
  uniform vec2 uMouse;
  attribute vec4 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  const float PI = 3.14159265;
  const vec3 INK = vec3(0.925, 0.91, 0.875);
  const vec3 RUN = vec3(1.0, 0.70, 0.14);
  const vec3 PASS = vec3(0.21, 0.90, 0.65);
  const vec3 PEND = vec3(0.42, 0.44, 0.48);

  void main() {
    vec2 target = position.xy;
    float W = uWidth * 1.1;

    // Intro: particles stream in along the rail, then fan up into the letters.
    float start = aRand.x * 0.42 + (target.x / uWidth + 0.5) * 0.28;
    float i = clamp((uIntro - start) / 0.3, 0.0, 1.0);
    float t = 1.0 - pow(1.0 - i, 4.0);
    vec2 from = vec2(-W * 0.5 - aRand.y * W * 0.25, uRailY + (aRand.z - 0.5) * 30.0);
    vec2 pos = mix(from, target, t);
    pos.y += sin(t * PI) * (aRand.w - 0.5) * 180.0;

    // Letters breathe slightly so they read as alive.
    pos += vec2(sin(uTime * 1.3 + aRand.x * 40.0), cos(uTime * 1.1 + aRand.y * 40.0)) * 0.6 * t;

    // Cursor pushes particles away.
    vec2 d = pos - uMouse;
    float l = length(d) + 0.001;
    float force = smoothstep(uRadius, 0.0, l);
    pos += d / l * force * force * uRadius * (0.35 + aRand.z * 0.5);

    // Scroll: the name pours down into a single flowing rail.
    float cs = aRand.w * 0.5;
    float c = smoothstep(cs, cs + 0.5, uCollapse);
    float cc = c * c * (3.0 - 2.0 * c);
    float flow = mod(aRand.y * W + uTime * (12.0 + aRand.x * 44.0), W) - W * 0.5;
    vec2 line = vec2(flow, uRailY + (aRand.z - 0.5) * (2.0 + aRand.w * 6.0));
    pos = mix(pos, line, cc);
    pos.x += sin(c * PI) * (aRand.x - 0.5) * 90.0;

    // Colour tells the build state: green behind the token, amber at it, grey ahead.
    float dist = line.x - uTokenX;
    vec3 rail = mix(PASS, RUN, smoothstep(-70.0, -10.0, dist));
    rail = mix(rail, PEND, smoothstep(10.0, 80.0, dist));
    vec3 letter = mix(INK, RUN, force * 0.9);
    vColor = mix(letter, rail, cc);
    vAlpha = smoothstep(0.0, 0.08, i) * mix(1.0, 0.55 + aRand.z * 0.45, cc);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
    gl_PointSize = mix(uSize * (0.8 + aRand.z * 0.4), 1.5 + aRand.x * 1.4, cc) * uDpr;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.3, d));
  }
`;

/** Rasterises the real h1 words and returns particle positions centred on the canvas. */
function sampleName(width: number, height: number, canvasEl: HTMLElement, maxCount: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";

  const origin = canvasEl.getBoundingClientRect();
  document.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
    const cs = getComputedStyle(word);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText("A");
    const rect = word.getBoundingClientRect();
    const baseline =
      rect.top - origin.top + (rect.height - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    ctx.fillText(word.textContent ?? "", rect.left - origin.left, baseline);
  });

  const { data } = ctx.getImageData(0, 0, width, height);
  let filled = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;

  const step = Math.max(1.5, Math.sqrt(filled / maxCount));
  const points: number[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 128) {
        points.push(x + (Math.random() - 0.5) * step * 0.3 - width / 2, height / 2 - y + (Math.random() - 0.5) * step * 0.3, 0);
      }
    }
  }
  return { positions: new Float32Array(points), step };
}

function Field() {
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const gl = useThree((s) => s.gl);
  const [sample, setSample] = useState<{ positions: Float32Array; step: number } | null>(null);
  const started = useRef(false);
  const introStart = useRef(0);
  const mouse = useRef(new THREE.Vector2(99999, 99999));

  useEffect(() => {
    let dead = false;
    document.fonts.ready.then(() => {
      if (dead) return;
      setSample(sampleName(size.width, size.height, gl.domElement, size.width < 768 ? 12000 : 48000));
    });
    return () => {
      dead = true;
    };
  }, [size.width, size.height, gl]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = gl.domElement.getBoundingClientRect();
      mouse.current.set(e.clientX - r.left - r.width / 2, r.height / 2 - (e.clientY - r.top));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  const geometry = useMemo(() => {
    if (!sample) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sample.positions, 3));
    const count = sample.positions.length / 3;
    const rand = new Float32Array(count * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    return g;
  }, [sample]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uIntro: { value: 0 },
          uCollapse: { value: 0 },
          uDpr: { value: 1 },
          uRailY: { value: 0 },
          uWidth: { value: 1 },
          uTokenX: { value: 0 },
          uSize: { value: 3 },
          uRadius: { value: 130 },
          uMouse: { value: new THREE.Vector2(99999, 99999) },
        },
      }),
    [],
  );

  useEffect(() => () => geometry?.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (!geometry || !sample) return;
    const u = material.uniforms;
    const time = clock.getElapsedTime();
    if (!started.current) {
      started.current = true;
      introStart.current = time;
    }
    const W = size.width * 1.1;
    const rail = document.querySelector<HTMLElement>("[data-rail]");
    const canvasRect = gl.domElement.getBoundingClientRect();
    const railY = rail ? rail.getBoundingClientRect().top - canvasRect.top : size.height * 0.9;

    u.uTime.value = time;
    u.uIntro.value = Math.min(1, (time - introStart.current) / 2.6);
    u.uCollapse.value = stage.collapse;
    u.uDpr.value = dpr;
    u.uWidth.value = size.width;
    u.uRailY.value = size.height / 2 - railY;
    u.uTokenX.value = stage.token * W - W / 2;
    u.uSize.value = sample.step * 1.02;
    (u.uMouse.value as THREE.Vector2).lerp(mouse.current, 0.14);
  });

  if (!geometry) return null;
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export default function ParticleScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering once the stage has scrolled away.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        orthographic
        flat
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
      >
        <Field />
      </Canvas>
    </div>
  );
}
