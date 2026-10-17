import { copy } from "@/copy/en";
import { OG_SIZE, ogCard } from "@/lib/og/card";

export const alt = "Zohraé: sculptural lamps, made by hand in India";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    image: "/products/aurelia/stage-on.webp",
    title: "Light, sculpted.",
    line: `${copy.home.heroTagline} Lamps, vessels and keepsakes, made to order.`,
  });
}
