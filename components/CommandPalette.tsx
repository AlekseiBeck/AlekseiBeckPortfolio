"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { LINKS, PROJECTS, SECTIONS } from "@/lib/content";
import { goTo, pauseScroll } from "@/lib/stage";

export const OPEN_PALETTE = "open-palette";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, []);

  useEffect(() => pauseScroll(open), [open]);

  const run = (action: () => void) => {
    setOpen(false);
    pauseScroll(false);
    action();
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command menu"
      data-lenis-prevent
      filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
    >
      <Command.Input placeholder="Jump to, copy, open…" />
      <Command.List>
        <Command.Empty>No matching command.</Command.Empty>
        <Command.Group heading="Go to">
          {SECTIONS.map((s) => (
            <Command.Item key={s.id} onSelect={() => run(() => goTo(s.id))}>
              {s.label}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Case studies">
          {PROJECTS.map((p) => (
            <Command.Item key={p.id} onSelect={() => run(() => (window.location.hash = `case-${p.id}`))}>
              {p.name}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Actions">
          <Command.Item value="copy email" onSelect={() => run(() => navigator.clipboard.writeText(LINKS.email))}>
            Copy email address
          </Command.Item>
          <Command.Item onSelect={() => run(() => window.open(LINKS.resume, "_blank"))}>Open resume</Command.Item>
          <Command.Item onSelect={() => run(() => window.open(LINKS.linkedin, "_blank"))}>LinkedIn</Command.Item>
          <Command.Item onSelect={() => run(() => window.open(LINKS.github, "_blank"))}>GitHub</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
