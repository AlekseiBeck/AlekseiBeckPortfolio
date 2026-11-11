import { TOOLS } from "@/lib/content";
import SectionHead from "./SectionHead";

export default function Tools() {
  return (
    <section id="tools" className="wrap mt-28 lg:mt-40">
      <SectionHead n={4} label="Background" title="School and tools" />

      <dl className="mt-12 grid border-l border-t border-form sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
        <div className="border-b border-r border-form px-4 pb-4 pt-3 sm:col-span-2 lg:col-span-6">
          <dt className="label">Education</dt>
          <dd className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
            <span className="text-[1.3125rem] font-bold tracking-[-0.01em]">Michigan State University</span>
            <span className="font-type text-[1rem]">
              B.S. Computer Science, May 2025. GPA 3.7. Dean&apos;s List six times.
            </span>
          </dd>
        </div>
        {TOOLS.map(({ group, items }, i) => (
          <div
            key={group}
            className={`border-b border-r border-form px-4 pb-4 pt-3 ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${i === TOOLS.length - 1 ? "sm:col-span-2" : ""}`}
          >
            <dt className="label">{group}</dt>
            <dd className="mt-1.5 font-type text-[1rem] leading-relaxed">{items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
