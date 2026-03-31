import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

export interface CryptoPriceData {
  currency: string
  price: number
}

export interface CryptoPricesResponse {
  success: boolean
  data: CryptoPriceData[]
  timestamp: number
  error?: any
}

export interface SinglePriceResponse {
  success: boolean
  data: {
    currency: string
    price: number
  }
  timestamp: number
  error?: any
}

/**
 * Get all cryptocurrency prices
 */
export const getAllCryptoPrices = async (): Promise<CryptoPricesResponse> => {
  try {
    const response = await api.get<CryptoPricesResponse>('/crypto/prices')

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get crypto prices')
  }
}

/**
 * Get single cryptocurrency price
 */
export const getCryptoPrice = async (currency: string): Promise<SinglePriceResponse> => {
  try {
    const response = await api.get<SinglePriceResponse>(`/crypto/price/${currency}`)

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, `Failed to get price for ${currency}`)
  }
}

