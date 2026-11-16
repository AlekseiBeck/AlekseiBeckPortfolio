import type { ReactNode } from "react";
import { LINKS } from "@/lib/content";
import SectionHead from "./SectionHead";
import TraceDemo from "./TraceDemo";

function Meta({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-1">
      {rows.map(([label, value], i) => (
        <div key={label} className={i === rows.length - 1 ? "col-span-2 lg:col-span-1" : ""}>
          <dt className="label">{label}</dt>
          <dd className="mt-1 font-type text-[0.9375rem] leading-snug">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Project({ name, meta, children }: { name: string; meta: [string, ReactNode][]; children: ReactNode }) {
  return (
    <article className="grid gap-x-8 gap-y-8 border-t border-form/30 py-10 lg:grid-cols-12 lg:py-14">
      <div className="lg:col-span-3">
        <Meta rows={meta} />
      </div>
      <div className="lg:col-span-9">
        <h3 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em]">{name}</h3>
        {children}
      </div>
    </article>
  );
}

const prose = "max-w-[40rem] text-[1.0625rem] leading-[1.6] text-pretty";

/** nba-agent, the run of 15 November 2026. Shares of the questions asked, in percent. */
const EVAL = [
  {
    setup: "With the database",
    questions: 72,
    right: 100,
    wrong: 0,
    note: "100% right. 95% interval 95 to 100. $0.0006 per question.",
  },
  {
    setup: "From memory, no database",
    questions: 63,
    right: 33,
    wrong: 19,
    note: "33% right, 19% wrong, 48% declined. 95% interval 23 to 46.",
  },
];

function EvalResult() {
  return (
    <figure className="mt-8 max-w-[40rem]">
      <div className="border border-form bg-sheet">
        {EVAL.map((row) => (
          <div key={row.setup} className="border-t border-form/25 px-4 py-4 first:border-t-0 sm:px-6">
            <p className="label flex flex-wrap items-baseline justify-between gap-x-4">
              {row.setup}
              <span className="font-type text-[0.875rem] font-normal normal-case tracking-normal text-soft">
                {row.questions} questions
              </span>
            </p>
            <div className="mt-2.5 flex items-center gap-4">
              <p className="w-[5.25rem] shrink-0 font-type text-[2rem] font-bold leading-none">{row.right}%</p>
              <div aria-hidden className="flex h-3 flex-1 bg-form/15">
                <span className="bg-form" style={{ width: `${row.right}%` }} />
                <span className="bg-stamp" style={{ width: `${row.wrong}%` }} />
              </div>
            </div>
            <p className="mt-2.5 font-type text-[0.875rem] leading-snug text-soft">{row.note}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-2.5 text-[0.875rem] leading-snug text-soft">
        Claude Haiku 5.5, one pass over every question. Blue is right, red is wrong, and the empty part is where the
        model declined to answer. The nine questions the database can&apos;t answer are left out of the memory run.
      </figcaption>
    </figure>
  );
}

/** us-airfare-analytics. One-way, passenger-weighted median fares in 2024 dollars. */
const FARES = [
  ["Median fare, after inflation", "$257 in 2015, $200 in 2024"],
  ["Cheapest New York airport", "LaGuardia at $183, then JFK at $198 and Newark at $200"],
  ["Against the average carrier", "Spirit 52% below, Delta 23% above"],
  ["Check against federal averages", "0.41% median difference, 2016 to 2024"],
];

function FareFindings() {
  return (
    <figure className="mt-8 max-w-[40rem]">
      <dl className="grid border-l border-t border-form bg-sheet sm:grid-cols-2">
        {FARES.map(([label, value]) => (
          <div key={label} className="border-b border-r border-form px-4 pb-3 pt-2.5">
            <dt className="label">{label}</dt>
            <dd className="mt-1.5 font-type text-[1rem] leading-snug">{value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-2.5 text-[0.875rem] leading-snug text-soft">
        Fares are one way, before bag and seat fees. The carrier gaps compare the same route and quarter, and the New
        York figures are since 2023.
      </figcaption>
    </figure>
  );
}

const lead = "mt-5 max-w-[34rem] text-[1.3125rem] font-medium leading-[1.35] tracking-[-0.01em] text-pretty";

export default function Projects() {
  return (
    <section id="projects" className="wrap mt-28 lg:mt-40">
      <SectionHead n={3} label="Projects" title="One tool for work, three for myself" />

      <div className="mt-12 lg:mt-16">
        <Project
          name="Loan Info Tool"
          meta={[
            ["Where", "UWM, internal"],
            ["When", "May 2026 to present"],
            ["Role", "Led the intern team that designed and built it"],
            ["Stack", "C#, .NET, EF Core, SQL Server, TypeScript, React, OAuth"],
          ]}
        >
          <p className={lead}>
            Working out what state a loan was in used to take hours of manual digging. Now it takes one lookup.
          </p>
          <TraceDemo />
          <div className={`mt-8 space-y-4 ${prose}`}>
            <p>
              The tool pulls everything about a single loan into one place, traces it through BOLT&apos;s approval
              pipeline, and points to the exact service where a feature or a production-breaking change fails. It is
              used across UWM&apos;s roughly 1,500-person IT department by developers, business analysts, and product
              owners, both for test loans in integration and staging and for production loans flagged by underwriters
              and operations specialists.
            </p>
            <p>
              I built the C# and EF Core backend behind a single consolidated GET endpoint, secured with UWM&apos;s
              internal auth library and OAuth, and the React and TypeScript frontend on the internal component library.
              I also owned testing, worked through UI iterations with UX designers, and shaped the roadmap.
            </p>
            <p>
              It also remembers what you were doing. Each user gets search history, bookmarks, and custom aliases that
              tie a loan to its Jira story, with single and bulk history deletion. Someone chasing several defects at
              once can pick up where they left off instead of searching by loan number again.
            </p>
          </div>
        </Project>

        <Project
          name="NBA Stats Agent and Eval Harness"
          meta={[
            ["Where", "Personal project"],
            ["When", "November 2026 to present"],
            [
              "Code",
              <a key="code" href={LINKS.nbaAgent} target="_blank" rel="noreferrer" className="link">
                AlekseiBeck/
                <wbr />
                nba-agent
              </a>,
            ],
            ["Stack", "Python, Claude API, SQLite, pytest"],
          ]}
        >
          <p className={lead}>
            An LLM agent that answers NBA questions by writing SQL, and the harness that measures how often it is
            right.
          </p>
          <EvalResult />
          <div className={`mt-8 space-y-4 ${prose}`}>
            <p>
              The agent is a loop around the Claude API with two tools. One runs a read-only query against a 112K-row
              box-score database covering four seasons, and the other submits the answer. When a query fails, it reads
              the SQL error and corrects itself.
            </p>
            <p>
              The harness grades it on 72 questions whose answers are computed by code from the same database, with no
              LLM judge. Nine of them can&apos;t be answered from the data at all, which catches an agent that guesses
              when it should decline. 34 tests verify the grader.
            </p>
            <p>
              With the database, the model got all 72 right. Answering from memory, the same model got a third right,
              and about one in three of the answers it did commit to was wrong. A perfect score also means the question
              set is too easy for this agent, so harder questions are the next step.
            </p>
          </div>
        </Project>

        <Project
          name="US Airfare Analytics"
          meta={[
            ["Where", "Personal project"],
            ["When", "November 2026 to present"],
            [
              "Code",
              <a key="code" href={LINKS.airfare} target="_blank" rel="noreferrer" className="link">
                AlekseiBeck/
                <wbr />
                us-airfare-analytics
              </a>,
            ],
            ["Stack", "Python, SQL, dbt, DuckDB, pandas, statsmodels, Tableau, GitHub Actions"],
          ]}
        >
          <p className={lead}>
            When, where, and on which airline are U.S. domestic flights cheapest? A pipeline over 272 million DOT
            ticket records, 2015 to mid-2025.
          </p>
          <FareFindings />
          <div className={`mt-8 space-y-4 ${prose}`}>
            <p>
              Python ingests the raw federal files into Parquet and DuckDB. From there, 23 dbt models with 54 data
              tests clean the records, adjust fares for inflation, and compute passenger-weighted fare metrics by
              route, airline, and quarter.
            </p>
            <p>
              The featured case study is Detroit to New York. Since 2023 the cheapest nonstop has been Spirit to Newark
              at a median of $69 before fees. Among airlines that are not ultra-low-cost, it is American to LaGuardia
              at $151.
            </p>
            <p>
              The same models feed the analysis notebooks and the extracts for a Tableau dashboard. The data is
              quarterly, so it can&apos;t say which week is cheapest or how far ahead to book.
            </p>
          </div>
        </Project>

        <Project
          name="Stakdx"
          meta={[
            ["Where", "Personal project"],
            ["When", "April 2026 to present"],
            [
              "Live at",
              <a key="live" href={LINKS.stakdx} target="_blank" rel="noreferrer" className="link">
                stakdx.vercel.app
              </a>,
            ],
            ["Stack", "TypeScript, React, Supabase, Finnhub, Claude API, Alpaca API"],
          ]}
        >
          <p className={lead}>
            A trading assistant. Give it a budget and it returns ranked longs, shorts, calls, and puts, each scored by
            confidence.
          </p>
          <a
            href={LINKS.stakdx}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 block border border-form bg-sheet transition-shadow duration-200 hover:shadow-[0.375rem_0.375rem_0_var(--color-form)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/stakdx.jpg"
              alt="The Stakdx landing page, showing a ranked long setup and an AI chat reply."
              width={1440}
              height={900}
              loading="lazy"
              className="block h-auto w-full"
            />
            <span className="flex items-baseline justify-between gap-4 border-t border-form px-4 py-2.5 font-type text-[0.875rem]">
              <span>stakdx.vercel.app</span>
              <span className="text-form group-hover:underline">Open it ↗</span>
            </span>
          </a>
          <div className={`mt-8 space-y-4 ${prose}`}>
            <p>
              The scan engine combines real-time market data, global news sentiment, and a Claude-powered analysis
              layer. The same layer answers market questions in conversation and reviews a portfolio on demand.
            </p>
            <p>
              I don&apos;t take its word for it. Recommendations are checked against live market performance through
              the Alpaca paper trading API, and opt-in push notifications cover breaking news, price movement, and sell
              signals on tracked positions.
            </p>
            <p>
              The frontend runs on Vercel, the backend on Railway, and Postgres on Supabase, with GitHub-based CI/CD.
              The UI adapts between desktop and mobile.
            </p>
          </div>
        </Project>
      </div>
    </section>
  );
}
