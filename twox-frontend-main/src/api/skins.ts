import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

import { TPagination } from '@/types/pagination'
import { SKIN_TYPES, SkinItem } from '@/types/skins'

interface GetSkinsResponse {
  items: SkinItem[]
  pagination: TPagination
  error?: string
}
export const getSkins = async ({
  type,
  limit,
  offset,
}: {
  type: SKIN_TYPES
  limit: number
  offset: number
}): Promise<GetSkinsResponse> => {
  try {
    const params = new URLSearchParams({
      type,
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await api.get<GetSkinsResponse>(
      `/skinsback/items/${type}`,
      { params }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get skins')
  }
}

interface CreateDepositOrderResponse {
  error?: string
  url: string
}

export const createDepositOrder = async () => {
  try {
    const response = await api.post<CreateDepositOrderResponse>(
      '/skinsback/create-order'
    )
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to create deposit order')
  }
}
