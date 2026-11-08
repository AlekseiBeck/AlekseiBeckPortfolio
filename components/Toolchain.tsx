import { Fragment } from "react";
import { TOOLCHAIN } from "@/lib/content";

export default function Toolchain() {
  return (
    <section id="toolchain" className="relative z-20 bg-ink px-5 py-20 cine:px-8 cine:py-32">
      <h2 className="font-mono text-[13px] text-dim">Toolchain</h2>
      <dl className="mt-8">
        {TOOLCHAIN.map(({ group, items }) => (
          <div
            key={group}
            className="group grid gap-2 border-t border-line py-6 transition-colors hover:border-pass md:grid-cols-[200px_1fr] md:gap-8"
          >
            <dt className="pt-1.5 font-mono text-[14px] text-dim transition-colors group-hover:text-pass">{group}</dt>
            <dd className="font-display text-[clamp(30px,3.6vw,56px)] font-black uppercase leading-[1.08]">
              {items.map((item, i) => (
                <Fragment key={item}>
                  <span className="whitespace-nowrap">
                    {item}
                    {i < items.length - 1 && <span className="mx-[0.3em] text-pending">/</span>}
                  </span>{" "}
                </Fragment>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
