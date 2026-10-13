export function mergeQuery(pathname: string, channel?: string | null, extra?: string): string {
  const hashIndex = pathname.indexOf("#");
  const hash = hashIndex < 0 ? "" : pathname.slice(hashIndex);
  const path = hashIndex < 0 ? pathname : pathname.slice(0, hashIndex);
  const queryIndex = path.indexOf("?");
  const base = queryIndex < 0 ? path : path.slice(0, queryIndex);
  const query = new URLSearchParams(queryIndex < 0 ? "" : path.slice(queryIndex + 1));
  new URLSearchParams(extra?.replace(/^\?/, "")).forEach((value, key) => query.set(key, value));
  if (channel) query.set("channel", channel);
  const search = query.toString();
  return `${base}${search ? `?${search}` : ""}${hash}`;
}
