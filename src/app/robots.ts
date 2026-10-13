import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Query variants must remain crawlable for their canonical/noindex to be read.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${getSiteConfig().url}/sitemap.xml`,
  };
}
