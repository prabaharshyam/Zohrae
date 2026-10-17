import type { Metadata, Viewport } from "next";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Interactions } from "@/components/delight/Interactions";
import { MotionDirector } from "@/components/delight/MotionDirector";
import { bodoni, jost, parisienne, pinyon } from "@/app/fonts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LightSwitch } from "@/components/light/LightSwitch";
import { copy } from "@/copy/en";
import { getCollections } from "@/lib/commerce";
import { INTRO_BOOT_SCRIPT, LIGHT_BOOT_SCRIPT } from "@/lib/boot-scripts";
import { SmoothScroll } from "@/lib/motion/SmoothScroll";
import "./globals.css";

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
    <html
      lang="en-IN"
      className={`${bodoni.variable} ${jost.variable} ${pinyon.variable} ${parisienne.variable}`}
      data-lights="off"
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: apply a saved "lights on", and skip the intro for returning visitors. */}
        <script dangerouslySetInnerHTML={{ __html: LIGHT_BOOT_SCRIPT + INTRO_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <SmoothScroll>
          <Header collections={collections} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <LightSwitch />
          <CartDrawer />
          <Interactions />
          <MotionDirector />
        </SmoothScroll>
      </body>
    </html>
  );
}
