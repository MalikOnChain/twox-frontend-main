import api from '@/lib/api'

export interface TierReward {
  _id: string
  bonusId: string
  tierId: string
  tierName: string
  tierLevel?: string
  tierReward: {
    cash?: {
      amount?: number
      percentage?: number
      minAmount?: number
      maxAmount?: number
    }
    freeSpins?: {
      amount?: number
      percentage?: number
      minAmount?: number
      maxAmount?: number
    }
    bonus?: {
      amount?: number
      percentage?: number
      minAmount?: number
      maxAmount?: number
    }
    special?: any
  }
  tierWageringMultiplier?: number
  isActive: boolean
  priority?: number
}

export interface TierRewardsResponse {
  success: boolean
  rewards: TierReward[]
  total: number
}

/**
 * Get tier rewards for the user's current tier
 */
export const getUserTierRewards = async (): Promise<TierRewardsResponse> => {
  const response = await api.get('/vip/tier-rewards')
  return response.data
}

/**
 * Claim a tier reward
 */
export const claimTierReward = async (rewardId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/vip/tier-rewards/${rewardId}/claim`)
  return response.data
}

