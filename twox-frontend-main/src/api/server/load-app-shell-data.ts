import { getBonuses } from './bonus'
import { getLoyaltyTiers } from './loyalty-tier'
import { getSettings } from './settings'

async function readJsonSafe(res: Response): Promise<Record<string, unknown>> {
  try {
    const text = await res.text()
    if (!text.trim()) return {}
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return { error: 'Invalid API response' }
  }
}

/** Vercel cannot reach the developer machine; avoid slow failing fetches to localhost. */
function shouldUseShellFallbackWithoutFetch(): boolean {
  if (process.env.VERCEL !== '1') return false
  const base =
    process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:5000/api'
  const u = base.toLowerCase()
  return u.includes('localhost') || u.includes('127.0.0.1')
}

export type AppShellData = {
  /** Present when a real fetch ran; use .ok to detect HTTP errors */
  responses: [Response, Response, Response] | null
  settingsResponse: Record<string, unknown>
  loyaltyResponse: Record<string, unknown>
  bonusesResponse: Record<string, unknown>
}

/**
 * Loads settings / VIP / bonuses for the app shell. Never throws: on failure uses
 * empty payloads so the UI can render with defaults (e.g. Vercel without API URL).
 */
export async function loadAppShellData(): Promise<AppShellData> {
  const empty: AppShellData = {
    responses: null,
    settingsResponse: {},
    loyaltyResponse: { ranks: [] },
    bonusesResponse: { bonuses: [] },
  }

  if (shouldUseShellFallbackWithoutFetch()) {
    return empty
  }

  try {
    const settingsRes = await getSettings()
    const loyaltyRes = await getLoyaltyTiers()
    const bonusesRes = await getBonuses()
    const [settingsResponse, loyaltyResponse, bonusesResponse] =
      await Promise.all([
        readJsonSafe(settingsRes),
        readJsonSafe(loyaltyRes),
        readJsonSafe(bonusesRes),
      ])
    return {
      responses: [settingsRes, loyaltyRes, bonusesRes],
      settingsResponse,
      loyaltyResponse,
      bonusesResponse,
    }
  } catch {
    return empty
  }
}
