"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type CaseId, PROJECTS } from "@/lib/content";
import { pauseScroll } from "@/lib/stage";
import ScanDemo from "./ScanDemo";
import TraceDemo from "./TraceDemo";

const PREFIX = "#case-";
const spring = { type: "spring", stiffness: 240, damping: 32 } as const;

function idFromHash(): CaseId | null {
  const id = window.location.hash.startsWith(PREFIX) ? window.location.hash.slice(PREFIX.length) : "";
  return PROJECTS.some((p) => p.id === id) ? (id as CaseId) : null;
}

export default function Artifacts() {
  const [openId, setOpenId] = useState<CaseId | null>(null);
  const pushed = useRef(false);
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : spring;

  // The URL hash is the source of truth, so the back button closes a case study.
  useEffect(() => {
    const sync = () => setOpenId(idFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => pauseScroll(openId !== null), [openId]);

  const open = (id: CaseId) => {
    pushed.current = true;
    window.location.hash = `case-${id}`;
  };

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname);
      setOpenId(null);
    }
  }, []);

  const project = PROJECTS.find((p) => p.id === openId);

  return (
    <section id="artifacts" className="relative z-20 bg-ink px-5 py-28 cine:px-8 cine:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(84px,18vw,300px)] font-black uppercase leading-[0.8]">Artifacts</h2>
        <p className="max-w-sm pb-2 text-[18px] leading-[1.4] text-dim">
          Two builds worth opening. Run them here, then read how they work.
        </p>
      </div>

      <div className="mt-16 space-y-6 cine:mt-24">
        {PROJECTS.map((p, i) => (
          <article key={p.id} className="relative">
            <motion.div layoutId={`shell-${p.id}`} transition={transition} className="absolute inset-0 rounded-md border border-line bg-panel" />
            <div className={`relative grid gap-10 p-6 md:p-10 lg:grid-cols-2 lg:gap-14 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="flex flex-col">
                <p className="font-mono text-[13px] text-dim">
                  {p.context} · {p.dates}
                </p>
                <motion.h3
                  layoutId={`title-${p.id}`}
                  transition={transition}
                  className="mt-4 w-fit font-display text-[clamp(64px,8.6vw,136px)] font-black uppercase leading-[0.85]"
                >
                  {p.name}
                </motion.h3>
                <p className="mt-6 max-w-xl text-[19px] leading-[1.45]">{p.summary}</p>
                <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="font-display text-[46px] font-black uppercase leading-none">{s.value}</dd>
                      <dd aria-hidden className="mt-1 font-mono text-[13px] text-dim">{s.label}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto flex flex-wrap items-center gap-5 pt-10">
                  <button
                    type="button"
                    onClick={() => open(p.id)}
                    className="rounded bg-paper px-5 py-3 font-mono text-[14px] font-medium text-ink transition-colors hover:bg-pass"
                  >
                    Read the case study
                  </button>
                  {p.link && (
                    <a href={p.link.href} target="_blank" rel="noreferrer" className="font-mono text-[14px] underline decoration-line underline-offset-4 hover:decoration-pass">
                      {p.link.label} ↗
                    </a>
                  )}
                </div>
              </div>
              {p.id === "stakdx" ? <ScanDemo /> : <TraceDemo />}
            </div>
          </article>
        ))}
      </div>

      <Dialog.Root open={project !== undefined} onOpenChange={(o) => !o && close()}>
        <AnimatePresence>
          {project && (
            <Dialog.Portal forceMount>
              <Dialog.Content forceMount aria-describedby={undefined} data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
                <motion.div layoutId={`shell-${project.id}`} transition={transition} className="fixed inset-0 bg-panel" />
                <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-20 md:px-10">
                  <Dialog.Close className="fixed right-5 top-4 z-10 rounded border border-line bg-panel px-3 py-2 font-mono text-[13px] transition-colors hover:border-paper md:right-8">
                    Close
                  </Dialog.Close>
                  <Dialog.Title asChild>
                    <motion.h2
                      layoutId={`title-${project.id}`}
                      transition={transition}
                      className="w-fit font-display text-[clamp(72px,14vw,190px)] font-black uppercase leading-[0.85]"
                    >
                      {project.name}
                    </motion.h2>
                  </Dialog.Title>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 0.18, duration: 0.4 } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    <p className="mt-5 font-mono text-[13px] text-dim">
                      {project.context} · {project.dates}
                    </p>
                    <p className="mt-8 max-w-3xl text-[clamp(22px,2.4vw,30px)] leading-[1.3]">{project.summary}</p>
                    {project.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.image.src} alt={project.image.alt} width={1440} height={900} loading="lazy" className="mt-12 w-full rounded border border-line" />
                    )}
                    <div className="mt-14 space-y-12">
                      {project.sections.map((s) => (
                        <section key={s.heading} className="grid gap-3 border-t border-line pt-6 md:grid-cols-[220px_1fr] md:gap-8">
                          <h3 className="font-mono text-[14px] text-dim">{s.heading}</h3>
                          <p className="max-w-2xl text-[19px] leading-[1.5]">{s.body}</p>
                        </section>
                      ))}
                      <section className="grid gap-3 border-t border-line pt-6 md:grid-cols-[220px_1fr] md:gap-8">
                        <h3 className="font-mono text-[14px] text-dim">Stack</h3>
                        <p className="font-mono text-[15px] leading-[1.7]">{project.stack.join(" · ")}</p>
                      </section>
                    </div>
                    {project.note && <p className="mt-12 font-mono text-[13px] text-dim">{project.note}</p>}
                    {project.link && (
                      <a href={project.link.href} target="_blank" rel="noreferrer" className="mt-12 inline-block rounded bg-paper px-5 py-3 font-mono text-[14px] font-medium text-ink transition-colors hover:bg-pass">
                        {project.link.label} ↗
                      </a>
                    )}
                  </motion.div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  );
}
