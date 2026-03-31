import api from '@/lib/api'

export interface Promotion {
  _id: string
  name: string
  summary: string
  colorTheme: number
  highlightText?: string
  badge?: string
  buttons: Array<{
    text: string
    link: string
  }>
  image: string
  description: string
  bonusId?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface PromotionResponse {
  success: boolean
  data: Promotion[]
  message?: string
}

export interface PromotionDetailsResponse {
  success: boolean
  data: Promotion
  message?: string
}

/**
 * Get all public promotions
 */
export const getPromotions = async (): Promise<PromotionResponse> => {
  try {
    const response = await api.get<any>('/promotion')
    // Backend returns 'promotions' field, normalize to 'data'
    return {
      success: response.data?.success || true,
      data: response.data?.promotions || response.data?.data || [],
    }
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
    return { success: false, data: [] }
  }
}

/**
 * Get promotion by ID
 */
export const getPromotionById = async (id: string): Promise<PromotionDetailsResponse> => {
  try {
    const response = await api.get<PromotionDetailsResponse>(`/promotion/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch promotion details:', error)
    return { success: false, data: {} as Promotion }
  }
}
