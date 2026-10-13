import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Locale } from "@/i18n/routing";
import { getTargetHref } from "@/utils/navigation";

export const useLocaleAndChannel = () => {
  const locale = useLocale() as Locale;
  const channel = useSearchParams().get("channel");
  return (pathname: string, otherSearchStr?: string) => getTargetHref(locale, pathname, channel, otherSearchStr);
};
