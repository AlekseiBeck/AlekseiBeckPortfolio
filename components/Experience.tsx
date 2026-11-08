"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { CINE_QUERY, setLenis, stage } from "@/lib/stage";
import Hero from "./Hero";
import HeroParticles from "./HeroParticles";
import Pipeline from "./Pipeline";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function setPanel(panel: HTMLElement, p: number) {
  panel.style.setProperty("--p", p.toFixed(3));
  panel.dataset.state = p <= 0 ? "pending" : p < 1 ? "running" : "passed";
  panel.querySelectorAll<HTMLElement>("[data-to]").forEach((el) => {
    const from = Number(el.dataset.from ?? 0);
    const to = Number(el.dataset.to);
    const value = Math.round(from + (to - from) * clamp(p / 0.85));
    el.textContent = `${el.dataset.prefix ?? ""}${value.toLocaleString("en-US")}${el.dataset.suffix ?? ""}`;
  });
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.12 });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", el);
    const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", el);
    const fill = el.querySelector<HTMLElement>("[data-rail-fill]")!;
    const status = el.querySelector<HTMLElement>("[data-run-status]")!;

    const mm = gsap.matchMedia();

    mm.add(CINE_QUERY, () => {
      const layer = el.querySelector<HTMLElement>("[data-pipeline-layer]")!;
      const track = el.querySelector<HTMLElement>("[data-track]")!;
      const info = el.querySelector<HTMLElement>("[data-hero-info]")!;
      const name = el.querySelector<HTMLElement>("[data-name]")!;

      const apply = (self: ScrollTrigger) => {
        const h = window.innerHeight;
        const v = window.innerWidth;
        const travel = track.scrollWidth - v;
        const px = self.scroll() - self.start;

        const collapse = clamp(px / h);
        stage.collapse = collapse;
        info.style.opacity = String(1 - clamp(collapse / 0.35));
        info.style.transform = `translateY(${-collapse * 60}px)`;
        name.style.opacity = String(1 - clamp(collapse / 0.5));

        const show = clamp((px - h * 0.72) / (h * 0.3));
        layer.style.opacity = String(show);
        layer.style.visibility = show > 0 ? "visible" : "hidden";

        const offset = travel * clamp((px - h * 1.1) / travel);
        track.style.transform = `translate3d(${-offset}px,0,0)`;

        let total = 0;
        panels.forEach((panel, i) => {
          const p = clamp((offset + v * 0.72 - panel.offsetLeft) / (panel.offsetWidth * 0.62));
          setPanel(panel, p);
          nodes[i].dataset.state = panel.dataset.state;
          total += p;
        });

        const progress = total / panels.length;
        stage.token = progress;
        fill.style.transform = `scaleX(${progress})`;
        const done = panels.filter((p) => p.dataset.state === "passed").length;
        status.textContent = done === panels.length ? `build passed · ${done}/${done}` : `running · ${done}/${panels.length}`;
        status.style.color = done === panels.length ? "var(--color-pass)" : "var(--color-run)";
      };

      ScrollTrigger.create({
        id: "stage",
        trigger: el,
        pin: true,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.1 + (track.scrollWidth - window.innerWidth)}`,
        anticipatePin: 1,
        onUpdate: apply,
        onRefresh: apply,
      });

      return () => {
        stage.collapse = 0;
        stage.token = 0;
        track.style.transform = "";
        layer.style.opacity = "";
        layer.style.visibility = "";
        info.style.opacity = "";
        info.style.transform = "";
        name.style.opacity = "";
      };
    });

    mm.add("(prefers-reduced-motion: no-preference) and ((max-width: 1023px) or (max-height: 619px))", () => {
      const list = el.querySelector<HTMLElement>("[data-track]")!;
      const line = el.querySelector<HTMLElement>("[data-mobile-fill]")!;
      const triggers = panels.map((panel) =>
        ScrollTrigger.create({
          trigger: panel,
          start: "top 80%",
          end: "center 50%",
          onUpdate: (s) => setPanel(panel, s.progress),
          onRefresh: (s) => setPanel(panel, s.progress),
        }),
      );
      const fillLine = ScrollTrigger.create({
        trigger: list,
        start: "top 60%",
        end: "bottom 60%",
        onUpdate: (s) => (line.style.transform = `scaleY(${s.progress})`),
        onRefresh: (s) => (line.style.transform = `scaleY(${s.progress})`),
      });
      return () => {
        triggers.forEach((t) => t.kill());
        fillLine.kill();
        panels.forEach((panel) => setPanel(panel, 1));
      };
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);

    return () => {
      mm.revert();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div ref={root} id="top" className="relative overflow-clip cine:h-svh cine:overflow-hidden">
      <HeroParticles />
      <Hero />
      <Pipeline />
    </div>
  );
}
