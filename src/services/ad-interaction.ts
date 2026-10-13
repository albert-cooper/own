const AD_SELECTOR = ".adsbygoogle, .gpt-slot, .ad-placeholder, [id^='google_vignette'], [id^='div-gpt-ad']";

export function getFocusedAdFrame(): HTMLIFrameElement | null {
  const focused = document.activeElement;
  if (!(focused instanceof HTMLIFrameElement)) return null;
  // Only a known ad container qualifies; unrelated game/video iframes do not.
  return focused.closest(AD_SELECTOR) ? focused : null;
}
