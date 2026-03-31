import api from '@/lib/api'

export interface ContentSection {
  _id: string
  title: string
  content: string
  listItems: string[]
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface ContentSectionsResponse {
  success: boolean
  data: ContentSection[]
  message?: string
}

/**
 * Get all active content sections
 */
export const getContentSections = async (): Promise<ContentSectionsResponse> => {
  try {
    const response = await api.get<ContentSectionsResponse>('/content/sections')
    return response.data
  } catch (error) {
    console.error('Failed to fetch content sections:', error)
    return {
      success: false,
      data: [],
    }
  }
}

