"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const STAGES = ["Intake", "Credit", "Income", "Property", "Insurance", "Closing"];

// Invented loans, calls and error text. `stop` is the index of the stage that fails, or null when the loan clears.
const LOANS: { number: string; stop: number | null; call: string; response: string; message: string }[] = [
  {
    number: "0417",
    stop: 3,
    call: "GetLoanFacts",
    response: "500 Internal Server Error",
    message: 'NullReferenceException building fact "LoanToValue": Property.AppraisedValue is null.',
  },
  {
    number: "0932",
    stop: 1,
    call: "GetLoanRules",
    response: "400 Bad Request",
    message: "Borrowers[1].CreditReportId: The CreditReportId field is required.",
  },
  {
    number: "0655",
    stop: 0,
    call: "GetBorrowerInformation",
    response: "404 Not Found",
    message: "Borrower 2 not found. Loan 0655 lists 2 borrowers but has 1 borrower record.",
  },
  {
    number: "1103",
    stop: 4,
    call: "RunInsuranceRules",
    response: "500 Internal Server Error",
    message: 'InvalidOperationException in rule "FloodPolicyRequired": Sequence contains no elements.',
  },
  {
    number: "1288",
    stop: null,
    call: "GetLoanRules",
    response: "200 OK",
    message: "No errors. Every call on this loan returned 200.",
  },
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

  const { number, stop, call, response, message } = LOANS[loan];
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
      <div role="group" aria-label="Sample loan" className="grid grid-cols-5 gap-1">
        {LOANS.map((l, i) => (
          <button
            key={l.number}
            type="button"
            aria-pressed={loan === i}
            onClick={() => trace(i)}
            className={`min-h-11 border border-b-0 border-form px-1 py-2 text-[0.8125rem] font-semibold leading-tight transition-colors sm:text-[0.875rem] ${loan === i ? "bg-form text-sheet" : "bg-sheet/50 text-form hover:bg-sheet"}`}
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

        <div aria-live="polite" className="border-t border-form/25">
          <p className="min-h-[5.75rem] px-4 py-3 leading-snug sm:min-h-[4.5rem] sm:px-6">
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
                {STAGES.length}. Nothing after it ran.
              </>
            )}
          </p>

          {/* What came back from the call the trace ended on. */}
          <dl className="grid border-t border-form/25 font-type text-[0.875rem] leading-snug sm:grid-cols-2">
            <div className="border-b border-form/25 px-4 py-2.5 sm:border-r sm:px-6">
              <dt className="label font-sans">{stop === null ? "Last call" : "Failed call"}</dt>
              <dd className="mt-1">{done ? call : "…"}</dd>
            </div>
            <div className="border-b border-form/25 px-4 py-2.5 sm:px-6">
              <dt className="label font-sans">Response</dt>
              <dd className={`mt-1 ${done ? `font-bold ${stop === null ? "text-form" : "text-stamp"}` : ""}`}>
                {done ? response : "…"}
              </dd>
            </div>
            <div className="px-4 py-2.5 sm:col-span-2 sm:px-6">
              <dt className="label font-sans">Message</dt>
              <dd className="mt-1 min-h-[4lh] [overflow-wrap:anywhere] sm:min-h-[2lh]">{done ? message : "…"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <figcaption className="mt-2.5 text-[0.875rem] leading-snug text-soft">
        A sketch of the idea: follow one loan stage by stage, stop where it broke, and show what came back. The loans,
        stage names, calls and errors here are invented. The real screens are internal, so there are no screenshots.
      </figcaption>
    </figure>
  );
}
