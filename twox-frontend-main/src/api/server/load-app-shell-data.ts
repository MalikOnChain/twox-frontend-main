import {
  isLocalhostApiBase,
  isSameOriginApiProxyEnabled,
} from '@/lib/api-base-url'

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

/** Vercel cannot reach the dev machine or a missing API URL; avoid useless fetches. */
function shouldUseShellFallbackWithoutFetch(): boolean {
  if (process.env.VERCEL !== '1') return false
  if (isSameOriginApiProxyEnabled()) return false
  if (!process.env.NEXT_PUBLIC_BACKEND_API?.trim()) return true
  return isLocalhostApiBase()
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
