import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import LoanFile from "@/components/LoanFile";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import { InkFilter } from "@/components/Seal";
import SectionHead from "@/components/SectionHead";
import Tools from "@/components/Tools";
import Work from "@/components/Work";

export default function Page() {
  return (
    <>
      <a
        href="#loan-file"
        className="fixed left-3 top-3 z-50 -translate-y-20 bg-form px-4 py-2 text-[0.875rem] font-semibold text-sheet focus:translate-y-0"
      >
        Skip to content
      </a>
      <InkFilter />
      <Nav />
      <Hero />
      <main>
        <section id="loan-file" className="wrap mt-20 lg:mt-28">
          <SectionHead n={1} label="Try it" title="A loan file you can break">
            <div className="mt-5 max-w-[40rem] space-y-4 text-[1.0625rem] leading-[1.6] text-pretty">
              <p>
                One of the things I do at UWM is write rules like these. Each one reads part of a loan (the property,
                the insurance, the income, the debts) and, when something doesn&apos;t hold up, raises a condition for
                the underwriter.
              </p>
              <p>
                This is a toy version that runs in your browser. The real ones are C# on NRules, and they track Freddie
                Mac and investor guidelines. Pick a borrower, then change the file until every condition clears.
              </p>
            </div>
          </SectionHead>
          <div className="mt-10 lg:mt-14">
            <LoanFile />
          </div>
        </section>
        <Work />
        <Projects />
        <Tools />
      </main>
      <Contact />
    </>
  );
}
