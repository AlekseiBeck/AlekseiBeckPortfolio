"use client";

import { useState } from "react";
import { LINKS } from "@/lib/content";

const linkClass = "font-mono text-[15px] underline decoration-line underline-offset-4 transition-colors hover:decoration-pass";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(LINKS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer id="contact" className="relative z-20 border-t border-line bg-ink px-5 pb-8 pt-24 cine:px-8 cine:pt-36">
      <p className="flex items-center gap-2 font-mono text-[13px] text-pass">
        <span className="size-[7px] rounded-full bg-pass" />
        All stages passed
      </p>
      <h2 className="mt-5 font-display text-[min(24vw,36svh)] font-black uppercase leading-[0.87]">
        Ready to<br />merge?
      </h2>

      <button
        type="button"
        onClick={copy}
        className="mt-12 flex w-full flex-wrap items-center justify-between gap-3 rounded border border-line p-5 text-left transition-colors hover:border-pass md:p-7"
      >
        <span className="min-w-0 break-all text-[clamp(20px,3.4vw,48px)] leading-tight">{LINKS.email}</span>
        <span aria-live="polite" className={`font-mono text-[14px] ${copied ? "text-pass" : "text-dim"}`}>
          {copied ? "Copied ✓" : "Copy email"}
        </span>
      </button>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <a className={linkClass} href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a className={linkClass} href={LINKS.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a className={linkClass} href={LINKS.resume} target="_blank" rel="noreferrer">Resume (PDF) ↗</a>
      </div>

      <p className="mt-20 flex flex-wrap justify-between gap-2 font-mono text-[12.5px] text-dim">
        <span>© 2026 Aleksei Beck</span>
        <span>Next.js, React Three Fiber, GSAP. Hosted on Cloudflare Pages.</span>
      </p>
    </footer>
  );
}
