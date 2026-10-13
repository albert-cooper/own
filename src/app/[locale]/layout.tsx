import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import BaseLayout from "@/components/basic-layout";
import { Locale, routing } from "@/i18n/routing";
import { DarkMode } from "@chakra-ui/react";
import Script from "next/script";
import PixelScripts from "@/components/analytics/pixel-scripts";
import dynamic from "next/dynamic";



const AdClickTracker = dynamic(() => import("@/components/analytics/ad-click-tracker"), { ssr: false })
// const CookieConsent = dynamic(() => import("@/components/cookie-consent"), { ssr: false })
interface Props extends PropsWithChildren {
  params: { locale: Locale };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <BaseLayout locale={locale}>
      <Script
        async
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=tag-manager-id"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />

      <PixelScripts />
      <DarkMode>{children}</DarkMode>
      {/* <CookieConsent /> */}
      <AdClickTracker />
    </BaseLayout>
  );
}
