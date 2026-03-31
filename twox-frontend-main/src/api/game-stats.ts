import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

export interface GameStatItem {
  id: string
  gameName: string
  gameCode?: string
  providerCode?: string
  gameType?: 'slots' | 'live-casino'
  gameImage?: string
  player: string
  betAmount: number
  winAmount: number
  profit: number
  multiplier: string
  currency: '$' | '₿'
  timestamp?: Date
}

// Alias for backward compatibility with latest-winners component
export type GameStatsWinner = GameStatItem

export interface GameStatsResponse {
  success: boolean
  data: GameStatItem[]
  error?: any
}

/**
 * Get latest winners
 * Now controlled by Winners Feed settings from admin panel
 */
export const getLatestWinners = async (limit = 8): Promise<GameStatsResponse> => {
  try {
    const response = await api.get<GameStatsResponse>(
      '/slots-casino/blueocean/stats/latest-winners',
      { params: { limit } }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get latest winners')
  }
}

/**
 * Get high rollers (biggest bets)
 */
export const getHighRollers = async (
  limit = 5,
  period: 'day' | 'week' | 'month' = 'day'
): Promise<GameStatsResponse> => {
  try {
    const response = await api.get<GameStatsResponse>(
      '/slots-casino/blueocean/stats/high-rollers',
      { params: { limit, period } }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get high rollers')
  }
}

/**
 * Get best multipliers
 */
export const getBestMultipliers = async (
  limit = 5,
  period: 'day' | 'week' | 'month' = 'day'
): Promise<GameStatsResponse> => {
  try {
    const response = await api.get<GameStatsResponse>(
      '/slots-casino/blueocean/stats/best-multipliers',
      { params: { limit, period } }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get best multipliers')
  }
}

/**
 * Get top winners (winners of day/month)
 */
export const getTopWinners = async (
  limit = 4,
  period: 'day' | 'week' | 'month' = 'day'
): Promise<GameStatsResponse> => {
  try {
    const response = await api.get<GameStatsResponse>(
      '/slots-casino/blueocean/stats/top-winners',
      { params: { limit, period } }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get top winners')
  }
}
