import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export const API_UNREACHABLE_TOAST_ID = 'twox-api-unreachable'

/** Thrown after a single deduplicated connectivity toast so callers can avoid repeating it. */
export class ClientUnreachableApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ClientUnreachableApiError'
  }
}

export function isClientUnreachableApiError(
  e: unknown
): e is ClientUnreachableApiError {
  return e instanceof ClientUnreachableApiError
}

const VERCEL_ENV_HINT =
  'On Vercel: Project → Settings → Environment Variables — add the variable(s), enable them for Production ' +
  '(and Preview if you use preview URLs), then trigger a new deployment so the client bundle is rebuilt.'

function showVercelDeployHint(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h.endsWith('.vercel.app') || h === 'vercel.app'
}

export function describeAxiosNetworkFailure(error: AxiosError): string {
  const code = error.code
  const base = error.config?.baseURL?.trim()
  const vercelTail = showVercelDeployHint() ? ` ${VERCEL_ENV_HINT}` : ''

  if (!base) {
    return (
      'No backend URL is configured for the browser. Set NEXT_PUBLIC_BACKEND_API to your API base ' +
      '(for example https://your-api.com/api), or use NEXT_PUBLIC_USE_API_PROXY=1 with BACKEND_PROXY_TARGET ' +
      'pointing at that same API base. These are read at build time for NEXT_PUBLIC_* — redeploy after changing them.' +
      vercelTail +
      ' Also ensure your API allows this site’s origin in CORS.'
    )
  }

  if (code === 'ECONNABORTED') {
    return `Request timed out before reaching the API (${base}). Check that the backend is running and reachable.`
  }

  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    base.startsWith('http:')
  ) {
    return (
      'This page is served over HTTPS but the API URL is HTTP, which browsers block (mixed content). ' +
      'Use an HTTPS API URL, or set NEXT_PUBLIC_USE_API_PROXY=1 with BACKEND_PROXY_TARGET so requests go through /_api.'
    )
  }

  return (
    `Could not reach the API (${base}). ` +
    `If you are online, verify NEXT_PUBLIC_BACKEND_API (or the /_api proxy), that the backend is running, ` +
    `and that CORS allows this site’s origin.` +
    vercelTail
  )
}

/** Matches messages produced by this module / connectivity failures (for string-only error state). */
export function isLikelyApiConnectivityMessage(message: string): boolean {
  if (!message) return false
  return (
    message.includes('Could not reach the API') ||
    message.includes('Request timed out before reaching the API') ||
    message.includes('mixed content') ||
    message.includes('No backend URL is configured') ||
    message.includes('API base URL not set') ||
    message.includes('API is not configured') ||
    message.includes('NEXT_PUBLIC_BACKEND_API') ||
    message.includes('Network error: Please check your internet connection')
  )
}

export function toastApiUnreachable(message: string): void {
  if (typeof window === 'undefined') return
  toast.error(message, { id: API_UNREACHABLE_TOAST_ID, duration: 12_000 })
}
