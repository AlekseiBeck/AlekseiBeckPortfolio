import type { ReactNode } from "react";
import SectionHead from "./SectionHead";

// Each row opens with one filled-in field, the same way the loan file prints its figures.
const ROWS: { label: string; value: ReactNode; title: string; body: ReactNode }[] = [
  {
    label: "Code smells removed",
    value: "~1,900",
    title: "Code quality across BOLT",
    body: (
      <>
        My intern group took on code quality in BOLT. Across 34+ microservices we cleared about 1,900 code smells and
        raised test coverage from roughly 70% to over 80%. It won <strong>Most Valuable Project</strong> out of 16
        intern groups, and the README standards I wrote became an official UWM engineering convention.
      </>
    ),
  },
  {
    label: "Rules in the BOLT rule engine",
    value: "15",
    title: "Rules that read the loan",
    body: (
      <>
        I wrote and maintain 15 C# rules on NRules. They evaluate the loan object (property, insurance, income,
        tradelines, liabilities) and fire the conditions underwriters see. When Freddie Mac or an investor changes a
        guideline, the rules have to follow.
      </>
    ),
  },
  {
    label: "Matches",
    value: (
      <span className="block text-[1rem] font-normal leading-relaxed">
        liability → tradeline
        <br />
        document → debt risk
      </span>
    ),
    title: "Matching",
    body: (
      <>
        C# matching algorithms that link a borrower&apos;s liabilities to the tradelines on their credit report, and
        loan documents to specific debt-related risks. Part of it is parsing LLM responses. Underneath are EF Core data
        access changes and SQL migration scripts.
      </>
    ),
  },
  {
    label: "BOLT repositories",
    value: "4",
    title: "Getting through the gates",
    body: (
      <>
        UWM is working to certify every microservice for continuous deployment through PORT by the end of 2026. For 4
        BOLT repositories I wrote the unit, integration, contract, smoke, and end-to-end suites they need to clear the
        automated quality gates.
      </>
    ),
  },
  {
    label: "Jira tickets delivered",
    value: "70+",
    title: "The day to day",
    body: (
      <>
        A mix of high-priority production bugs and new feature work. I use Dynatrace to watch deployments and trace
        root causes across the BOLT microservices.
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
