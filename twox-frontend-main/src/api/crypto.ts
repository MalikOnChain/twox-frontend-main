import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import { WithdrawConfig } from '@/types/crypto'

export interface GetWithdrawConfig {
  data: WithdrawConfig
  error?: any
}

export const getWithdrawConfig = async (): Promise<GetWithdrawConfig> => {
  try {
    const response = await api.get<GetWithdrawConfig>('/crypto/withdraw-config')

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get withdraw config')
  }
}

export interface WithdrawCryptoResponse {
  success: boolean
  message: string
  error?: any
}

export const sendCryptoWithdrawRequest = async (
  payload: {
    symbol: string
    blockchain: string
    address: string
    amount: number
  },
  fingerprint?: { visitorId: string; fingerprintData?: any }
): Promise<WithdrawCryptoResponse> => {
  try {
    const response = await api.post<WithdrawCryptoResponse>(
      '/crypto/withdraw',
      {
        ...payload,
        ...(fingerprint && {
          fingerprint: {
            visitorId: fingerprint.visitorId,
            data: fingerprint.fingerprintData,
          },
        }),
      }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to withdraw crypto')
  }
}
