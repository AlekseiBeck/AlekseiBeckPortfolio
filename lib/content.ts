export const LINKS = {
  email: "alekseibeck0711@gmail.com",
  linkedin: "https://linkedin.com/in/alekseibeck",
  github: "https://github.com/AlekseiBeck",
  stakdx: "https://stakdx.vercel.app",
  resume: "/AlekseiBeck-Resume.pdf",
};

export const STAGE_NAMES = ["checkout", "quality", "rules", "matching", "gates", "release"];

export const SECTIONS = [
  { id: "pipeline", label: "Pipeline" },
  { id: "artifacts", label: "Artifacts" },
  { id: "toolchain", label: "Toolchain" },
  { id: "contact", label: "Contact" },
];

export type CaseId = "stakdx" | "loan-info-tool";

export const PROJECTS: {
  id: CaseId;
  name: string;
  context: string;
  dates: string;
  summary: string;
  stats: { value: string; label: string }[];
  stack: string[];
  sections: { heading: string; body: string }[];
  link?: { href: string; label: string };
  image?: { src: string; alt: string };
  note?: string;
}[] = [
  {
    id: "stakdx",
    name: "Stakdx",
    context: "Personal project",
    dates: "April 2026 – Present",
    summary:
      "A trading assistant built around a budget-driven scan engine. It returns AI-ranked longs, shorts, calls, and puts, each scored by confidence.",
    stats: [
      { value: "4", label: "setup types ranked" },
      { value: "3", label: "cloud services in production" },
    ],
    stack: ["TypeScript", "React", "Supabase", "Finnhub", "Claude API", "Alpaca API"],
    sections: [
      {
        heading: "The scan engine",
        body: "You set a budget and the engine returns ranked setups scored by confidence. It combines real-time market data, global news sentiment, and a Claude-powered analysis layer that also answers conversational market questions and reviews portfolios on demand.",
      },
      {
        heading: "Proving the picks",
        body: "AI recommendations are validated against live market performance through the Alpaca paper trading API. Opt-in push notifications cover breaking news, price movement, and sell signals on tracked positions.",
      },
      {
        heading: "In production",
        body: "The frontend runs on Vercel, the backend on Railway, and Postgres on Supabase, with GitHub-based CI/CD. The UI adapts between desktop and mobile.",
      },
    ],
    link: { href: LINKS.stakdx, label: "Open Stakdx" },
    image: { src: "/stakdx.jpg", alt: "The Stakdx landing page, showing a ranked long setup and an AI chat reply." },
  },
  {
    id: "loan-info-tool",
    name: "Loan Info Tool",
    context: "UWM internal",
    dates: "May 2026 – Present",
    summary:
      "An internal diagnostics tool I led with the intern team. One lookup traces a loan through BOLT's approval pipeline and pinpoints the service where a change fails.",
    stats: [
      { value: "~1,500", label: "person IT department" },
      { value: "Hours → 1", label: "manual rebuild to a single lookup" },
    ],
    stack: ["C#", ".NET", "EF Core", "TypeScript", "React", "SQL Server", "OAuth"],
    sections: [
      {
        heading: "The problem",
        body: "Reconstructing a loan's state was a manual workflow that took hours. Developers, business analysts, and product owners needed one place to inspect test loans in integration and staging, alongside production loans flagged by underwriters and operations specialists.",
      },
      {
        heading: "What I built",
        body: "A C#/EF Core backend behind one consolidated GET endpoint, secured with UWM's internal user library and OAuth, and a React/TypeScript frontend on the internal component library. I owned testing, drove UI iterations with UX designers, and shaped the feature roadmap.",
      },
      {
        heading: "Designed for real debugging",
        body: "Per-user search history, bookmarks, and custom loan aliases that map a loan to its Jira story, with granular and bulk history deletion. Engineers tracking several defects resume context instead of re-searching by loan number.",
      },
    ],
    note: "This is an internal tool, so there are no screenshots here.",
  },
];

export const TOOLCHAIN = [
  { group: ".NET", items: ["C#", ".NET", "EF Core", "xUnit", "SQL Server", "SSMS"] },
  { group: "Web", items: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "HTML/CSS", "REST APIs", "OAuth"] },
  { group: "Languages", items: ["Python", "C++", "SQL"] },
  {
    group: "Cloud & DevOps",
    items: ["Azure", "Vercel", "Railway", "Supabase", "Docker", "Jenkins", "CI/CD", "Dynatrace", "Git", "GitHub", "Bitbucket", "Jira"],
  },
  {
    group: "AI / LLM",
    items: ["Claude Code agents", "Copilot agents", "LLM integration", "Prompt engineering"],
  },
];
