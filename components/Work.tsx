import type { ReactNode } from "react";
import SectionHead from "./SectionHead";

// Each row opens with one filled-in field, the same way the loan file prints its figures.
const ROWS: { label: string; value: ReactNode; title: string; body: ReactNode }[] = [
  {
    label: "Rules written or reworked",
    value: "20+",
    title: "Rules that read the loan",
    body: (
      <>
        I&apos;ve written or reworked more than 20 C# rules on NRules for BOLT, UWM&apos;s underwriting platform. They
        evaluate loan data and fire the conditions underwriters see, for condo and master-policy insurance and for FHA
        mortgage history.
      </>
    ),
  },
  {
    label: "Pull requests merged",
    value: "168",
    title: "From the database to the UI",
    body: (
      <>
        168 merged pull requests across about 30 repositories, and 174 Jira issues closed. The features run from SQL
        Server stored procedures and EF Core and Dapper services through REST APIs to the React UI. I&apos;ve also
        reviewed 239 of my teammates&apos; pull requests.
      </>
    ),
  },
  {
    label: "Traced to",
    value: (
      <span className="block text-[1rem] font-normal leading-relaxed">
        a JSON deserialization
        <br />
        default
      </span>
    ),
    title: "A crash in the credit rules",
    body: (
      <>
        A null-reference crash was aborting the entire credit rule session and blocking the affected loans from
        advancing. I traced it to a JSON deserialization default and shipped the guard with regression tests.
      </>
    ),
  },
  {
    label: "Mutation score",
    value: "99.4%",
    title: "Ready for continuous deployment",
    body: (
      <>
        I took a core microservice through all 15 criteria of its production-readiness checklist for continuous
        deployment. Its mutation score rose to 99.4% (713 of 720 mutants killed) and integration coverage from 80% to
        84%. I added Pact contract tests, plus k6 smoke and load tests that run in Testkube in every environment.
      </>
    ),
  },
  {
    label: "Services, one click",
    value: "6",
    title: "A launcher for the local stack",
    body: (
      <>
        On my own I built a C#/.NET 10 WPF launcher that starts a six-service local stack in one click. It clones the
        repositories, isolates each developer&apos;s Kafka topics, auto-corrects about 20 config mismatches per fresh
        clone, and starts the services in dependency order. It is about 16,000 lines with about 620 xUnit tests, and
        has had three team releases.
      </>
    ),
  },
  {
    label: "Stored per match",
    value: (
      <span className="block text-[1rem] font-normal leading-relaxed">
        liability → tradeline
        <br />
        confirmed, or not
      </span>
    ),
    title: "An audit trail for AI matching",
    body: (
      <>
        I built the persistence and audit layer for LLM-driven tradeline matching: the EF Core migrations and
        repository code that store each AI-proposed liability-to-tradeline match and whether an underwriter confirmed
        it.
      </>
    ),
  },
  {
    label: "Code smells removed",
    value: "~1,900",
    title: "Code quality across BOLT",
    body: (
      <>
        My intern group took on code quality in BOLT. Across 34+ microservices we removed about 1,900 code smells and
        raised test coverage from roughly 70% to over 80%, which won <strong>Most Valuable Project</strong> out of 16
        intern groups. About 40 of those fixes, across 12 services, were mine.
      </>
    ),
  },
];

export default function Work() {
  return (
    <section id="work" className="wrap mt-28 lg:mt-40">
      <SectionHead n={2} label="Work" title="United Wholesale Mortgage">
        <p className="mt-4 font-type text-[1rem] leading-relaxed text-soft">
          Pontiac, MI. May 2025 to present.
          <br />
          Intern → Associate Software Developer → Software Developer I
        </p>
      </SectionHead>

      <ol className="mt-12 lg:mt-16">
        {ROWS.map((row) => (
          <li key={row.title} className="grid gap-x-8 gap-y-4 border-t border-form/30 py-7 lg:grid-cols-12 lg:py-9">
            <div className="lg:col-span-3">
              <p className="label">{row.label}</p>
              <p className="mt-2 font-type text-[2rem] font-bold leading-none">{row.value}</p>
            </div>
            <div className="lg:col-span-8">
              <h3 className="text-[1.25rem] font-bold tracking-[-0.01em]">{row.title}</h3>
              <p className="mt-2 max-w-[40rem] text-[1.0625rem] leading-[1.6] text-pretty [&_strong]:font-bold">{row.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
