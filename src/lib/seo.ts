import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/config/site";

// Only these locales have translated game catalogs. UI translations alone
// do not make another translation of a game detail page.
export const catalogLocales = ["en-US", "ja-JP"] as const;
export type CatalogLocale = (typeof catalogLocales)[number];
export const catalogLocale = (locale: Locale): CatalogLocale =>
  locale === "ja-JP" ? "ja-JP" : "en-US";
export const documentLocale = (locale: Locale) =>
  locale === "fr-FR" ? locale : catalogLocale(locale);

export const homeCopy = {
  "en-US": {
    title: "Free Online Games",
    description: "Browse browser games by category, read game introductions, and find your next game to play online.",
  },
  "ja-JP": {
    title: "無料オンラインゲーム",
    description: "カテゴリー別にブラウザゲームを探し、ゲームの紹介を読んで、次に遊ぶオンラインゲームを見つけましょう。",
  },
};

export const informationPages = {
  "/about": { title: "About Us", description: "Learn about our online game catalog and the experience we offer players." },
  "/contact": { title: "Contact Us", description: "Find contact information for questions and feedback about our online game website." },
  "/privacy-policy": { title: "Privacy Policy", description: "Read how this website handles information, cookies, and advertising services." },
  "/terms-of-service": { title: "Terms of Service", description: "Read the terms that apply when using this website and its online game catalog." },
} as const;

// Canonicals describe content, so tracking parameters and fragments are excluded.
export function pageUrl(locale: string, path = "/") {
  const pathname = path.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, "");
  return `${getSiteConfig().url}/${locale}${pathname ? `/${pathname}` : ""}`;
}

export function languageAlternates(path: string, locales: readonly string[]) {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = pageUrl(locale, path);
  if (locales.includes("en-US")) languages["x-default"] = pageUrl("en-US", path);
  return languages;
}

export function buildPageMetadata({ locale, path = "/", title, description,
  availableLocales = catalogLocales, noindex = false,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  availableLocales?: readonly string[];
  noindex?: boolean;
}): Metadata {
  const site = getSiteConfig();
  const contentLocale = catalogLocale(locale);
  const canonicalLocale = availableLocales.includes(contentLocale) ? contentLocale : "en-US";
  const canonical = pageUrl(canonicalLocale, path);
  const fullTitle = `${title} | ${site.name}`;
  const summary = description.replace(/\s+/g, " ").trim().slice(0, 180);
  return {
    metadataBase: new URL(site.url),
    title: fullTitle,
    description: summary,
    alternates: {
      canonical,
      ...(noindex ? {} : { languages: languageAlternates(path, availableLocales) }),
    },
    robots: { index: !noindex, follow: true },
    openGraph: { type: "website", title: fullTitle, description: summary, url: canonical,
      siteName: site.name, locale: canonicalLocale.replace("-", "_") },
    twitter: { card: "summary", title: fullTitle, description: summary },
  };
}

export function informationMetadata(locale: Locale, path: keyof typeof informationPages) {
  // These articles currently contain English text in every locale.
  return buildPageMetadata({ locale, path, ...informationPages[path], availableLocales: ["en-US"] });
}
