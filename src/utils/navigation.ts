import { Locale, getPathname } from "@/i18n/routing";
import { mergeQuery } from "./query";

export function getTargetHref(locale: Locale, pathname: string, channel?: string | null, otherSearchStr?: string) {
  return getPathname({ locale, href: mergeQuery(pathname, channel, otherSearchStr) });
}
