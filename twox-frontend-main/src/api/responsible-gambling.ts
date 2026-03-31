import api from '@/lib/api'

export interface SelfExclusionResponse {
  success: boolean
  message: string
}

/**
 * Request self-exclusion - sends confirmation code to email
 */
export const requestSelfExclusion = async (email: string): Promise<SelfExclusionResponse> => {
  const response = await api.post('/user/self-exclusion/request', { email })
  return response.data
}

/**
 * Confirm self-exclusion with verification code
 */
export const confirmSelfExclusion = async (email: string, code: string): Promise<SelfExclusionResponse> => {
  const response = await api.post('/user/self-exclusion/confirm', { email, code })
  return response.data
}

