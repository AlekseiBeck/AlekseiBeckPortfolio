export default function Hero() {
  return (
    <section className="relative z-10 flex min-h-svh flex-col justify-center px-5 pt-20 pb-10 cine:absolute cine:inset-0 cine:justify-end cine:px-8 cine:pb-8 cine:pt-0">
      <h1 data-name className="name cine-name-size select-none">
        <span data-word className="block w-fit">ALEKSEI</span>{" "}
        <span data-word className="block w-fit">BECK</span>
      </h1>

      <div
        data-hero-info
        className="mt-10 max-w-xl cine:absolute cine:bottom-10 cine:right-8 cine:mt-0 cine:w-[min(36vw,540px)]"
      >
        <p className="flex items-center gap-2 font-mono text-[13px] text-run">
          <span className="size-[7px] rounded-full bg-run motion-safe:animate-pulse" />
          Build running · Pontiac, MI
        </p>
        <p className="mt-4 text-[clamp(20px,1.75vw,27px)] leading-[1.3]">
          Software Developer at United Wholesale Mortgage. I build loan rule engines, LLM-backed matching, and the test
          suites that get them through the gate.
        </p>
        <p className="mt-5 hidden font-mono text-[13px] text-dim cine:block">Scroll to run the pipeline ↓</p>
      </div>
    </section>
  );
}
