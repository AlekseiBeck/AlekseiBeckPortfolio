"use client";

import { useEffect, useState } from "react";
import { LINKS, SECTIONS } from "@/lib/content";

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [pastName, setPastName] = useState(false);

  useEffect(() => {
    const sections = SECTIONS.map((s) => document.getElementById(s.id)!);
    const name = document.querySelector("[data-masthead]")!;

    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      // The last section is short, so it never reaches the line on tall screens.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections.at(-1)!.id;
      setActive(current);
      setPastName(name.getBoundingClientRect().bottom < 56);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-form/25 bg-paper">
      <div className="wrap flex h-14 items-center justify-between gap-4">
        {/* The masthead already says the name, so this only appears once that has scrolled away. */}
        <a
          href="#top"
          tabIndex={pastName ? 0 : -1}
          aria-hidden={!pastName}
          className={`text-[0.9375rem] font-extrabold tracking-[-0.01em] text-form transition-opacity duration-200 ${pastName ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          Aleksei Beck
        </a>
        <nav aria-label="Primary" className="flex items-center gap-5 text-[0.875rem] font-medium sm:gap-7">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`relative py-3 transition-colors hover:text-form ${s.id === "contact" ? "" : "hidden md:inline"} ${active === s.id ? "text-form" : "text-soft"}`}
            >
              {s.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-1.5 h-0.5 origin-left bg-form transition-transform duration-200 ${active === s.id ? "scale-x-100" : "scale-x-0"}`}
              />
            </a>
          ))}
          <a
            href={LINKS.resume}
            target="_blank"
            rel="noreferrer"
            className="border border-form px-3 py-2.5 font-semibold leading-none text-form transition-colors hover:bg-form hover:text-sheet"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
