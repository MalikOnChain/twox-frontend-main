const STORAGE_KEY = 'twox_remembered_login'

export type RememberedLoginCredentials = {
  email: string
  password: string
}

/** Plain localStorage; only for convenience on trusted devices. */
export function getRememberedLoginCredentials(): RememberedLoginCredentials | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as RememberedLoginCredentials).email !== 'string' ||
      typeof (parsed as RememberedLoginCredentials).password !== 'string'
    ) {
      return null
    }
    return {
      email: (parsed as RememberedLoginCredentials).email,
      password: (parsed as RememberedLoginCredentials).password,
    }
  } catch {
    return null
  }
}

export function saveRememberedLoginCredentials(
  email: string,
  password: string
): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ email, password })
    )
  } catch {
    // ignore quota / private mode
  }
}

export function clearRememberedLoginCredentials(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
