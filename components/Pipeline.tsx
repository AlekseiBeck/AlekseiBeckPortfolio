import type { CSSProperties, ReactNode } from "react";
import { STAGE_NAMES } from "@/lib/content";

function seq(i: number, n: number) {
  return { "--i": i, "--n": n } as CSSProperties;
}

function Panel({ index, kicker, title, body, children, stacked }: {
  stacked?: boolean;
  index: number;
  kicker: string;
  title: ReactNode;
  body: ReactNode;
  children: ReactNode;
}) {
  return (
    <article
      data-panel
      data-state="passed"
      className={`relative pb-20 pl-9 cine:flex cine:shrink-0 cine:gap-[5vw] cine:pb-0 ${stacked ? "cine:w-screen cine:flex-col cine:justify-center cine:gap-[4vh] cine:px-8" : "cine:w-[min(86vw,1500px)] cine:items-center cine:pl-0 cine:pr-[8vw]"}`}
    >
      <span className="absolute left-[9px] top-1 z-10 size-[13px] rounded-full border-2 border-ink bg-pass cine:hidden" />
      <div className={`cine:shrink-0 ${stacked ? "" : "cine:w-fit cine:max-w-[62%]"}`}>
        <p className="flex items-center gap-4 font-mono text-[13px] text-dim">
          <span>
            {String(index + 1).padStart(2, "0")} / {STAGE_NAMES[index]}
          </span>
          <span className="pill" />
        </p>
        <h3 className={`panel-title mt-4 cine:whitespace-nowrap ${stacked ? "cine-release-title" : "cine-panel-title"}`}>{title}</h3>
        <p className="mt-5 max-w-[34em] text-[17px] leading-[1.5] text-dim cine:text-[min(1.3vw,2.3vh)]">{body}</p>
        <p className="sr-only">{kicker}</p>
      </div>
      <div className={`mt-9 min-w-0 cine:mt-0 ${stacked ? "" : "flex-1"}`}>{children}</div>
    </article>
  );
}

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <p className="font-display text-[clamp(64px,8vw,132px)] font-black leading-[0.85]">{value}</p>
      <p className="mt-4 font-mono text-[13px] text-dim">{label}</p>
    </div>
  );
}

const LOAN_FIELDS = ["Property", "Insurance", "Income", "Tradelines", "Liabilities"];
const SUITES = ["Unit", "Integration", "Contract", "Smoke", "End-to-end"];

// Left and right node rows for the matching diagram, in a 400 by 300 box.
const LEFT = [40, 110, 190, 260];
const RIGHT = [40, 110, 190, 260];
const EDGES: [number, number][] = [[0, 1], [1, 0], [2, 3], [3, 2]];

function MatchingDiagram() {
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-[460px]" role="img" aria-label="Borrower liabilities linked to credit tradelines, and loan documents linked to debt-related risks">
      {EDGES.map(([a, b], i) => (
        <path
          key={i}
          className="seq"
          style={{
            ...seq(i, EDGES.length),
            strokeDasharray: 1,
            strokeDashoffset: "calc(1 - var(--on))",
          } as CSSProperties}
          pathLength={1}
          d={`M 130 ${LEFT[a]} C 200 ${LEFT[a]}, 200 ${RIGHT[b]}, 270 ${RIGHT[b]}`}
          fill="none"
          stroke="var(--color-pass)"
          strokeWidth="1.5"
        />
      ))}
      {[
        ["Liability", LEFT[0], 0],
        ["Liability", LEFT[1], 0],
        ["Document", LEFT[2], 0],
        ["Document", LEFT[3], 0],
        ["Tradeline", RIGHT[0], 1],
        ["Tradeline", RIGHT[1], 1],
        ["Debt risk", RIGHT[2], 1],
        ["Debt risk", RIGHT[3], 1],
      ].map(([label, y, side], i) => (
        <g key={i} transform={`translate(${side ? 270 : 0} ${(y as number) - 19})`}>
          <rect width="130" height="38" rx="3" fill="var(--color-panel)" stroke="var(--color-line)" />
          <text x="65" y="24" textAnchor="middle" fontSize="14" fontFamily="var(--font-mono)" fill="var(--color-paper)">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Pipeline() {
  return (
    <section
      id="pipeline"
      data-pipeline-layer
      aria-label="Career pipeline"
      className="relative z-20 px-5 py-16 cine:invisible cine:absolute cine:inset-0 cine:p-0 cine:opacity-0"
    >
      <h2 className="mb-12 font-mono text-[13px] text-dim cine:hidden">Career pipeline</h2>

      <div className="relative cine:h-full">
        <span className="absolute bottom-0 left-[15px] top-0 w-px bg-line cine:hidden" />
        <span data-mobile-fill className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-pass cine:hidden" />

        <div
          data-track
          className="relative cine:absolute cine:bottom-[calc(9vh+44px)] cine:left-0 cine:top-16 cine:flex cine:w-max cine:pl-8 cine:will-change-transform"
        >
          <Panel
            index={0}
            kicker="Education"
            title={<>Michigan<br />State</>}
            body="Bachelor of Science in Computer Science, May 2025. East Lansing, MI."
          >
            <Stat value="3.7" label="GPA" />
            <div className="mt-8 flex gap-2" aria-hidden>
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="seq seq-fill h-9 w-7" style={seq(i, 6)} />
              ))}
            </div>
            <p className="mt-2 font-mono text-[13px] text-dim">Dean&apos;s List, 6 times</p>
          </Panel>

          <Panel
            index={1}
            kicker="United Wholesale Mortgage, code quality"
            title={<>Smells<br />gone</>}
            body={
              <>
                A BOLT code quality initiative that won <span className="text-paper">Most Valuable Project, 1 of 16 intern groups</span>. The README standards I wrote became an official UWM engineering convention.
              </>
            }
          >
            <Stat
              value={<span data-to="1900" data-prefix="~" >~1,900</span>}
              label="code smells eliminated"
            />
            <div className="mt-7">
              <div className="flex justify-between font-mono text-[13px] text-dim">
                <span>Test coverage</span>
                <span data-from="70" data-to="80" data-suffix="%+" className="text-paper">80%+</span>
              </div>
              <div className="relative mt-2 h-3 bg-line">
                <div
                  className="h-full bg-pass"
                  style={{ width: "calc(70% + 12% * min(1, var(--p) / 0.85))" }}
                />
                <span className="absolute -top-1 bottom-[-4px] left-[80%] w-px bg-paper" />
              </div>
            </div>
            <div className="mt-6 grid max-w-[420px] grid-cols-[repeat(17,1fr)] gap-[3px]" aria-hidden>
              {Array.from({ length: 34 }, (_, i) => (
                <span key={i} className="seq seq-fill aspect-square" style={seq(i, 34)} />
              ))}
            </div>
            <p className="mt-2 font-mono text-[13px] text-dim">34+ microservices</p>
          </Panel>

          <Panel
            index={2}
            kicker="United Wholesale Mortgage, rule engine"
            title={<>Rules that<br />read loans</>}
            body="I wrote and maintain 15 C# NRules in the BOLT rule engine. They evaluate each loan and fire underwriter-facing conditions, tracking Freddie Mac and investor guideline changes."
          >
            <ul className="max-w-[440px]">
              {LOAN_FIELDS.map((field, i) => (
                <li key={field} className="seq flex items-center gap-4 border-b border-line py-[min(1.6vh,14px)]" style={seq(i, 5)}>
                  <span className="seq-text w-28 font-mono text-[15px]">{field}</span>
                  <span className="relative h-px flex-1 bg-line">
                    <span className="absolute inset-y-0 left-0 bg-pass" style={{ width: "calc(var(--on) * 100%)" }} />
                  </span>
                  <span className="seq-text font-mono text-[13px]">
                    condition
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-display text-[clamp(52px,6vw,96px)] font-black leading-[0.85]">
              <span data-to="15">15</span> <span className="text-dim">NRules</span>
            </p>
          </Panel>

          <Panel
            index={3}
            kicker="United Wholesale Mortgage, matching algorithms"
            title={<>Debt<br />matched</>}
            body="C# matching algorithms with LLM-driven response parsing link borrower liabilities to credit tradelines, and loan documents to specific debt-related risks. EF Core data access and SQL migrations sit underneath."
          >
            <MatchingDiagram />
          </Panel>

          <Panel
            index={4}
            kicker="United Wholesale Mortgage, CI/CD"
            title={<>Five suites<br />four repos</>}
            body="I wrote the tests that clear automated quality gates across 4 BOLT repositories, advancing a company-wide push to certify every microservice for continuous deployment through PORT by the end of 2026."
          >
            <ul className="max-w-[440px] font-mono text-[15px]">
              {SUITES.map((suite, i) => (
                <li key={suite} className="seq flex items-center justify-between border-b border-line py-[min(1.6vh,14px)]" style={seq(i, 5)}>
                  <span className="seq-text">{suite}</span>
                  <span className="text-pass" style={{ opacity: "var(--on)" }}>
                    ✓ pass
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="font-display text-[clamp(52px,6vw,96px)] font-black leading-[0.85]">
                <span data-to="70" data-suffix="+">70+</span> <span className="text-dim">tickets</span>
              </p>
              <p className="mt-2 font-mono text-[13px] text-dim">Production bugs and new features, monitored with Dynatrace</p>
            </div>
          </Panel>

          <Panel
            index={5}
            stacked
            kicker="Current role"
            title={<span className="text-pass">Software Developer I</span>}
            body="United Wholesale Mortgage. Pontiac, MI. May 2025 to present."
          >
            <ol className="flex flex-col gap-1 font-mono text-[15px] cine:flex-row cine:items-center cine:gap-4">
              {["Intern", "Associate Software Developer", "Software Developer I"].map((title, i) => (
                <li key={title} className="seq seq-text flex items-center gap-4" style={seq(i, 3)}>
                  {i > 0 && <span aria-hidden className="hidden text-pending cine:inline">→</span>}
                  {title}
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        {/* Rail: desktop only. The particle stream collapses onto this line. */}
        <div className="absolute inset-x-0 bottom-[9vh] hidden cine:block">
          <p data-run-status className="absolute -top-8 left-8 font-mono text-[13px] text-run">
            running
          </p>
          <div data-rail className="relative h-px w-full bg-line">
            <div data-rail-fill className="absolute inset-0 origin-left scale-x-0 bg-pass" />
            {STAGE_NAMES.map((name, i) => (
              <div
                key={name}
                data-node
                data-state="pending"
                className="absolute top-0 flex -translate-x-1/2 -translate-y-[5px] flex-col items-center"
                style={{ left: `${((i + 1) / STAGE_NAMES.length) * 100 - (i === STAGE_NAMES.length - 1 ? 3 : 0)}%` }}
              >
                <span className="rail-node" />
                <span className="rail-label mt-3 font-mono text-[13px]">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
