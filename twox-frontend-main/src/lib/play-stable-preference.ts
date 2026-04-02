export const PREFERRED_PLAY_STABLE_STORAGE_KEY = 'twox:preferred-play-stable:v1'

/** Fired on `window` after a same-tab preference write (storage event is cross-tab only). */
export const PREFERRED_PLAY_STABLE_EVENT = 'twox:preferred-play-stable'

export function readPreferredPlayStable(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(PREFERRED_PLAY_STABLE_STORAGE_KEY)?.trim()
    return v || null
  } catch {
    return null
  }
}

export function writePreferredPlayStable(value: string): void {
  if (typeof window === 'undefined') return
  try {
    const t = value.trim()
    if (t) localStorage.setItem(PREFERRED_PLAY_STABLE_STORAGE_KEY, t)
    else localStorage.removeItem(PREFERRED_PLAY_STABLE_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(PREFERRED_PLAY_STABLE_EVENT, { detail: t }))
  } catch {
    /* quota / private mode */
  }
}
