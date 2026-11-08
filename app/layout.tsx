import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const shoulders = Big_Shoulders({ subsets: ["latin"], weight: "900", variable: "--font-shoulders" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

const description =
  "Software Developer at United Wholesale Mortgage building rule engines, LLM-backed matching, and the test suites that get them shipped.";

export const metadata: Metadata = {
  metadataBase: new URL("https://alekseibeck.pages.dev"),
  title: "Aleksei Beck | Software Developer",
  description,
  openGraph: {
    title: "Aleksei Beck | Software Developer",
    description,
    url: "/",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Aleksei Beck, Software Developer" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0a0b0d" };

// Runs before first paint so the layout never jumps between modes.
const bootstrap = `(function(){var d=document.documentElement;d.classList.add('js');try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r&&document.createElement('canvas').getContext('webgl2'))d.classList.add('fx')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${shoulders.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
