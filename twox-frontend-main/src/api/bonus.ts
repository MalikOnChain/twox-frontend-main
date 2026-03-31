import api from '@/lib/api'

export interface Bonus {
  _id: string
  name: string
  code?: string
  description: string
  type: string
  category: string
  status: string
  isVisible: boolean
  defaultReward: {
    cash?: {
      amount?: number
      percentage?: number
      minAmount?: number
      maxAmount?: number
    }
    freespins?: {
      count?: number
      valuePerSpin?: number
    }
  }
  wageringRequirement?: {
    multiplier?: number
    minOdds?: number
  }
  validFrom?: string
  validTo?: string
  imageUrl?: string
  termsAndConditions?: string
  createdAt: string
  updatedAt: string
}

export interface BonusResponse {
  success: boolean
  data: Bonus[]
  bonuses?: Bonus[]
  message?: string
}

export interface BonusDetailsResponse {
  success: boolean
  data: Bonus
  message?: string
}

/**
 * Get all active bonuses
 */
export const getAllBonuses = async (): Promise<BonusResponse> => {
  try {
    const response = await api.get<any>('/rewards/bonuses')
    console.log('🔍 getAllBonuses response:', response.data);
    
    // Backend returns 'bonuses' field, normalize to 'data'
    return {
      success: response.data?.success || true,
      data: response.data?.bonuses || response.data?.data || [],
    }
  } catch (error) {
    console.error('Failed to fetch bonuses:', error)
    return { success: false, data: [] }
  }
}

/**
 * Get eligible bonuses for current user
 */
export const getEligibleBonuses = async (): Promise<BonusResponse> => {
  try {
    const response = await api.get<BonusResponse>('/rewards/bonuses/eligible')
    return response.data
  } catch (error) {
    console.error('Failed to fetch eligible bonuses:', error)
    return { success: false, data: [] }
  }
}

/**
 * Claim a bonus
 */
export const claimBonus = async (
  bonusId: string,
  code?: string,
  fingerprint?: { visitorId: string; fingerprintData?: any }
): Promise<{ success: boolean; message?: string; data?: any }> => {
  try {
    console.log('🎁 Claiming bonus:', bonusId)
    const response = await api.post(`/rewards/bonuses/claim`, { 
      id: bonusId,
      code,
      ...(fingerprint && {
        fingerprint: {
          visitorId: fingerprint.visitorId,
          data: fingerprint.fingerprintData,
        },
      }),
    })
    console.log('✅ Bonus claim response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Failed to claim bonus:', error)
    console.error('Error response:', error.response?.data)
    return { 
      success: false, 
      message: error.response?.data?.message || error.response?.data?.error || 'Failed to claim bonus' 
    }
  }
}

/**
 * Get bonus details
 */
export const getBonusDetails = async (bonusId: string): Promise<BonusDetailsResponse> => {
  try {
    const response = await api.get<BonusDetailsResponse>(`/rewards/bonus/details`, {
      params: { bonusId }
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch bonus details:', error)
    return { success: false, data: {} as Bonus }
  }
}

/**
 * Get user's bonus history
 */
export const getUserBonusHistory = async (): Promise<BonusResponse> => {
  try {
    const response = await api.get<BonusResponse>('/rewards/bonus/history')
    return response.data
  } catch (error) {
    console.error('Failed to fetch bonus history:', error)
    return { success: false, data: [] }
  }
}

/**
 * Get user bonuses (alias for getUserBonusHistory)
 */
export const getUserBonuses = async (): Promise<{ bonuses: Bonus[] }> => {
  try {
    const response = await getUserBonusHistory()
    return { bonuses: response.data || [] }
  } catch (error) {
    console.error('Failed to fetch user bonuses:', error)
    return { bonuses: [] }
  }
}

/**
 * Get user referral metrics
 */
export const getUserReferralMetrics = async (): Promise<{
  totalReferrals: number
  totalDeposits: number
  totalWagered: number
  totalEarnings: number
}> => {
  const response = await api.get('/user/referral/metrics')
  return response.data
}

/**
 * Redeem a promo code
 */
export interface RedeemPromoCodeResponse {
  success: boolean
  message: string
  bonus?: {
    name: string
    description: string
    amount: number
  }
}

export const redeemPromoCode = async (
  code: string,
  fingerprint?: { visitorId: string; fingerprintData?: any }
): Promise<RedeemPromoCodeResponse> => {
  const response = await api.post('/rewards/promo-code/redeem', {
    code: code.toUpperCase(),
    ...(fingerprint && {
      fingerprint: {
        visitorId: fingerprint.visitorId,
        data: fingerprint.fingerprintData,
      },
    }),
  })
  return response.data
}
