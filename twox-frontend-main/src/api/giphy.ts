import api from '@/lib/api'
import { handleApiError } from '@/lib/error-handler'

export interface GiphyGif {
  _id: string
  title: string
  url: string
  images: {
    original: {
      url: string
      width: string
      height: string
    }
    fixed_height: {
      url: string
      width: string
      height: string
    }
    fixed_width: {
      url: string
      width: string
      height: string
    }
    preview: {
      url: string
      width: string
      height: string
    }
    preview_webp: {
      url: string
      width: string
      height: string
    }
  }
}

export interface GiphyResponse {
  success: boolean
  data: GiphyGif[]
  error?: any
}

export interface GiphyGifResponse {
  success: boolean
  data: GiphyGif
  error?: any
}

export const searchGifs = async ({
  query,
  limit = 20,
  offset = 0,
}: {
  query: string
  limit?: number
  offset?: number
}): Promise<GiphyResponse> => {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await api.get<GiphyResponse>('/giphy/search', { params })

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to search gifs')
  }
}

export const getTrendingGifs = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number
  offset?: number
} = {}): Promise<GiphyResponse> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await api.get<GiphyResponse>('/giphy/trending', { params })

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get trending gifs')
  }
}

export const getRandomGif = async (): Promise<GiphyResponse> => {
  try {
    const response = await api.get<GiphyResponse>('/giphy/random')

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get random gif')
  }
}

export const getGifsByCategory = async ({
  category,
  limit = 20,
  offset = 0,
}: {
  category: string
  limit?: number
  offset?: number
}): Promise<GiphyResponse> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await api.get<GiphyResponse>(
      `/giphy/category/${category}`,
      {
        params,
      }
    )

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get gifs by category')
  }
}

export const getGifById = async (id: string): Promise<GiphyGifResponse> => {
  try {
    if (!id) {
      throw new Error('Gif id is required')
    }
    const response = await api.get<GiphyGifResponse>(`/giphy/${id}`)

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    throw handleApiError(error, 'Failed to get gif by id')
  }
}

export const incrementGifUsage = async (gifId: string): Promise<void> => {
  try {
    const response = await api.post(`/giphy/${gifId}/increment`)

    if (response.data.error) {
      throw new Error(response.data.error)
    }
  } catch (error) {
    throw handleApiError(error, 'Failed to increment gif usage')
  }
}
