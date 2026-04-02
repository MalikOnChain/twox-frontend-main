import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'
import { paymentDebugTraceClient } from '@/lib/payment-debug-trace'

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

    // #region agent log
    paymentDebugTraceClient({
      flow: 'withdraw_ui',
      step: 'getWithdrawConfig_ok',
      data: {
        hasStableOptions: Array.isArray(response.data.data?.withdrawStablePayoutOptions),
      },
    })
    // #endregion

    return response.data
  } catch (error) {
    // #region agent log
    paymentDebugTraceClient({
      flow: 'withdraw_ui',
      step: 'getWithdrawConfig_error',
      data: { errMsgLen: error instanceof Error ? error.message.length : 0 },
    })
    // #endregion
    throw handleApiError(error, 'Failed to get withdraw config')
  }
}

export interface WithdrawCryptoResponse {
  success: boolean
  message: string
  error?: any
  data?: {
    fystack?: { submitted?: boolean; message?: string | null }
  }
}

export const sendCryptoWithdrawRequest = async (
  payload: {
    symbol: string
    /** USDT rail: ERC20, TRC20, BSC, SOL, …, must match FYSTACK_WITHDRAW_ASSET_MAP keys. */
    network: string
    address: string
    amount: number
  },
  fingerprint?: { visitorId: string; fingerprintData?: any }
): Promise<WithdrawCryptoResponse> => {
  try {
    // #region agent log
    paymentDebugTraceClient({
      flow: 'withdraw_ui',
      step: 'sendWithdraw_request',
      data: {
        symbol: payload.symbol,
        network: payload.network,
        amountPositive: payload.amount > 0,
        addrLen: payload.address.length,
      },
    })
    // #endregion
    const response = await api.post<WithdrawCryptoResponse>(
      '/crypto/withdraw',
      {
        amount: payload.amount,
        currency: payload.symbol,
        address: payload.address,
        network: payload.network,
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

    // #region agent log
    paymentDebugTraceClient({
      flow: 'withdraw_ui',
      step: 'sendWithdraw_ok',
      data: {
        success: Boolean(response.data.success),
        fystackSubmitted: Boolean(response.data.data?.fystack?.submitted),
      },
    })
    // #endregion

    return response.data
  } catch (error) {
    // #region agent log
    paymentDebugTraceClient({
      flow: 'withdraw_ui',
      step: 'sendWithdraw_error',
      data: { errMsgLen: error instanceof Error ? error.message.length : 0 },
    })
    // #endregion
    throw handleApiError(error, 'Failed to withdraw crypto')
  }
}
