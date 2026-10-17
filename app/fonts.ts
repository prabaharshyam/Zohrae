import { Bodoni_Moda, Jost, Parisienne, Pinyon_Script } from "next/font/google";

/** House faces. */
export const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

/** Personalisation scripts (names on tumblers, badges, trays). */
// Not preloaded: only the personalisation builders use them.
export const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
  display: "swap",
  preload: false,
});
export const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-parisienne",
  display: "swap",
  preload: false,
});

/** The lettering styles a customer can choose, in display order. */
export const LETTERING = [
  { id: "Script", font: pinyon },
  { id: "Calligraphy", font: parisienne },
  { id: "Classic", font: bodoni },
  { id: "Modern", font: jost },
] as const;
export type LetteringId = (typeof LETTERING)[number]["id"];
