import { advertising } from "@/config/advertising";
import { trackRevenue } from "@/utils/meta-pixel";

export type ConversionState = { meta: boolean; tiktok: boolean };
export const createConversionState = (): ConversionState => ({ meta: false, tiktok: false });

/** Keep SDK failures isolated and queue at most once per provider and interaction. */
export function trackAdConversion(state: ConversionState) {
  if (typeof window === "undefined") return;
  if (!state.meta) {
    state.meta = trackRevenue({ value: advertising.conversionValue, currency: advertising.currency });
  }
  if (!state.tiktok && typeof window.ttq?.track === "function") {
    try {
      window.ttq.track("Purchase", {
        value: advertising.conversionValue,
        currency: advertising.currency,
        content_type: "product",
        content_name: "Ad Click Conversion",
      });
      state.tiktok = true;
    } catch {
      // A blocked or unavailable provider must not prevent the other provider.
    }
  }
}
