import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await (locale === "ja-JP" ? import("../../messages/ja-JP.json") : locale === "fr-FR" ? import("../../messages/fr-FR.json") : import("../../messages/en-US.json"))).default,
  };
});
