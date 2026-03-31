import api from '@/lib/api'

export interface SiteStatsResponse {
  success: boolean
  data: {
    totalWagered: number
    onlineUsers: number
  }
  message?: string
}

/**
 * Get site statistics (total wagered, online users)
 */
export const getSiteStats = async (): Promise<SiteStatsResponse> => {
  try {
    const response = await api.get<SiteStatsResponse>('/site/stats')
    return response.data
  } catch (error) {
    console.error('Failed to fetch site stats:', error)
    return {
      success: false,
      data: {
        totalWagered: 0,
        onlineUsers: 0,
      },
    }
  }
}


