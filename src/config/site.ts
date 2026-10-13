export const DEFAULT_SITE_URL = "https://brutto-netto-rechner.com.de";

export function getSiteConfig(input: string | undefined = process.env.BASE_URL) {
  const value = (input ?? "").trim().replace(/^["']+|["']+$/g, "") || DEFAULT_SITE_URL;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!/^https?:$/.test(url.protocol)) throw new Error("Unsupported site protocol");
  } catch {
    url = new URL(DEFAULT_SITE_URL);
  }
  const hostname = url.hostname;
  return {
    url: url.origin,
    hostname,
    name: hostname.charAt(0).toUpperCase() + hostname.slice(1),
  };
}
export type SiteConfig = ReturnType<typeof getSiteConfig>;
