/**
 * Normalize user-entered URLs for href (add https:// when missing).
 * Safe for linkedin.com/..., github.com/..., and bare domains.
 */
export function normalizeExternalUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^mailto:/i.test(t) || /^tel:/i.test(t)) return t;
  return `https://${t}`;
}

/** Non-empty trimmed URL string (user entered a link). */
export function hasWebLink(url: string | undefined | null): url is string {
  return typeof url === 'string' && url.trim().length > 0;
}
