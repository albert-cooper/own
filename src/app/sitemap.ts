import type { MetadataRoute } from "next";
import { informationPages, languageAlternates, pageUrl } from "@/lib/seo";
import { getIndexableCatalog } from "@/services/seo-catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalogs = await getIndexableCatalog();
  const entries: MetadataRoute.Sitemap = catalogs.flatMap(({ locale, paths }) =>
    Array.from(paths, path => ({
      url: pageUrl(locale, path),
      alternates: { languages: languageAlternates(path,
        catalogs.filter(catalog => catalog.paths.has(path)).map(catalog => catalog.locale)) },
    }))
  );
  for (const path of Object.keys(informationPages)) entries.push({ url: pageUrl("en-US", path) });
  return entries;
}
