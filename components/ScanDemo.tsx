"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const STEPS = ["Pull real-time market data", "Score global news sentiment", "Run Claude analysis layer", "Rank by confidence"];

const BUDGETS = [1000, 5000, 25000];

// Placeholder symbols and scores. This shows the flow, not real recommendations.
const SAMPLES = [
  [["Long", "TKR-A", 84, 0.55], ["Call", "TKR-B", 71, 0.25], ["Short", "TKR-C", 66, 0.2]],
  [["Long", "TKR-D", 88, 0.4], ["Put", "TKR-E", 77, 0.25], ["Call", "TKR-A", 73, 0.2], ["Short", "TKR-F", 62, 0.15]],
  [["Short", "TKR-G", 91, 0.3], ["Long", "TKR-D", 86, 0.3], ["Call", "TKR-H", 79, 0.25], ["Put", "TKR-C", 68, 0.15]],
] as const;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function ScanDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [budget, setBudget] = useState(1);
  const [step, setStep] = useState(-1);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (inView) setRunId(1);
  }, [inView]);

  useEffect(() => {
    if (runId === 0) return;
    if (reduced) {
      setStep(STEPS.length);
      return;
    }
    setStep(0);
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), 520 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [runId, reduced]);

  const done = step >= STEPS.length;
  const running = step >= 0 && !done;
  const results = SAMPLES[budget];

  const choose = (i: number) => {
    setBudget(i);
    setRunId((r) => r + 1);
  };

  return (
    <div ref={ref} className="flex flex-col rounded border border-line bg-ink p-5 font-mono text-[14px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-dim">Scan budget</span>
        <div role="group" aria-label="Scan budget" className="flex gap-1">
          {BUDGETS.map((b, i) => (
            <button
              key={b}
              type="button"
              aria-pressed={budget === i}
              onClick={() => choose(i)}
              className={`rounded px-3 py-2 transition-colors ${budget === i ? "bg-paper text-ink" : "text-dim hover:text-paper"}`}
            >
              {usd(b)}
            </button>
          ))}
        </div>
      </div>

      <ol className="mt-5 space-y-1.5 border-y border-line py-4">
        {STEPS.map((s, i) => {
          const state = step > i ? "pass" : step === i ? "run" : "wait";
          return (
            <li key={s} className={`flex justify-between gap-4 ${state === "wait" ? "text-pending" : ""}`}>
              <span>{s}</span>
              <span className={state === "pass" ? "text-pass" : state === "run" ? "text-run" : ""}>
                {state === "pass" ? "✓" : state === "run" ? "…" : "·"}
              </span>
            </li>
          );
        })}
      </ol>

      <ul aria-live="polite" className="mt-4 min-h-[172px] space-y-3">
        {done &&
          results.map(([side, symbol, confidence, weight]) => (
            <li key={symbol + side} className="grid grid-cols-[52px_64px_1fr_72px] items-center gap-3">
              <span className="text-dim">{side}</span>
              <span>{symbol}</span>
              <span className="relative h-1.5 bg-line" role="img" aria-label={`Confidence ${confidence}`}>
                <span className="absolute inset-y-0 left-0 bg-pass" style={{ width: `${confidence}%` }} />
              </span>
              <span className="text-right">{usd(BUDGETS[budget] * weight)}</span>
            </li>
          ))}
        {running && <li className="text-dim">Scanning…</li>}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-4 border-t border-line pt-3 text-[12.5px] text-dim">
        <span>Illustrative sample. Placeholder tickers, not real picks.</span>
        <button type="button" onClick={() => setRunId((r) => r + 1)} disabled={running} className="shrink-0 text-paper underline underline-offset-4 disabled:opacity-40">
          Run again
        </button>
      </div>
    </div>
  );
}
