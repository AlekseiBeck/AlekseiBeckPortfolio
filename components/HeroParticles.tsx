"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ParticleScene = dynamic(() => import("./ParticleScene"), { ssr: false });

export default function HeroParticles() {
  const [ready, setReady] = useState(false);

  // Three.js only loads after the page is usable, and never when effects are off.
  useEffect(() => {
    if (!document.documentElement.classList.contains("fx")) return;
    const id = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-svh">
      {ready && <ParticleScene />}
    </div>
  );
}
