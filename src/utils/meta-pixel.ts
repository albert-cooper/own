type RevenueOptions = {
  value: number;
  currency: string;
  eventId?: string;
};

declare global {
  interface Window {
    fbq?: (
      command: "track" | "trackCustom",
      event: string,
      parameters: { value: number; currency: string },
      options?: { eventID: string }
    ) => void;
  }
}

/** True means queued to the Pixel, not confirmed delivery or actual revenue. */
export function trackRevenue({ value, currency, eventId }: RevenueOptions): boolean {
  const normalizedCurrency = currency.trim().toUpperCase();
  if (!Number.isFinite(value) || value < 0 || !/^[A-Z]{3}$/.test(normalizedCurrency)) return false;
  if (typeof window === "undefined" || typeof window.fbq !== "function") return false;
  try {
    window.fbq(
      "track",
      "Purchase",
      { value, currency: normalizedCurrency },
      eventId ? { eventID: eventId } : undefined
    );
    return true;
  } catch {
    return false;
  }
}
