const DEFAULT_LOCAL_API = 'http://localhost:5000/api'
const DEFAULT_LOCAL_SOCKET_ORIGIN = 'http://127.0.0.1:5000'

/** Strip trailing `/api` (and slashes) so an API base URL becomes a Socket.IO HTTP origin. */
function apiBaseToSocketOrigin(raw: string): string {
  const normalized = raw.replace(/\?+$/, '').replace(/\/$/, '')
  return normalized.endsWith('/api') ? normalized.slice(0, -4) : normalized
}

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

/**
 * Socket.IO origin (no `/api`). REST may use `/_api` while sockets must reach the real backend.
 * When `NEXT_PUBLIC_USE_API_PROXY=1`, prefers `NEXT_PUBLIC_BACKEND_ORIGIN`, then `NEXT_PUBLIC_BACKEND_API`,
 * then `NEXT_PUBLIC_BACKEND_PROXY_TARGET` (mirrors `BACKEND_PROXY_TARGET` via next.config.mjs `env`).
 */
export function getSocketHttpOrigin(): string {
  const explicitOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim()
  if (explicitOrigin) {
    return explicitOrigin.replace(/\?+$/, '').replace(/\/$/, '')
  }
  const api = process.env.NEXT_PUBLIC_BACKEND_API?.trim()
  if (api) {
    return apiBaseToSocketOrigin(api)
  }
  if (isSameOriginApiProxyEnabled()) {
    const proxyTarget = process.env.NEXT_PUBLIC_BACKEND_PROXY_TARGET?.trim()
    if (proxyTarget) {
      return apiBaseToSocketOrigin(proxyTarget)
    }
    if (process.env.NODE_ENV === 'development') {
      return DEFAULT_LOCAL_SOCKET_ORIGIN
    }
  }
  return ''
}

/** SSR shell fetch when API base is unavailable (avoids throwing). */
export function shellStubJsonResponse(): Response {
  return new Response('{}', {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
