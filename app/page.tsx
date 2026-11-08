import Artifacts from "@/components/Artifacts";
import CommandPalette from "@/components/CommandPalette";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Nav from "@/components/Nav";
import Toolchain from "@/components/Toolchain";

export default function Page() {
  return (
    <>
      <a
        href="#artifacts"
        className="fixed left-3 top-3 z-[70] -translate-y-20 bg-paper px-4 py-2 font-mono text-sm text-ink focus:translate-y-0"
      >
        Skip to projects
      </a>
      <Nav />
      <CommandPalette />
      <main>
        <Experience />
        <Artifacts />
        <Toolchain />
        <Contact />
      </main>
    </>
  );
}
