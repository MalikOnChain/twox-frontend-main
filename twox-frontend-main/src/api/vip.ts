import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import { LoyaltyTier, UserRankStatus } from '@/types/vip'

interface VipRankingInfoResponse {
  error?: string
  ranks: LoyaltyTier[]
}
export const getVipRankingInfo = async (): Promise<LoyaltyTier[]> => {
  try {
    const response = await api.get<VipRankingInfoResponse>('/vip/ranking-info')

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data?.ranks
  } catch (error) {
    throw handleApiError(error, 'Failed to get VIP Ranking Info')
  }
}

interface UserRankStatusResponse {
  error?: string
  rank: UserRankStatus
}
export const getUserRankStatus = async (): Promise<UserRankStatus> => {
  try {
    const response = await api.get<UserRankStatusResponse>('/vip')

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data?.rank
  } catch (error) {
    throw handleApiError(error, 'Failed to get VIP Ranking Info')
  }
}
