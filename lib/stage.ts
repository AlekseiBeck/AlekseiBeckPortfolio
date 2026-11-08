import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const CINE_QUERY =
  "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";

/** Written by the scroll handler each frame, read by the WebGL loop. */
export const stage = { collapse: 0, token: 0 };

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function pauseScroll(paused: boolean) {
  if (paused) lenis?.stop();
  else lenis?.start();
}

export function goTo(id: string) {
  const pin = ScrollTrigger.getById("stage");
  const el = document.getElementById(id);
  if (!el) return;

  let target: number | HTMLElement = el;
  if (id === "top") target = 0;
  else if (id === "pipeline" && pin) target = pin.start + window.innerHeight * 1.12;

  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
