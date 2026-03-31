import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

/**
 * Interface for spin result from backend
 */
export interface SpinResultResponse {
  success: boolean
  result: string
  error?: string
}

export interface GetWheelBonuses {
  success: boolean
  wheelBonusAmounts: number[]
  error?: any
}

export const getWheelBonuses = async (): Promise<GetWheelBonuses> => {
  try {
    const response = await api.get<GetWheelBonuses>('/rewards/spin-bonus')
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get wheel bonuses')
  }
}

export const getSpinResult = async (): Promise<SpinResultResponse> => {
  try {
    const response = await api.get<SpinResultResponse>(
      '/rewards/spin-bonus/result'
    )
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get spin result')
  }
}
