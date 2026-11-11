import type { ReactNode } from "react";

export default function SectionHead({ n, label, title, children }: {
  n: number;
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-x-8 gap-y-3 border-t-2 border-form pt-4 lg:grid-cols-12">
      <p className="label lg:col-span-3">
        Section {n}
        <span className="mx-2 opacity-50">/</span>
        {label}
      </p>
      <div className="lg:col-span-9">
        <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.032em] text-balance">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
