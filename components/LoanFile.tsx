"use client";

import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import { evaluate, LIABILITIES, LIMITS, type Loan, SCENARIOS } from "@/lib/rules";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={title} className="border-t border-form first:border-t-0">
      <p className="label flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 bg-form/[0.07] px-4 py-2">
        {title}
        {note && <span className="font-medium normal-case tracking-normal text-soft">{note}</span>}
      </p>
      {children}
    </div>
  );
}

function Slider({ id, label, value, min, max, step, format, note, onChange }: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  note?: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="px-4 pb-1 pt-3">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.9375rem] font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-type text-[1.0625rem] font-bold">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
      />
      {note && <p className="-mt-1 pb-2 font-type text-[0.875rem] text-soft">{note}</p>}
    </div>
  );
}

/** A form checkbox, marked the way a typewriter would: with an X. */
function Check({ checked, onChange, disabled, radio, children }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  radio?: string;
  children: ReactNode;
}) {
  return (
    <label className={`relative flex min-h-11 items-center gap-3 px-4 py-1.5 text-[0.9375rem] font-medium ${disabled ? "text-soft/60" : "cursor-pointer"}`}>
      <input
        type={radio ? "radio" : "checkbox"}
        name={radio}
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className="grid size-5 shrink-0 place-items-center border-[1.5px] border-form bg-sheet font-type text-[1.0625rem] font-bold leading-none text-transparent peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-form peer-disabled:border-form/30"
      >
        <span className="translate-y-[0.06em]">X</span>
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}

function Gauge({ label, value, text, limit, max }: { label: string; value: number; text: string; limit: number; max: number }) {
  const over = value > limit;
  return (
    <div className="px-4 py-4">
      <p className="label">{label}</p>
      <p className={`mt-1.5 font-type text-[2rem] font-bold leading-none ${over ? "text-stamp" : ""}`}>{text}</p>
      <div className="relative mt-3 h-1.5 bg-form/15">
        <div
          className={`h-full transition-[width] duration-150 ${over ? "bg-stamp" : "bg-form"}`}
          style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        />
        <span className="absolute -bottom-1 -top-1 w-0.5 bg-ink" style={{ left: `${(limit / max) * 100}%` }} />
      </div>
      <p className="mt-2 font-type text-[0.875rem] text-soft">limit {limit}%</p>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-3 py-2.5 sm:px-4">
      <p className="label">{label}</p>
      <p className="mt-1 font-type text-[1rem]">{value}</p>
    </div>
  );
}

export default function LoanFile() {
  const [scenario, setScenario] = useState(0);
  const [loan, setLoan] = useState<Loan>(SCENARIOS[0].loan);
  const result = useMemo(() => evaluate(loan), [loan]);

  const set = <K extends keyof Loan>(key: K, value: Loan[K]) => setLoan((l) => ({ ...l, [key]: value }));
  const pick = (i: number) => {
    setScenario(i);
    setLoan(SCENARIOS[i].loan);
  };

  const clear = result.open === 0;
  const dti = `${result.dti.toFixed(1)}%`;
  const count = `${result.open} ${result.open === 1 ? "condition" : "conditions"}`;

  return (
    <div>
      <div role="group" aria-label="Borrower" className="grid grid-cols-3 gap-1 sm:flex">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            aria-pressed={scenario === i}
            onClick={() => pick(i)}
            className={`min-h-11 border border-b-0 border-form px-2 py-2 text-[0.8125rem] font-semibold leading-tight transition-colors sm:px-5 sm:text-[0.875rem] ${scenario === i ? "bg-form text-sheet" : "bg-sheet/50 text-form hover:bg-sheet"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="border border-form bg-sheet">
        <div className="flex min-h-11 items-center justify-between gap-4 bg-form px-4 text-sheet">
          <p className="text-[0.9375rem] font-bold">Loan file</p>
          <p className="flex items-center gap-4 font-type text-[0.875rem]">
            {loan !== SCENARIOS[scenario].loan && (
              <button type="button" onClick={() => pick(scenario)} className="-my-1 px-2 py-3 underline underline-offset-4 hover:no-underline">
                Reset
              </button>
            )}
            <span>{result.rules.length} rules</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* ---- The file ---- */}
          <div className="order-2 flex flex-col border-t border-form lg:order-1 lg:border-r lg:border-t-0">
            <Group title="Property">
              <Slider
                id="lf-value"
                label="Appraised value"
                value={loan.value}
                min={150_000}
                max={900_000}
                step={5_000}
                format={usd}
                onChange={(v) => set("value", v)}
              />
              <Slider
                id="lf-down"
                label="Down payment"
                value={loan.downPct}
                min={3}
                max={40}
                step={1}
                format={(v) => `${v}%`}
                note={`Borrowing ${usd(result.loanAmount)}`}
                onChange={(v) => set("downPct", v)}
              />
              <Check checked={loan.floodZone} onChange={(v) => set("floodZone", v)}>
                In a flood zone
              </Check>
            </Group>

            <Group title="Insurance">
              <Slider
                id="lf-coverage"
                label="Dwelling coverage"
                value={loan.coverage}
                min={100_000}
                max={900_000}
                step={5_000}
                format={usd}
                onChange={(v) => set("coverage", v)}
              />
              <Check checked={loan.floodPolicy} disabled={!loan.floodZone} onChange={(v) => set("floodPolicy", v)}>
                Flood policy on file
              </Check>
            </Group>

            <Group title="Income">
              <Slider
                id="lf-income"
                label="Monthly income"
                value={loan.income}
                min={3_000}
                max={20_000}
                step={250}
                format={usd}
                onChange={(v) => set("income", v)}
              />
              <div className="grid grid-cols-2">
                <Check radio="lf-employment" checked={!loan.selfEmployed} onChange={() => set("selfEmployed", false)}>
                  W-2 employee
                </Check>
                <Check radio="lf-employment" checked={loan.selfEmployed} onChange={() => set("selfEmployed", true)}>
                  Self-employed
                </Check>
              </div>
              <Slider
                id="lf-years"
                label="Years doing it"
                value={loan.years}
                min={0}
                max={10}
                step={1}
                format={(v) => (v === 1 ? "1 year" : `${v} years`)}
                onChange={(v) => set("years", v)}
              />
            </Group>

            <Group title="Liabilities" note="as listed, matched to the credit report">
              <ul className="pb-2 pt-1">
                {LIABILITIES.map((liability) => {
                  const listed = loan.listed.includes(liability.id);
                  const match = result.matches.find((m) => m.liability === liability);
                  return (
                    <li key={liability.id}>
                      <Check
                        checked={listed}
                        onChange={(v) =>
                          set("listed", v ? [...loan.listed, liability.id] : loan.listed.filter((id) => id !== liability.id))
                        }
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span>{liability.name}</span>
                          <span className="font-type">{usd(liability.payment)}/mo</span>
                        </span>
                        <span className={`block font-type text-[0.875rem] leading-snug ${match ? "text-soft" : "text-stamp"}`}>
                          {match
                            ? `= ${match.tradeline.name}, ${usd(match.tradeline.payment)}/mo (${match.score.toFixed(2)})`
                            : "left off the application"}
                        </span>
                      </Check>
                    </li>
                  );
                })}
              </ul>
            </Group>

            <p className="mt-auto border-t border-form/25 px-4 py-3 text-[0.8125rem] leading-relaxed text-soft">
              The borrowers, creditors, rates, and thresholds are invented, and none of this is UWM&apos;s code or data.
              The engine is real: about 200 lines of TypeScript that re-evaluate the file every time you touch it.
            </p>
          </div>

          {/* ---- What the engine makes of it ---- */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 divide-x divide-form/25">
              <Gauge label="Loan-to-value" value={result.ltv} text={`${result.ltv}%`} limit={LIMITS.ltv} max={100} />
              <Gauge label="Debt-to-income" value={result.dti} text={dti} limit={LIMITS.dti} max={70} />
            </div>
            <div className="grid grid-cols-3 divide-x divide-form/25 border-t border-form/25">
              <Figure label="Loan" value={usd(result.loanAmount)} />
              <Figure label="Housing/mo" value={usd(result.housing)} />
              <Figure label="Debts/mo" value={usd(result.debts)} />
            </div>

            <div aria-live="polite" className="flex h-28 items-center border-y border-form px-4">
              {clear ? (
                <p className="stamp inked thunk mx-auto text-[clamp(1.5rem,6vw,2rem)] !text-form">Clear to close</p>
              ) : (
                <p className="flex items-center gap-4">
                  <span className="font-type text-[3.5rem] font-bold leading-none text-stamp">{result.open}</span>
                  <span className="text-[1.0625rem] font-semibold leading-snug">
                    {result.open === 1 ? "condition" : "conditions"} to clear.
                    <span className="block font-normal text-soft">Change the file until none are left.</span>
                  </span>
                </p>
              )}
            </div>

            <ol>
              {result.rules.map((rule) => (
                <li key={rule.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 border-t border-form/25 px-4 py-3 first:border-t-0">
                  <div>
                    <p className="font-type text-[0.875rem] text-soft">
                      {rule.id} / {rule.part}
                    </p>
                    <p className="mt-0.5 font-semibold">{rule.name}</p>
                    <p className="font-type text-[0.875rem] text-soft">when {rule.when}</p>
                  </div>
                  <div className="pt-0.5">
                    {rule.conditions.length ? (
                      <span className="stamp thunk text-[0.75rem]">Condition</span>
                    ) : (
                      <span className="font-type text-[0.875rem] font-bold text-form">pass</span>
                    )}
                  </div>
                  {rule.conditions.map((condition) => (
                    <p key={condition} className="col-span-2 mt-2 text-[0.9375rem] font-medium leading-snug text-stamp">
                      {condition}
                    </p>
                  ))}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* On a phone the results scroll out of view while you edit, so keep a running total in reach. */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-form bg-form px-4 py-2.5 font-type text-[0.875rem] text-sheet lg:hidden">
          <span>
            LTV {result.ltv}% · DTI {dti}
          </span>
          <span className="font-bold">{clear ? "Clear to close" : `${count} open`}</span>
        </div>
      </div>
    </div>
  );
}
