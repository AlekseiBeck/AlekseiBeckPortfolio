"use client";

import { useState } from "react";
import { LINKS } from "@/lib/content";
import SectionHead from "./SectionHead";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(LINKS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer id="contact" className="wrap mt-28 pb-8 lg:mt-40">
      <SectionHead n={5} label="Contact" title="Get in touch">
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${LINKS.email}`}
            className="link text-[clamp(1.0625rem,5.3vw,2.75rem)] font-extrabold leading-tight tracking-[-0.03em] [overflow-wrap:anywhere]"
          >
            {LINKS.email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="min-h-11 min-w-[5.5rem] border border-form px-3 py-1.5 text-[0.875rem] font-semibold text-form transition-colors hover:bg-form hover:text-sheet"
          >
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-8 text-[1.0625rem] font-semibold">
          <li>
            <a className="link inline-block py-2.5" href={LINKS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a className="link inline-block py-2.5" href={LINKS.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </li>
          <li>
            <a className="link inline-block py-2.5" href={LINKS.resume} target="_blank" rel="noreferrer">
              Resume (PDF) ↗
            </a>
          </li>
        </ul>
      </SectionHead>

      <p className="mt-24 flex flex-wrap justify-between gap-x-8 gap-y-1 border-t border-form/30 pt-4 font-type text-[0.875rem] text-soft">
        <span>© 2026 Aleksei Beck</span>
        <span>Set in Libre Franklin and Courier Prime.</span>
      </p>
    </footer>
  );
}
