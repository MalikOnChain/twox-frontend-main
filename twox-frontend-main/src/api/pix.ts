import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

export interface PaymentRequest {
  amount: number
  currency: string
  isTest?: boolean
  pix_key?: string
  cpf_number?: string
  pix_key_type?: 'email' | 'phone' | 'cpf'
}

export const getTransactions = async (payload: {
  page: number
  limit: number
}): Promise<any> => {
  try {
    const response = await api.get('/transactions', { params: payload })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get transactions')
  }
}
export const makePayment = async (payload: PaymentRequest): Promise<any> => {
  try {
    const response = await api.post('/transactions/payment', payload, {
      headers: {
        'x-test-mode': payload.isTest,
      },
    })
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to make payment')
  }
}

export const withdraw = async (payload: PaymentRequest): Promise<any> => {
  try {
    const response = await api.post('/transactions/withdraw', payload)
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to withdraw')
  }
}

export const pixWebhook = async (payload: {
  transaction_id: string
}): Promise<any> => {
  try {
    const response = await api.post('/transactions/webhook', payload, {
      headers: {
        'x-test-mode': true,
      },
    })
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to make payment')
  }
}
