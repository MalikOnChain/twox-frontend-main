const DEFAULT_LOCAL_API = 'http://localhost:5000/api'

/** True when browser should call the backend through Next.js rewrites (same origin). */
export function isSameOriginApiProxyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_API_PROXY === '1'
}

/**
 * Client-side axios baseURL: full API URL or same-origin proxy prefix `/_api`.
 * When unset on Vercel, returns empty string (caller should avoid firing requests).
 */
export function getBrowserApiBaseUrl(): string {
  if (isSameOriginApiProxyEnabled()) {
    return '/_api'
  }
  const direct = process.env.NEXT_PUBLIC_BACKEND_API?.trim()
  return direct ? direct.replace(/\?+$/, '').replace(/\/$/, '') : ''
}

/**
 * Server-side fetch base (RSC, Route Handlers). Never defaults to localhost on Vercel
 * when `NEXT_PUBLIC_BACKEND_API` is missing (avoids timeouts).
 */
export function getServerFetchApiBase(): string {
  if (isSameOriginApiProxyEnabled()) {
    if (process.env.VERCEL_URL) {
      const host = process.env.VERCEL_URL.replace(/^https?:\/\//, '')
      return `https://${host}/_api`.replace(/\?+$/, '').replace(/\/$/, '')
    }
    const port = process.env.PORT || '3000'
    return `http://127.0.0.1:${port}/_api`.replace(/\/$/, '')
  }
  const direct = process.env.NEXT_PUBLIC_BACKEND_API?.trim()
  if (direct) {
    return direct.replace(/\?+$/, '').replace(/\/$/, '')
  }
  if (process.env.VERCEL === '1') {
    return ''
  }
  return DEFAULT_LOCAL_API.replace(/\/$/, '')
}

/** Whether configured API base points at loopback (useless on Vercel). */
export function isLocalhostApiBase(): boolean {
  const raw =
    process.env.NEXT_PUBLIC_BACKEND_API?.trim() || DEFAULT_LOCAL_API
  const u = raw.toLowerCase()
  return u.includes('localhost') || u.includes('127.0.0.1')
}

/** Socket.IO origin (no `/api`). Requires direct backend URL when using proxy for HTTP. */
export function getSocketHttpOrigin(): string {
  const origin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim()
  if (origin) {
    return origin.replace(/\?+$/, '').replace(/\/$/, '')
  }
  const api = process.env.NEXT_PUBLIC_BACKEND_API?.trim()
  if (!api) return ''
  const normalized = api.replace(/\?+$/, '').replace(/\/$/, '')
  return normalized.endsWith('/api')
    ? normalized.slice(0, -4)
    : normalized
}

/** SSR shell fetch when API base is unavailable (avoids throwing). */
export function shellStubJsonResponse(): Response {
  return new Response('{}', {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
