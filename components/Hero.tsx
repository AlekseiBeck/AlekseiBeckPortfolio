import { LINKS } from "@/lib/content";
import Seal from "./Seal";

// Two columns on phones, three on small laptops, one row once there is room for it.
const FACTS = [
  { label: "Position", value: "Software Developer\u00a0I", span: "lg:col-span-2 min-[86rem]:col-span-1" },
  { label: "Employer", value: "United Wholesale Mortgage", span: "lg:col-span-2 min-[86rem]:col-span-1" },
  { label: "Office", value: "Pontiac, Michigan", span: "lg:col-span-2 min-[86rem]:col-span-1" },
  { label: "Since", value: "May\u00a02025", span: "lg:col-span-2 min-[86rem]:col-span-1" },
  { label: "Education", value: "B.S. Computer Science, Michigan State", span: "col-span-2 lg:col-span-4 min-[86rem]:col-span-1" },
];

export default function Hero() {
  return (
    <header id="top" className="wrap pt-24 sm:pt-28 lg:pt-32">
      <div data-masthead className="masthead">
        <h1 className="name">Aleksei Beck</h1>
      </div>

      <div className="mt-8 grid gap-x-8 gap-y-8 sm:mt-10 lg:grid-cols-12">
        <p className="text-[clamp(1.3125rem,2.5vw,2rem)] font-medium leading-[1.28] tracking-[-0.015em] text-pretty lg:col-span-8">
          I&apos;m a software developer at United Wholesale Mortgage. I write the rules that read a loan and raise
          conditions for underwriters, the matching code behind them, and the tests that let all of it ship.
        </p>
        <div className="flex items-end justify-between gap-6 lg:col-span-4 lg:flex-col lg:items-end">
          {/* Above the links on wide screens, beside them on narrow ones. */}
          <Seal className="order-2 w-28 shrink-0 sm:w-36 lg:order-1 lg:mr-2 lg:w-40" />
          <div className="order-1 flex flex-col items-start text-[1.0625rem] font-semibold lg:order-2 lg:items-end">
            <a href="#loan-file" className="link py-2.5">
              Break a loan file <span aria-hidden>↓</span>
            </a>
            <a href={`mailto:${LINKS.email}`} className="link py-2.5">
              Email me
            </a>
          </div>
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-2 border-l border-t border-form sm:mt-12 lg:grid-cols-6 min-[86rem]:grid-cols-[1.15fr_1.4fr_1fr_0.56fr_1.95fr]">
        {FACTS.map((fact) => (
          <div key={fact.label} className={`border-b border-r border-form px-3 pb-2.5 pt-2 sm:px-4 ${fact.span}`}>
            <dt className="label">{fact.label}</dt>
            <dd className="mt-1 font-type text-[1rem] leading-snug">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
