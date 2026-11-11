"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const STAGES = ["Intake", "Credit", "Income", "Property", "Insurance", "Closing"];

// Invented loans. `stop` is the index of the stage that fails, or null when the loan clears.
const LOANS: { number: string; stop: number | null; why?: string }[] = [
  { number: "0417", stop: 3, why: "no appraised value on the file" },
  { number: "0932", stop: 1, why: "credit report came back empty" },
  { number: "1288", stop: null },
];

const STEP_MS = 340;

/** How many stages report back before a trace is over. */
const lastStep = (stop: number | null) => (stop === null ? STAGES.length : stop + 1);

export default function TraceDemo() {
  const figure = useRef<HTMLElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [loan, setLoan] = useState(0);
  // Stages that have reported back so far. -1 until the first trace starts.
  const [step, setStep] = useState(-1);

  const { number, stop, why } = LOANS[loan];
  const done = step >= lastStep(stop);

  const trace = (i: number) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const end = lastStep(LOANS[i].stop);
    setLoan(i);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(end);
      return;
    }
    setStep(0);
    timers.current = Array.from({ length: end }, (_, n) => setTimeout(() => setStep(n + 1), STEP_MS * (n + 1)));
  };

  // Run the first trace when the figure scrolls into view, so nobody misses it.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        trace(0);
      },
      { threshold: 0.6 },
    );
    io.observe(figure.current!);
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const stateOf = (i: number) => {
    if (i < step) return i === stop ? "fail" : "pass";
    if (done) return "skip";
    return i === step ? "run" : "wait";
  };

  return (
    <figure ref={figure} className="mt-8 max-w-[40rem]">
      <div role="group" aria-label="Sample loan" className="grid grid-cols-3 gap-1 sm:flex">
        {LOANS.map((l, i) => (
          <button
            key={l.number}
            type="button"
            aria-pressed={loan === i}
            onClick={() => trace(i)}
            className={`min-h-11 border border-b-0 border-form px-2 py-2 text-[0.8125rem] font-semibold leading-tight transition-colors sm:px-5 sm:text-[0.875rem] ${loan === i ? "bg-form text-sheet" : "bg-sheet/50 text-form hover:bg-sheet"}`}
          >
            Loan {l.number}
          </button>
        ))}
      </div>

      <div className="border border-form bg-sheet">
        <div aria-hidden className="flex items-center px-4 py-6 sm:px-6 sm:pb-12">
          {STAGES.map((stage, i) => {
            const state = stateOf(i);
            const reached = state === "pass" || state === "fail" || state === "run";
            return (
              <Fragment key={stage}>
                {i > 0 && (
                  <span
                    className={`h-0 flex-1 border-t transition-colors duration-200 ${
                      reached ? "border-form" : state === "skip" ? "border-dashed border-form/40" : "border-form/30"
                    }`}
                  />
                )}
                <span className="relative shrink-0">
                  <span
                    className={`grid size-8 place-items-center border-[1.5px] font-type text-[1.0625rem] font-bold leading-none transition-colors duration-200 sm:size-10 ${
                      {
                        pass: "border-form text-form",
                        fail: "thunk border-stamp bg-stamp text-sheet [--r:0deg]",
                        run: "border-form bg-form text-sheet",
                        skip: "border-dashed border-form/40 text-form/40",
                        wait: "border-form/40 text-form/60",
                      }[state]
                    }`}
                  >
                    {state === "pass" ? "✓" : state === "fail" ? "X" : i + 1}
                  </span>
                  <span
                    className={`label absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 transition-opacity duration-200 sm:block ${state === "skip" ? "opacity-40" : ""}`}
                  >
                    {stage}
                  </span>
                </span>
              </Fragment>
            );
          })}
        </div>

        <p aria-live="polite" className="min-h-[5.75rem] border-t border-form/25 px-4 py-3 leading-snug sm:min-h-[4.5rem] sm:px-6">
          {step < 0 ? null : !done ? (
            <span className="font-type text-soft">Tracing loan {number}…</span>
          ) : stop === null ? (
            <>
              <strong className="font-bold text-form">Cleared all {STAGES.length} stages.</strong> Whatever is wrong
              with loan {number}, it isn&apos;t the pipeline.
            </>
          ) : (
            <>
              <strong className="font-bold text-stamp">Stopped at {STAGES[stop]}</strong>, stage {stop + 1} of{" "}
              {STAGES.length}: {why}. Nothing after it ran.
            </>
          )}
        </p>
      </div>

      <figcaption className="mt-2.5 text-[0.875rem] leading-snug text-soft">
        A sketch of the idea: follow one loan stage by stage and stop where it broke. These loans and stage names are
        invented. The real screens are internal, so there are no screenshots.
      </figcaption>
    </figure>
  );
}
