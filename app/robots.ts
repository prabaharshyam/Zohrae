import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/cart", "/dream-room", "/dev/"] }],
    sitemap: absolute("/sitemap.xml"),
  };
}
