import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import { TRankingResponse, TWagerRaceResponse } from '@/types/wagerRace'

export const getWagerRaceById = async (id: string) => {
  try {
    const response = await api.get<TRankingResponse>(`/wager-race/${id}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get wager race')
  }
}

export const getWagerRaces = async () => {
  try {
    const response = await api.get<TWagerRaceResponse>(`/wager-race/list`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get wager races')
  }
}

export const joinWagerRace = async (id: string) => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(
      `/wager-race/entry/${id}`
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to join wager race')
  }
}

export const getUserRaceStatus = async (id: string) => {
  try {
    const response = await api.get<{ isJoined: boolean; rank: number | null }>(
      `/wager-race/me/${id}`
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get user race status')
  }
}
