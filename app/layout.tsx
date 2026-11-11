import type { Metadata, Viewport } from "next";
import { Courier_Prime, Libre_Franklin } from "next/font/google";
import "./globals.css";

const franklin = Libre_Franklin({ subsets: ["latin"], variable: "--font-franklin" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });

const description =
  "Software developer at United Wholesale Mortgage. I write the rules that read a loan and raise conditions for underwriters, and the tests that let them ship.";

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

export const viewport: Viewport = { themeColor: "#eef0ec" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${franklin.variable} ${courier.variable}`}>
      <body>{children}</body>
    </html>
  );
}
