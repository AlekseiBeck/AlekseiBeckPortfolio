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

export default function Projects() {
  return (
    <section id="projects" className="wrap mt-28 lg:mt-40">
      <SectionHead n={3} label="Projects" title="One tool for work, one for myself" />

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
          <p className="mt-5 max-w-[34rem] text-[1.3125rem] font-medium leading-[1.35] tracking-[-0.01em] text-pretty">
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
          <p className="mt-5 max-w-[34rem] text-[1.3125rem] font-medium leading-[1.35] tracking-[-0.01em] text-pretty">
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
