"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/content";
import { goTo } from "@/lib/stage";
import { OPEN_PALETTE } from "./CommandPalette";

export default function Nav() {
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("Ctrl K");
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-ink/80 px-5 backdrop-blur-md py-4 font-mono text-[13px] cine:px-8">
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          goTo("top");
        }}
        className="font-medium tracking-wide"
      >
        Aleksei Beck
      </a>
      <nav aria-label="Primary" className="flex items-center gap-6">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              goTo(s.id);
            }}
            className="hidden text-dim transition-colors hover:text-paper md:inline"
          >
            {s.label}
          </a>
        ))}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
          className="rounded border border-line px-2.5 py-1.5 transition-colors hover:border-paper"
        >
          <span className="md:hidden">Menu</span>
          <span className="hidden md:inline">{shortcut}</span>
        </button>
      </nav>
    </header>
  );
}
