import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

export interface CreatePaymentRequest {
  amount: number
  currency: string
  pay_currency: string
  order_description?: string
  network?: string
}

export interface CreatePaymentResponse {
  success: boolean
  data: {
    payment_id: string
    pay_address: string
    pay_currency: string
    price_amount: string
    price_currency: string
    order_id: string
    created_at: string
    valid_until: string | null
    transaction_id: string
  }
  error?: string
}

export interface PaymentStatusResponse {
  success: boolean
  data: {
    payment_id: string
    payment_status: string
    pay_address: string
    price_amount: string
    price_currency: string
    pay_currency: string
    pay_amount: string
    actually_paid: string
    outcome_amount: string
    outcome_currency: string
    order_id: string
    created_at: string
    updated_at: string
    transaction_status: number
  }
  error?: string
}

export interface CurrencyNetwork {
  code: string
  name: string
  min_deposit_amount?: number
  min_payout_amount?: number
}

export interface Currency {
  code: string
  name: string
  symbol: string
  decimals: number
  min_deposit_amount?: number
  min_payout_amount?: number
  networks?: CurrencyNetwork[]
  // Metadata fields added by frontend
  logo?: string
  color?: string
  popular?: boolean
}

export interface SupportedCurrenciesResponse {
  success: boolean
  data: {
    currencies: Currency[]
  }
  error?: string
}

export interface MinAmountResponse {
  success: boolean
  data: {
    currency_from: string
    currency_to: string
    min_amount: string
  }
  error?: string
}

export interface EstimatedPriceResponse {
  success: boolean
  data: {
    currency_from: string
    currency_to: string
    estimated_amount: string
  }
  error?: string
}

export interface PaymentHistoryResponse {
  success: boolean
  data: {
    transactions: any[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
  error?: string
}

/**
 * Create a new cryptocurrency payment
 */
export const createPayment = async (payload: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
  try {
    const response = await api.post<CreatePaymentResponse>('/payments/coinsbuy/payment', payload)
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to create payment')
  }
}

/**
 * Get payment status
 */
export const getPaymentStatus = async (paymentId: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await api.get<PaymentStatusResponse>(`/payments/coinsbuy/payment/${paymentId}`)
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get payment status')
  }
}

/**
 * Get supported cryptocurrencies
 */
export const getSupportedCurrencies = async (): Promise<SupportedCurrenciesResponse> => {
  try {
    const response = await api.get<SupportedCurrenciesResponse>('/payments/coinsbuy/currencies')
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get supported currencies')
  }
}

/**
 * Get minimum payment amount for currency pair
 */
export const getMinimumPaymentAmount = async (currencyFrom: string, currencyTo: string): Promise<MinAmountResponse> => {
  try {
    const response = await api.get<MinAmountResponse>('/payments/coinsbuy/min-amount', {
      params: {
        currency_from: currencyFrom,
        currency_to: currencyTo,
      },
    })
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get minimum payment amount')
  }
}

/**
 * Get estimated price for currency conversion
 */
export const getEstimatedPrice = async (amount: number, currencyFrom: string, currencyTo: string): Promise<EstimatedPriceResponse> => {
  try {
    const response = await api.get<EstimatedPriceResponse>('/payments/coinsbuy/estimate', {
      params: {
        amount,
        currency_from: currencyFrom,
        currency_to: currencyTo,
      },
    })
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get estimated price')
  }
}

/**
 * Get payment history for user
 */
export const getPaymentHistory = async (params: { limit?: number; page?: number } = {}): Promise<PaymentHistoryResponse> => {
  try {
    const response = await api.get<PaymentHistoryResponse>('/payments/coinsbuy/history', {
      params,
    })
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get payment history')
  }
}

