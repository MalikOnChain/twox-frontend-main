export const AUTH_SESSION_COOKIE = 'twox_auth'

const MAX_AGE_SEC = 60 * 60 * 24 * 7

export function setAuthSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_SESSION_COOKIE}=1; Max-Age=${MAX_AGE_SEC}; Path=/; SameSite=Lax`
}

export function clearAuthSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_SESSION_COOKIE}=; Max-Age=0; Path=/`
}

/** Mirrors localStorage session token so Edge middleware can gate /profile. */
export function syncAuthSessionCookieFromStorage(): void {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem('token')
    if (!raw) {
      clearAuthSessionCookie()
      return
    }
    const val = JSON.parse(raw) as unknown
    if (val !== null && val !== undefined && val !== '') {
      setAuthSessionCookie()
    } else {
      clearAuthSessionCookie()
    }
  } catch {
    clearAuthSessionCookie()
  }
}
