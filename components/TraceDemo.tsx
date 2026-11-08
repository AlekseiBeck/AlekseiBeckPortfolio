"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SERVICES = 6;

// Illustrative only: index of the service where each sample loan stops, or null if it clears.
const LOANS = [
  { label: "Loan A", failsAt: 3 },
  { label: "Loan B", failsAt: 1 },
  { label: "Loan C", failsAt: null },
];

export default function TraceDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [loan, setLoan] = useState(0);
  const [cursor, setCursor] = useState(-1);
  const [runId, setRunId] = useState(0);

  const { failsAt } = LOANS[loan];
  const last = failsAt ?? SERVICES;

  useEffect(() => {
    if (inView) setRunId(1);
  }, [inView]);

  useEffect(() => {
    if (runId === 0) return;
    if (reduced) {
      setCursor(last);
      return;
    }
    setCursor(0);
    const timers = Array.from({ length: last }, (_, i) => setTimeout(() => setCursor(i + 1), 380 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [runId, last, reduced]);

  const done = cursor >= last;

  return (
    <div ref={ref} className="flex flex-col rounded border border-line bg-ink p-5 font-mono text-[14px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-dim">Trace a loan</span>
        <div role="group" aria-label="Sample loan" className="flex gap-1">
          {LOANS.map((l, i) => (
            <button
              key={l.label}
              type="button"
              aria-pressed={loan === i}
              onClick={() => {
                setLoan(i);
                setRunId((r) => r + 1);
              }}
              className={`rounded px-3 py-2 transition-colors ${loan === i ? "bg-paper text-ink" : "text-dim hover:text-paper"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center py-12">
        <ol className="flex w-full items-center" aria-hidden>
          {Array.from({ length: SERVICES }, (_, i) => {
            const passed = cursor > i;
            const failed = done && failsAt === i;
            const active = cursor === i && !done;
            const color = failed ? "bg-fail" : passed ? "bg-pass" : active ? "bg-run" : "bg-line";
            return (
              <li key={i} className={`flex items-center ${i ? "flex-1" : ""}`}>
                {i > 0 && <span className={`h-px flex-1 transition-colors duration-300 ${cursor >= i ? "bg-pass" : "bg-line"}`} />}
                <span className="relative flex flex-col items-center">
                  <span className={`size-7 rounded-sm transition-colors duration-300 sm:size-10 ${color}`} />
                  <span className="absolute top-full mt-2 text-[12px] text-dim">s{i + 1}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p aria-live="polite" className="min-h-[3em] border-t border-line pt-4 text-[15px]">
        {!done ? (
          <span className="text-run">Tracing through the approval pipeline…</span>
        ) : failsAt === null ? (
          <span className="text-pass">Cleared every service.</span>
        ) : (
          <span className="text-fail">Stopped at service {failsAt + 1}. That is where to look.</span>
        )}
      </p>
      <p className="mt-2 text-[12.5px] text-dim">Illustrative sample. Real loan data stays internal.</p>
    </div>
  );
}
