import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

export interface BonusBanner {
  _id: string
  title: string
  subtitle: string
  highlight: string
  image: string
  features: string[]
  buttonText: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BonusBannersResponse {
  success: boolean
  data: BonusBanner[]
  error?: any
}

export interface BonusBannerResponse {
  success: boolean
  data: BonusBanner
  message?: string
  error?: any
}

/**
 * Get all active bonus banners (public)
 */
export const getActiveBonusBanners = async (): Promise<BonusBannersResponse> => {
  try {
    const response = await api.get<BonusBannersResponse>(
      '/content/bonus-banners/active'
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get active bonus banners')
  }
}

/**
 * Get all bonus banners (admin only)
 */
export const getAllBonusBanners = async (): Promise<BonusBannersResponse> => {
  try {
    const response = await api.get<BonusBannersResponse>(
      '/content/bonus-banners/all'
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get all bonus banners')
  }
}

/**
 * Get bonus banner by ID (admin only)
 */
export const getBonusBannerById = async (id: string): Promise<BonusBannerResponse> => {
  try {
    const response = await api.get<BonusBannerResponse>(
      `/content/bonus-banners/${id}`
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get bonus banner')
  }
}

/**
 * Create bonus banner (admin only)
 */
export const createBonusBanner = async (
  data: Omit<BonusBanner, '_id' | 'createdAt' | 'updatedAt'>
): Promise<BonusBannerResponse> => {
  try {
    const response = await api.post<BonusBannerResponse>(
      '/content/bonus-banners',
      data
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to create bonus banner')
  }
}

/**
 * Update bonus banner (admin only)
 */
export const updateBonusBanner = async (
  id: string,
  data: Partial<Omit<BonusBanner, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<BonusBannerResponse> => {
  try {
    const response = await api.put<BonusBannerResponse>(
      `/content/bonus-banners/${id}`,
      data
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to update bonus banner')
  }
}

/**
 * Delete bonus banner (admin only)
 */
export const deleteBonusBanner = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/content/bonus-banners/${id}`
    )

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete')
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to delete bonus banner')
  }
}

/**
 * Toggle bonus banner active status (admin only)
 */
export const toggleBonusBannerStatus = async (id: string): Promise<BonusBannerResponse> => {
  try {
    const response = await api.patch<BonusBannerResponse>(
      `/content/bonus-banners/${id}/toggle`
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to toggle bonus banner status')
  }
}

