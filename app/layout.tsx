import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { copy } from "@/copy/en";
import { getCollections } from "@/lib/commerce";
import { SmoothScroll } from "@/lib/motion/SmoothScroll";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${copy.brand.name} — ${copy.brand.tagline} Luxury Lamps & Vases, Handcrafted in India`,
    template: `%s · ${copy.brand.name}`,
  },
  description:
    "Sculptural designer lamps, vases and planters — 3D-printed in plant-based PLA and hand-finished in India. Delivered across India in premium packaging.",
  applicationName: copy.brand.name,
  openGraph: { siteName: copy.brand.name, locale: "en_IN", type: "website" },
};

export const viewport: Viewport = {
  themeColor: [{ color: "#F6F1E7" }],
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const collections = (await getCollections())
    .filter((c) => !c.hidden)
    .map(({ handle, title, eyebrow }) => ({ handle, title, eyebrow }));

  return (
    <html lang="en-IN" className={`${bodoni.variable} ${jost.variable}`} data-lights="off">
      <body className="flex min-h-dvh flex-col antialiased">
        <SmoothScroll>
          <Header collections={collections} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
