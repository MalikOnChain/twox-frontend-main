import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import { Banner } from '@/types/banner'

export interface GetBanners {
  banners: Banner[]
  error?: any
}

export const getAllBanners = async (): Promise<GetBanners> => {
  try {
    const response = await api.get<GetBanners>('/banner')
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get banners')
  }
}
