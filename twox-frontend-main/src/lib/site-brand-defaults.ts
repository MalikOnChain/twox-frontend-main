/** Official TWOX wordmark (transparent background) */
export const SITE_BRAND_LOGO_URL = '/twox-logo.png'
export const SITE_BRAND_LOGO_SYMBOL_URL = '/twox-logo.png'

/**
 * Use when CMS/API omits logos or still points at legacy public paths that were never shipped.
 */
export function resolveSiteLogoUrl(
  url: string | undefined | null,
  fallback: string = SITE_BRAND_LOGO_URL
): string {
  if (url == null || typeof url !== 'string') return fallback
  const t = url.trim()
  if (!t) return fallback
  if (t === '/images/small-logo-32.png' || t === '/twox-mark.svg') return fallback
  return t
}
