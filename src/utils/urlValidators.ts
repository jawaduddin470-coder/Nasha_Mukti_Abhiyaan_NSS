/**
 * URL and External Link Validators
 * NSS MJCET Nasha Mukti Abhiyaan
 */

/**
 * Validates whether a given string is a genuine, properly formatted LinkedIn profile URL.
 * Rejects empty strings, generic homepages, and non-profile links.
 */
export function isValidLinkedInUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  try {
    const candidate = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(candidate);
    const host = parsed.hostname.toLowerCase();

    // Must be on a linkedin domain
    if (!host.includes('linkedin.com')) return false;

    // Must contain a meaningful profile path (e.g. /in/username or /pub/...)
    const path = parsed.pathname.trim().replace(/\/+$/, '');
    if (!path || path === '' || path === '/in' || path === '/pub') return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Formats a valid LinkedIn URL to ensure an https:// protocol prefix.
 */
export function formatExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
